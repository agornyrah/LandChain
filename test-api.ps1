Write-Host "Testing LandChain Backend API..." -ForegroundColor Green

# Test registration
Write-Host "`n1. Testing User Registration..." -ForegroundColor Yellow
$registerData = @{
    username = "testuser2"
    email = "test2@example.com"
    password = "password123"
    role = "user"
    firstName = "Test"
    lastName = "User2"
    address = "123 Test St"
    phone = "1234567890"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -ContentType "application/json" -Body $registerData
    Write-Host "✅ Registration successful: $($response.success)" -ForegroundColor Green
    if ($response.success) {
        Write-Host "   User created: $($response.user.username)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test login
Write-Host "`n2. Testing User Login..." -ForegroundColor Yellow
$loginData = @{
    email = "test2@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginData
    Write-Host "✅ Login successful: $($response.success)" -ForegroundColor Green
    if ($response.success) {
        Write-Host "   User logged in: $($response.user.username)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test property registration
Write-Host "`n3. Testing Property Registration..." -ForegroundColor Yellow
$propertyData = @{
    address = "456 Property Ave"
    size = "1000 sqm"
    type = "residential"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/properties" -Method POST -ContentType "application/json" -Body $propertyData -SessionVariable session
    Write-Host "✅ Property registration successful: $($response.success)" -ForegroundColor Green
    if ($response.success) {
        Write-Host "   Property ID: $($response.propertyId)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Property registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test getting properties
Write-Host "`n4. Testing Get Properties..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/properties" -Method GET
    Write-Host "✅ Get properties successful" -ForegroundColor Green
    Write-Host "   Found $($response.properties.Count) properties" -ForegroundColor Green
} catch {
    Write-Host "❌ Get properties failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAPI Testing completed!" -ForegroundColor Green 