using CarRentalMoveZ.DTOs;
using CarRentalMoveZ.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarRentalMoveZ.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class OtpController : ControllerBase
    {
        private readonly EmailService _emailService;
        private static readonly Dictionary<string, string> _otpStore = new Dictionary<string, string>();
        private static readonly object _lockObject = new object();

        public OtpController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(ApiResponse.CreateError("Email is required"));
            }

            try
            {
                var otp = new Random().Next(100000, 999999).ToString();

                // Store OTP (in production, use Redis or database)
                lock (_lockObject)
                {
                    _otpStore[request.Email] = otp;
                }

                await _emailService.SendEmailAsync(request.Email, "Your OTP Code", $"Your OTP is: <b>{otp}</b>");

                return Ok(ApiResponse.CreateSuccess("OTP sent successfully!"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error sending OTP: " + ex.Message));
            }
        }

        [HttpPost("verify")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Otp))
            {
                return BadRequest(ApiResponse.CreateError("Email and OTP are required"));
            }

            try
            {
                string? storedOtp = null;
                lock (_lockObject)
                {
                    _otpStore.TryGetValue(request.Email, out storedOtp);
                }

                if (storedOtp == request.Otp)
                {
                    // Remove OTP after successful verification
                    lock (_lockObject)
                    {
                        _otpStore.Remove(request.Email);
                    }
                    return Ok(ApiResponse.CreateSuccess("OTP verified successfully!"));
                }

                return Unauthorized(ApiResponse.CreateError("Invalid OTP!"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.CreateError("Error verifying OTP: " + ex.Message));
            }
        }
    }

    public class SendOtpRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyOtpRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
}

