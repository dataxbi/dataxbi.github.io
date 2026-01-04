# Script para generar automaticamente paginas de tags
Write-Host "Analizando posts..." -ForegroundColor Cyan
$postsPath = "_posts"
$tagPagesPath = "blog/tag"
if (!(Test-Path $tagPagesPath)) { New-Item -ItemType Directory -Path $tagPagesPath -Force | Out-Null }
$allTags = @{}
Get-ChildItem -Path $postsPath -Filter "*.md" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    if ($content -match '(?s)tags:\s*\n((?:\s+-\s+[^\n]+\n?)+)') {
        $tagsBlock = $matches[1]
        $tags = $tagsBlock -split '\n' | Where-Object { $_ -match '^\s+-\s+(.+)$' } | ForEach-Object {
            if ($_ -match '^\s+-\s+"([^"]+)"') { $matches[1] }
            elseif ($_ -match '^\s+-\s+(.+)$') { $matches[1].Trim() }
        }
        foreach ($tag in $tags) {
            if ($tag) {
                if ($allTags.ContainsKey($tag)) { $allTags[$tag]++ } else { $allTags[$tag] = 1 }
            }
        }
    }
}
Write-Host "Tags encontrados: $($allTags.Count)" -ForegroundColor Green
$sortedTags = $allTags.GetEnumerator() | Sort-Object Value -Descending
Write-Host "`nEstadisticas:" -ForegroundColor Yellow
foreach ($item in $sortedTags) { Write-Host "  $($item.Key): $($item.Value) posts" }
Write-Host "`nGenerando paginas..." -ForegroundColor Cyan
foreach ($tagEntry in $sortedTags) {
    $tag = $tagEntry.Key
    $count = $tagEntry.Value
    $tagSlug = $tag.ToLower() -replace '\s+', '-'
    $fileName = "$tagPagesPath\$tagSlug.html"
    $arrowSymbol = [char]0x2192
    $template = "---`nlayout: page`ntitle: `"Posts sobre $tag`"`npermalink: /blog/tag/$tagSlug/`n---`n`n<div class=`"blog-list`">`n    <p>Mostrando <strong>$tag</strong> ($count posts) - <a href=`"/blog/`"> Volver al blog</a></p>`n    {% for post in site.posts %}{% if post.tags contains `"$tag`" %}<article class=`"blog-item`"><h2><a href=`"{{ post.url }}`">{{ post.title }}</a></h2><p class=`"post-meta`">{{ post.date | date: `"%d/%m/%Y`" }}{% if post.author %} $arrowSymbol {{ post.author }}{% endif %}</p><p>{{ post.excerpt | strip_html | truncate: 200 }}</p><a href=`"{{ post.url }}`">Leer mas</a></article>{% endif %}{% endfor %}`n</div>"
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($fileName, $template, $utf8NoBom)
    Write-Host "  $fileName" -ForegroundColor Green
}
Write-Host "`nCompletado: $($sortedTags.Count) paginas generadas" -ForegroundColor Green
Write-Host "`nTop tags:" -ForegroundColor Yellow
$sortedTags | Select-Object -First 15 | ForEach-Object { Write-Host "  $($_.Key)" -ForegroundColor Cyan }
