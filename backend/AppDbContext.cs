using Microsoft.EntityFrameworkCore;

namespace backend;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Section> Sections => Set<Section>();
    public DbSet<Unit> Units => Set<Unit>();
    public DbSet<Lesson> Lessons => Set<Lesson>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Seed data
        modelBuilder.Entity<Section>().HasData(
            new Section { Id = 1, Name = "Розділ 1", Order = 1 },
            new Section { Id = 2, Name = "Розділ 2", Order = 2 }
        );

        modelBuilder.Entity<Unit>().HasData(
            new Unit
            {
                Id = 1, SectionId = 1, Order = 1, Progress = 40,
                Title = "Складай базові речення",
                Icon = "📝",
                ImageUrl = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
                Color = "from-green-700/80 to-emerald-700/80"
            },
            new Unit
            {
                Id = 2, SectionId = 1, Order = 2, Progress = 0,
                Title = "Числа та час",
                Icon = "🔢",
                ImageUrl = "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&q=80",
                Color = "from-blue-700/80 to-indigo-700/80"
            },
            new Unit
            {
                Id = 3, SectionId = 2, Order = 1, Progress = 0,
                Title = "Їжа та побут",
                Icon = "🍎",
                ImageUrl = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
                Color = "from-rose-700/80 to-pink-700/80"
            }
        );

        modelBuilder.Entity<Lesson>().HasData(
            // Unit 1
            new Lesson { Id = 1,  UnitId = 1, Order = 1, Title = "Базові привітання",       Type = "Словник",  IsDone = true,  IsActive = false, IsLocked = false, XpReward = 10 },
            new Lesson { Id = 2,  UnitId = 1, Order = 2, Title = "Привітання та прощання",   Type = "Мовлення", IsDone = true,  IsActive = false, IsLocked = false, XpReward = 10 },
            new Lesson { Id = 3,  UnitId = 1, Order = 3, Title = "Познайомся",               Type = "Розмова",  IsDone = false, IsActive = true,  IsLocked = false, XpReward = 10 },
            new Lesson { Id = 4,  UnitId = 1, Order = 4, Title = "Задавай прості питання",   Type = "Граматика", IsDone = false, IsActive = false, IsLocked = true,  XpReward = 10 },
            new Lesson { Id = 5,  UnitId = 1, Order = 5, Title = "Розповідай про себе",      Type = "Аудіювання", IsDone = false, IsActive = false, IsLocked = true, XpReward = 10 },
            // Unit 2
            new Lesson { Id = 6,  UnitId = 2, Order = 1, Title = "Числа 1–10",               Type = "Словник",  IsDone = false, IsActive = false, IsLocked = true, XpReward = 10 },
            new Lesson { Id = 7,  UnitId = 2, Order = 2, Title = "Говори про час",            Type = "Розмова",  IsDone = false, IsActive = false, IsLocked = true, XpReward = 10 },
            new Lesson { Id = 8,  UnitId = 2, Order = 3, Title = "Дати та календар",          Type = "Граматика", IsDone = false, IsActive = false, IsLocked = true, XpReward = 10 },
            new Lesson { Id = 9,  UnitId = 2, Order = 4, Title = "Рахуй предмети",            Type = "Практика", IsDone = false, IsActive = false, IsLocked = true, XpReward = 10 },
            // Unit 3
            new Lesson { Id = 10, UnitId = 3, Order = 1, Title = "Їжа та напої",              Type = "Словник",  IsDone = false, IsActive = false, IsLocked = true, XpReward = 10 },
            new Lesson { Id = 11, UnitId = 3, Order = 2, Title = "Замовляй в ресторані",      Type = "Розмова",  IsDone = false, IsActive = false, IsLocked = true, XpReward = 10 },
            new Lesson { Id = 12, UnitId = 3, Order = 3, Title = "Висловлюй вподобання",      Type = "Мовлення", IsDone = false, IsActive = false, IsLocked = true, XpReward = 10 },
            new Lesson { Id = 13, UnitId = 3, Order = 4, Title = "Покупки",                   Type = "Словник",  IsDone = false, IsActive = false, IsLocked = true, XpReward = 10 }
        );
    }
}
