using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

public class User : IdentityUser
{
    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public string Country { get; set; }

    [Required]
    public int Age { get; set; }
    public string ProfilePictureUrl { get; set; }
    public string Description { get; set; }
    public DateTime MemberSince {get; set;}
    public string InstagramUsername {get; set;}
    public string TwitterUsername {get; set;}
    public string FacebookUsername {get; set;}
    public List<Hashtag> Hashtags {get; set;} = new List<Hashtag>();
    public ICollection<UserFollow> Followers { get; set; } = new List<UserFollow>();
    public ICollection<UserFollow> Following { get; set; } =  new List<UserFollow>();
}

public class Hashtag
{
    public int Id { get; set; }
    public string Name { get; set; }
    public User User {get; set;}
}