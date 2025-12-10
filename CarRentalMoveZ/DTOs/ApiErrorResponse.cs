namespace CarRentalMoveZ.DTOs
{
    public class ApiErrorResponse
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new List<string>();
        public string? StackTrace { get; set; }

        public static ApiErrorResponse Create(string message, List<string>? errors = null, string? stackTrace = null)
        {
            return new ApiErrorResponse
            {
                Message = message,
                Errors = errors ?? new List<string>(),
                StackTrace = stackTrace
            };
        }
    }
}

