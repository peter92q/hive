namespace API.DTOs
{
    public class UserDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Country { get; set; }
        public string ProfilePictureUrl { get; set; }
        public int Age { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
        public string Description { get; set; }
        public string MemberSince { get; set; }
        public List<string> Hashtags {get; set;}
        public string InstagramUsername {get; set;}
        public string TwitterUsername {get; set;}
        public string FacebookUsername {get; set;}
        public Boolean IsFollowed { get; set; }

    }
}