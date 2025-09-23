using CarRentalMoveZ.DTOs;
using CarRentalMoveZ.Models;

namespace CarRentalMoveZ.Repository.Interfaces
{
    public interface IBookingRepository
    {
        int Add(Booking booking);

        IEnumerable<Booking> GetAllBookings();
        IEnumerable<Booking> GetBookingsByUserId(int userId);
        Booking GetBooking(int id);

        IEnumerable<Booking> GetBookingsByCar(int carId);

        void Update(Booking booking);

        void Cancel(int bookingId);

        Task<List<Booking>> GetRecentAssignedBookingsAsync(int customerId, int hours);

        Task<List<BookingDTO>> GetLast5BookingsAsync();

        Task<IEnumerable<Booking>> GetByDriverAsync(int driverId);

        void Complete(int bookingId);



    }
}
