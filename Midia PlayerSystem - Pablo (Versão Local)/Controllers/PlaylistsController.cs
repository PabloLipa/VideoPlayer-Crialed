using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Midia_PlayerSystem___Pablo.Data;
using Midia_PlayerSystem___Pablo.Models;

namespace Midia_PlayerSystem___Pablo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PlaylistsController : Controller
    {
        [HttpGet]
        public ActionResult<IEnumerable<Playlist>> Get() => Ok(DataStore.Playlists);

        [HttpPost]
        public ActionResult<Playlist> Post([FromBody] Playlist playlist)
        {
            if (string.IsNullOrEmpty(playlist.Name))
            {
                return BadRequest("O nome da playlist é obrigatório.");
            }

            playlist.Id = DataStore.PlaylistIdCounter++;
            DataStore.Playlists.Add(playlist);
            return CreatedAtAction(nameof(Get), new { id = playlist.Id }, playlist);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public ActionResult<Playlist> Get(int id)
        {
            var playlist = DataStore.Playlists.FirstOrDefault(p => p.Id == id);
            return playlist == null ? NotFound() : Ok(playlist);
        }

        [HttpGet("{id}/media")]
        [AllowAnonymous]
        public ActionResult<IEnumerable<Midia>> GetMedia(int id)
        {
            var playlist = DataStore.Playlists.FirstOrDefault(p => p.Id == id);
            if (playlist == null) return NotFound();

            var mediaList = DataStore.MediaList.Where(m => playlist.MediaIds.Contains(m.Id)).ToList();
            return Ok(mediaList);
        }

        [HttpPost("{id}/addMedia")]
        public IActionResult AddMedia(int id, [FromBody] int mediaId)
        {
            var playlist = DataStore.Playlists.FirstOrDefault(p => p.Id == id);
            if (playlist == null) return NotFound("Playlist não encontrada.");
            if (!DataStore.MediaList.Any(m => m.Id == mediaId)) return NotFound("Mídia não encontrada.");
            if (playlist.MediaIds.Contains(mediaId)) return BadRequest("A mídia já está nesta playlist.");

            playlist.MediaIds.Add(mediaId);
            return NoContent();
        }

        [HttpPost("{id}/removeMedia")]
        public IActionResult RemoveMedia(int id, [FromBody] int mediaId)
        {
            var playlist = DataStore.Playlists.FirstOrDefault(p => p.Id == id);
            if (playlist == null) return NotFound("Playlist não encontrada.");
            if (!playlist.MediaIds.Contains(mediaId)) return BadRequest("A mídia não está nesta playlist.");

            playlist.MediaIds.Remove(mediaId);
            return NoContent();
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Playlist updatedPlaylist)
        {
            var playlist = DataStore.Playlists.FirstOrDefault(p => p.Id == id);
            if (playlist == null) return NotFound();

            playlist.Name = updatedPlaylist.Name;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var playlist = DataStore.Playlists.FirstOrDefault(p => p.Id == id);
            if (playlist == null) return NotFound();
            DataStore.Playlists.Remove(playlist);
            return NoContent();
        }
    }
}
