using CarRentalMoveZ.DTOs;
using CarRentalMoveZ.Mappings;
using CarRentalMoveZ.Models;
using CarRentalMoveZ.Repository.Implementations;
using CarRentalMoveZ.Repository.Interfaces;
using CarRentalMoveZ.Services.Interfaces;
using CarRentalMoveZ.ViewModels;

namespace CarRentalMoveZ.Services.Implementations
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly IPaymentRepository _paymentRepo;

        public BookingService(IBookingRepository bookingRepo,IPaymentRepository paymentRepo)
        {
            _bookingRepo = bookingRepo;
            _paymentRepo = paymentRepo;
        }

        public int CreateBooking(BookingViewModel model)
        {

            // Fetch existing bookings for this car
            var existingBookings = _bookingRepo.GetBookingsByCar(model.CarId);

            // Check for overlap
            bool hasConflict = existingBookings.Any(b =>
                (model.StartDate >= b.StartDate && model.StartDate <= b.EndDate) || // overlap start
                (model.EndDate >= b.StartDate && model.EndDate <= b.EndDate) ||     // overlap end
                (model.StartDate <= b.StartDate && model.EndDate >= b.EndDate)      // fully covers
            );

            if (hasConflict)
            {
                throw new InvalidOperationException("This car is already booked for the selected dates.");
            }

            

            // Map ViewModel → Entity using Mapper
            Booking booking = BookingMapper.ToEntity(model);

            // Save to repository
            var id=_bookingRepo.Add(booking);
            return id;
        }

        public IEnumerable<BookingDTO> GetAllBookings()
        {

            var bookings = _bookingRepo.GetAllBookings();


            return BookingMapper.ToDTOList(bookings);
        }
        public IEnumerable<BookingDTO> GetBookingsByUserId(int userId)
        {
            var bookings = _bookingRepo.GetBookingsByUserId(userId);
            return BookingMapper.ToDTOList(bookings);
        }

        public BookingDetailsViewModel GetBookingById(int id)
        {
            var booking = _bookingRepo.GetBooking(id);
            var payment = _paymentRepo.GetPaymentByBookingId(id);
            if (booking == null)
            {
                return null; // Or throw an exception, based on your error handling strategy
            }
            return BookingMapper.ToDetailsViewModel(booking,payment);
        }

        public IEnumerable<BookingDetailsViewModel> GetAllBookingsDetail()
        {
            var bookings = _bookingRepo.GetAllBookings();
            var bookingDetailsList = new List<BookingDetailsViewModel>();
            foreach (var booking in bookings)
            {
                var payment = _paymentRepo.GetPaymentByBookingId(booking.BookingId);
                var bookingDetails = BookingMapper.ToDetailsViewModel(booking, payment);
                bookingDetailsList.Add(bookingDetails);
            }
            return bookingDetailsList;
        }

        public void UpdateBooking(BookingDetailsViewModel model)
        {
            // Fetch existing booking
            var existingBooking = _bookingRepo.GetBooking(model.BookingId);
            if (existingBooking == null)
            {
                throw new Exception("Booking not found");
            }
            // Update fields
            existingBooking.Location = model.Location;
            existingBooking.StartDate = model.StartDate;
            existingBooking.EndDate = model.EndDate;
            existingBooking.Days = model.Days;
            existingBooking.Amount = model.Amount;
            existingBooking.Status = model.BookingStatus;
            existingBooking.DriverStatus = model.DriverStatus;
            existingBooking.DriverId = model.DriverId;
            existingBooking.StatusUpdatedAt = model.StatusUpdatedAt; // <-- update timestamp


            // Save changes
            _bookingRepo.Update(existingBooking);
        }

        public IEnumerable<Booking> GetBookingsForCar(int carId)
        {
            return _bookingRepo.GetBookingsByCar(carId);
        }

        public void CancelBooking(int bookingId)
        {
            var booking = _bookingRepo.GetBooking(bookingId);
            if (booking == null)
                throw new InvalidOperationException("Booking not found");

            // ✅ Check 24-hour rule
            if ((booking.StartDate - DateTime.Now).TotalHours < 24)
                throw new InvalidOperationException("Bookings can only be cancelled at least 24 hours before the start date.");

            booking.Status = "Cancelled";
            _bookingRepo.Cancel(bookingId);

            // ✅ Update related payment
            var payment = _paymentRepo.GetPaymentByBookingId(bookingId);
            if (payment != null && payment.Status == "Paid")
            {
                payment.Status = "Pending to refund";
                _paymentRepo.Update(payment);
            }
        }
        public void CompleteBooking(int bookingId)
        {
            var booking = _bookingRepo.GetBooking(bookingId);
            if (booking == null)
                throw new InvalidOperationException("Booking not found");

            DateTime now = DateTime.Now;

            // If booking has already ended
            if (booking.EndDate < now)
            {
                booking.Status = "Completed";
                _bookingRepo.Complete(booking.BookingId); // Assuming UpdateStatus updates the booking
                return;
            }

            // Booking has not yet ended
            throw new InvalidOperationException("Cannot complete booking before the end date.");
        }


        public async Task<List<CustomerNotificationDTO>> GetRecentAssignedBookingsAsync(int customerId, int hours = 2)
        {
            var bookings = await _bookingRepo.GetRecentAssignedBookingsAsync(customerId, hours);

            return bookings.Select(b => new CustomerNotificationDTO
            {
                BookingId = b.BookingId,
                CarName = b.Car.CarName,
                DriverName = b.Driver?.Name ?? "N/A",
                AssignedAt = b.StatusUpdatedAt
            }).ToList();
        }

        public async Task<List<BookingDTO>> GetLast5BookingsAsync()
        {
            return await _bookingRepo.GetLast5BookingsAsync();
        }

        public async Task<IEnumerable<BookingDTO>> GetDriverAssignedBookingsAsync(int driverId)
        {
            var bookings = await _bookingRepo.GetByDriverAsync(driverId);

            return BookingMapper.ToDTOList(bookings);

        }
    }
}
