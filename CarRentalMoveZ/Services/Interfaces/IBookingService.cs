using CarRentalMoveZ.DTOs;
using CarRentalMoveZ.Models;
using CarRentalMoveZ.ViewModels;

namespace CarRentalMoveZ.Services.Interfaces
{
    public interface IBookingService
    {
        int CreateBooking(BookingViewModel model);

        IEnumerable<BookingDTO> GetAllBookings();

        IEnumerable<BookingDTO> GetBookingsByUserId(int userId);

        BookingDetailsViewModel GetBookingById(int id);

        IEnumerable<Booking> GetBookingsForCar(int carId);
        void UpdateBooking(BookingDetailsViewModel model);

        IEnumerable<BookingDetailsViewModel> GetAllBookingsDetail();

        Task<List<CustomerNotificationDTO>> GetRecentAssignedBookingsAsync(int customerId, int hours = 2);

        Task<List<BookingDTO>> GetLast5BookingsAsync();

        void CancelBooking(int bookingId);

        Task<IEnumerable<BookingDTO>> GetDriverAssignedBookingsAsync(int driverId);

        void CompleteBooking(int bookingId);

    }
}
