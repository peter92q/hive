using System.ComponentModel.DataAnnotations;

public class RegisterDto
{
    [Required]
    public string UserName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [Required]
    [DataType(DataType.Password)]
    [Compare("Password", ErrorMessage = "The passwords do not match.")]
    public string ConfirmPassword { get; set; }

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public string Country { get; set; }

    [Required]
    [Range(1930, int.MaxValue, ErrorMessage = "Invalid birth year.")]
    public int BirthYear { get; set; }
}
