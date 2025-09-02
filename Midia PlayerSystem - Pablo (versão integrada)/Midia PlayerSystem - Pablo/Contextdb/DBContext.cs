using Microsoft.EntityFrameworkCore;
using Midia_PlayerSystem___Pablo.Models;

namespace Midia_PlayerSystem___Pablo.Contextdb
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> options) : base(options) { }

        public DbSet<UserLoggin> Useres {get; set;}

    }
}
