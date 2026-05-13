using MangaApi.Data;
using MangaApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace MangaApi.Controllers;

[ApiController]
[Route("api/manga")]
public class MangaController : ControllerBase
{
    private readonly MangaStore _store;

    public MangaController(MangaStore store)
    {
        _store = store;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var (items, total) = _store.GetPaged(page, pageSize);

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
    public IActionResult GetById(int id)
    {
        var manga = _store.GetById(id);
        if (manga is null) return NotFound(new { message = $"Serie con id {id} no encontrada." });
        return Ok(manga);
    }

    [HttpPost]
    public IActionResult Create([FromBody] MangaSeries manga)
    {
        var created = _store.Create(manga);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] MangaSeries manga)
    {
        var updated = _store.Update(id, manga);
        if (updated is null) return NotFound(new { message = $"Serie con id {id} no encontrada." });
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        if (!_store.Delete(id)) return NotFound(new { message = $"Serie con id {id} no encontrada." });
        return NoContent();
    }
}
