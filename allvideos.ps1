$base = "http://localhost:5084/api/admin/add-video"

function Add-Video($lessonId, $videoId, $title, $desc, $order) {
    $body = [PSCustomObject]@{
        LessonId    = $lessonId
        VideoId     = $videoId
        Title       = $title
        Description = $desc
        Order       = $order
    } | ConvertTo-Json -Compress
    try {
        $r = Invoke-RestMethod -Uri $base -Method POST -ContentType "application/json" -Body $body
        Write-Host "OK lesson=$lessonId -> $title"
    } catch {
        Write-Host "FAIL lesson=$lessonId -> $($_.Exception.Message)"
    }
}

# ── Day 1 ─────────────────────────────────────────────────────────────────────
# Lesson 1: Greetings vocabulary
Add-Video 1 "QowqVG1BBto" "How to Say Hello in Spanish" "SpanishPod101: greetings A1" 1
Add-Video 1 "m9eaWTKrBDk" "Basic Greetings and Goodbyes" "Senor Jordan: greetings A1" 2

# Lesson 2: Verb SER
Add-Video 2 "lyy8pgKQHgY" "Ser Conjugation in Present Tense" "Senor Jordan: verb SER" 1
Add-Video 2 "5fJm-0XI1FQ" "Start Speaking Spanish in 10 min" "Butterfly Spanish: soy eres es" 2

# Lesson 3: Countries and languages
Add-Video 3 "Nw1H8aIhKNk" "Countries in Spanish" "Senor Jordan: countries A1" 1

# Lesson 4: Dialog (already has 2 videos – skip or add 1 more)

# Lesson 5: Self-presentation (Practica)
Add-Video 5 "QowqVG1BBto" "How to Introduce Yourself in Spanish" "SpanishPod101: presentacion A1" 1

# ── Day 2 ─────────────────────────────────────────────────────────────────────
# Lesson 6: Family vocabulary
Add-Video 6 "fuq7-Qp91Ic" "Family Vocabulary in Spanish" "School resource: la familia A1" 1

# Lesson 7: TENER + age
Add-Video 7 "YJCk6y3fO9g" "Tener in Present Tense" "Senor Jordan: tener A1" 1

# Lesson 8: Possessive pronouns
Add-Video 8 "q-qLrI_Uc44" "Possessive Adjectives in Spanish" "Senor Jordan: mi tu su nuestro" 1

# Lesson 9: Reading (already has 1 video – add 1 more)
Add-Video 9 "fuq7-Qp91Ic" "La familia en espanol" "Family vocab review" 2

# Lesson 10: Family story (Practica)
Add-Video 10 "YJCk6y3fO9g" "Talking about your family" "Tener review + family" 1

# ── Day 3 ─────────────────────────────────────────────────────────────────────
# Lesson 11: Numbers 0-100
Add-Video 11 "XNlAFiQM5xo" "Spanish Numbers 1 to 100" "SpanishPod101: numbers A1" 1

# Lesson 12: Days and months
Add-Video 12 "9j1ueJ_XdFM" "Days of the Week in Spanish" "Siempre Spanish: days A1" 1

# Lesson 13: Articles el/la/los/las
Add-Video 13 "N_xYnEEK6wU" "Definite Articles in Spanish" "School resource: el la los las" 1

# Lesson 14: Telling time
Add-Video 14 "PvPh6-9BgQU" "Telling Time in Spanish" "Senor Jordan: que hora es A1" 1
Add-Video 14 "LL-HuuvFPTw" "Telling Time with Menos" "Senor Jordan: menos cuarto" 2

# Lesson 15: Audio numbers (already has 1 video – add 1 more)
Add-Video 15 "XNlAFiQM5xo" "Numbers in Context" "Numbers review A1" 2
