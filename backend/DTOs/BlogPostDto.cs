public class BlogPostDto
{
    public int Id { get; set; }
    public string Image { get; set; }
    public string Description { get; set; }
    public string CreatedAt { get; set; }
    public int Likes { get; set; }
    public string AuthorUsername { get; set; }
    public string PostEmail { get; set; }
    public bool IsLikedByCurrentUser { get; set; }
    public string AuthorProfilePic { get; set; }
    public string AuthorId { get; set; }
    public int CommentsCount { get; set; }

    public List<CommentResponseDto> Comments {get; set;}
}
