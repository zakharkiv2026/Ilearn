$base = "http://localhost:5084/api/admin/add-video"

$videos = @(
  @{ lessonId=4;  videoId="MmNNGVeNerU"; title="Primer dialogo en espanol";       description="Dreaming Spanish: простий діалог для початківців A1"; order=1 },
  @{ lessonId=4;  videoId="P97OKB4bFOI"; title="Saludos y presentaciones";        description="Dreaming Spanish: вітання та знайомство A1";            order=2 },
  @{ lessonId=9;  videoId="kNNJm-UeJGM"; title="La familia en espanol";           description="Dreaming Spanish: розповідь про сім'ю A1";              order=1 },
  @{ lessonId=15; videoId="1BXVn_0Pcgk"; title="Los numeros del 1 al 100";        description="Dreaming Spanish: числа від 1 до 100 A1";               order=1 }
)

foreach ($v in $videos) {
  $body = $v | ConvertTo-Json
  try {
    $r = Invoke-RestMethod -Uri $base -Method POST -ContentType "application/json" -Body $body
    Write-Host "Added video id=$($r.id) for lesson $($v.lessonId): $($v.title)"
  } catch {
    Write-Host "Error for lesson $($v.lessonId): $_"
  }
}
