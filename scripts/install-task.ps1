# ============================================================
# install-task.ps1 — Regjistron auto-resume.ps1 si Windows Scheduled Task
# ============================================================
# Përdorim (run as Administrator NUK kërkohet — task për user-in aktual):
#   PowerShell -ExecutionPolicy Bypass -File install-task.ps1
# ============================================================

$TaskName  = "Unify-Claude-AutoResume"
$ScriptPath = Join-Path $PSScriptRoot "auto-resume.ps1"

if (!(Test-Path $ScriptPath)) {
    Write-Host "Nuk u gjet auto-resume.ps1 në $ScriptPath" -ForegroundColor Red
    exit 1
}

# Hiq task-un ekzistues nëse ekziston
if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Write-Host "Heq task-un ekzistues '$TaskName'..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# Action: nis PowerShell me skriptin
$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ScriptPath`""

# Trigger: at logon + every 5h sa kohë jeni i loguar
$triggerAtLogon = New-ScheduledTaskTrigger -AtLogOn

$triggerEvery5h = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(2)
$triggerEvery5h.Repetition = (New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 5) -RepetitionDuration (New-TimeSpan -Days 365)).Repetition

# Settings
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 5)

# Principal: useri aktual
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger @($triggerAtLogon, $triggerEvery5h) `
    -Settings $settings `
    -Principal $principal `
    -Description "Ringjall sesionin Claude Code për të vazhduar punën në Unify çdo 5 orë."

Write-Host ""
Write-Host "✓ Task '$TaskName' u regjistrua me sukses!" -ForegroundColor Green
Write-Host ""
Write-Host "Komandat:"
Write-Host "  Start manual:    Start-ScheduledTask -TaskName $TaskName"
Write-Host "  Stop:            Stop-ScheduledTask -TaskName $TaskName"
Write-Host "  Status:          Get-ScheduledTask -TaskName $TaskName"
Write-Host "  Heq:             Unregister-ScheduledTask -TaskName $TaskName -Confirm:`$false"
Write-Host ""
Write-Host "Logs: $PSScriptRoot\logs\"
