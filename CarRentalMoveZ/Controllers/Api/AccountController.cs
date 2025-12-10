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
    public class AccountController : ControllerBase
    {
        private readonly IRegisterService _registerService;
        private readonly ILoginService _loginService;
        private readonly IJwtService _jwtService;

        public AccountController(IRegisterService registerService, ILoginService loginService, IJwtService jwtService)
        {
            _registerService = registerService;
            _loginService = loginService;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            try
            {
                _registerService.Register(model);
                return Ok(ApiResponse.CreateSuccess("Registration successful. Please login."));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse.CreateError(ex.Message));
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            if (_loginService.ValidateUser(model, out int userId, out string role, out string name))
            {
                var token = _jwtService.GenerateToken(userId, role, name);
                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    token,
                    userId,
                    role,
                    name
                }, "Login successful"));
            }

            return Unauthorized(ApiResponse.CreateError("Invalid email or password"));
        }

        [HttpPost("verify-email")]
        public IActionResult VerifyEmail([FromBody] VerifyEmailViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            if (_loginService.VerifyEmail(model.Email))
            {
                return Ok(ApiResponse.CreateSuccess("Email verified. You can now change your password."));
            }

            return NotFound(ApiResponse.CreateError("Email not found"));
        }

        [HttpPost("change-password")]
        public IActionResult ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse.CreateError("Validation failed", errors));
            }

            if (_loginService.ChangePassword(model.Email, model.NewPassword))
            {
                return Ok(ApiResponse.CreateSuccess("Password changed successfully. Please login."));
            }

            return BadRequest(ApiResponse.CreateError("Unable to change password. Try again."));
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // JWT tokens are stateless, so logout is handled client-side by removing the token
            return Ok(ApiResponse.CreateSuccess("Logout successful"));
        }

        [HttpGet("google-login")]
        public IActionResult GoogleLogin([FromQuery] string? returnUrl = "/")
        {
            // For API, Google OAuth flow needs to be handled differently
            // This endpoint can return the Google OAuth URL
            var redirectUrl = Url.Action("GoogleResponse", "Account", new { returnUrl }, Request.Scheme);
            return Ok(ApiResponse<object>.SuccessResponse(new
            {
                googleAuthUrl = $"/signin-google?returnUrl={returnUrl}"
            }, "Redirect to this URL for Google authentication"));
        }

        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse([FromQuery] string? returnUrl = "/")
        {
            // This would need to be adapted for API use
            // For now, return a message that Google OAuth should be handled via the MVC endpoint
            return Ok(ApiResponse<object>.SuccessResponse(new
            {
                message = "Google OAuth callback. Use the MVC endpoint for Google authentication."
            }));
        }
    }
}

