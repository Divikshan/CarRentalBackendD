using System.Security.Claims;

namespace CarRentalMoveZ.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(int userId, string role, string name);
        ClaimsPrincipal? ValidateToken(string token);
        int GetUserIdFromClaims(ClaimsPrincipal user);
        string GetRoleFromClaims(ClaimsPrincipal user);
    }
}

