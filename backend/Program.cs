using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
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

// ── Auth ──────────────────────────────────────────────────────────────────────

const string GoogleClientId = "38815317747-03jq5rgddlvlad74los5f566j0hg0a8s.apps.googleusercontent.com";
const string JwtSecret = "ilearn-super-secret-jwt-key-2026-aprender";

string CreateJwt(User user)
{
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSecret));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(
        claims: [
            new Claim("sub",     user.Id.ToString()),
            new Claim("email",   user.Email),
            new Claim("name",    user.Name),
            new Claim("picture", user.Picture),
        ],
        expires: DateTime.UtcNow.AddDays(30),
        signingCredentials: creds
    );
    return new JwtSecurityTokenHandler().WriteToken(token);
}

app.MapPost("/api/auth/google", async (GoogleAuthRequest req, AppDbContext db) =>
{
    try
    {
        var payload = await GoogleJsonWebSignature.ValidateAsync(req.IdToken,
            new GoogleJsonWebSignature.ValidationSettings { Audience = [GoogleClientId] });

        var user = await db.Users.FirstOrDefaultAsync(u => u.GoogleId == payload.Subject);
        if (user is null)
        {
            user = new User
            {
                GoogleId = payload.Subject,
                Email    = payload.Email,
                Name     = payload.Name,
                Picture  = payload.Picture,
            };
            db.Users.Add(user);
            await db.SaveChangesAsync();
        }

        var token = CreateJwt(user);
        return Results.Ok(new { token, user.Name, user.Email, user.Picture });
    }
    catch
    {
        return Results.Unauthorized();
    }
});

app.MapGet("/api/auth/me", (HttpContext ctx) =>
{
    var auth = ctx.Request.Headers.Authorization.ToString();
    if (!auth.StartsWith("Bearer ")) return Results.Unauthorized();
    var tokenStr = auth["Bearer ".Length..];
    try
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSecret));
        var handler = new JwtSecurityTokenHandler();
        handler.ValidateToken(tokenStr, new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false,
        }, out var validated);
        var jwt = (JwtSecurityToken)validated;
        return Results.Ok(new
        {
            name    = jwt.Claims.First(c => c.Type == "name").Value,
            email   = jwt.Claims.First(c => c.Type == "email").Value,
            picture = jwt.Claims.First(c => c.Type == "picture").Value,
        });
    }
    catch { return Results.Unauthorized(); }
});

// ── User helpers ─────────────────────────────────────────────────────────────

int? GetUserId(HttpContext ctx)
{
    var auth = ctx.Request.Headers.Authorization.ToString();
    if (!auth.StartsWith("Bearer ")) return null;
    var tokenStr = auth["Bearer ".Length..];
    try
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSecret));
        var handler = new JwtSecurityTokenHandler();
        handler.ValidateToken(tokenStr, new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false,
        }, out var validated);
        var jwt = (JwtSecurityToken)validated;
        return int.Parse(jwt.Claims.First(c => c.Type == "sub").Value);
    }
    catch { return null; }
}

(int level, int currentXp, int nextLevelXp) CalcLevel(int totalXp)
{
    // Every level requires 100 * level XP: L1=100, L2=200, L3=300...
    int lvl = 1, xp = totalXp;
    while (xp >= lvl * 100) { xp -= lvl * 100; lvl++; }
    return (lvl, xp, lvl * 100);
}

app.MapGet("/api/users/me/stats", async (HttpContext ctx, AppDbContext db) =>
{
    var userId = GetUserId(ctx);
    if (userId is null) return Results.Unauthorized();

    var userLessons = await db.UserLessons
        .Where(ul => ul.UserId == userId)
        .Include(ul => ul.Lesson)
        .ToListAsync();

    var totalXp = userLessons.Sum(ul => ul.Lesson?.XpReward ?? 0);
    var completedCount = userLessons.Count;

    // Streak: count consecutive days (ending today) with at least 1 lesson
    var today = DateOnly.FromDateTime(DateTime.UtcNow);
    var days = userLessons
        .Select(ul => DateOnly.FromDateTime(ul.CompletedAt))
        .Distinct()
        .OrderByDescending(d => d)
        .ToList();

    int streak = 0;
    var check = today;
    foreach (var d in days)
    {
        if (d == check) { streak++; check = check.AddDays(-1); }
        else if (d < check) break;
    }

    var (level, currentLevelXp, nextLevelXp) = CalcLevel(totalXp);

    // Leaderboard rank
    var allUsersXp = await db.UserLessons
        .GroupBy(ul => ul.UserId)
        .Select(g => new { UserId = g.Key, Xp = g.Sum(ul => ul.Lesson!.XpReward) })
        .ToListAsync();
    var rank = allUsersXp.Count(u => u.Xp > totalXp) + 1;

    return Results.Ok(new
    {
        totalXp,
        completedLessons = completedCount,
        streak,
        level,
        currentLevelXp,
        nextLevelXp,
        rank,
    });
});

