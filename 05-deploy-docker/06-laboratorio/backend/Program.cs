using MangaApi.Data;
using MangaApi.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "MangaTracker API", Version = "v1" });
});

var connectionString =
    Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("No se encontró la cadena de conexión a la base de datos.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// Crear la base de datos y sembrar datos iniciales si está vacía
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.MangaSeries.Any())
    {
        db.MangaSeries.AddRange(new List<MangaSeries>
        {
            new() { Title = "Berserk", Author = "Kentaro Miura", Genre = "Dark Fantasy", Status = "Ongoing", Chapters = 374, Synopsis = "La oscura epopeya de Guts, un mercenario solitario marcado por un pasado brutal que busca venganza contra su antiguo compañero Griffith." },
            new() { Title = "One Piece", Author = "Eiichiro Oda", Genre = "Adventure", Status = "Ongoing", Chapters = 1110, Synopsis = "Monkey D. Luffy y su tripulación navegan los mares en busca del legendario tesoro 'One Piece' para convertirse en el Rey de los Piratas." },
            new() { Title = "Vagabond", Author = "Takehiko Inoue", Genre = "Historical", Status = "Hiatus", Chapters = 327, Synopsis = "La vida ficticia del espadachín Miyamoto Musashi en el Japón feudal, basada en la novela histórica de Eiji Yoshikawa." },
            new() { Title = "Fullmetal Alchemist", Author = "Hiromu Arakawa", Genre = "Fantasy", Status = "Completed", Chapters = 116, Synopsis = "Dos hermanos alquimistas recorren el mundo buscando la Piedra Filosofal para recuperar los cuerpos que perdieron en un ritual prohibido." },
            new() { Title = "Attack on Titan", Author = "Hajime Isayama", Genre = "Action", Status = "Completed", Chapters = 139, Synopsis = "La humanidad sobrevive encerrada tras murallas colosales, amenazada por los Titanes, gigantes devoradores de humanos." },
            new() { Title = "Hunter x Hunter", Author = "Yoshihiro Togashi", Genre = "Adventure", Status = "Hiatus", Chapters = 401, Synopsis = "Gon Freecss sigue los pasos de su padre ausente para convertirse en Hunter, un título reservado a los más hábiles del mundo." },
            new() { Title = "Vinland Saga", Author = "Makoto Yukimura", Genre = "Historical", Status = "Ongoing", Chapters = 210, Synopsis = "Un joven guerrero vikingo busca venganza y termina encontrando su camino hacia la paz y la verdadera fortaleza." },
            new() { Title = "Chainsaw Man", Author = "Tatsuki Fujimoto", Genre = "Action", Status = "Ongoing", Chapters = 185, Synopsis = "Denji, fusionado con un demonio motosierra, trabaja como Cazador de Demonios mientras busca cumplir sus modestos sueños." },
            new() { Title = "Demon Slayer", Author = "Koyoharu Gotouge", Genre = "Action", Status = "Completed", Chapters = 205, Synopsis = "Tanjiro Kamado entrena para convertirse en Cazador de Demonios y salvar a su hermana Nezuko, transformada en demonio." },
            new() { Title = "Jujutsu Kaisen", Author = "Gege Akutami", Genre = "Action", Status = "Ongoing", Chapters = 270, Synopsis = "Yuji Itadori ingiere un dedo maldito y se convierte en receptor del hechicero maldito más poderoso de la historia." },
            new() { Title = "Kingdom", Author = "Yasuhisa Hara", Genre = "Historical", Status = "Ongoing", Chapters = 810, Synopsis = "En la China de los Reinos Combatientes, un huérfano llamado Xin sueña con convertirse en el General más grande de la historia." },
            new() { Title = "Tokyo Ghoul", Author = "Sui Ishida", Genre = "Horror", Status = "Completed", Chapters = 179, Synopsis = "Ken Kaneki, un estudiante universitario, se convierte en medio ghoul tras un encuentro con uno de estos seres devoradores de humanos." },
        });
        db.SaveChanges();
    }
}

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MangaTracker API v1"));

app.UseCors();
app.MapControllers();
app.Run();
