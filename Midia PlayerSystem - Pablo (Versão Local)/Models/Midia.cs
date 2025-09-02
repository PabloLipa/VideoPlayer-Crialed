using System.ComponentModel.DataAnnotations;

namespace Midia_PlayerSystem___Pablo.Models
{
    public class Midia
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "É precisso de um nome.")]
        public string Name { get; set; }

        [Required (ErrorMessage = "É precisso de uma descrição")]
        public string Description { get; set; }

        public string UrlVideo { get; set; } // URL do vídeo ou imagem
        public string Type { get; set; } // "video" ou "image"

    }
}
