public class Comment
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public string UserId { get; set; }
    public string Text { get; set; }
    public DateTime CreatedAt { get; set; }
    public User User { get; set; }
    public string AuthorUsername { get; set; }
    public string AuthorProfilePic { get;set; }
    public string AuthorEmail { get; set; }
    public BlogPost Post { get; set; }
}
