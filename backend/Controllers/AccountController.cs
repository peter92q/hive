using API.DTOs;
using API.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AccountController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly TokenService _tokenService;
    private readonly DbContext _context;
    private readonly IS3Service _s3Service;
    private readonly IUserService _userService;


    public AccountController(UserManager<User> userManager,
        TokenService tokenService, DbContext context, IS3Service s3Service,
        IUserService userService)
    {
        _context = context;
        _userManager = userManager;
        _tokenService = tokenService;
        _s3Service = s3Service;
        _userService = userService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var cookieUser = await _userManager.FindByNameAsync(loginDto.Username);
        var user = await _context.Users
        .Include(h=>h.Hashtags)
        .FirstOrDefaultAsync(u=>u.Id == cookieUser.Id);
        
        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            return Unauthorized();

        int followersCount = await _userService.GetFollowersCountAsync(user.Id);
        int followingCount = await _userService.GetFollowingCountAsync(user.Id);
 
        return new UserDto
        {
            Username = user.UserName,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Country = user.Country,
            Age = user.Age,
            Id = user.Id,
            Email = user.Email,
            ProfilePictureUrl = user.ProfilePictureUrl,
            Token = await _tokenService.GenerateToken(user),
            FollowersCount = followersCount,
            FollowingCount = followingCount,
            Description = user.Description,
            Hashtags = user.Hashtags.Select(h => h.Name).ToList(),
            MemberSince = user.MemberSince.ToString("MMMM dd, yyyy h:mm tt"),
            InstagramUsername = user.InstagramUsername,
            TwitterUsername = user.TwitterUsername,
            FacebookUsername = user.FacebookUsername
        };
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        var user = new User
        {
            UserName = registerDto.UserName,
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Country = registerDto.Country,
            Age = AgeCalculator.CalculateAge(registerDto.BirthYear),
            MemberSince = DateTime.UtcNow,
            ProfilePictureUrl = "https://peter92q.s3.eu-central-1.amazonaws.com/nobg.png"

        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }

        await _userManager.AddToRoleAsync(user, "Member");

        return StatusCode(201);
    }

    [Authorize]
    [HttpGet("currentUser")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var cookieUser = await _userManager.FindByNameAsync(User.Identity.Name);
        var user = await _context.Users
            .Include(h=>h.Hashtags)
            .FirstOrDefaultAsync(u=>u.Id == cookieUser.Id);
        var userId = user.Id;
        var followersCount = await _userService.GetFollowersCountAsync(userId);
        var followingCount = await _userService.GetFollowingCountAsync(userId);

        return new UserDto
        { 
            Username = user.UserName,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Country = user.Country,
            Age = user.Age,
            Id = user.Id,
            Email = user.Email,
            ProfilePictureUrl = user.ProfilePictureUrl,
            Token = await _tokenService.GenerateToken(user),
            FollowersCount = followersCount,
            FollowingCount = followingCount, 
            Description = user.Description,
            Hashtags = user.Hashtags.Select(h => h.Name).ToList(),
            MemberSince = user.MemberSince.ToString("MMMM dd, yyyy h:mm tt"),
            InstagramUsername = user.InstagramUsername,
            TwitterUsername = user.TwitterUsername,
            FacebookUsername = user.FacebookUsername
        };
    }

    [HttpGet("users/{id}")]
    public async Task<ActionResult<UserDto>> GetUserById(string id)
    {
        var currentUser = await _userManager.FindByNameAsync(User.Identity.Name);
        var user = await _context.Users
            .Include(h=>h.Hashtags)
            .FirstOrDefaultAsync(u=>u.Id == id);
        var followersCount = await _userService.GetFollowersCountAsync(id);
        var followingCount = await _userService.GetFollowingCountAsync(id);
        var isUserFollowed = await _userService.IsFollowingAsync(currentUser.Id, id);

        return new UserDto 
        {
            Username = user.UserName,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Country = user.Country,
            Age = user.Age,
            Id = user.Id,
            Email = user.Email,
            ProfilePictureUrl = user.ProfilePictureUrl,
            Token = await _tokenService.GenerateToken(user),
            FollowersCount = followersCount,
            FollowingCount = followingCount,
            IsFollowed = isUserFollowed, 
            Description = user.Description,
            Hashtags = user.Hashtags.Select(h => h.Name).ToList(),
            MemberSince = user.MemberSince.ToString("MMMM dd, yyyy h:mm tt"),
            InstagramUsername = user.InstagramUsername,
            TwitterUsername = user.TwitterUsername,
            FacebookUsername = user.FacebookUsername
        };
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<GetAllUsersDto>>> GetAllUsers(int limit = 5)
    {
        var currentUser = await _userManager.FindByNameAsync(User.Identity.Name);

        string rawQueryString = "SELECT * FROM \"AspNetUsers\" WHERE \"Id\" <> {0} ORDER BY RANDOM() LIMIT 5;";

        var users = await _context.Users
            .FromSqlRaw(rawQueryString, currentUser.Id)
            .ToListAsync();

        var usersDto = new List<GetAllUsersDto>();
        foreach (var user in users)
        {
            usersDto.Add(new GetAllUsersDto
            {
                Id = user.Id,
                Username = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePictureUrl = user.ProfilePictureUrl,
                IsFollowed = await _userService.IsFollowingAsync(currentUser.Id, user.Id),
            });
        }
        return Ok(usersDto);
    }

    [Authorize]
    [HttpPut("updateProfile")]
    public async Task<ActionResult<UserDto>> UpdateProfile(UpdateProfileDto updateProfileDto)
    {
        var cookieUser = await _userManager.FindByNameAsync(User.Identity.Name);
        var user = await _context.Users
            .Include(h=>h.Hashtags)
            .FirstOrDefaultAsync(u=>u.Id == cookieUser.Id);
        if (user == null) 
        {
            return NotFound();
        }

        user.FirstName = updateProfileDto.FirstName ?? user.FirstName;
        user.LastName = updateProfileDto.LastName ?? user.LastName;
        user.Country = updateProfileDto.Country ?? user.Country;
        user.Description = updateProfileDto.Description ?? user.Description;
        user.FacebookUsername = updateProfileDto.FacebookUsername ?? user.FacebookUsername;
        user.InstagramUsername = updateProfileDto.InstagramUsername ?? user.InstagramUsername;
        user.TwitterUsername = updateProfileDto.TwitterUsername ?? user.TwitterUsername;
        user.Hashtags.Clear();
        if (updateProfileDto.Hashtags != null && updateProfileDto.Hashtags.Count > 0)
        {
            int maxHashtags = Math.Min(updateProfileDto.Hashtags.Count, 5);

            for (int i = 0; i < maxHashtags; i++)
            {
                var hashtag = new Hashtag { Name = updateProfileDto.Hashtags[i] };
                user.Hashtags.Add(hashtag);
            }
        }
        
        await _context.SaveChangesAsync();
 
        return new UserDto
        {
          Username = user.UserName,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Country = user.Country,
            Age = user.Age,
            Id = user.Id,
            Email = user.Email,
            ProfilePictureUrl = user.ProfilePictureUrl,
            Description = user.Description,
            Hashtags = user.Hashtags.Select(h => h.Name).ToList(),
            MemberSince = user.MemberSince.ToString("MMMM dd, yyyy h:mm tt") ?? null,
            InstagramUsername = user.InstagramUsername,
            TwitterUsername = user.TwitterUsername,
            FacebookUsername = user.FacebookUsername
        };
    }

    //working
    [Authorize]
    [HttpPost("updateProfilePic")]
    public async Task<IActionResult> UpdateAvatar([FromForm] UpdateAvatarDto updateAvatarDto)
    {
        var file = updateAvatarDto.AvatarFile;
        var s3ObjectUrl = await _s3Service.UploadFileAsync(file);

        var user = await _userManager.FindByNameAsync(User.Identity.Name);

        if (user == null)
        {
            return NotFound();
        }

        // Update the user's profile picture URL and save changes to the database
        user.ProfilePictureUrl = s3ObjectUrl;
        await _userManager.UpdateAsync(user);

        return Ok(new { profilePictureUrl = s3ObjectUrl });
    }

    //working
    [HttpPost("follow/{userId}")]
    [Authorize]
    public async Task<ActionResult<object>> FollowUser(string userId)
    {
        var follower = await _userManager.FindByNameAsync(User.Identity.Name);

        if (follower == null)
        {
            return BadRequest("Failed to follow user.");
        }

        if (follower.Id == userId)
        {
            return BadRequest("You cannot follow yourself.");
        }

        bool isFollowing = await _userService.FollowUserAsync(follower.Id, userId);

        int updatedFollowingCount = await _userService.GetFollowingCountAsync(follower.Id);

        // Update the isFollowing property based on the updated IsFollowing property of the UserFollow entity
        isFollowing = await _userService.IsFollowingAsync(follower.Id, userId);

        if (isFollowing)
        {
            return Ok(new { followingCount = updatedFollowingCount, isFollowing });
        }
        else
        {
            // Remove the user follow entity from the user's Followers and Following collections
            var followingUser = await _userManager.FindByIdAsync(userId);

            var followerFollow = followingUser.Followers.FirstOrDefault(f => f.FollowerId == follower.Id);
            if (followerFollow != null)
            {
                follower.Following.Remove(followerFollow);
            }

            var followingFollow = follower.Following.FirstOrDefault(f => f.FollowingId == followingUser.Id);
            if (followingFollow != null)
            {
                followingUser.Followers.Remove(followingFollow);
            }

            await _userManager.UpdateAsync(follower);
            await _userManager.UpdateAsync(followingUser);

            return Ok(new { followingCount = updatedFollowingCount, isFollowing });
        }
    }

    //working
    [HttpGet("{userId}/following")]
    public async Task<ActionResult<IEnumerable<object>>> GetUserFollowing(string userId)
    {
        var targetUser = await _userManager.FindByIdAsync(userId);
        if (targetUser == null)
        {
            return NotFound("User not found.");
        }
        var loggedInUser = await _userManager.FindByNameAsync(User.Identity.Name);
        var following = await _userService.GetFollowingAsync(userId);

        var followingDto = new List<object>();
        foreach (var user in following)
        {
            if (loggedInUser != null)
            {
                followingDto.Add(new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.UserName,
                    user.ProfilePictureUrl,
                    IsFollowed = await _userService.IsFollowingAsync(loggedInUser.Id, user.Id)
                });
            }
            else
            {
                followingDto.Add(new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.UserName,
                    user.ProfilePictureUrl
                });
            }
        }
        return Ok(followingDto);
    }


    //working
    [HttpGet("{userId}/followers")]
    public async Task<ActionResult<IEnumerable<object>>> GetUserFollowers(string userId)
    {
        var targetUser = await _userManager.FindByIdAsync(userId);
        if (targetUser == null)
        {
            return NotFound("User not found.");
        }

        var loggedInUser = await _userManager.FindByNameAsync(User.Identity.Name);

        var followers = await _userService.GetFollowersAsync(userId);

        var followersDto = new List<object>();
        foreach (var user in followers)
        {
            if (loggedInUser != null)
            {
                followersDto.Add(new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.UserName,
                    user.ProfilePictureUrl,
                    IsFollowed = await _userService.IsFollowingAsync(loggedInUser.Id, user.Id)
                });
            }
            else
            {
                followersDto.Add(new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.UserName,
                    user.ProfilePictureUrl
                });
            }
        }
        return Ok(followersDto);
    }

    [HttpGet("users/search")]
    public async Task<ActionResult<List<SearchUserDto>>> SearchUsers(string name)
    {
        var users = await _userManager.Users
            .Where(user => 
             user.FirstName.ToLower().StartsWith(name.ToLower()) || 
             user.LastName.ToLower().StartsWith(name.ToLower()) ||
             user.UserName.ToLower().StartsWith(name.ToLower()))
            .Select(user => new SearchUserDto
            {
                Id = user.Id,
                Name = $"{user.FirstName} {user.LastName}",
                ProfilePictureUrl = user.ProfilePictureUrl,
                UserName = user.UserName
            })
            .ToListAsync();
            
        if (!users.Any())
        {
            return NotFound();
        }

        return Ok(users);
    }

};
