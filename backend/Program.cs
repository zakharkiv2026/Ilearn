using Microsoft.EntityFrameworkCore;
using backend;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=ilearn.db"));

var app = builder.Build();

// Auto-migrate + seed on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors();

// ── Sections ─────────────────────────────────────────────────────────────────

app.MapGet("/api/sections", async (AppDbContext db) =>
    await db.Sections
        .OrderBy(s => s.Order)
        .Select(s => new { s.Id, s.Name, s.Order })
        .ToListAsync());

// ── Units ─────────────────────────────────────────────────────────────────────

app.MapGet("/api/units", async (AppDbContext db) =>
    await db.Units
        .OrderBy(u => u.SectionId).ThenBy(u => u.Order)
        .Select(u => new
        {
            u.Id, u.SectionId, u.Title, u.Icon, u.ImageUrl, u.Color, u.Order, u.Progress,
            SectionName = u.Section!.Name,
            LessonCount = u.Lessons.Count
        })
        .ToListAsync());

app.MapGet("/api/units/{id}", async (int id, AppDbContext db) =>
{
    var unit = await db.Units
        .Include(u => u.Lessons.OrderBy(l => l.Order))
        .Include(u => u.Section)
        .FirstOrDefaultAsync(u => u.Id == id);
    return unit is null ? Results.NotFound() : Results.Ok(new
    {
        unit.Id, unit.SectionId, unit.Title, unit.Icon, unit.ImageUrl,
        unit.Color, unit.Order, unit.Progress,
        SectionName = unit.Section!.Name,
        Lessons = unit.Lessons.Select(l => new
        {
            l.Id, l.Title, l.Type, l.Order, l.IsLocked, l.IsDone, l.IsActive, l.XpReward
        })
    });
});

// ── Lessons ───────────────────────────────────────────────────────────────────

app.MapGet("/api/lessons", async (AppDbContext db) =>
    await db.Lessons
        .OrderBy(l => l.UnitId).ThenBy(l => l.Order)
        .Select(l => new { l.Id, l.UnitId, l.Title, l.Type, l.Order, l.IsLocked, l.IsDone, l.IsActive, l.XpReward })
        .ToListAsync());

app.MapPatch("/api/lessons/{id}/complete", async (int id, AppDbContext db) =>
{
    var lesson = await db.Lessons.FindAsync(id);
    if (lesson is null) return Results.NotFound();
    lesson.IsDone = true;
    lesson.IsActive = false;
    // Unlock next lesson
    var next = await db.Lessons
        .Where(l => l.UnitId == lesson.UnitId && l.Order == lesson.Order + 1)
        .FirstOrDefaultAsync();
    if (next is not null) { next.IsLocked = false; next.IsActive = true; }
    await db.SaveChangesAsync();
    return Results.Ok(new { success = true });
});

// ── Stats (admin) ─────────────────────────────────────────────────────────────

app.MapGet("/api/admin/stats", async (AppDbContext db) => new
{
    totalUsers = 1284,
    activeCourses = await db.Units.CountAsync(),
    completedLessons = await db.Lessons.CountAsync(l => l.IsDone),
    newToday = 23,
    weeklyActivity = new[]
    {
        new { day = "Пн", users = 40 },
        new { day = "Вт", users = 65 },
        new { day = "Ср", users = 55 },
        new { day = "Чт", users = 80 },
        new { day = "Пт", users = 72 },
        new { day = "Сб", users = 30 },
        new { day = "Нд", users = 20 },
    }
});

app.Run();
