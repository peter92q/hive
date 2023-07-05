namespace API.DTOs
{
    public class GetAllUsersDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ProfilePictureUrl { get; set; }
        public bool IsFollowed { get; set; }
    }
}
