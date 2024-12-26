param(
    [Parameter(Mandatory=$false)]
    [string]$environment = "local"
)

switch ($environment) {
    "local" { npm run stop }
    "staging" { docker-compose -f docker-compose.staging.yml down }
    "prod" { docker-compose -f docker-compose.prod.yml down }
    default {
        Write-Host "Invalid environment. Use: local, staging, or prod" -ForegroundColor Red
        exit 1
    }
}
