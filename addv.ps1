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
        Write-Host "OK lesson=$lessonId id=$($r.id) -> $title"
    } catch {
        $err = $_.Exception.Response
        Write-Host "FAIL lesson=$lessonId -> $($_.Exception.Message)"
    }
}

# Lesson 4  – Audio: "Dialog: first meeting"  (Day 1)
Add-Video 4 "MmNNGVeNerU" "Primer dialogo en espanol" "Dreaming Spanish: beginner dialog A1" 1
Add-Video 4 "P97OKB4bFOI" "Saludos y presentaciones"  "Dreaming Spanish: greetings A1"       2

# Lesson 9  – Reading: questionnaire  (Day 2)
Add-Video 9 "kNNJm-UeJGM" "La familia en espanol"     "Dreaming Spanish: family vocab A1"    1

# Lesson 15 – Audio: numbers in dialog  (Day 3)
Add-Video 15 "1BXVn_0Pcgk" "Los numeros del 1 al 100"  "Dreaming Spanish: numbers 1-100 A1"  1
