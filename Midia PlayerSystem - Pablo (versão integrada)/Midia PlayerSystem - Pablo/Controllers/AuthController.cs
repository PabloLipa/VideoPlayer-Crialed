using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Midia_PlayerSystem___Pablo.Data;
using Midia_PlayerSystem___Pablo.Models;
using System.Security.Claims;
using System.Text;



namespace Midia_PlayerSystem___Pablo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoggin model)
        {
            
            var user = DataStore.Users.FirstOrDefault(u => u.Username == model.Username && u.Password == model.Password);
            if (user == null)
            {
                return Unauthorized(new { message = "Credenciais inválidas." });
            }

            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
          
            var key = Encoding.ASCII.GetBytes(DataStore.JwtKey);
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
             
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { token = tokenString });
        }
    }
}
