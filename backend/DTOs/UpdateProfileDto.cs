public class UpdateProfileDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Country { get; set; }
    public string Description { get; set; }
    public List<string> Hashtags { get; set; }
    public string FacebookUsername {get; set;}
    public string InstagramUsername {get; set;}
    public string TwitterUsername {get; set;}
}