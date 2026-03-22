var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();

app.MapGet("/api/hello", () => new { message = "Hello World!" });

app.MapGet("/api/admin/stats", () => new
{
    totalUsers = 1284,
    activeCourses = 42,
    completedLessons = 8530,
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
