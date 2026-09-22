$ErrorActionPreference = "Stop"
$gh = "C:\Program Files\GitHub CLI\gh.exe"
Set-Location $PSScriptRoot

& $gh auth status
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "GitHub CLI is not signed in yet."
  Write-Host "Run:  & `"$gh`" auth login -h github.com -p https -w"
  Write-Host "After approving in the browser, press Enter in that terminal to finish."
  exit 1
}

$remote = git remote get-url origin 2>$null
if (-not $remote) {
  & $gh repo create Oakville-Mediation --public --description "Cross Mediation Inc website" --source=. --remote=origin --push
} else {
  git push -u origin main
}

Write-Host ""
Write-Host "Deploying to Vercel (you may be asked to log in once)..."
npx vercel --prod --yes
