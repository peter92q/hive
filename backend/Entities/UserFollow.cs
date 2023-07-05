public class UserFollow
{
    public string FollowerId { get; set; }
    public User Follower { get; set; }
    public string FollowingId { get; set; }
    public User Following { get; set; }
    public bool IsFollowing { get; set; }
}
