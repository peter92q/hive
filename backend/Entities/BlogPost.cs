public class BlogPost
{
    public BlogPost()
    {
        PostLikes = new List<PostLike>();
        Comments = new List<Comment>();
    }
    public int Id { get; set; }
    public string Image { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public string UserId { get; set; }
    public User User { get; set; }
    public ICollection<PostLike> PostLikes { get; set; }
    public int Likes { get; set; }
    public ICollection<Comment> Comments { get; set; }
    public int CommentsCount { get; set; }
}
