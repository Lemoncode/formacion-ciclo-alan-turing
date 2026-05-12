using MangaApi.Data;
using MangaApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MangaApi.Controllers;

[ApiController]
[Route("api/manga")]
public class MangaController : ControllerBase
{
    private readonly AppDbContext _context;

    public MangaController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var total = await _context.MangaSeries.CountAsync();
        var items = await _context.MangaSeries
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            data = items,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling((double)total / pageSize)
        });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var manga = await _context.MangaSeries.FindAsync(id);
        if (manga is null) return NotFound(new { message = $"Serie con id {id} no encontrada." });
        return Ok(manga);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MangaSeries manga)
    {
        manga.Id = 0;
        manga.CreatedAt = DateTime.UtcNow;
        _context.MangaSeries.Add(manga);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = manga.Id }, manga);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] MangaSeries manga)
    {
        var existing = await _context.MangaSeries.FindAsync(id);
        if (existing is null) return NotFound(new { message = $"Serie con id {id} no encontrada." });

        existing.Title = manga.Title;
        existing.Author = manga.Author;
        existing.Genre = manga.Genre;
        existing.Status = manga.Status;
        existing.Chapters = manga.Chapters;
        existing.Synopsis = manga.Synopsis;
        existing.ImageUrl = manga.ImageUrl;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var manga = await _context.MangaSeries.FindAsync(id);
        if (manga is null) return NotFound(new { message = $"Serie con id {id} no encontrada." });

        _context.MangaSeries.Remove(manga);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
