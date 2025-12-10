using CarRentalMoveZ.DTOs;
using CarRentalMoveZ.Enums;
using CarRentalMoveZ.Services.Interfaces;
using CarRentalMoveZ.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace CarRentalMoveZ.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Staff,Driver")]
    public class AdminController : ControllerBase
    {
        private readonly ICarService _carService;
        private readonly IStaffService _staffService;
        private readonly IRegisterService _registerService;
        private readonly ICustomerService _customerService;
        private readonly IBookingService _bookingService;
        private readonly IPaymentService _paymentService;
        private readonly IUserService _userService;
        private readonly IDriverService _driverService;
        private readonly IOfferService _offerService;
        private readonly IDashboardService _dashboardService;
        private readonly IFaqService _faqService;
        private readonly IJwtService _jwtService;

        public AdminController(
            ICarService carService,
            IStaffService staffService,
            IRegisterService registerService,
            ICustomerService customerService,
            IBookingService bookingService,
            IPaymentService paymentService,
            IUserService userService,
            IDriverService driverService,
            IOfferService offerService,
            IDashboardService dashboardService,
            IFaqService faqService,
            IJwtService jwtService)
        {
            _carService = carService;
            _staffService = staffService;
            _registerService = registerService;
            _customerService = customerService;
            _bookingService = bookingService;
            _paymentService = paymentService;
            _userService = userService;
            _driverService = driverService;
            _offerService = offerService;
            _dashboardService = dashboardService;
            _faqService = faqService;
            _jwtService = jwtService;
        }

        [HttpGet("dashboard")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> Dashboard()
        {
            try
            {
                var dashboardDto = await _dashboardService.GetDashboardDataAsync();
                return Ok(ApiResponse<object>.SuccessResponse(dashboardDto));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving dashboard: " + ex.Message));
            }
        }

        #region Car Management

        [HttpGet("cars")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetCars()
        {
            try
            {
                var cars = _carService.GetAll();
                return Ok(ApiResponse<object>.SuccessResponse(cars));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving cars: " + ex.Message));
            }
        }

        [HttpGet("cars/{id}")]
        [Authorize(Roles = "Admin,Staff")]
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

        [HttpPost("cars")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddCar([FromBody] CarViewModel carViewModel)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                _carService.AddCar(carViewModel);
                return Ok(ApiResponse.CreateSuccess("Car added successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error adding car: " + ex.Message));
            }
        }

        [HttpPut("cars/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateCar(int id, [FromBody] CarViewModel carViewModel)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                carViewModel.CarId = id;
                _carService.UpdateCar(carViewModel);
                return Ok(ApiResponse.CreateSuccess("Car updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error updating car: " + ex.Message));
            }
        }

        [HttpDelete("cars/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteCar(int id)
        {
            try
            {
                _carService.DeleteCar(id);
                return Ok(ApiResponse.CreateSuccess("Car deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error deleting car: " + ex.Message));
            }
        }

        #endregion

        #region Booking Management

        [HttpGet("bookings")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetBookings()
        {
            try
            {
                var bookings = _bookingService.GetAllBookings();
                return Ok(ApiResponse<object>.SuccessResponse(bookings));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving bookings: " + ex.Message));
            }
        }

        [HttpGet("bookings/{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetBookingDetails(int id)
        {
            try
            {
                var booking = _bookingService.GetBookingById(id);
                if (booking == null)
                {
                    return NotFound(ApiResponse.CreateError("Booking not found"));
                }

                booking.AvailableDrivers = _driverService.GetAvailableDrivers();
                return Ok(ApiResponse<object>.SuccessResponse(booking));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving booking details: " + ex.Message));
            }
        }

        [HttpPut("bookings/{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult UpdateBooking(int id, [FromBody] BookingDetailsViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                model.BookingId = id;
                model.BookingStatus = "Assigned";
                model.StatusUpdatedAt = DateTime.Now;

                _bookingService.UpdateBooking(model);

                if (model.DriverId.HasValue)
                {
                    _driverService.SetDriverOnDuty(model.DriverId.Value);
                }

                return Ok(ApiResponse.CreateSuccess("Booking updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error updating booking: " + ex.Message));
            }
        }

        [HttpPost("bookings/{id}/complete")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult CompleteBooking(int id)
        {
            try
            {
                _bookingService.CompleteBooking(id);
                return Ok(ApiResponse.CreateSuccess("Booking marked as completed"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse.CreateError(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error completing booking: " + ex.Message));
            }
        }

        [HttpGet("bookings/assigned")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> GetAssignedBookings()
        {
            try
            {
                int userId = _jwtService.GetUserIdFromClaims(User);
                var driver = _driverService.GetbyUserid(userId);
                if (driver == null || driver.DriverId == 0)
                {
                    return NotFound(ApiResponse.CreateError("Driver not found"));
                }

                var bookings = await _bookingService.GetDriverAssignedBookingsAsync(driver.DriverId);
                return Ok(ApiResponse<object>.SuccessResponse(bookings));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving assigned bookings: " + ex.Message));
            }
        }

        #endregion

        #region Customer Management

        [HttpGet("customers")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetCustomers()
        {
            try
            {
                var customers = _customerService.GetAllCustomer();
                return Ok(ApiResponse<object>.SuccessResponse(customers));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving customers: " + ex.Message));
            }
        }

        [HttpGet("customers/{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetCustomerDetails(int id)
        {
            try
            {
                var customer = _customerService.GetCustomerById(id);
                if (customer == null)
                {
                    return NotFound(ApiResponse.CreateError("Customer not found"));
                }

                int userId = _customerService.GetCustomerUserId(id);
                var profile = _userService.GetProfile(userId);
                var bookings = _bookingService.GetBookingsByUserId(userId);
                var payments = _paymentService.GetPaymentsByUserId(userId);

                var dashboardDto = new CustomerDashboardDTO
                {
                    Profile = profile,
                    Bookings = bookings,
                    Payments = payments
                };

                var fullViewDto = new CustomerFullViewDTO
                {
                    Customer = customer,
                    Dashboard = dashboardDto
                };

                return Ok(ApiResponse<object>.SuccessResponse(fullViewDto));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving customer details: " + ex.Message));
            }
        }

        #endregion

        #region Staff Management

        [HttpGet("staff")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetStaff()
        {
            try
            {
                var staff = _staffService.GetAllStaff();
                return Ok(ApiResponse<object>.SuccessResponse(staff));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving staff: " + ex.Message));
            }
        }

        [HttpGet("staff/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetStaffDetails(int id)
        {
            try
            {
                var staff = _staffService.GetById(id);
                if (staff == null)
                {
                    return NotFound(ApiResponse.CreateError("Staff not found"));
                }

                var staffDTO = new StaffDTO
                {
                    StaffId = staff.Id,
                    Name = staff.Name,
                    Email = staff.Email,
                    Role = staff.Role.ToString(),
                    PhoneNumber = staff.PhoneNumber
                };

                return Ok(ApiResponse<object>.SuccessResponse(staffDTO));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving staff details: " + ex.Message));
            }
        }

        [HttpPost("staff")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddStaff([FromBody] RegisterStaffViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                bool isSuccess = _registerService.RegisterStaff(model);
                if (isSuccess)
                {
                    return Ok(ApiResponse.CreateSuccess("Staff user created successfully"));
                }
                return BadRequest(ApiResponse.CreateError("Email already exists. Please try again."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error adding staff: " + ex.Message));
            }
        }

        [HttpPut("staff/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateStaff(int id, [FromBody] StaffViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                model.Id = id;
                _staffService.Update(model);
                return Ok(ApiResponse.CreateSuccess("Staff updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error updating staff: " + ex.Message));
            }
        }

        [HttpDelete("staff/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteStaff(int id)
        {
            try
            {
                _staffService.Delete(id);
                return Ok(ApiResponse.CreateSuccess("Staff deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error deleting staff: " + ex.Message));
            }
        }

        #endregion

        #region Driver Management

        [HttpGet("drivers")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetDrivers()
        {
            try
            {
                var drivers = _driverService.GetAllDriver();
                return Ok(ApiResponse<object>.SuccessResponse(drivers));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving drivers: " + ex.Message));
            }
        }

        [HttpGet("drivers/{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetDriverDetails(int id)
        {
            try
            {
                var driver = _driverService.Getbyid(id);
                if (driver == null)
                {
                    return NotFound(ApiResponse.CreateError("Driver not found"));
                }
                return Ok(ApiResponse<object>.SuccessResponse(driver));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving driver details: " + ex.Message));
            }
        }

        [HttpPost("drivers")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddDriver([FromBody] RegisterDriverViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                bool isSuccess = _registerService.RegisterDriver(model);
                if (isSuccess)
                {
                    return Ok(ApiResponse.CreateSuccess("Driver user created successfully"));
                }
                return BadRequest(ApiResponse.CreateError("Email already exists. Please try again."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error adding driver: " + ex.Message));
            }
        }

        [HttpPut("drivers/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateDriver(int id, [FromBody] DriverViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                model.DriverId = id;
                _driverService.Update(model);
                return Ok(ApiResponse.CreateSuccess("Driver updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error updating driver: " + ex.Message));
            }
        }

        [HttpDelete("drivers/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteDriver(int id)
        {
            try
            {
                _driverService.Delete(id);
                return Ok(ApiResponse.CreateSuccess("Driver deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error deleting driver: " + ex.Message));
            }
        }

        #endregion

        #region Offer Management

        [HttpGet("offers")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetOffers()
        {
            try
            {
                var offers = _offerService.GetAll();
                return Ok(ApiResponse<object>.SuccessResponse(offers));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving offers: " + ex.Message));
            }
        }

        [HttpPost("offers")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddOffer([FromBody] OfferViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                _offerService.Add(model);
                return Ok(ApiResponse.CreateSuccess("Offer added successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error adding offer: " + ex.Message));
            }
        }

        [HttpPut("offers/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateOffer(int id, [FromBody] OfferViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                var existingOffer = _offerService.GetById(id);
                if (existingOffer == null)
                {
                    return NotFound(ApiResponse.CreateError("Offer not found"));
                }

                _offerService.Update(model);
                return Ok(ApiResponse.CreateSuccess("Offer updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error updating offer: " + ex.Message));
            }
        }

        [HttpDelete("offers/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteOffer(int id)
        {
            try
            {
                _offerService.Delete(id);
                return Ok(ApiResponse.CreateSuccess("Offer deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error deleting offer: " + ex.Message));
            }
        }

        #endregion

        #region FAQ Management

        [HttpGet("faqs")]
        [Authorize(Roles = "Admin,Staff")]
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

        [HttpPost("faqs")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddFaq([FromBody] FaqViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                var faqDto = new FaqDTO
                {
                    Question = model.Question,
                    Answer = model.Answer
                };

                await _faqService.AddAsync(faqDto);
                return Ok(ApiResponse.CreateSuccess("FAQ added successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error adding FAQ: " + ex.Message));
            }
        }

        [HttpPut("faqs/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFaq(int id, [FromBody] FaqDTO model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                var faq = await _faqService.GetFaqForEditAsync(id);
                if (faq == null)
                {
                    return NotFound(ApiResponse.CreateError("FAQ not found"));
                }

                model.FaqId = id;
                await _faqService.UpdateAsync(model);
                return Ok(ApiResponse.CreateSuccess("FAQ updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error updating FAQ: " + ex.Message));
            }
        }

        [HttpDelete("faqs/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFaq(int id)
        {
            try
            {
                await _faqService.DeleteAsync(id);
                return Ok(ApiResponse.CreateSuccess("FAQ deleted successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error deleting FAQ: " + ex.Message));
            }
        }

        #endregion

        #region Payment Management

        [HttpGet("payments")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetPayments()
        {
            try
            {
                var payments = _paymentService.GetAllPayments();
                return Ok(ApiResponse<object>.SuccessResponse(payments));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving payments: " + ex.Message));
            }
        }

        #endregion

        #region Cashier Operations

        [HttpGet("cashier")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetCashierBookings()
        {
            try
            {
                var bookings = _bookingService.GetAllBookingsDetail();
                return Ok(ApiResponse<object>.SuccessResponse(bookings));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving cashier bookings: " + ex.Message));
            }
        }

        [HttpGet("cashier/bookings/{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult GetCashierBookingDetails(int id)
        {
            try
            {
                var booking = _bookingService.GetBookingById(id);
                if (booking == null)
                {
                    return NotFound(ApiResponse.CreateError("Booking not found"));
                }

                var customer = _customerService.GetCustomerById(booking.CustomerId);
                if (customer != null)
                {
                    booking.CustomerName = customer.Name;
                    booking.PhoneNumber = customer.PhoneNumber;
                    booking.CustomerEmail = customer.Email;
                }

                return Ok(ApiResponse<object>.SuccessResponse(booking));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving cashier booking details: " + ex.Message));
            }
        }

        [HttpPut("cashier/bookings/{id}")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult UpdateCashierBooking(int id, [FromBody] BookingDetailsViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                model.BookingId = id;
                _paymentService.UpdatePayment(model);
                return Ok(ApiResponse.CreateSuccess("Payment updated successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error updating payment: " + ex.Message));
            }
        }

        [HttpPost("cashier/bookings/{id}/confirm-cash")]
        [Authorize(Roles = "Admin,Staff")]
        public IActionResult ConfirmCashPayment(int id, [FromBody] BookingDetailsViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                model.BookingId = id;
                model.PaymentStatus = "Paid";
                model.IsPaid = true;
                model.PaymentDate = DateTime.Now;
                model.PaymentMethod = "Cash";
                model.PaymentAmount = model.Amount;

                _paymentService.ConfirmCashPayment(model);
                return Ok(ApiResponse.CreateSuccess("Cash payment confirmed successfully"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error confirming cash payment: " + ex.Message));
            }
        }

        #endregion

        #region Notifications

        [HttpGet("notifications")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetNotifications()
        {
            try
            {
                var bookings = await _bookingService.GetLast5BookingsAsync();
                var payments = await _paymentService.GetLast5PaidPaymentsAsync();

                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    bookings,
                    payments
                }));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving notifications: " + ex.Message));
            }
        }

        [HttpGet("notifications/count")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetNotificationCount()
        {
            try
            {
                var bookings = await _bookingService.GetLast5BookingsAsync();
                var payments = await _paymentService.GetLast5PaidPaymentsAsync();

                bool hasNotifications = bookings.Any() || payments.Any();
                return Ok(ApiResponse<object>.SuccessResponse(new { hasNotifications }));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error retrieving notification count: " + ex.Message));
            }
        }

        #endregion
    }
}

