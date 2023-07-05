using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class BlogPostsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly DbContext _context;
        private readonly IS3Service _s3Service;

        public BlogPostsController(UserManager<User> userManager, DbContext context, IS3Service s3Service)
        {
            _context = context;
            _userManager = userManager;
            _s3Service = s3Service;
        }

        //working
        [Authorize] 
        [HttpPost]  
        public async Task<ActionResult<BlogPostDto>> CreatePost([FromForm] CreatePostDto createPostDto)
        {
            var file = createPostDto.File;
            var s3ObjectUrl = await _s3Service.UploadFileAsync(file);
            var post = new BlogPost
            {
                Image = s3ObjectUrl,
                Description = createPostDto.Description,
                User = await _userManager.FindByNameAsync(User.Identity.Name),
                CreatedAt = DateTime.UtcNow
            };

            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            var postDto = new BlogPostDto
            {
                Id = post.Id,
                Image = post.Image,
                Description = post.Description,
                CreatedAt = post.CreatedAt.ToString("MMMM dd, yyyy h:mm tt"),
                AuthorUsername = post.User.UserName,
                PostEmail = post.User.Email,
                Likes = post.PostLikes.Count(),
                AuthorProfilePic = post.User.ProfilePictureUrl,
                AuthorId = post.User.Id,
                CommentsCount = post.Comments.Count,
            };

            return Ok(postDto);
        }

        //working
        [HttpGet]
        public async Task<ActionResult<List<BlogPostDto>>> GetBlogPosts()
        {
            //setup the guest user
            User user = null;

            if (User.Identity.IsAuthenticated)
            {
                user = await _userManager.FindByNameAsync(User.Identity.Name);
            }

            var posts = await _context.BlogPosts
                .Include(p => p.User)
                .Include(p => p.PostLikes)
                .Include(p => p.Comments)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return posts.Select(p => new BlogPostDto
            {
                Id = p.Id,
                Image = p.Image,
                Description = p.Description,
                CreatedAt = p.CreatedAt.ToString("MMMM dd, yyyy h:mm tt"),
                AuthorUsername = p.User.UserName,
                PostEmail = p.User.Email,
                Likes = p.PostLikes.Count(),
                AuthorProfilePic = p.User.ProfilePictureUrl,
                AuthorId = p.User.Id,
                CommentsCount = p.Comments.Count,
                IsLikedByCurrentUser = user != null ? p.PostLikes.Any(pl => pl.UserId == user.Id) : false
            }).ToList();
        }

        [HttpGet("getIndividualPost")]
        public async Task<ActionResult<List<BlogPostDto>>> GetSinglePost(int postId)
        {
            // Setup the guest user
            User user = null;

            if (User.Identity.IsAuthenticated)
            {
                user = await _userManager.FindByNameAsync(User.Identity.Name);
            }

            var post = await _context.BlogPosts
                .Include(p => p.User)
                .Include(p => p.PostLikes)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == postId);

            return Ok(new
            {
                Id = post.Id,
                Image = post.Image,
                Description = post.Description,
                CreatedAt = post.CreatedAt.ToString("MMMM dd, yyyy h:mm tt"),
                AuthorUsername = post.User.UserName,
                PostEmail = post.User.Email,
                Likes = post.PostLikes.Count(),
                AuthorProfilePic = post.User.ProfilePictureUrl,
                AuthorId = post.User.Id,
                CommentsCount = post.Comments.Count,
                IsLikedByCurrentUser = user != null ? post.PostLikes.Any(pl => pl.UserId == user.Id) : false
            });
        }

        [HttpGet("{authorId}")]
        public async Task<ActionResult<List<BlogPostDto>>> GetBlogPostsByAuthor(string authorId)
        {
            User user = null;

            if (User.Identity.IsAuthenticated)
            {
                user = await _userManager.FindByNameAsync(User.Identity.Name);
            }

            var posts = await _context.BlogPosts
            .Include(p => p.User)
            .Include(p => p.PostLikes)
            .Include(p => p.Comments)
            .Where(p => p.User.Id == authorId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

            return posts.Select(p => new BlogPostDto
            {
                Id = p.Id,
                Image = p.Image,  
                Description = p.Description,
                CreatedAt = p.CreatedAt.ToString("MMMM dd, yyyy h:mm tt"),
                AuthorUsername = p.User.UserName,
                PostEmail = p.User.Email,
                Likes = p.PostLikes.Count(),
                AuthorProfilePic = p.User.ProfilePictureUrl,
                AuthorId = p.User.Id,
                CommentsCount = p.Comments.Count,
                Comments = p.Comments.Select(c=> new CommentResponseDto{
                    Id = c.Id,
                    Text = c.Text,
                    CreatedAt = c.CreatedAt.ToString("MMMM dd, yyyy h:mm tt"),
                    AuthorUsername = c.AuthorUsername,
                    AuthorProfilePic = c.AuthorProfilePic

                }).ToList(),
                IsLikedByCurrentUser = user != null ? p.PostLikes.Any(pl => pl.UserId == user.Id) : false
            }).ToList();
        }


        //pagination(infinite scrolling effect)//
        //working
        [HttpGet("experimental")]
        public async Task<ActionResult<List<BlogPostDto>>> GetBlogPosts([FromQuery] int skip = 0, [FromQuery] int take = 10)
        {
            User user = null;

            if (User.Identity.IsAuthenticated)
            {
                user = await _userManager.FindByNameAsync(User.Identity.Name);
            }

            var posts = await _context.BlogPosts
                .Include(p => p.User)
                .Include(p => p.PostLikes)
                .Include(p => p.Comments)
                .OrderByDescending(p => p.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();

            return posts.Select(p => new BlogPostDto
            {
                Id = p.Id,
                Image = p.Image,
                Description = p.Description,
                CreatedAt = p.CreatedAt.ToString("MMMM dd, yyyy h:mm tt"),
                AuthorUsername = p.User.UserName,
                PostEmail = p.User.Email,
                Likes = p.PostLikes.Count(),
                AuthorProfilePic = p.User.ProfilePictureUrl,
                AuthorId = p.User.Id,
                CommentsCount = p.Comments.Count(),
                IsLikedByCurrentUser = user != null ? p.PostLikes.Any(pl => pl.UserId == user.Id) : false
            }).ToList();
        }

        [HttpPost("{id}/like")]
        public async Task<ActionResult> LikePost(int id)
        {
            var post = await _context.BlogPosts
                .Include(p => p.PostLikes)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            if (user == null)
            {
                return Unauthorized();
            }
            
            var existingLike = post.PostLikes.FirstOrDefault(pl => pl.UserId == user.Id);

            if (existingLike != null)
            {
                _context.PostLikes.Remove(existingLike);
                await _context.SaveChangesAsync();

                post.PostLikes.Remove(existingLike);
                post.Likes = post.PostLikes.Count;
                await _context.SaveChangesAsync();

                return Ok(new { Likes = post.Likes, IsLiked = false, Username = user.UserName, Email = user.Email });
            }
            else
            {
                var newLike = new PostLike
                {
                    PostId = id,
                    UserId = user.Id
                };

                _context.PostLikes.Add(newLike);
                await _context.SaveChangesAsync();

                post.PostLikes.Add(newLike);
                post.Likes = post.PostLikes.Count;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Likes = post.Likes,
                    IsLiked = true,
                    Username = user.UserName,
                    Email = user.Email
                }); 

            }
        }

        [Authorize]
        [HttpDelete("{postId}")]
        public async Task<ActionResult> DeletePost(int postId)
        {
            var post = await _context.BlogPosts
                .Include(p => p.PostLikes)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == postId);

            if (post == null)
            {
                return NotFound();
            }

            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            if (post.User.Id != user.Id)
            {
                return Forbid();
            }

            _context.PostLikes.RemoveRange(post.PostLikes); // Remove related PostLikes entities
            await _context.SaveChangesAsync();

            _context.Comments.RemoveRange(post.Comments);
            await _context.SaveChangesAsync();

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //working
        [Authorize]
        [HttpPost("{postId}/createComment")]
        public async Task<ActionResult<CreateCommentDto>> CreateComment(int postId, [FromBody] CreateCommentDto createCommentDto)
        {
            var post = await _context.BlogPosts.FindAsync(postId);

            if (post == null)
            {
                return NotFound();
            }

            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var comment = new Comment
            {
                Text = createCommentDto.Text,
                CreatedAt = DateTime.UtcNow,
                PostId = postId,
                User = user,
                UserId = user.Id,
                AuthorUsername = user.UserName,
                AuthorProfilePic = user.ProfilePictureUrl,
                AuthorEmail = user.Email
            };

            post.Comments.Add(comment);
            post.CommentsCount = post.Comments.Count;
            await _context.SaveChangesAsync();

            var newPost = new CommentResponseDto
            {
                Id = comment.Id,
                Text = comment.Text,
                AuthorUsername = comment.AuthorUsername,
                CreatedAt = comment.CreatedAt.ToString("MMMM dd, yyyy h:mm tt"),
                AuthorProfilePic = comment.User.ProfilePictureUrl
            };

            return Ok(newPost);
        }

        //working
        [HttpGet("{postId}/comments")]
        public async Task<ActionResult<List<CommentResponseDto>>> GetComments(int postId)
        {
            var comments = await _context.Comments
           .Where(c => c.PostId == postId)
           .Include(c => c.User)
           .Select(c => new CommentResponseDto
           {
               Id = c.Id,
               Text = c.Text,
               CreatedAt = c.CreatedAt.ToString("MMMM dd, yyyy h:mm tt"),
               AuthorUsername = c.AuthorUsername,
               AuthorProfilePic = c.AuthorProfilePic
           })
           .ToListAsync();

            return comments;
        }

        //working
        [Authorize]
        [HttpDelete("{postId}/comments/{commentId}")]
        public async Task<ActionResult> DeleteComment(int postId, int commentId)
        {
            var post = await _context.BlogPosts.FindAsync(postId);

            if (post == null)
            {
                return NotFound("Post not found");
            }

            var comment = await _context.Comments.FindAsync(commentId);

            if (comment == null)
            {
                return NotFound("Comment not found");
            }

            if (comment.PostId != postId)
            {
                return BadRequest("The comment does not belong to the specified post");
            }

            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            if (user.Id != comment.UserId )
            {
                return Forbid("You do not have permission to delete this comment");
            }

            post.Comments.Remove(comment);
            post.CommentsCount = post.Comments.Count;
            _context.Comments.Remove(comment);

            await _context.SaveChangesAsync();

            return NoContent();
        }

    }

}
