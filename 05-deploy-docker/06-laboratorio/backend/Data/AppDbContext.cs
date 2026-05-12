using MangaApi.Models;
using Microsoft.EntityFrameworkCore;

namespace MangaApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<MangaSeries> MangaSeries => Set<MangaSeries>();
}
