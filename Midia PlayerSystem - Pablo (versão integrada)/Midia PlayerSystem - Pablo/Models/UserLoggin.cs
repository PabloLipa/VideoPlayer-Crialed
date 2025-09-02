using System.ComponentModel.DataAnnotations;

namespace Midia_PlayerSystem___Pablo.Models
{
    public class UserLoggin
    {
        [Key]
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
