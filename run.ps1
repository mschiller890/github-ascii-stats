$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match "^\s*([^#=]+?)\s*=\s*(.+?)\s*$") {
      Set-Item -Path "env:$($matches[1])" -Value $matches[2]
    }
  }
}

node "$PSScriptRoot\scripts\index.mjs"