// ── Leaderboard ───────────────────────────────────────────────────────────────

app.MapGet("/api/leaderboard", async (HttpContext ctx, AppDbContext db) =>
{
    var currentUserId = GetUserId(ctx);

    var rows = await db.UserLessons
        .GroupBy(ul => ul.UserId)
        .Select(g => new
        {
            UserId = g.Key,
            Xp = g.Sum(ul => ul.Lesson!.XpReward),
            CompletedLessons = g.Count(),
        })
        .OrderByDescending(r => r.Xp)
        .Take(50)
        .ToListAsync();

    var userIds = rows.Select(r => r.UserId).ToList();
    var users = await db.Users
        .Where(u => userIds.Contains(u.Id))
        .ToDictionaryAsync(u => u.Id);

    return Results.Ok(rows.Select((r, i) => new
    {
        rank    = i + 1,
        name    = users.TryGetValue(r.UserId, out var u) ? u.Name    : "?",
        picture = users.TryGetValue(r.UserId, out var u2) ? u2.Picture : "",
        xp      = r.Xp,
        completedLessons = r.CompletedLessons,
        isYou   = r.UserId == currentUserId,
    }));
});

// ── Sections ─────────────────────────────────────────────────────────────────

app.MapGet("/api/sections", async (AppDbContext db) =>
    await db.Sections
        .OrderBy(s => s.Order)
        .Select(s => new { s.Id, s.Name, s.Order })
        .ToListAsync());

// ── Per-user lesson state helper ──────────────────────────────────────────────

// Returns set of lessonIds completed by the given user
async Task<HashSet<int>> GetUserDoneIds(int? userId, AppDbContext db)
{
    if (userId is null) return [];
    var ids = await db.UserLessons
        .Where(ul => ul.UserId == userId)
        .Select(ul => ul.LessonId)
        .ToListAsync();
    return [..ids];
}

// Compute per-user isDone/isActive/isLocked for an ordered list of lessons
List<object> ComputeLessonStates(IEnumerable<Lesson> orderedLessons, HashSet<int> doneIds)
{
    var list = orderedLessons.OrderBy(l => l.Order).ToList();
    var result = new List<object>();
    for (int i = 0; i < list.Count; i++)
    {
        var l = list[i];
        bool isDone   = doneIds.Contains(l.Id);
        bool isActive = !isDone && (i == 0 || doneIds.Contains(list[i - 1].Id));
        bool isLocked = !isDone && !isActive;
        result.Add(new { l.Id, l.Title, l.Type, l.Order, IsDone = isDone, IsActive = isActive, IsLocked = isLocked, l.XpReward });
    }
    return result;
}

// ── Units ─────────────────────────────────────────────────────────────────────

app.MapGet("/api/units", async (HttpContext ctx, AppDbContext db) =>
{
    var userId  = GetUserId(ctx);
    var doneIds = await GetUserDoneIds(userId, db);

    var units = await db.Units
        .Include(u => u.Lessons)
        .Include(u => u.Section)
        .OrderBy(u => u.SectionId).ThenBy(u => u.Order)
        .ToListAsync();

    return Results.Ok(units.Select(u =>
    {
        var lessons = u.Lessons.OrderBy(l => l.Order).ToList();
        int done    = lessons.Count(l => doneIds.Contains(l.Id));
        int pct     = lessons.Count > 0 ? (int)Math.Round(done * 100.0 / lessons.Count) : 0;
        return new
        {
            u.Id, u.SectionId, u.Title, u.Icon, u.ImageUrl, u.Color, u.Order,
            Progress    = pct,
            SectionName = u.Section!.Name,
            LessonCount = lessons.Count,
        };
    }));
});

app.MapGet("/api/units/{id}", async (int id, HttpContext ctx, AppDbContext db) =>
{
    var unit = await db.Units
        .Include(u => u.Lessons.OrderBy(l => l.Order))
        .Include(u => u.Section)
        .FirstOrDefaultAsync(u => u.Id == id);
    if (unit is null) return Results.NotFound();

    var userId  = GetUserId(ctx);
    var doneIds = await GetUserDoneIds(userId, db);
    var lessons = ComputeLessonStates(unit.Lessons, doneIds);
    int done    = unit.Lessons.Count(l => doneIds.Contains(l.Id));
    int pct     = unit.Lessons.Count > 0 ? (int)Math.Round(done * 100.0 / unit.Lessons.Count) : 0;

    return Results.Ok(new
    {
        unit.Id, unit.SectionId, unit.Title, unit.Icon, unit.ImageUrl,
        unit.Color, unit.Order, Progress = pct,
        SectionName = unit.Section!.Name,
        Lessons = lessons
    });
});

