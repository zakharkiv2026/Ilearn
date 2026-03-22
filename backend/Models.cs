namespace backend;

public class User
{
    public int Id { get; set; }
    public string GoogleId { get; set; } = "";
    public string Email { get; set; } = "";
    public string Name { get; set; } = "";
    public string Picture { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class UserLesson
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int LessonId { get; set; }
    public Lesson? Lesson { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
}

public class Section
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int Order { get; set; }
    public List<Unit> Units { get; set; } = [];
}

public class Unit
{
    public int Id { get; set; }
    public int SectionId { get; set; }
    public Section? Section { get; set; }
    public string Title { get; set; } = "";
    public string Icon { get; set; } = "";
    public string ImageUrl { get; set; } = "";
    public string Color { get; set; } = "";
    public int Order { get; set; }
    public int Progress { get; set; }
    public List<Lesson> Lessons { get; set; } = [];
}

public class Lesson
{
    public int Id { get; set; }
    public int UnitId { get; set; }
    public Unit? Unit { get; set; }
    public string Title { get; set; } = "";
    public string Type { get; set; } = "";
    public int Order { get; set; }
    public bool IsLocked { get; set; }
    public bool IsDone { get; set; }
    public bool IsActive { get; set; }
    public int XpReward { get; set; } = 10;
}
