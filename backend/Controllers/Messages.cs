using API.services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class MessageController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly DbContext _context;

    public MessageController(UserManager<User> userManager,
        TokenService tokenService, DbContext context, IS3Service s3Service,
        IUserService userService)
    {
        _context = context;
        _userManager = userManager;
    }
    [HttpPost]
    public async Task<IActionResult> SendMessage(MessageRequestModel model)
    {
        var sender = await _userManager.FindByNameAsync(User.Identity.Name);
        var recipient = await _userManager.FindByIdAsync(model.RecipientId);

        if (sender == null || recipient == null)
        {
            return NotFound("Sender or recipient user not found.");
        }

        var conversation = _context.Chats
            .Include(c => c.Messages)
            .FirstOrDefault(c =>
            (c.IdUserA == sender.Id && c.IdUserB == recipient.Id) ||
            (c.IdUserA == recipient.Id && c.IdUserB == sender.Id));

        if (conversation == null)
        {
            conversation = new Chat
            {
                Id = Guid.NewGuid().ToString(),
                IdUserA = sender.Id,
                IdUserB = recipient.Id,
                UsernameUserA = sender.UserName,
                UsernameUserB = recipient.UserName,
                PicUserA = sender.ProfilePictureUrl,
                PicUserB = recipient.ProfilePictureUrl,
                Messages = new List<Message>(),
                LastMessageById = "",
                UnreadMessageCount = 0
            };

            _context.Chats.Add(conversation);
        }

        var message = new Message
        {
            MessageId = Guid.NewGuid().ToString(),
            SentBy = sender.Id,
            UserIdA = sender.Id,
            UserIdB = recipient.Id,
            FirstNameUserA = sender.FirstName,
            FirstNameUserB = recipient.FirstName,
            UserPicA = sender.ProfilePictureUrl,
            UserPicB = recipient.ProfilePictureUrl,
            Content = model.Content,
            Timestamp = DateTime.UtcNow,
        }; 

        conversation.LastMessageShort = model.Content;
        conversation.LastMessageById = sender.Id;
        conversation.UnreadMessageCount += 1;
        conversation.Messages.Add(message);

        _context.SaveChanges();

        var response = new
        {
            Content = message.Content, 
            MessageId = message.MessageId,
            SentBy = message.SentBy,
            Timestamp = message.Timestamp.ToString("MMMM dd, yyyy h:mm tt"),
            UserIdA = message.UserIdA,
            UserIdB = message.UserIdB,
            FirstNameUserA = message.FirstNameUserA,
            FirstNameUserB = message.FirstNameUserB,
            UserPicA = message.UserPicA,
            UserPicB = message.UserPicB,
        }; 

        return Ok(response);
    }

[HttpGet("allConvos")]
public async Task<IActionResult> GetAllConvos()
{
    var user = await _userManager.FindByNameAsync(User.Identity.Name);
    var userId = user.Id.ToString();

    var convos = await _context.Chats
        .Include(c => c.DeletedForIds)
        .Where(u => u.IdUserA == userId || u.IdUserB == userId)
        .Where(c => !c.DeletedForIds.Any(d => d.UserId == userId))
        .ToListAsync();

    return Ok(convos);
}



[HttpGet("allDeletedConvos")]
public async Task<IActionResult> GetAllDeletedConvos()
{
    var user = await _userManager.FindByNameAsync(User.Identity.Name);
    var userId = user.Id.ToString();

    var convos = await _context.Chats
        .Include(c => c.DeletedForIds)
        .Where(u => u.IdUserA == userId || u.IdUserB == userId)
        .Where(c => c.DeletedForIds.Any(d => d.UserId == userId))
        .ToListAsync();

    return Ok(convos);
}


    [HttpPost("allConvoMessages")]
    public async Task<IActionResult> GetConvoMessages(fetchConvoModel convo)
    {

        var chat = await _context.Chats
            .Where(c => c.Id == convo.chatId)
            .Include(c => c.Messages)
            .FirstOrDefaultAsync();

        if (chat == null)
        {
            return NotFound("Chat not found.");
        }
        
        var messages = chat.Messages.Select(message => new
        {   
            Content = message.Content,
            MessageId = message.MessageId,
            SentBy = message.SentBy,
            Timestamp = message.Timestamp.ToString("MMMM dd, yyyy h:mm tt"),
            UserIdA = message.UserIdA,
            UserIdB = message.UserIdB,
            FirstNameUserA = message.FirstNameUserA,
            FirstNameUserB = message.FirstNameUserB,
            UserPicA = message.UserPicA,
            UserPicB = message.UserPicB,
        }).ToList();

        return Ok(messages);
    }

    [HttpPost("resetUnread")]
    public async Task<ActionResult> ResetUndreadCount(fetchConvoModel convo)
    {
        var chat = await _context.Chats
            .Where(c => c.Id == convo.chatId)
            .Include(c => c.Messages)
            .FirstOrDefaultAsync();

        chat.UnreadMessageCount = 0;

        _context.SaveChanges();

        return Ok(0);

    }

    [HttpGet("unreadCount")]
    public async Task<IActionResult> GetUnreadMessageCount()
    {
        var user = await _userManager.FindByNameAsync(User.Identity.Name);
        var userId = user.Id.ToString();

        var unreadCount = await _context.Chats
            .Where(c => (c.IdUserA == userId || c.IdUserB == userId) && c.LastMessageById != userId)
            .SumAsync(c => c.UnreadMessageCount);

        return Ok(unreadCount);
    }

[HttpPost("deleteChat/{chatId}")]
public async Task<IActionResult> DeleteChat(string chatId)
{
    var user = await _userManager.FindByNameAsync(User.Identity.Name);
    var userId = user.Id.ToString();

    var chat = await _context.Chats.FirstOrDefaultAsync(c => c.Id == chatId);

    if (chat == null)
    {
        return NotFound();
    }

    var deletedChat = new DeletedChat
    {
        UserId = userId,
        ChatId = chatId
    };

    chat.DeletedForIds.Add(deletedChat);
    await _context.SaveChangesAsync();

    return Ok();
}
 
[HttpPost("restoreChat/{chatId}")]
public async Task<IActionResult> RestoreChat(string chatId)
{
    var user = await _userManager.FindByNameAsync(User.Identity.Name);
    var userId = user.Id.ToString();

    var chat = await _context.Chats
        .Include(c => c.DeletedForIds)
        .FirstOrDefaultAsync(c => c.Id == chatId);

    if (chat == null)
    {
        return NotFound();
    }

    var deletedChat = chat.DeletedForIds.FirstOrDefault(dc =>
        dc.UserId == userId && dc.ChatId == chatId);

    if (deletedChat == null)
    {
        return NotFound();
    }

    chat.DeletedForIds.Remove(deletedChat);
    await _context.SaveChangesAsync();

    return Ok();
}

};

public class MessageRequestModel {
    public string RecipientId {get; set;}
    public string Content {get; set;}
}

public class fetchConvoModel {
    public string chatId {get; set;}
}