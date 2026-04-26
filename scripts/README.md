# Auto-Resume Automation për Claude Code

Sa herë limit-i 5-orësh i Claude reset-on, këto skripte ringjallin automatikisht sesionin
dhe dërgojnë prompt që të vazhdojë punën në Unify.

## Files

- `auto-resume.ps1` — Loop pa fund që pret 5h 10min, dërgon prompt te Claude CLI, përsërit
- `install-task.ps1` — Regjistron auto-resume si Windows Scheduled Task (true persistence)
- `logs/` — Output i çdo sesioni Claude

## Përdorim i shpejtë (manual)

```powershell
cd C:\Projects\Unify\unify\unify-platform\scripts
PowerShell -ExecutionPolicy Bypass -File auto-resume.ps1
```

Lëre të hapur — do dërgojë "vazhdo" çdo 5h 10min.

## Persistencë e plotë (Scheduled Task)

```powershell
PowerShell -ExecutionPolicy Bypass -File install-task.ps1
```

Pas kësaj:
- Auto-nisje në çdo logon
- Repetition çdo 5h
- Survive restart kompjuteri
- Logs në `scripts/logs/claude-YYYYMMDD-HHMMSS.log`

## Çaktivizim

```powershell
Unregister-ScheduledTask -TaskName Unify-Claude-AutoResume -Confirm:$false
```
