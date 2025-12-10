using CarRentalMoveZ.DTOs;
using CarRentalMoveZ.Services.Interfaces;
using CarRentalMoveZ.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace CarRentalMoveZ.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly ICarService _carService;
        private readonly IFaqService _faqService;

        public HomeController(ICarService carService, IFaqService faqService)
        {
            _carService = carService;
            _faqService = faqService;
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
    }
}

