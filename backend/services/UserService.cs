using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly DbContext _dbContext;

    public UserService(UserManager<User> userManager, DbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }

    public async Task<bool> FollowUserAsync(string followerId, string followingId)
    {
        var userFollow = await _dbContext.UserFollows
            .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowingId == followingId);

        if (userFollow != null)
        { 
            userFollow.IsFollowing = !userFollow.IsFollowing;
            if (!userFollow.IsFollowing)
            {
                // Remove the user follow entity from the user's Followers and Following collections
                var followerToRemoveFrom = await _dbContext.Users.FindAsync(followerId);
                var followingToRemoveFrom = await _dbContext.Users.FindAsync(followingId);

                followerToRemoveFrom.Following.Remove(userFollow);
                followingToRemoveFrom.Followers.Remove(userFollow);
            }

            await _dbContext.SaveChangesAsync();
            return userFollow.IsFollowing;
        }

        var followerUser = await _userManager.FindByIdAsync(followerId);
        var followingUser = await _userManager.FindByIdAsync(followingId);

        if (followerUser == null || followingUser == null)
        {
            // User not found, can't follow
            return false;
        }

        var follow = new UserFollow
        {
            Follower = followerUser,
            Following = followingUser,
            IsFollowing = true
        };

        await _dbContext.UserFollows.AddAsync(follow);

        // Add the user follow entity to the user's Followers and Following collections
        followerUser.Following.Add(follow);
        followingUser.Followers.Add(follow);

        await _dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<bool> IsFollowingAsync(string followerId, string followingId)
    {
        return await _dbContext.UserFollows
            .AnyAsync(f => f.FollowerId == followerId && f.FollowingId == followingId && f.IsFollowing == true);
    }


    public async Task<int> GetFollowersCountAsync(string userId)
    {
        return await _dbContext.UserFollows.CountAsync(f => f.FollowingId == userId);
    }

    public async Task<int> GetFollowingCountAsync(string userId)
    {
        return await _dbContext.UserFollows.CountAsync(f => f.FollowerId == userId);
    }

    public async Task<IEnumerable<User>> GetFollowersAsync(string userId)
    {
        return await _dbContext.UserFollows
            .Include(f => f.Follower)
            .Where(f => f.FollowingId == userId && f.IsFollowing == true)
            .Select(f => f.Follower)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetFollowingAsync(string userId)
    {
        return await _dbContext.UserFollows
            .Include(f => f.Following)
            .Where(f => f.FollowerId == userId && f.IsFollowing == true)
            .Select(f => f.Following)
            .ToListAsync();
    }

}
