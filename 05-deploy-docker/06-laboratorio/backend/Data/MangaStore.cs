using MangaApi.Models;

namespace MangaApi.Data;

public class MangaStore
{
    private int _nextId;
    private readonly List<MangaSeries> _items;

    public MangaStore()
    {
        _items = new List<MangaSeries>
        {
            new() { Id = 1,  Title = "Berserk",             Author = "Kentaro Miura",    Genre = "Dark Fantasy", Status = "Ongoing",   Chapters = 374,  Synopsis = "La oscura epopeya de Guts, un mercenario solitario marcado por un pasado brutal que busca venganza contra su antiguo compañero Griffith.", CreatedAt = DateTime.UtcNow },
            new() { Id = 2,  Title = "One Piece",           Author = "Eiichiro Oda",     Genre = "Adventure",    Status = "Ongoing",   Chapters = 1110, Synopsis = "Monkey D. Luffy y su tripulación navegan los mares en busca del legendario tesoro 'One Piece' para convertirse en el Rey de los Piratas.", CreatedAt = DateTime.UtcNow },
            new() { Id = 3,  Title = "Vagabond",            Author = "Takehiko Inoue",   Genre = "Historical",   Status = "Hiatus",    Chapters = 327,  Synopsis = "La vida ficticia del espadachín Miyamoto Musashi en el Japón feudal, basada en la novela histórica de Eiji Yoshikawa.", CreatedAt = DateTime.UtcNow },
            new() { Id = 4,  Title = "Fullmetal Alchemist", Author = "Hiromu Arakawa",   Genre = "Fantasy",      Status = "Completed", Chapters = 116,  Synopsis = "Dos hermanos alquimistas recorren el mundo buscando la Piedra Filosofal para recuperar los cuerpos que perdieron en un ritual prohibido.", CreatedAt = DateTime.UtcNow },
            new() { Id = 5,  Title = "Attack on Titan",     Author = "Hajime Isayama",   Genre = "Action",       Status = "Completed", Chapters = 139,  Synopsis = "La humanidad sobrevive encerrada tras murallas colosales, amenazada por los Titanes, gigantes devoradores de humanos.", CreatedAt = DateTime.UtcNow },
            new() { Id = 6,  Title = "Hunter x Hunter",     Author = "Yoshihiro Togashi",Genre = "Adventure",    Status = "Hiatus",    Chapters = 401,  Synopsis = "Gon Freecss sigue los pasos de su padre ausente para convertirse en Hunter, un título reservado a los más hábiles del mundo.", CreatedAt = DateTime.UtcNow },
            new() { Id = 7,  Title = "Vinland Saga",        Author = "Makoto Yukimura",  Genre = "Historical",   Status = "Ongoing",   Chapters = 210,  Synopsis = "Un joven guerrero vikingo busca venganza y termina encontrando su camino hacia la paz y la verdadera fortaleza.", CreatedAt = DateTime.UtcNow },
            new() { Id = 8,  Title = "Chainsaw Man",        Author = "Tatsuki Fujimoto", Genre = "Action",       Status = "Ongoing",   Chapters = 185,  Synopsis = "Denji, fusionado con un demonio motosierra, trabaja como Cazador de Demonios mientras busca cumplir sus modestos sueños.", CreatedAt = DateTime.UtcNow },
            new() { Id = 9,  Title = "Demon Slayer",        Author = "Koyoharu Gotouge", Genre = "Action",       Status = "Completed", Chapters = 205,  Synopsis = "Tanjiro Kamado entrena para convertirse en Cazador de Demonios y salvar a su hermana Nezuko, transformada en demonio.", CreatedAt = DateTime.UtcNow },
            new() { Id = 10, Title = "Jujutsu Kaisen",      Author = "Gege Akutami",     Genre = "Action",       Status = "Ongoing",   Chapters = 270,  Synopsis = "Yuji Itadori ingiere un dedo maldito y se convierte en receptor del hechicero maldito más poderoso de la historia.", CreatedAt = DateTime.UtcNow },
            new() { Id = 11, Title = "Kingdom",             Author = "Yasuhisa Hara",    Genre = "Historical",   Status = "Ongoing",   Chapters = 810,  Synopsis = "En la China de los Reinos Combatientes, un huérfano llamado Xin sueña con convertirse en el General más grande de la historia.", CreatedAt = DateTime.UtcNow },
            new() { Id = 12, Title = "Tokyo Ghoul",         Author = "Sui Ishida",       Genre = "Horror",       Status = "Completed", Chapters = 179,  Synopsis = "Ken Kaneki, un estudiante universitario, se convierte en medio ghoul tras un encuentro con uno de estos seres devoradores de humanos.", CreatedAt = DateTime.UtcNow },
        };
        _nextId = 13;
    }

    public (List<MangaSeries> Items, int Total) GetPaged(int page, int pageSize)
    {
        var ordered = _items.OrderByDescending(m => m.CreatedAt).ToList();
        var items = ordered.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        return (items, _items.Count);
    }

    public MangaSeries? GetById(int id) => _items.FirstOrDefault(m => m.Id == id);

    public MangaSeries Create(MangaSeries manga)
    {
        manga.Id = _nextId++;
        manga.CreatedAt = DateTime.UtcNow;
        _items.Add(manga);
        return manga;
    }

    public MangaSeries? Update(int id, MangaSeries manga)
    {
        var existing = _items.FirstOrDefault(m => m.Id == id);
        if (existing is null) return null;

        existing.Title = manga.Title;
        existing.Author = manga.Author;
        existing.Genre = manga.Genre;
        existing.Status = manga.Status;
        existing.Chapters = manga.Chapters;
        existing.Synopsis = manga.Synopsis;
        existing.ImageUrl = manga.ImageUrl;
        return existing;
    }

    public bool Delete(int id)
    {
        var manga = _items.FirstOrDefault(m => m.Id == id);
        if (manga is null) return false;
        _items.Remove(manga);
        return true;
    }
}
