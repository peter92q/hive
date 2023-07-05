using Amazon.S3;
using Amazon.S3.Model;

public class S3Service : IS3Service
{
    private readonly AmazonS3Client _s3Client;
    private readonly string _s3BucketName;

    public S3Service(string accessKeyId, string secretAccessKey, string regionEndpoint, string s3BucketName)
    {
        _s3Client = new AmazonS3Client(accessKeyId, secretAccessKey, Amazon.RegionEndpoint.GetBySystemName(regionEndpoint));
        _s3BucketName = s3BucketName;
    }
    public async Task<string> UploadFileAsync(IFormFile file)
    {
        var s3ObjectKey = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var s3ObjectUrl = "";

        using (var stream = file.OpenReadStream())
        {
            var request = new PutObjectRequest
            {
                BucketName = _s3BucketName,
                Key = s3ObjectKey,
                InputStream = stream,
                ContentType = file.ContentType,
                CannedACL = S3CannedACL.PublicRead
            };

            await _s3Client.PutObjectAsync(request);
            s3ObjectUrl = $"https://{_s3BucketName}.s3.amazonaws.com/{s3ObjectKey}";
        }

        return s3ObjectUrl;
    }
}
