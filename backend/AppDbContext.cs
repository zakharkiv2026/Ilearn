using Microsoft.EntityFrameworkCore;

namespace backend;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<UserLesson> UserLessons => Set<UserLesson>();
    public DbSet<Section> Sections => Set<Section>();
    public DbSet<Unit> Units => Set<Unit>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Word> Words => Set<Word>();
    public DbSet<Exercise> Exercises => Set<Exercise>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ── Sections ────────────────────────────────────────────────────────
        modelBuilder.Entity<Section>().HasData(
            new Section { Id = 1, Name = "Тиждень 1 · Граматика та особисте", Order = 1 }
        );

        // ── Units (Days) ─────────────────────────────────────────────────────
        modelBuilder.Entity<Unit>().HasData(
            new Unit
            {
                Id = 1, SectionId = 1, Order = 1, Progress = 0,
                Title = "День 1 · Знайомство",
                Icon = "👋",
                ImageUrl = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
                Color = "from-green-700/80 to-emerald-700/80"
            },
            new Unit
            {
                Id = 2, SectionId = 1, Order = 2, Progress = 0,
                Title = "День 2 · Сім'я та вік",
                Icon = "👨‍👩‍👧",
                ImageUrl = "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=800&q=80",
                Color = "from-blue-700/80 to-indigo-700/80"
            },
            new Unit
            {
                Id = 3, SectionId = 1, Order = 3, Progress = 0,
                Title = "День 3 · Числа та час",
                Icon = "🔢",
                ImageUrl = "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&q=80",
                Color = "from-violet-700/80 to-purple-700/80"
            }
        );

        // ── Lessons ───────────────────────────────────────────────────────────
        modelBuilder.Entity<Lesson>().HasData(
            // День 1
            new Lesson { Id = 1,  UnitId = 1, Order = 1, Title = "Привітання та прощання",   Type = "Словник",    IsActive = true,  IsDone = false, IsLocked = false, XpReward = 10 },
            new Lesson { Id = 2,  UnitId = 1, Order = 2, Title = "Дієслово SER",              Type = "Граматика",  IsActive = false, IsDone = false, IsLocked = true,  XpReward = 15 },
            new Lesson { Id = 3,  UnitId = 1, Order = 3, Title = "Країни та мови",            Type = "Словник",    IsActive = false, IsDone = false, IsLocked = true,  XpReward = 10 },
            new Lesson { Id = 4,  UnitId = 1, Order = 4, Title = "Діалог: перше знайомство",  Type = "Аудіо",      IsActive = false, IsDone = false, IsLocked = true,  XpReward = 20 },
            new Lesson { Id = 5,  UnitId = 1, Order = 5, Title = "Самопрезентація",           Type = "Практика",   IsActive = false, IsDone = false, IsLocked = true,  XpReward = 25 },

            // День 2
            new Lesson { Id = 6,  UnitId = 2, Order = 1, Title = "Члени сім'ї",              Type = "Словник",    IsActive = false, IsDone = false, IsLocked = true,  XpReward = 10 },
            new Lesson { Id = 7,  UnitId = 2, Order = 2, Title = "Дієслово TENER + вік",     Type = "Граматика",  IsActive = false, IsDone = false, IsLocked = true,  XpReward = 15 },
            new Lesson { Id = 8,  UnitId = 2, Order = 3, Title = "Присвійні займенники",      Type = "Граматика",  IsActive = false, IsDone = false, IsLocked = true,  XpReward = 15 },
            new Lesson { Id = 9,  UnitId = 2, Order = 4, Title = "Читання: анкета",           Type = "Читання",    IsActive = false, IsDone = false, IsLocked = true,  XpReward = 20 },
            new Lesson { Id = 10, UnitId = 2, Order = 5, Title = "Розповідь про сім'ю",       Type = "Практика",   IsActive = false, IsDone = false, IsLocked = true,  XpReward = 25 },

            // День 3
            new Lesson { Id = 11, UnitId = 3, Order = 1, Title = "Числа 0–100",               Type = "Словник",    IsActive = false, IsDone = false, IsLocked = true,  XpReward = 10 },
            new Lesson { Id = 12, UnitId = 3, Order = 2, Title = "Дні тижня та місяці",       Type = "Словник",    IsActive = false, IsDone = false, IsLocked = true,  XpReward = 10 },
            new Lesson { Id = 13, UnitId = 3, Order = 3, Title = "Артиклі el/la/los/las",     Type = "Граматика",  IsActive = false, IsDone = false, IsLocked = true,  XpReward = 15 },
            new Lesson { Id = 14, UnitId = 3, Order = 4, Title = "Котра година? ¿Qué hora es?", Type = "Граматика", IsActive = false, IsDone = false, IsLocked = true, XpReward = 15 },
            new Lesson { Id = 15, UnitId = 3, Order = 5, Title = "Аудіо: числа в діалозі",    Type = "Аудіо",      IsActive = false, IsDone = false, IsLocked = true,  XpReward = 20 }
        );

        // ── Words ─────────────────────────────────────────────────────────────

        modelBuilder.Entity<Word>().HasData(
            // Урок 1 — Привітання
            new Word { Id = 1,  LessonId = 1, Order = 1,  Es = "¡Hola!",           Uk = "Привіт!",             Example = "¡Hola! ¿Cómo te llamas?",           ExampleUk = "Привіт! Як тебе звати?" },
            new Word { Id = 2,  LessonId = 1, Order = 2,  Es = "Buenos días",      Uk = "Доброго ранку",       Example = "Buenos días, señora García.",         ExampleUk = "Доброго ранку, пані Гарсіа." },
            new Word { Id = 3,  LessonId = 1, Order = 3,  Es = "Buenas tardes",    Uk = "Добрий день",         Example = "Buenas tardes, ¿cómo está usted?",   ExampleUk = "Добрий день, як ви?" },
            new Word { Id = 4,  LessonId = 1, Order = 4,  Es = "Buenas noches",    Uk = "Добрий вечір / Надобраніч", Example = "Buenas noches, hasta mañana.", ExampleUk = "Добрий вечір, до завтра." },
            new Word { Id = 5,  LessonId = 1, Order = 5,  Es = "¿Cómo te llamas?", Uk = "Як тебе звати?",     Example = "¿Cómo te llamas? Me llamo Ana.",     ExampleUk = "Як тебе звати? Мене звати Ана." },
            new Word { Id = 6,  LessonId = 1, Order = 6,  Es = "Me llamo...",      Uk = "Мене звати...",       Example = "Me llamo Carlos, ¿y tú?",            ExampleUk = "Мене звати Карлос, а тебе?" },
            new Word { Id = 7,  LessonId = 1, Order = 7,  Es = "¿Cómo estás?",     Uk = "Як ти?",             Example = "¡Hola! ¿Cómo estás?",                ExampleUk = "Привіт! Як ти?" },
            new Word { Id = 8,  LessonId = 1, Order = 8,  Es = "Bien, gracias",    Uk = "Добре, дякую",       Example = "Bien, gracias. ¿Y tú?",               ExampleUk = "Добре, дякую. А ти?" },
            new Word { Id = 9,  LessonId = 1, Order = 9,  Es = "Adiós",            Uk = "До побачення",       Example = "Adiós, hasta luego.",                 ExampleUk = "До побачення, побачимося." },
            new Word { Id = 10, LessonId = 1, Order = 10, Es = "Hasta luego",      Uk = "До зустрічі",        Example = "Hasta luego, buenas noches.",         ExampleUk = "До зустрічі, надобраніч." },
            new Word { Id = 11, LessonId = 1, Order = 11, Es = "Mucho gusto",      Uk = "Приємно познайомитись", Example = "Mucho gusto, soy María.",          ExampleUk = "Приємно познайомитись, я Марія." },
            new Word { Id = 12, LessonId = 1, Order = 12, Es = "Igualmente",       Uk = "Взаємно",            Example = "Mucho gusto. — Igualmente.",          ExampleUk = "Приємно. — Взаємно." },

            // Урок 3 — Країни та мови
            new Word { Id = 13, LessonId = 3, Order = 1,  Es = "España",           Uk = "Іспанія",            Example = "Soy de España.",                      ExampleUk = "Я з Іспанії." },
            new Word { Id = 14, LessonId = 3, Order = 2,  Es = "México",           Uk = "Мексика",            Example = "Ella es de México.",                  ExampleUk = "Вона з Мексики." },
            new Word { Id = 15, LessonId = 3, Order = 3,  Es = "Argentina",        Uk = "Аргентина",          Example = "Él es de Argentina.",                 ExampleUk = "Він з Аргентини." },
            new Word { Id = 16, LessonId = 3, Order = 4,  Es = "Francia",          Uk = "Франція",            Example = "Soy de Francia.",                     ExampleUk = "Я з Франції." },
            new Word { Id = 17, LessonId = 3, Order = 5,  Es = "Alemania",         Uk = "Німеччина",          Example = "Ella es alemana.",                    ExampleUk = "Вона німкеня." },
            new Word { Id = 18, LessonId = 3, Order = 6,  Es = "el español",       Uk = "іспанська мова",     Example = "Hablo español.",                      ExampleUk = "Я розмовляю іспанською." },
            new Word { Id = 19, LessonId = 3, Order = 7,  Es = "el francés",       Uk = "французька мова",    Example = "¿Hablas francés?",                    ExampleUk = "Ти розмовляєш французькою?" },
            new Word { Id = 20, LessonId = 3, Order = 8,  Es = "el inglés",        Uk = "англійська мова",    Example = "Hablo inglés y español.",             ExampleUk = "Я розмовляю англійською та іспанською." },
            new Word { Id = 21, LessonId = 3, Order = 9,  Es = "¿De dónde eres?",  Uk = "Звідки ти?",         Example = "¿De dónde eres? Soy de Ucrania.",     ExampleUk = "Звідки ти? Я з України." },
            new Word { Id = 22, LessonId = 3, Order = 10, Es = "Ucrania",          Uk = "Україна",            Example = "Soy de Ucrania.",                     ExampleUk = "Я з України." },

            // Урок 6 — Члени сім'ї
            new Word { Id = 23, LessonId = 6, Order = 1,  Es = "la madre",         Uk = "мама",               Example = "Mi madre se llama Laura.",            ExampleUk = "Мою маму звати Лаура." },
            new Word { Id = 24, LessonId = 6, Order = 2,  Es = "el padre",         Uk = "тато",               Example = "Mi padre tiene 45 años.",             ExampleUk = "Моєму татові 45 років." },
            new Word { Id = 25, LessonId = 6, Order = 3,  Es = "el hermano",       Uk = "брат",               Example = "Tengo un hermano.",                   ExampleUk = "У мене є брат." },
            new Word { Id = 26, LessonId = 6, Order = 4,  Es = "la hermana",       Uk = "сестра",             Example = "Mi hermana tiene 12 años.",           ExampleUk = "Моїй сестрі 12 років." },
            new Word { Id = 27, LessonId = 6, Order = 5,  Es = "el abuelo",        Uk = "дідусь",             Example = "Mi abuelo vive en Madrid.",           ExampleUk = "Мій дідусь живе в Мадриді." },
            new Word { Id = 28, LessonId = 6, Order = 6,  Es = "la abuela",        Uk = "бабуся",             Example = "Mi abuela cocina muy bien.",          ExampleUk = "Моя бабуся дуже добре готує." },
            new Word { Id = 29, LessonId = 6, Order = 7,  Es = "el hijo",          Uk = "син",                Example = "Tengo dos hijos.",                    ExampleUk = "У мене двоє синів." },
            new Word { Id = 30, LessonId = 6, Order = 8,  Es = "la hija",          Uk = "дочка",              Example = "Mi hija se llama Sofía.",             ExampleUk = "Мою дочку звати Софія." },
            new Word { Id = 31, LessonId = 6, Order = 9,  Es = "el marido",        Uk = "чоловік",            Example = "Mi marido trabaja en Madrid.",        ExampleUk = "Мій чоловік працює в Мадриді." },
            new Word { Id = 32, LessonId = 6, Order = 10, Es = "la mujer",         Uk = "дружина",            Example = "Mi mujer es profesora.",              ExampleUk = "Моя дружина — вчителька." },
            new Word { Id = 33, LessonId = 6, Order = 11, Es = "el tío",           Uk = "дядько",             Example = "Mi tío vive en Barcelona.",           ExampleUk = "Мій дядько живе в Барселоні." },
            new Word { Id = 34, LessonId = 6, Order = 12, Es = "la tía",           Uk = "тітка",              Example = "Mi tía tiene tres hijos.",            ExampleUk = "У моєї тітки троє дітей." },

            // Урок 11 — Числа 0-100
            new Word { Id = 35, LessonId = 11, Order = 1,  Es = "cero",            Uk = "нуль",               Example = "El teléfono es 0034...",              ExampleUk = "Телефон: 0034..." },
            new Word { Id = 36, LessonId = 11, Order = 2,  Es = "uno / una",       Uk = "один / одна",        Example = "Tengo un hijo.",                      ExampleUk = "У мене одна дитина." },
            new Word { Id = 37, LessonId = 11, Order = 3,  Es = "dos",             Uk = "два",                Example = "Tengo dos hermanos.",                 ExampleUk = "У мене два брати." },
            new Word { Id = 38, LessonId = 11, Order = 4,  Es = "diez",            Uk = "десять",             Example = "Son las diez.",                       ExampleUk = "Десята година." },
            new Word { Id = 39, LessonId = 11, Order = 5,  Es = "veinte",          Uk = "двадцять",           Example = "Tengo veinte años.",                  ExampleUk = "Мені двадцять років." },
            new Word { Id = 40, LessonId = 11, Order = 6,  Es = "treinta",         Uk = "тридцять",           Example = "Mi madre tiene treinta años.",        ExampleUk = "Моїй мамі тридцять років." },
            new Word { Id = 41, LessonId = 11, Order = 7,  Es = "cuarenta",        Uk = "сорок",              Example = "El billete cuesta cuarenta euros.",   ExampleUk = "Квиток коштує сорок євро." },
            new Word { Id = 42, LessonId = 11, Order = 8,  Es = "cincuenta",       Uk = "п'ятдесят",          Example = "Hay cincuenta personas.",             ExampleUk = "Є п'ятдесят осіб." },
            new Word { Id = 43, LessonId = 11, Order = 9,  Es = "cien",            Uk = "сто",                Example = "Cuesta cien euros.",                  ExampleUk = "Коштує сто євро." },
            new Word { Id = 44, LessonId = 11, Order = 10, Es = "mil",             Uk = "тисяча",             Example = "Un billete de avión cuesta mil euros.", ExampleUk = "Авіаквиток коштує тисячу євро." },

            // Урок 12 — Дні тижня та місяці
            new Word { Id = 45, LessonId = 12, Order = 1,  Es = "lunes",           Uk = "понеділок",          Example = "El lunes tengo clase.",               ExampleUk = "У понеділок у мене заняття." },
            new Word { Id = 46, LessonId = 12, Order = 2,  Es = "martes",          Uk = "вівторок",           Example = "El examen es el martes.",             ExampleUk = "Іспит у вівторок." },
            new Word { Id = 47, LessonId = 12, Order = 3,  Es = "miércoles",       Uk = "середа",             Example = "Los miércoles voy al gimnasio.",      ExampleUk = "По середах я ходжу в спортзал." },
            new Word { Id = 48, LessonId = 12, Order = 4,  Es = "jueves",          Uk = "четвер",             Example = "El jueves hay reunión.",              ExampleUk = "У четвер є зустріч." },
            new Word { Id = 49, LessonId = 12, Order = 5,  Es = "viernes",         Uk = "п'ятниця",           Example = "El viernes salimos a cenar.",         ExampleUk = "У п'ятницю ми виходимо вечеряти." },
            new Word { Id = 50, LessonId = 12, Order = 6,  Es = "sábado",          Uk = "субота",             Example = "El sábado descanso.",                 ExampleUk = "У суботу я відпочиваю." },
            new Word { Id = 51, LessonId = 12, Order = 7,  Es = "domingo",         Uk = "неділя",             Example = "El domingo comemos en familia.",      ExampleUk = "У неділю ми обідаємо всією сім'єю." },
            new Word { Id = 52, LessonId = 12, Order = 8,  Es = "enero",           Uk = "січень",             Example = "Mi cumpleaños es en enero.",          ExampleUk = "Мій день народження у січні." },
            new Word { Id = 53, LessonId = 12, Order = 9,  Es = "febrero",         Uk = "лютий",              Example = "En febrero hace frío.",               ExampleUk = "У лютому холодно." },
            new Word { Id = 54, LessonId = 12, Order = 10, Es = "marzo",           Uk = "березень",           Example = "Las clases empiezan en marzo.",       ExampleUk = "Заняття починаються в березні." },
            new Word { Id = 55, LessonId = 12, Order = 11, Es = "junio",           Uk = "червень",            Example = "En junio hace calor.",                ExampleUk = "У червні жарко." },
            new Word { Id = 56, LessonId = 12, Order = 12, Es = "diciembre",       Uk = "грудень",            Example = "La Navidad es en diciembre.",         ExampleUk = "Різдво — у грудні." }
        );

        // ── Exercises ─────────────────────────────────────────────────────────

        modelBuilder.Entity<Exercise>().HasData(
            // Урок 1 — Привітання (вибір відповіді)
            new Exercise { Id = 1,  LessonId = 1, Order = 1, Type = "choice",
                Question = "Як сказати 'Доброго ранку' іспанською?",
                OptionsJson = "[\"Buenas noches\",\"Buenos días\",\"Buenas tardes\",\"Adiós\"]",
                Answer = "Buenos días" },
            new Exercise { Id = 2,  LessonId = 1, Order = 2, Type = "choice",
                Question = "Що означає 'Mucho gusto'?",
                OptionsJson = "[\"Дуже смачно\",\"Дуже добре\",\"Приємно познайомитись\",\"До побачення\"]",
                Answer = "Приємно познайомитись" },
            new Exercise { Id = 3,  LessonId = 1, Order = 3, Type = "translate",
                Question = "Перекладіть: 'Як тебе звати?'",
                OptionsJson = "[\"¿Cómo estás?\",\"¿Cómo te llamas?\",\"¿De dónde eres?\",\"¿Cuántos años tienes?\"]",
                Answer = "¿Cómo te llamas?" },
            new Exercise { Id = 4,  LessonId = 1, Order = 4, Type = "choice",
                Question = "Як відповісти на '¿Cómo estás?'",
                OptionsJson = "[\"Me llamo Ana\",\"Soy de España\",\"Bien, gracias\",\"Hasta luego\"]",
                Answer = "Bien, gracias" },
            new Exercise { Id = 5,  LessonId = 1, Order = 5, Type = "translate",
                Question = "Як сказати 'До зустрічі'?",
                OptionsJson = "[\"Adiós\",\"Hola\",\"Hasta luego\",\"Buenas noches\"]",
                Answer = "Hasta luego" },

            // Урок 2 — Дієслово SER
            new Exercise { Id = 6,  LessonId = 2, Order = 1, Type = "choice",
                Question = "Яка правильна форма: 'Я є студент'?",
                OptionsJson = "[\"Yo eres estudiante\",\"Yo soy estudiante\",\"Yo es estudiante\",\"Yo somos estudiante\"]",
                Answer = "Yo soy estudiante" },
            new Exercise { Id = 7,  LessonId = 2, Order = 2, Type = "choice",
                Question = "Яка форма SER для 'tú'?",
                OptionsJson = "[\"soy\",\"es\",\"eres\",\"son\"]",
                Answer = "eres" },
            new Exercise { Id = 8,  LessonId = 2, Order = 3, Type = "choice",
                Question = "Заповніть: 'Ella ___ profesora'",
                OptionsJson = "[\"soy\",\"eres\",\"es\",\"somos\"]",
                Answer = "es" },
            new Exercise { Id = 9,  LessonId = 2, Order = 4, Type = "translate",
                Question = "Перекладіть: 'Ми іспанці'",
                OptionsJson = "[\"Nosotros somos españoles\",\"Ellos son españoles\",\"Vosotros sois españoles\",\"Yo soy español\"]",
                Answer = "Nosotros somos españoles" },
            new Exercise { Id = 10, LessonId = 2, Order = 5, Type = "choice",
                Question = "Яка форма SER для 'ellos'?",
                OptionsJson = "[\"sois\",\"somos\",\"son\",\"eres\"]",
                Answer = "son" },

            // Урок 3 — Країни та мови
            new Exercise { Id = 11, LessonId = 3, Order = 1, Type = "choice",
                Question = "Як сказати 'Я з України'?",
                OptionsJson = "[\"Soy de Francia\",\"Soy de Ucrania\",\"Soy de España\",\"Soy de México\"]",
                Answer = "Soy de Ukraine" },
            new Exercise { Id = 12, LessonId = 3, Order = 2, Type = "translate",
                Question = "Що означає 'Hablo español'?",
                OptionsJson = "[\"Я вчу іспанську\",\"Я розмовляю іспанською\",\"Я люблю іспанську\",\"Я знаю іспанську\"]",
                Answer = "Я розмовляю іспанською" },
            new Exercise { Id = 13, LessonId = 3, Order = 3, Type = "choice",
                Question = "Як запитати 'Звідки ти?'",
                OptionsJson = "[\"¿Cómo te llamas?\",\"¿Cuántos años tienes?\",\"¿De dónde eres?\",\"¿Cómo estás?\"]",
                Answer = "¿De dónde eres?" },

            // Урок 6 — Члени сім'ї
            new Exercise { Id = 14, LessonId = 6, Order = 1, Type = "choice",
                Question = "Що означає 'la hermana'?",
                OptionsJson = "[\"брат\",\"дочка\",\"сестра\",\"мама\"]",
                Answer = "сестра" },
            new Exercise { Id = 15, LessonId = 6, Order = 2, Type = "translate",
                Question = "Як сказати 'У мене є брат'?",
                OptionsJson = "[\"Tengo una hermana\",\"Tengo un hermano\",\"Tengo un hijo\",\"Tengo un abuelo\"]",
                Answer = "Tengo un hermano" },
            new Exercise { Id = 16, LessonId = 6, Order = 3, Type = "choice",
                Question = "Що означає 'el abuelo'?",
                OptionsJson = "[\"тато\",\"дядько\",\"дідусь\",\"брат\"]",
                Answer = "дідусь" },
            new Exercise { Id = 17, LessonId = 6, Order = 4, Type = "choice",
                Question = "Як сказати 'моя дружина'?",
                OptionsJson = "[\"mi madre\",\"mi mujer\",\"mi hermana\",\"mi hija\"]",
                Answer = "mi mujer" },

            // Урок 7 — TENER + вік
            new Exercise { Id = 18, LessonId = 7, Order = 1, Type = "choice",
                Question = "Як сказати 'Мені 25 років'?",
                OptionsJson = "[\"Soy 25 años\",\"Tengo 25 años\",\"Hay 25 años\",\"Estoy 25 años\"]",
                Answer = "Tengo 25 años" },
            new Exercise { Id = 19, LessonId = 7, Order = 2, Type = "choice",
                Question = "Яка форма TENER для 'ella'?",
                OptionsJson = "[\"tengo\",\"tienes\",\"tiene\",\"tenemos\"]",
                Answer = "tiene" },
            new Exercise { Id = 20, LessonId = 7, Order = 3, Type = "translate",
                Question = "Перекладіть: '¿Cuántos años tienes?'",
                OptionsJson = "[\"Як тебе звати?\",\"Скільки тобі років?\",\"Де ти живеш?\",\"Звідки ти?\"]",
                Answer = "Скільки тобі років?" },

            // Урок 11 — Числа
            new Exercise { Id = 21, LessonId = 11, Order = 1, Type = "choice",
                Question = "Як буде 'сорок' іспанською?",
                OptionsJson = "[\"treinta\",\"cincuenta\",\"cuarenta\",\"veinte\"]",
                Answer = "cuarenta" },
            new Exercise { Id = 22, LessonId = 11, Order = 2, Type = "choice",
                Question = "Що означає 'cien'?",
                OptionsJson = "[\"десять\",\"тисяча\",\"сто\",\"сім\"]",
                Answer = "сто" },
            new Exercise { Id = 23, LessonId = 11, Order = 3, Type = "translate",
                Question = "Як сказати 'двадцять п'ять'?",
                OptionsJson = "[\"quince\",\"veinticinco\",\"treinta y cinco\",\"veintiuno\"]",
                Answer = "veinticinco" },

            // Урок 12 — Дні та місяці
            new Exercise { Id = 24, LessonId = 12, Order = 1, Type = "choice",
                Question = "Який день після 'martes'?",
                OptionsJson = "[\"lunes\",\"jueves\",\"miércoles\",\"viernes\"]",
                Answer = "miércoles" },
            new Exercise { Id = 25, LessonId = 12, Order = 2, Type = "choice",
                Question = "Що означає 'viernes'?",
                OptionsJson = "[\"четвер\",\"субота\",\"середа\",\"п'ятниця\"]",
                Answer = "п'ятниця" },
            new Exercise { Id = 26, LessonId = 12, Order = 3, Type = "translate",
                Question = "Як сказати 'у грудні'?",
                OptionsJson = "[\"en enero\",\"en junio\",\"en diciembre\",\"en marzo\"]",
                Answer = "en diciembre" },

            // Урок 13 — Артиклі
            new Exercise { Id = 27, LessonId = 13, Order = 1, Type = "choice",
                Question = "Який артикль до 'madre' (мама)?",
                OptionsJson = "[\"el\",\"la\",\"los\",\"las\"]",
                Answer = "la" },
            new Exercise { Id = 28, LessonId = 13, Order = 2, Type = "choice",
                Question = "Який артикль до 'hermanos' (брати)?",
                OptionsJson = "[\"el\",\"la\",\"los\",\"las\"]",
                Answer = "los" },
            new Exercise { Id = 29, LessonId = 13, Order = 3, Type = "choice",
                Question = "Який артикль до 'padre' (тато)?",
                OptionsJson = "[\"el\",\"la\",\"los\",\"las\"]",
                Answer = "el" },

            // Урок 14 — Котра година
            new Exercise { Id = 30, LessonId = 14, Order = 1, Type = "choice",
                Question = "Як запитати 'Котра година?'",
                OptionsJson = "[\"¿Qué día es hoy?\",\"¿Qué hora es?\",\"¿Cuándo es?\",\"¿Dónde estás?\"]",
                Answer = "¿Qué hora es?" },
            new Exercise { Id = 31, LessonId = 14, Order = 2, Type = "choice",
                Question = "Як сказати 'Третя година'?",
                OptionsJson = "[\"Son las dos\",\"Es la una\",\"Son las tres\",\"Son las cuatro\"]",
                Answer = "Son las tres" },
            new Exercise { Id = 32, LessonId = 14, Order = 3, Type = "choice",
                Question = "Як сказати 'Перша година'?",
                OptionsJson = "[\"Son las dos\",\"Es la una\",\"Son las tres\",\"Son las doce\"]",
                Answer = "Es la una" }
        );
    }
}
