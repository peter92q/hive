public class Chat
{
    public string Id { get; set; }
    public string IdUserA { get; set; }
    public string IdUserB { get; set; }
    public string UsernameUserA {get; set;}
    public string UsernameUserB {get; set;}
    public string PicUserA {get; set;}
    public string PicUserB {get; set;}
    public List<Message> Messages { get; set; } = new List<Message>();

     public HashSet<DeletedChat> DeletedForIds { get; set; } = new HashSet<DeletedChat>();
    public string LastMessageShort { get; set; }
    public string LastMessageById {get; set;}
    public int UnreadMessageCount { get; set; }
}

public class Message
{ 
    public string MessageId { get; set; }
    public string SentBy {get; set;} 
    public string UserIdA {get; set;}
    public string UserIdB {get; set;}
    public string FirstNameUserA {get; set;}
    public string FirstNameUserB {get; set;}
    public string UserPicA {get; set;}
    public string UserPicB {get; set;}
    public string Content { get; set; }
    public DateTime Timestamp { get; set; }
    public Chat Chat { get; set; }
}

public class DeletedChat
{
    public int Id { get; set; } // Primary key
    public string UserId { get; set; } // User ID
    public string ChatId { get; set; } // Chat ID
}
