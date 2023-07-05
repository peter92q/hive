interface deleteProp{
  userId: string;
  chatId: string;
}

export interface User 
{
    id: string;
    username: string;
    email: string;
    token: string; 
    firstName: string;
    lastName: string; 
    country: string; 
    age: number;
    profilePictureUrl: string;
    followersCount: number;
    followingCount: number;
    isFollowed: boolean; 
    description: string;
    memberSince: string;
    hashtags: string[];
    facebookUsername: string;
    instagramUsername: string;
    twitterUsername: string;
}

export interface BlogPostDto
{
    id: number;
    image: string;
    description: string;
    createdAt: string;
    authorUsername: string;
    postEmail: string;
    likes: number;
    isLikedByCurrentUser: boolean;
    authorProfilePic: string;
    authorId: string;
    comments: CommentResponseDto[];
    commentsCount: number;
} 

export interface CommentResponseDto 
{
    id: number;
    text: string;
    createdAt: string;
    authorUsername: string;
    authorProfilePic: string; 
}
  
export interface CreateCommentDto
{
    text: string;
}

export interface CreatePostDto 
{
    image: File;
    description?: string;
    userId: string;
}


export interface Sender {
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
  }
  
  export interface MessageProps {
    conversationId: string;
    messageId: string;
    sender: Sender;
    content: string;
    timestamp: string;
    receiver: string;
  }

  export interface InboxMessageProps {
    content: string
    messageId: string
    sentBy: string
    timestamp: string
    userIdA: string
    userIdB: string
    firstNameUserA: string
    firstNameUserB: string
    userPicA: string
    userPicB: string
  }
  

  export interface ConvoProps {
    id: string
    idUserA: string
    idUserB: string
    usernameUserA: string 
    usernameUserB: string
    picUserA: string
    picUserB: string
    messages: any[]
    lastMessageShort: string
    lastMessageById: string
    unreadMessageCount: number
    deletedForIds: deleteProp[]
  }

export interface CheckProps {
    index: number | null;
    id: string | null;
  }

export interface UserCardProps {
  id: string;
  name: string;
  userName: string;
  profilePictureUrl: string;
}