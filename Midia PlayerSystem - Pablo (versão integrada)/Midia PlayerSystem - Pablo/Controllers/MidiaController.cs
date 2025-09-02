using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Midia_PlayerSystem___Pablo.Data;
using Midia_PlayerSystem___Pablo.Models;

namespace Midia_PlayerSystem___Pablo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MidiaController : Controller
    {
        [HttpGet]
        public ActionResult<IEnumerable<Midia>> Get() => Ok(DataStore.MediaList);

        [HttpPost]
        public ActionResult<Midia> Post([FromBody] Midia media)
        {
            if (string.IsNullOrEmpty(media.Name) || string.IsNullOrEmpty(media.UrlVideo))
            {
                return BadRequest("Nome e URL da mídia são obrigatórios.");
            }

            media.Id = DataStore.MediaIdCounter++;
            DataStore.MediaList.Add(media);
            return CreatedAtAction(nameof(Get), new { id = media.Id }, media);
        }

        [HttpGet("{id}")]
        public ActionResult<Midia> Get(int id)
        {
            var media = DataStore.MediaList.FirstOrDefault(m => m.Id == id);
            return media == null ? NotFound() : Ok(media);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Midia updatedMedia)
        {
            var media = DataStore.MediaList.FirstOrDefault(m => m.Id == id);
            if (media == null) return NotFound();

            media.Name = updatedMedia.Name;
            media.Description = updatedMedia.Description;
            media.UrlVideo = updatedMedia.UrlVideo;
            media.Type = updatedMedia.Type;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var media = DataStore.MediaList.FirstOrDefault(m => m.Id == id);
            if (media == null) return NotFound();
            DataStore.MediaList.Remove(media);
            return NoContent();
        }
    }
}
