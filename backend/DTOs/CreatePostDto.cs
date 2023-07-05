using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class CreatePostDto
    {
        [Required]
        public IFormFile File { get; set; }
        public string Description { get; set; }
    }
}
