public class PostLike
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public string UserId { get; set; }
    public BlogPost Post { get; set; }
}
