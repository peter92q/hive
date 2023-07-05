namespace API.DTOs
{
    public class GetIndividualUserDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Country { get; set; }
        public int Age { get; set; }
        public string ProfilePictureUrl { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
        public string Description { get; set; }

        public List<string> Hashtags {get; set;}
        public string MemberSince {get; set;}
        public Boolean IsFollowed { get; set; }
    }
}