public interface IUserService
{
    Task<bool> FollowUserAsync(string followerId, string followingId);
    Task<bool> IsFollowingAsync(string followerId, string followingId);
    Task<int> GetFollowersCountAsync(string userId);
    Task<int> GetFollowingCountAsync(string userId);
    Task<IEnumerable<User>> GetFollowersAsync(string userId);
    Task<IEnumerable<User>> GetFollowingAsync(string userId);
}
