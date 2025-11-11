# Script para iniciar o backend com PostgreSQL
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  BACKEND - SPRING BOOT + POSTGRESQL" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Porta: 8080" -ForegroundColor Yellow
Write-Host "Banco: PostgreSQL (localhost:5432)" -ForegroundColor Yellow
Write-Host "Perfil: prod" -ForegroundColor Yellow
Write-Host ""
Write-Host "Iniciando...`n" -ForegroundColor Cyan

.\mvnw.cmd clean spring-boot:run "-Dspring-boot.run.profiles=prod"

