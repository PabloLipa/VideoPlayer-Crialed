namespace Midia_PlayerSystem___Pablo.Models
{
    public class Playlist
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<int> MediaIds { get; set; } = new List<int>();
    }
}
