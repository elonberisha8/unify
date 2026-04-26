# ============================================================
# auto-resume.ps1 — Ringjallon automatikisht sesionin Claude
#   pas resetimit të limitit (5h) për të vazhduar punën në Unify.
# ============================================================
# Si funksionon:
#   1. Pret 5 orë + 17 min (limit reset window) - jitter
#   2. Dërgon prompt me context të plotë te Claude Code CLI
#   3. Logon outputin
#   4. Përsëritet pa fund (Ctrl+C për ndalim)
#
# Përdorim:
#   • Manual: PowerShell -File auto-resume.ps1
#   • Si Task Scheduled: shih auto-resume-task.xml
# ============================================================

$ErrorActionPreference = "Continue"
$ProjectRoot = "C:\Projects\Unify\unify\unify-platform"
$LogDir = Join-Path $ProjectRoot "scripts\logs"
$WaitSeconds = 18600  # 5h 10min

if (!(Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

Set-Location $ProjectRoot

$Prompt = @'
vazhdo punën në projektin Unify (frontend + backend, branch develop).

Detyrat e mbetura sipas prioritetit:
1) git pull --rebase origin develop në frontend dhe backend
2) Verifiko çfarë ka shtuar Codex në backend (pull, merge)
3) Lidh wizardet e reja me API-t e backend-it nëse fushat e Prisma janë shtuar
4) Eliminim i window.location.href në admin pages (60+ vende) → router.push
5) Test navigimi: /shpalljet → /vullnetare/[id] → /dashboard → /admin
6) Verifiko logout flow: Clerk signOut + clear localStorage + router.push("/")
7) Verifiko useAuthGuard: nuk redirekton gabimisht kur Clerk po ngarkohet

Mos commit-o në main, push gjithmonë në develop me Co-Authored-By Claude.
'@

Write-Host "==== Auto-resume për Unify (Claude Code) ====" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot"
Write-Host "Wait: $WaitSeconds s ($([math]::Round($WaitSeconds / 3600, 2)) h)"
Write-Host "Logs: $LogDir"
Write-Host ""

while ($true) {
    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$now] Duke pritur $WaitSeconds sekonda deri në ringjallje..." -ForegroundColor Yellow

    Start-Sleep -Seconds $WaitSeconds

    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $logFile = Join-Path $LogDir "claude-$stamp.log"
    $startedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    Write-Host "[$startedAt] Duke dërguar prompt te Claude Code → $logFile" -ForegroundColor Green

    try {
        $Prompt | & npx @anthropic-ai/claude-code 2>&1 | Tee-Object -FilePath $logFile
    } catch {
        $errorMsg = $_.Exception.Message
        $errorMsg | Out-File -FilePath $logFile -Append -Encoding utf8
        Write-Host "Gabim: $errorMsg" -ForegroundColor Red
    }

    $finishedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$finishedAt] Sesioni përfundoi. Vazhdoj me ciklin tjetër..." -ForegroundColor Cyan
}
