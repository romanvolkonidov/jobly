# setup.ps1

Write-Host "Starting marketplace project setup..." -ForegroundColor Cyan

# Check for required tools
function Check-Requirements {
    Write-Host "Checking requirements..." -ForegroundColor Cyan
    
    $requirements = @(
        @{Name = "Node.js"; Command = "node --version"},
        @{Name = "Docker"; Command = "docker --version"},
        @{Name = "Docker Compose"; Command = "docker-compose --version"}
    )

    foreach ($req in $requirements) {
        try {
            Invoke-Expression $req.Command | Out-Null
            Write-Host "Found $($req.Name)" -ForegroundColor Green
        }
        catch {
            Write-Host "$($req.Name) is required but not installed. Please install it and try again." -ForegroundColor Red
            exit 1
        }
    }
}

# Create project structure
function Create-Structure {
    Write-Host "Creating project structure..." -ForegroundColor Cyan
    
    # Create directories
    $directories = @(
        "websocket/src",
        "task-processor/src"
    )

    foreach ($dir in $directories) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    # Create .gitignore
    $gitignoreContent = @"
node_modules
.next
.env*
!.env.example
dist
build
*.log
"@
    
    Set-Content -Path ".gitignore" -Value $gitignoreContent

    Write-Host "Project structure created" -ForegroundColor Green
}

# Create environment files
function Create-EnvFiles {
    Write-Host "Creating environment files..." -ForegroundColor Cyan
    
    $envExampleContent = @"
APP_NAME=Marketplace
API_VERSION=v1
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/marketplace_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
"@
    
    Set-Content -Path ".env.example" -Value $envExampleContent

    # Copy provided .env files if they exist
    if (Test-Path ".env.local") {
        Copy-Item ".env.local" ".env" -Force
        Write-Host "Copied .env.local to .env" -ForegroundColor Green
    }
    
    Write-Host "Environment files created" -ForegroundColor Green
}

# Copy Docker files
function Copy-DockerFiles {
    Write-Host "Setting up Docker configuration..." -ForegroundColor Cyan
    
    $dockerfiles = @("Dockerfile", "docker-compose.staging.yml", "docker-compose.prod.yml")
    
    foreach ($file in $dockerfiles) {
        if (Test-Path $file) {
            (Get-Content $file) | Set-Content -Path $file -NoNewline
            Write-Host "Processed $file" -ForegroundColor Green
        }
        else {
            Write-Host "Warning: $file not found" -ForegroundColor Yellow
        }
    }
}

# Initialize services
function Init-Services {
    Write-Host "Initializing services..." -ForegroundColor Cyan
    
    $websocketPackageJson = @"
{
  "name": "marketplace-websocket",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
"@

    $taskProcessorPackageJson = @"
{
  "name": "marketplace-task-processor",
  "version": "1.0.0",
  "main": "src/processor.js",
  "scripts": {
    "start": "node src/processor.js",
    "dev": "nodemon src/processor.js"
  }
}
"@

    Set-Content -Path "websocket/package.json" -Value $websocketPackageJson
    Set-Content -Path "task-processor/package.json" -Value $taskProcessorPackageJson

    Write-Host "Services initialized" -ForegroundColor Green
}

# Setup development environment
function Setup-DevEnv {
    Write-Host "Setting up development environment..." -ForegroundColor Cyan
    
    try {
        # Install main project dependencies
        npm install
        
        # Install websocket service dependencies
        Push-Location websocket
        npm install
        Pop-Location
        
        # Install task processor dependencies
        Push-Location task-processor
        npm install
        Pop-Location
        
        Write-Host "Development environment ready" -ForegroundColor Green
    }
    catch {
        Write-Host "Error installing dependencies: $_" -ForegroundColor Red
        exit 1
    }
}

# Create helper scripts
function Create-HelperScripts {
    Write-Host "Creating helper scripts..." -ForegroundColor Cyan
    
    $startScript = @"
param(
    [Parameter(Mandatory=`$false)]
    [string]`$environment = "local"
)

switch (`$environment) {
    "local" { npm run dev }
    "staging" { docker-compose -f docker-compose.staging.yml up -d --build }
    "prod" { docker-compose -f docker-compose.prod.yml up -d --build }
    default {
        Write-Host "Invalid environment. Use: local, staging, or prod" -ForegroundColor Red
        exit 1
    }
}
"@

    $stopScript = @"
param(
    [Parameter(Mandatory=`$false)]
    [string]`$environment = "local"
)

switch (`$environment) {
    "local" { npm run stop }
    "staging" { docker-compose -f docker-compose.staging.yml down }
    "prod" { docker-compose -f docker-compose.prod.yml down }
    default {
        Write-Host "Invalid environment. Use: local, staging, or prod" -ForegroundColor Red
        exit 1
    }
}
"@

    Set-Content -Path "start.ps1" -Value $startScript
    Set-Content -Path "stop.ps1" -Value $stopScript

    Write-Host "Helper scripts created" -ForegroundColor Green
}

# Main setup execution
function Start-Setup {
    try {
        Check-Requirements
        Create-Structure
        Create-EnvFiles
        Copy-DockerFiles
        Init-Services
        Setup-DevEnv
        Create-HelperScripts
        
        Write-Host "`nSetup complete! You can now:" -ForegroundColor Cyan
        Write-Host "1. Start local development: .\start.ps1 local" -ForegroundColor Yellow
        Write-Host "2. Start staging environment: .\start.ps1 staging" -ForegroundColor Yellow
        Write-Host "3. Start production environment: .\start.ps1 prod" -ForegroundColor Yellow
    }
    catch {
        Write-Host "Error during setup: $_" -ForegroundColor Red
        exit 1
    }
}

# Run setup
Start-Setup