using Midia_PlayerSystem___Pablo.Models;

namespace Midia_PlayerSystem___Pablo.Data
{
    public class DataStore
    {
        public static List<Midia> MediaList = new List<Midia>();
        public static List<Playlist> Playlists = new List<Playlist>();
        public static List<User> Users = new List<User> { new User { Username = "admin", Password = "password" } };
        public static int MediaIdCounter = 1;
        public static int PlaylistIdCounter = 1;
        public static readonly string JwtKey = "chave-secreta-muito-forte-para-jwts-nao-compartilhe";
    }
}
