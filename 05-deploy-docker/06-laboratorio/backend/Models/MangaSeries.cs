namespace MangaApi.Models;

public class MangaSeries
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Author { get; set; }
    public string? Genre { get; set; }
    public string Status { get; set; } = "Ongoing";
    public int? Chapters { get; set; }
    public string? Synopsis { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
