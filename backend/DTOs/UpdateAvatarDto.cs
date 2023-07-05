using System.ComponentModel.DataAnnotations;

public class UpdateAvatarDto
{
    [Required]
    public IFormFile AvatarFile { get; set; }
}