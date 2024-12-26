param(
    [Parameter(Mandatory=$false)]
    [string]$environment = "local"
)

switch ($environment) {
    "local" { npm run dev }
    "staging" { docker-compose -f docker-compose.staging.yml up -d --build }
    "prod" { docker-compose -f docker-compose.prod.yml up -d --build }
    default {
        Write-Host "Invalid environment. Use: local, staging, or prod" -ForegroundColor Red
        exit 1
    }
}
