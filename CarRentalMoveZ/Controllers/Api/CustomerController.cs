using CarRentalMoveZ.DTOs;
using CarRentalMoveZ.Services.Interfaces;
using CarRentalMoveZ.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CarRentalMoveZ.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer")]
    public class CustomerController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ICarService _carService;
        private readonly IBookingService _bookingService;
        private readonly ICustomerService _customerService;
        private readonly IPaymentService _paymentService;
        private readonly IDriverService _driverService;
        private readonly IOfferService _offerService;
        private readonly IFaqService _faqService;
        private readonly IJwtService _jwtService;

        public CustomerController(
            IUserService userService,
            ICarService carService,
            IBookingService bookingService,
            ICustomerService customerService,
            IPaymentService paymentService,
            IDriverService driverService,
            IOfferService offerService,
            IFaqService faqService,
            IJwtService jwtService)
        {
            _userService = userService;
            _carService = carService;
            _bookingService = bookingService;
            _customerService = customerService;
            _paymentService = paymentService;
            _driverService = driverService;
            _offerService = offerService;
            _faqService = faqService;
            _jwtService = jwtService;
        }

        private int GetUserId()
        {
            return _jwtService.GetUserIdFromClaims(User);
        }

        [HttpGet("dashboard")]
        public IActionResult Dashboard()
        {
            try
            {
                int userId = GetUserId();
                var profile = _userService.GetProfile(userId);
                var bookings = _bookingService.GetBookingsByUserId(userId);
                var payments = _paymentService.GetPaymentsByUserId(userId);

                var dashboardDto = new CustomerDashboardDTO
                {
                    Profile = profile,
                    Bookings = bookings,
                    Payments = payments
                };

                return Ok(ApiResponse<object>.SuccessResponse(dashboardDto));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving dashboard: " + ex.Message));
            }
        }

        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            try
            {
                int userId = GetUserId();
                var profile = _userService.GetProfile(userId);
                if (profile == null)
                {
                    return NotFound(ApiResponse.CreateError("Profile not found"));
                }
                return Ok(ApiResponse<object>.SuccessResponse(profile));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving profile: " + ex.Message));
            }
        }

        [HttpPut("profile")]
        public IActionResult UpdateProfile([FromBody] UserProfileDTO model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                int userId = GetUserId();
                if (model.UserId != userId)
                {
                    return Forbid("You can only update your own profile");
                }

                _userService.UpdateProfile(model);
                return Ok(ApiResponse.CreateSuccess("Profile updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error updating profile: " + ex.Message));
            }
        }

        [HttpGet("cars")]
        public IActionResult GetCars()
        {
            try
            {
                var cars = _carService.GetAllAvailable();
                return Ok(ApiResponse<object>.SuccessResponse(cars));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving cars: " + ex.Message));
            }
        }

        [HttpGet("cars/{id}")]
        public IActionResult GetCarDetails(int id)
        {
            try
            {
                var car = _carService.GetCarById(id);
                if (car == null)
                {
                    return NotFound(ApiResponse.CreateError("Car not found"));
                }
                return Ok(ApiResponse<object>.SuccessResponse(car));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving car details: " + ex.Message));
            }
        }

        [HttpGet("bookings")]
        public IActionResult GetBookings()
        {
            try
            {
                int userId = GetUserId();
                var bookings = _bookingService.GetBookingsByUserId(userId);
                return Ok(ApiResponse<object>.SuccessResponse(bookings));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving bookings: " + ex.Message));
            }
        }

        [HttpGet("bookings/{id}")]
        public IActionResult GetBookingDetails(int id)
        {
            try
            {
                int userId = GetUserId();
                var booking = _bookingService.GetBookingById(id);
                if (booking == null)
                {
                    return NotFound(ApiResponse.CreateError("Booking not found"));
                }

                // Verify the booking belongs to the user
                var customer = _customerService.GetCustomerByUserId(userId);
                if (customer == null || booking.CustomerId != customer.CustomerId)
                {
                    return Forbid("You can only view your own bookings");
                }

                booking.AvailableDrivers = _driverService.GetAvailableDrivers();
                return Ok(ApiResponse<object>.SuccessResponse(booking));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving booking details: " + ex.Message));
            }
        }

        [HttpGet("bookings/new/{carId}")]
        public IActionResult GetNewBookingData(int carId)
        {
            try
            {
                int userId = GetUserId();
                var car = _carService.GetCarById(carId);
                if (car == null)
                {
                    return NotFound(ApiResponse.CreateError("Car not found"));
                }

                var customer = _customerService.GetCustomerByUserId(userId);
                if (customer == null)
                {
                    return NotFound(ApiResponse.CreateError("Customer not found"));
                }

                var existingBookings = _bookingService.GetBookingsForCar(carId);
                var bookedRanges = existingBookings
                    .Select(b => new { start = b.StartDate.ToString("yyyy-MM-dd"), end = b.EndDate.ToString("yyyy-MM-dd") })
                    .ToList();

                var vm = new BookingViewModel
                {
                    CarId = car.CarId,
                    CarName = car.CarName,
                    ImgURL = car.ImgURL,
                    PricePerDay = car.PricePerDay,
                    CustomerId = customer.CustomerId,
                    CustomerName = customer.Name,
                    PhoneNumber = customer.PhoneNumber
                };

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    booking = vm,
                    bookedRanges
                }));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving booking data: " + ex.Message));
            }
        }

        [HttpPost("bookings")]
        public IActionResult CreateBooking([FromBody] BookingViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                int userId = GetUserId();
                var customer = _customerService.GetCustomerByUserId(userId);
                if (customer == null)
                {
                    return NotFound(ApiResponse.CreateError("Customer not found"));
                }

                if (customer.CustomerId != model.CustomerId)
                {
                    return Forbid("You can only create bookings for yourself");
                }

                var bookingId = _bookingService.CreateBooking(model);
                return Ok(ApiResponse<object>.SuccessResponse(new { bookingId, amount = model.Amount }, "Booking created successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse.CreateError(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error creating booking: " + ex.Message));
            }
        }

        [HttpPost("bookings/{id}/cancel")]
        public IActionResult CancelBooking(int id)
        {
            try
            {
                int userId = GetUserId();
                var booking = _bookingService.GetBookingById(id);
                if (booking == null)
                {
                    return NotFound(ApiResponse.CreateError("Booking not found"));
                }

                var customer = _customerService.GetCustomerByUserId(userId);
                if (customer == null || booking.CustomerId != customer.CustomerId)
                {
                    return Forbid("You can only cancel your own bookings");
                }

                _bookingService.CancelBooking(id);

                if (booking.DriverId.HasValue)
                {
                    _driverService.SetDriverOffDuty(booking.DriverId.Value);
                }

                return Ok(ApiResponse.CreateSuccess("Booking cancelled successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse.CreateError(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error cancelling booking: " + ex.Message));
            }
        }

        [HttpGet("payments")]
        public IActionResult GetPayments()
        {
            try
            {
                int userId = GetUserId();
                var payments = _paymentService.GetPaymentsByUserId(userId);
                return Ok(ApiResponse<object>.SuccessResponse(payments));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving payments: " + ex.Message));
            }
        }

        [HttpGet("payment/{bookingId}")]
        public async Task<IActionResult> GetPaymentData(int bookingId)
        {
            try
            {
                int userId = GetUserId();
                var booking = _bookingService.GetBookingById(bookingId);
                if (booking == null)
                {
                    return NotFound(ApiResponse.CreateError("Booking not found"));
                }

                var customer = _customerService.GetCustomerByUserId(userId);
                if (customer == null || booking.CustomerId != customer.CustomerId)
                {
                    return Forbid("You can only view payment for your own bookings");
                }

                var activeOffers = await _offerService.GetActiveOffersAsync();
                var model = new PaymentViewModel
                {
                    BookingId = bookingId,
                    Amount = booking.Amount
                };

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    payment = model,
                    activeOffers
                }));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving payment data: " + ex.Message));
            }
        }

        [HttpPost("payment")]
        public IActionResult ProcessPayment([FromBody] PaymentViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                int userId = GetUserId();
                var booking = _bookingService.GetBookingById(model.BookingId);
                if (booking == null)
                {
                    return NotFound(ApiResponse.CreateError("Booking not found"));
                }

                var customer = _customerService.GetCustomerByUserId(userId);
                if (customer == null || booking.CustomerId != customer.CustomerId)
                {
                    return Forbid("You can only process payment for your own bookings");
                }

                _paymentService.addPayment(model);
                return Ok(ApiResponse.CreateSuccess("Payment processed successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error processing payment: " + ex.Message));
            }
        }

        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            try
            {
                int userId = GetUserId();
                var customer = _customerService.GetCustomerByUserId(userId);
                if (customer == null)
                {
                    return NotFound(ApiResponse.CreateError("Customer not found"));
                }

                var bookingNotifications = await _bookingService.GetRecentAssignedBookingsAsync(customer.CustomerId, 2);
                var paymentNotifications = await _paymentService.GetLast5CashPaymentsCustomerNotificationsAsync(customer.CustomerId);

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    bookingNotifications,
                    paymentNotifications,
                    unreadCount = bookingNotifications.Count() + paymentNotifications.Count()
                }));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving notifications: " + ex.Message));
            }
        }

        [HttpGet("comparison")]
        public IActionResult GetComparison()
        {
            try
            {
                var model = new CarComparisonViewModel
                {
                    AvailableCars = _carService.GetAll().ToList()
                };
                return Ok(ApiResponse<object>.SuccessResponse(model));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving cars for comparison: " + ex.Message));
            }
        }

        [HttpGet("faqs")]
        public async Task<IActionResult> GetFaqs()
        {
            try
            {
                var faqs = await _faqService.GetAllAsync();
                return Ok(ApiResponse<object>.SuccessResponse(faqs));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving FAQs: " + ex.Message));
            }
        }
    }
}

