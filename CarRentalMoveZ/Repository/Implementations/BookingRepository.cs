using CarRentalMoveZ.Data;
using CarRentalMoveZ.DTOs;
using CarRentalMoveZ.Models;
using CarRentalMoveZ.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarRentalMoveZ.Repository.Implementations
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AppDbContext _context;

        public BookingRepository(AppDbContext context)
        {
            _context = context;
        }

        public int Add(Booking booking)
        {
            _context.Bookings.Add(booking);
            _context.SaveChanges();

            return booking.BookingId; // This now contains the generated ID
        }

        public IEnumerable<Booking> GetAllBookings()
        {
            return _context.Bookings
                           .Include(b => b.Car)
                           .Include(b => b.Customer)
                           .ToList();
        }

        public IEnumerable<Booking> GetBookingsByUserId(int userId)
        {
            return _context.Bookings
                           .Include(b => b.Car)
                           .Include(b => b.Customer)
                           .Where(b => b.Customer.UserId == userId) // Assuming Customer has UserId FK
                           .ToList();
        }

        public Booking GetBooking(int id)
        {
            return _context.Bookings
                           .Include(b => b.Car)
                           .Include(b => b.Customer)
                           .FirstOrDefault(b => b.BookingId == id);
        }


        public void Update(Booking booking)
        {
            _context.Bookings.Update(booking);
            _context.SaveChanges();
        }

        public IEnumerable<Booking> GetBookingsByCar(int carId)
        {
            return _context.Bookings
            .Where(b => b.CarId == carId && b.Status != "Cancelled") // exclude cancelled
            .ToList();
        }

        public void Cancel(int bookingId)
        {
            var booking = _context.Bookings.FirstOrDefault(b => b.BookingId == bookingId);
            if (booking != null)
            {
                booking.Status = "Cancelled";
                _context.SaveChanges();
            }
        }
        public void Complete(int bookingId)
        {
            var booking = _context.Bookings.FirstOrDefault(b => b.BookingId == bookingId);
            if (booking != null)
            {
                booking.Status = "Completed";
                _context.SaveChanges();
            }
        }

        public async Task<List<Booking>> GetRecentAssignedBookingsAsync(int customerId, int hours)
        {
            var cutoffTime = DateTime.UtcNow.AddHours(-hours);

            return await _context.Bookings
                .Include(b => b.Car)
                .Include(b => b.Driver)
                .Where(b => b.CustomerId == customerId
                         && b.Status == "Assigned"
                         && b.StatusUpdatedAt.HasValue
                         && b.StatusUpdatedAt.Value >= cutoffTime)
                .OrderByDescending(b => b.StatusUpdatedAt)
                .ToListAsync();
        }


        public async Task<List<BookingDTO>> GetLast5BookingsAsync()
        {
            return await _context.Bookings
                .Include(b => b.Car)
                .Include(b => b.Customer)
                .OrderByDescending(b => b.BookingId)
                .Take(5)
                .Select(b => new BookingDTO
                {
                    BookingId = b.BookingId,
                    StartDate = b.StartDate,
                    EndDate = b.EndDate,
                    Status = b.Status,
                    Location = b.Location,
                    Payment = b.Amount,
                    CustomerName = b.Customer.Name,
                    CarModel = b.Car.CarName,
                    DriverStatus = b.DriverStatus
                })
                .ToListAsync();
        }


        public async Task<IEnumerable<Booking>> GetByDriverAsync(int driverId)
        {
            return await _context.Bookings
                .Where(b => b.DriverId == driverId && b.Status == "Assigned")
                .Include(b => b.Customer)
                .Include(b => b.Car)
                .ToListAsync();
        }


    }
}