// ── Lessons ───────────────────────────────────────────────────────────────────

app.MapGet("/api/lessons", async (AppDbContext db) =>
    await db.Lessons
        .OrderBy(l => l.UnitId).ThenBy(l => l.Order)
        .Select(l => new { l.Id, l.UnitId, l.Title, l.Type, l.Order, l.IsLocked, l.IsDone, l.IsActive, l.XpReward })
        .ToListAsync());

app.MapPatch("/api/lessons/{id}/complete", async (int id, HttpContext ctx, AppDbContext db) =>
{
    var lesson = await db.Lessons.FindAsync(id);
    if (lesson is null) return Results.NotFound();

    var userId = GetUserId(ctx);
    if (userId is not null)
    {
        var userExists = await db.Users.AnyAsync(u => u.Id == userId);
        if (!userExists) return Results.Unauthorized();

        var already = await db.UserLessons.AnyAsync(ul => ul.UserId == userId && ul.LessonId == id);
        if (!already)
        {
            db.UserLessons.Add(new UserLesson { UserId = userId.Value, LessonId = id });
            await db.SaveChangesAsync();
        }
    }

    return Results.Ok(new { success = true });
});

// ── Lesson content ────────────────────────────────────────────────────────────

app.MapGet("/api/lessons/{id}/content", async (int id, AppDbContext db) =>
{
    var lesson = await db.Lessons.FindAsync(id);
    if (lesson is null) return Results.NotFound();

    var words = await db.Words
        .Where(w => w.LessonId == id)
        .OrderBy(w => w.Order)
        .Select(w => new { w.Id, w.Es, w.Uk, w.Example, w.ExampleUk, w.Order })
        .ToListAsync();

    var exercises = await db.Exercises
        .Where(e => e.LessonId == id)
        .OrderBy(e => e.Order)
        .Select(e => new { e.Id, e.Type, e.Question, e.OptionsJson, e.Answer, e.Order })
        .ToListAsync();

    return Results.Ok(new { lesson = new { lesson.Id, lesson.Title, lesson.Type, lesson.XpReward }, words, exercises });
});

// ── Debug ─────────────────────────────────────────────────────────────────────

app.MapGet("/api/admin/users", async (AppDbContext db) =>
    await db.Users.Select(u => new { u.Id, u.Name, u.Email, u.GoogleId }).ToListAsync());

app.MapGet("/api/admin/userlessons", async (AppDbContext db) =>
    await db.UserLessons.Select(ul => new { ul.Id, ul.UserId, ul.LessonId, ul.CompletedAt }).ToListAsync());

app.MapDelete("/api/admin/users/{id}", async (int id, AppDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user is null) return Results.NotFound();
    db.Users.Remove(user);
    db.UserLessons.RemoveRange(db.UserLessons.Where(ul => ul.UserId == id));
    await db.SaveChangesAsync();
    return Results.Ok(new { deleted = id });
});

app.MapPost("/api/admin/add-video", async (AddVideoRequest req, AppDbContext db) =>
{
    var ex = new Exercise
    {
        LessonId    = req.LessonId,
        Type        = "video",
        Question    = req.VideoId,
        OptionsJson = System.Text.Json.JsonSerializer.Serialize(new { title = req.Title, description = req.Description }),
        Answer      = req.VideoId,
        Order       = req.Order,
    };
    db.Exercises.Add(ex);
    await db.SaveChangesAsync();
    return Results.Ok(new { id = ex.Id });
});

app.MapPost("/api/admin/reset-lessons", async (AppDbContext db) =>
{
    var units = await db.Units.Include(u => u.Lessons).ToListAsync();
    foreach (var unit in units)
    {
        var lessons = unit.Lessons.OrderBy(l => l.Order).ToList();
        for (int i = 0; i < lessons.Count; i++)
        {
            lessons[i].IsDone   = false;
            lessons[i].IsActive = i == 0;
            lessons[i].IsLocked = i > 0;
        }
    }
    await db.SaveChangesAsync();
    return Results.Ok(new { reset = true });
});

// ── Stats (admin) ─────────────────────────────────────────────────────────────

app.MapGet("/api/admin/stats", async (AppDbContext db) => new
{
    totalUsers = await db.Users.CountAsync(),
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

record GoogleAuthRequest(string IdToken);
record AddVideoRequest(int LessonId, string VideoId, string Title, string Description, int Order);
