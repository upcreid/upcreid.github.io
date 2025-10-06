# C# & .NET - Cheat Sheet

## .NET Ecosystem Overview

.NET is a cross-platform development platform for building web, desktop, mobile, cloud, IoT, and gaming applications.

**Main versions:**

- **.NET Framework** (Windows only, legacy)
- **.NET Core** (cross-platform, deprecated)
- **.NET 6/7/8/9+** (modern, cross-platform, LTS every 2 years)

## dotnet CLI - Essential Commands

### Project Management

```bash
# Create a new solution
dotnet new sln -n MySolution

# Create different types of projects
dotnet new console -n MyApp                  # Console application
dotnet new classlib -n MyLibrary            # Class library
dotnet new web -n MyApi                     # Minimal Web API
dotnet new webapi -n MyApi                  # Web API with controllers
dotnet new mvc -n MyMvcApp                  # MVC application
dotnet new blazorserver -n MyBlazorApp      # Blazor Server application
dotnet new xunit -n MyTests                 # xUnit test project
dotnet new nunit -n MyTests                 # NUnit test project
dotnet new mstest -n MyTests                # MSTest test project

# List available templates
dotnet new list

# Add a project to a solution
dotnet sln add MyApp/MyApp.csproj

# Add a project reference
dotnet add MyApp/MyApp.csproj reference MyLibrary/MyLibrary.csproj

# Remove a project from the solution
dotnet sln remove MyApp/MyApp.csproj
```

### Build and Execution

```bash
# Restore dependencies
dotnet restore

# Build the project/solution
dotnet build
dotnet build --configuration Release
dotnet build -c Release --no-restore

# Clean build artifacts
dotnet clean

# Run the application
dotnet run
dotnet run --project MyApp/MyApp.csproj
dotnet run --configuration Release

# Run with arguments
dotnet run -- arg1 arg2 --option=value

# Watch mode (automatic rebuild)
dotnet watch run
dotnet watch test
```

### Publishing

```bash
# Publish the application
dotnet publish -c Release -o ./publish

# Publish as self-contained (includes runtime)
dotnet publish -c Release -r win-x64 --self-contained
dotnet publish -c Release -r linux-x64 --self-contained
dotnet publish -c Release -r osx-x64 --self-contained

# Publish as framework-dependent (requires .NET installed)
dotnet publish -c Release -r win-x64 --self-contained false

# Publish as single-file
dotnet publish -c Release -r win-x64 -p:PublishSingleFile=true

# Publish with trimming (size reduction)
dotnet publish -c Release -r linux-x64 -p:PublishTrimmed=true

# Publish as AOT (Ahead-of-Time compilation, .NET 7+)
dotnet publish -c Release -r linux-x64 -p:PublishAot=true
```

### NuGet Package Management

```bash
# Add a NuGet package
dotnet add package Newtonsoft.Json
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.0

# Remove a package
dotnet remove package Newtonsoft.Json

# List packages
dotnet list package
dotnet list package --outdated
dotnet list package --vulnerable

# Restore packages
dotnet restore

# Update packages
dotnet add package PackageName
```

## .csproj File

The `.csproj` (C# Project) file defines the project configuration.

### Basic Structure (modern .NET)

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>
```

### Common Properties

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <!-- Output type -->
    <OutputType>Exe</OutputType>              <!-- Exe, Library, WinExe -->

    <!-- Target framework -->
    <TargetFramework>net8.0</TargetFramework>
    <!-- Multi-targeting -->
    <TargetFrameworks>net6.0;net8.0</TargetFrameworks>

    <!-- C# language version -->
    <LangVersion>12.0</LangVersion>           <!-- latest, preview, 12.0, 11.0 -->

    <!-- Nullable reference types -->
    <Nullable>enable</Nullable>                <!-- enable, disable, warnings -->

    <!-- Implicit usings -->
    <ImplicitUsings>enable</ImplicitUsings>

    <!-- Assembly info -->
    <AssemblyName>MyApplication</AssemblyName>
    <RootNamespace>MyApplication</RootNamespace>
    <Version>1.0.0</Version>
    <AssemblyVersion>1.0.0.0</AssemblyVersion>
    <FileVersion>1.0.0.0</FileVersion>

    <!-- Package metadata -->
    <PackageId>MyPackage</PackageId>
    <Authors>Your Name</Authors>
    <Company>Your Company</Company>
    <Product>Your Product</Product>
    <Description>Package description</Description>
    <Copyright>Copyright © 2025</Copyright>
    <PackageLicenseExpression>MIT</PackageLicenseExpression>
    <PackageProjectUrl>https://github.com/user/repo</PackageProjectUrl>
    <RepositoryUrl>https://github.com/user/repo</RepositoryUrl>
    <RepositoryType>git</RepositoryType>
    <PackageTags>tag1;tag2;tag3</PackageTags>

    <!-- Build options -->
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <WarningsAsErrors>CS8600;CS8602</WarningsAsErrors>
    <NoWarn>CS1591</NoWarn>

    <!-- Publishing -->
    <PublishSingleFile>true</PublishSingleFile>
    <SelfContained>true</SelfContained>
    <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    <PublishTrimmed>true</PublishTrimmed>
    <PublishReadyToRun>true</PublishReadyToRun>
  </PropertyGroup>

</Project>
```

### NuGet Package References

```xml
<ItemGroup>
  <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
  <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
  <PackageReference Include="Serilog" Version="3.1.1" />

  <!-- With specific options -->
  <PackageReference Include="Moq" Version="4.20.70">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers</IncludeAssets>
  </PackageReference>
</ItemGroup>
```

### Project References

```xml
<ItemGroup>
  <ProjectReference Include="..\MyLibrary\MyLibrary.csproj" />
  <ProjectReference Include="..\Shared\Shared.csproj" />
</ItemGroup>
```

### Files to Include/Exclude

```xml
<ItemGroup>
  <!-- Include specific files -->
  <None Include="appsettings.json" CopyToOutputDirectory="PreserveNewest" />
  <None Include="data\*.json" CopyToOutputDirectory="Always" />

  <!-- Embedded content -->
  <EmbeddedResource Include="Resources\**\*" />

  <!-- Exclude files -->
  <Compile Remove="OldCode\**" />
  <EmbeddedResource Remove="OldCode\**" />
  <None Remove="OldCode\**" />
</ItemGroup>
```

### Complete Example - Web API

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
    <NoWarn>$(NoWarn);1591</NoWarn>
    <UserSecretsId>aspnet-MyApi-12345</UserSecretsId>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
    <PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\MyApi.Core\MyApi.Core.csproj" />
    <ProjectReference Include="..\MyApi.Infrastructure\MyApi.Infrastructure.csproj" />
  </ItemGroup>

</Project>
```

## Configuration - appsettings.json

### Basic Structure

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Complete Configuration

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information",
      "System": "Warning"
    },
    "Console": {
      "IncludeScopes": true,
      "LogLevel": {
        "Default": "Debug"
      }
    }
  },

  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MyDb;User Id=sa;Password=P@ssw0rd;TrustServerCertificate=True",
    "RedisConnection": "localhost:6379,password=redis123"
  },

  "AppSettings": {
    "JwtSecret": "YourVeryLongAndSecureSecretKey",
    "JwtExpirationDays": 7,
    "ApiUrl": "https://api.example.com",
    "MaxUploadSizeInMb": 10
  },

  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "noreply@example.com",
    "SenderName": "My Application",
    "EnableSsl": true
  },

  "Cors": {
    "AllowedOrigins": [
      "https://localhost:4200",
      "https://example.com"
    ]
  },

  "FeatureFlags": {
    "EnableNewFeature": false,
    "EnableBetaFeatures": true
  },

  "AllowedHosts": "*"
}
```

### Configuration Hierarchy

```
appsettings.json                      (Base)
  ↓ (override)
appsettings.Development.json          (Environment-specific)
  ↓ (override)
appsettings.{Environment}.json        (Production, Staging, etc.)
  ↓ (override)
User Secrets (development)
  ↓ (override)
Environment Variables
  ↓ (override)
Command-line arguments
```

### Usage in C#

**1. Strongly-typed configuration with IOptions:**

```csharp
// Configuration class
public class AppSettings
{
    public string JwtSecret { get; set; } = string.Empty;
    public int JwtExpirationDays { get; set; }
    public string ApiUrl { get; set; } = string.Empty;
    public int MaxUploadSizeInMb { get; set; }
}

// Program.cs
builder.Services.Configure<AppSettings>(
    builder.Configuration.GetSection("AppSettings")
);

// Injection in a service
public class MyService
{
    private readonly AppSettings _settings;

    public MyService(IOptions<AppSettings> options)
    {
        _settings = options.Value;
    }

    public void DoSomething()
    {
        var url = _settings.ApiUrl;
        var maxSize = _settings.MaxUploadSizeInMb;
    }
}
```

**2. Direct access via IConfiguration:**

```csharp
public class MyService
{
    private readonly IConfiguration _configuration;

    public MyService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void DoSomething()
    {
        // Simple read
        var logLevel = _configuration["Logging:LogLevel:Default"];

        // Read with default value
        var maxSize = _configuration.GetValue<int>("AppSettings:MaxUploadSizeInMb", 10);

        // Read ConnectionString
        var connString = _configuration.GetConnectionString("DefaultConnection");

        // Read section
        var emailSettings = _configuration.GetSection("EmailSettings");
        var smtpServer = emailSettings["SmtpServer"];
    }
}
```

**3. Bind to an object:**

```csharp
var emailSettings = new EmailSettings();
builder.Configuration.GetSection("EmailSettings").Bind(emailSettings);
```

### User Secrets (development)

```bash
# Initialize secrets
dotnet user-secrets init

# Add a secret
dotnet user-secrets set "AppSettings:JwtSecret" "my-secret-key"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=..."

# List secrets
dotnet user-secrets list

# Remove a secret
dotnet user-secrets remove "AppSettings:JwtSecret"

# Clear all secrets
dotnet user-secrets clear
```

**Storage:** `~/.microsoft/usersecrets/{UserSecretsId}/secrets.json`

### Environment Variables

```bash
# Linux/macOS
export AppSettings__JwtSecret="my-key"
export ConnectionStrings__DefaultConnection="Server=..."

# Windows (PowerShell)
$env:AppSettings__JwtSecret="my-key"
$env:ConnectionStrings__DefaultConnection="Server=..."

# Windows (CMD)
set AppSettings__JwtSecret=my-key
```

**Note:** Use `__` (double underscore) for nested sections.

## Tests

### xUnit (most popular)

**Installation:**

```bash
dotnet new xunit -n MyTests
dotnet add package xunit
dotnet add package xunit.runner.visualstudio
dotnet add package Microsoft.NET.Test.Sdk
```

**Test Examples:**

```csharp
using Xunit;

public class CalculatorTests
{
    [Fact]
    public void Addition_TwoNumbers_ReturnsCorrectResult()
    {
        // Arrange
        var calculator = new Calculator();

        // Act
        var result = calculator.Add(2, 3);

        // Assert
        Assert.Equal(5, result);
    }

    [Theory]
    [InlineData(2, 3, 5)]
    [InlineData(0, 0, 0)]
    [InlineData(-1, 1, 0)]
    [InlineData(10, -5, 5)]
    public void Addition_DifferentValues_ReturnsCorrectResult(
        int a, int b, int expected)
    {
        // Arrange
        var calculator = new Calculator();

        // Act
        var result = calculator.Add(a, b);

        // Assert
        Assert.Equal(expected, result);
    }

    [Fact]
    public void Division_ByZero_ThrowsException()
    {
        // Arrange
        var calculator = new Calculator();

        // Act & Assert
        Assert.Throws<DivideByZeroException>(() =>
            calculator.Divide(10, 0)
        );
    }

    [Fact]
    public async Task GetUser_WithValidId_ReturnsUser()
    {
        // Arrange
        var service = new UserService();

        // Act
        var user = await service.GetUserAsync(1);

        // Assert
        Assert.NotNull(user);
        Assert.Equal("John", user.Name);
    }
}
```

**Common Assertions:**

```csharp
// Equality
Assert.Equal(expected, actual);
Assert.NotEqual(expected, actual);

// Null
Assert.Null(obj);
Assert.NotNull(obj);

// Booleans
Assert.True(condition);
Assert.False(condition);

// Collections
Assert.Empty(collection);
Assert.NotEmpty(collection);
Assert.Contains(item, collection);
Assert.DoesNotContain(item, collection);
Assert.Collection(collection,
    item => Assert.Equal("a", item),
    item => Assert.Equal("b", item)
);

// Strings
Assert.StartsWith("Hello", text);
Assert.EndsWith("World", text);
Assert.Contains("middle", text);
Assert.Matches(@"\d{3}", text); // Regex

// Exceptions
Assert.Throws<InvalidOperationException>(() => method());
var ex = Assert.Throws<ArgumentException>(() => method());
Assert.Equal("paramName", ex.ParamName);

// Types
Assert.IsType<string>(obj);
Assert.IsAssignableFrom<IEnumerable>(obj);

// Ranges
Assert.InRange(value, low, high);
Assert.NotInRange(value, low, high);
```

### NUnit

```bash
dotnet add package NUnit
dotnet add package NUnit3TestAdapter
dotnet add package Microsoft.NET.Test.Sdk
```

```csharp
using NUnit.Framework;

[TestFixture]
public class CalculatorTests
{
    private Calculator _calculator;

    [SetUp]
    public void Setup()
    {
        _calculator = new Calculator();
    }

    [Test]
    public void Addition_TwoNumbers_ReturnsCorrectResult()
    {
        var result = _calculator.Add(2, 3);
        Assert.That(result, Is.EqualTo(5));
    }

    [TestCase(2, 3, 5)]
    [TestCase(0, 0, 0)]
    [TestCase(-1, 1, 0)]
    public void Addition_DifferentValues(int a, int b, int expected)
    {
        var result = _calculator.Add(a, b);
        Assert.That(result, Is.EqualTo(expected));
    }

    [TearDown]
    public void Cleanup()
    {
        _calculator = null;
    }
}
```

### Moq - Mocking Framework

```bash
dotnet add package Moq
```

```csharp
using Moq;
using Xunit;

public interface IUserRepository
{
    Task<User> GetAsync(int id);
    Task<bool> SaveAsync(User user);
}

public class UserServiceTests
{
    [Fact]
    public async Task GetUser_WithValidId_CallsRepository()
    {
        // Arrange
        var mockRepo = new Mock<IUserRepository>();
        mockRepo
            .Setup(r => r.GetAsync(1))
            .ReturnsAsync(new User { Id = 1, Name = "John" });

        var service = new UserService(mockRepo.Object);

        // Act
        var user = await service.GetUserAsync(1);

        // Assert
        Assert.NotNull(user);
        Assert.Equal("John", user.Name);
        mockRepo.Verify(r => r.GetAsync(1), Times.Once);
    }

    [Fact]
    public async Task SaveUser_WithEmptyName_ThrowsException()
    {
        // Arrange
        var mockRepo = new Mock<IUserRepository>();
        var service = new UserService(mockRepo.Object);

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(
            () => service.SaveAsync(new User { Name = "" })
        );

        // Verify repository was not called
        mockRepo.Verify(r => r.SaveAsync(It.IsAny<User>()), Times.Never);
    }
}
```

**Advanced Moq Setup:**

```csharp
// Return different values
mock.SetupSequence(m => m.GetValue())
    .Returns(1)
    .Returns(2)
    .Returns(3);

// Callback
mock.Setup(m => m.Save(It.IsAny<User>()))
    .Callback<User>(u => Console.WriteLine($"Saving {u.Name}"))
    .Returns(true);

// With conditions
mock.Setup(m => m.GetById(It.Is<int>(id => id > 0)))
    .Returns(new User());

// Properties
mock.SetupGet(m => m.Count).Returns(5);
mock.SetupSet(m => m.Name = "test");

// Exceptions
mock.Setup(m => m.Delete(It.IsAny<int>()))
    .Throws<InvalidOperationException>();
```

### Running Tests

```bash
# Run all tests
dotnet test

# With verbosity
dotnet test --verbosity normal

# Tests from a specific project
dotnet test MyTests/MyTests.csproj

# Filter by name
dotnet test --filter "FullyQualifiedName~CalculatorTests"
dotnet test --filter "Name~Addition"

# Filter by category
dotnet test --filter "Category=Integration"

# With code coverage
dotnet test --collect:"XPlat Code Coverage"

# Watch mode
dotnet watch test
```

### Code Coverage with Coverlet

```bash
# Install coverlet
dotnet add package coverlet.collector

# Generate coverage
dotnet test --collect:"XPlat Code Coverage"

# With ReportGenerator for HTML
dotnet tool install -g dotnet-reportgenerator-globaltool

reportgenerator \
  -reports:"**/coverage.cobertura.xml" \
  -targetdir:"coveragereport" \
  -reporttypes:Html

# View the report
open coveragereport/index.html
```

## NuGet - Package Management

### Creating a NuGet Package

**1. Configure the .csproj:**

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>

    <!-- Package metadata -->
    <PackageId>MyPackage.Utils</PackageId>
    <Version>1.0.0</Version>
    <Authors>Your Name</Authors>
    <Company>Your Company</Company>
    <Description>Utilities to simplify development</Description>
    <PackageLicenseExpression>MIT</PackageLicenseExpression>
    <PackageProjectUrl>https://github.com/user/repo</PackageProjectUrl>
    <RepositoryUrl>https://github.com/user/repo</RepositoryUrl>
    <RepositoryType>git</RepositoryType>
    <PackageTags>utils;helpers;extensions</PackageTags>
    <PackageReleaseNotes>Initial version</PackageReleaseNotes>
    <PackageReadmeFile>README.md</PackageReadmeFile>
    <PackageIcon>icon.png</PackageIcon>

    <!-- Package generation -->
    <GeneratePackageOnBuild>true</GeneratePackageOnBuild>
    <IncludeSymbols>true</IncludeSymbols>
    <SymbolPackageFormat>snupkg</SymbolPackageFormat>
  </PropertyGroup>

  <ItemGroup>
    <None Include="README.md" Pack="true" PackagePath="\" />
    <None Include="icon.png" Pack="true" PackagePath="\" />
  </ItemGroup>

</Project>
```

**2. Create the package:**

```bash
# Pack the project
dotnet pack -c Release

# Specify version
dotnet pack -c Release -p:PackageVersion=1.2.3

# Custom output
dotnet pack -c Release -o ./nupkgs
```

**3. Publish to NuGet.org:**

```bash
# Get an API key from nuget.org
# Publish the package
dotnet nuget push MyPackage.1.0.0.nupkg --api-key YOUR_API_KEY --source https://api.nuget.org/v3/index.json
```

### Custom NuGet Sources

**Configuration in `nuget.config`:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <clear />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
    <add key="MyPrivateFeed" value="https://pkgs.dev.azure.com/myorg/_packaging/myfeed/nuget/v3/index.json" />
    <add key="LocalFeed" value="./local-packages" />
  </packageSources>

  <packageSourceCredentials>
    <MyPrivateFeed>
      <add key="Username" value="myusername" />
      <add key="ClearTextPassword" value="mypassword" />
    </MyPrivateFeed>
  </packageSourceCredentials>
</configuration>
```

**Commands:**

```bash
# List sources
dotnet nuget list source

# Add a source
dotnet nuget add source https://api.myget.org/F/myfeed/api/v3/index.json -n MyGetFeed

# Remove a source
dotnet nuget remove source MyGetFeed

# Enable/disable a source
dotnet nuget enable source MyGetFeed
dotnet nuget disable source MyGetFeed
```

### Local Feed

```bash
# Create a folder for packages
mkdir local-packages

# Copy packages
dotnet pack -o ./local-packages

# Add as source
dotnet nuget add source ./local-packages -n LocalFeed

# Use
dotnet add package MyPackage --source LocalFeed
```

## Project Structure Examples

### Minimal Web API (.NET 8)

**Program.cs:**

```csharp
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");

// Endpoints
app.MapGet("/api/users", async (AppDbContext db) =>
{
    return await db.Users.ToListAsync();
});

app.MapGet("/api/users/{id}", async (int id, AppDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    return user is not null ? Results.Ok(user) : Results.NotFound();
});

app.MapPost("/api/users", async (User user, AppDbContext db) =>
{
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Created($"/api/users/{user.Id}", user);
});

app.MapPut("/api/users/{id}", async (int id, User user, AppDbContext db) =>
{
    var existingUser = await db.Users.FindAsync(id);
    if (existingUser is null) return Results.NotFound();

    existingUser.Name = user.Name;
    existingUser.Email = user.Email;
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/api/users/{id}", async (int id, AppDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user is null) return Results.NotFound();

    db.Users.Remove(user);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();
```

### Web API with Controllers

**Program.cs:**

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Dependency injection
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

**Controller:**

```csharp
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            _logger.LogWarning("User {UserId} not found", id);
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> Create([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userService.CreateUserAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var success = await _userService.UpdateUserAsync(id, dto);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _userService.DeleteUserAsync(id);
        return NoContent();
    }
}
```

## Useful Tools

### dotnet CLI Extensions

```bash
# Install global tools
dotnet tool install -g dotnet-ef                    # Entity Framework
dotnet tool install -g dotnet-outdated-tool         # Check outdated packages
dotnet tool install -g dotnet-format                # Code formatting
dotnet tool install -g dotnet-aspnet-codegenerator  # Scaffolding

# List installed tools
dotnet tool list -g

# Update a tool
dotnet tool update -g dotnet-ef
```

### Entity Framework Core

```bash
# Migrations
dotnet ef migrations add InitialCreate
dotnet ef migrations remove
dotnet ef migrations list

# Database
dotnet ef database update
dotnet ef database drop

# Scaffolding (database-first)
dotnet ef dbcontext scaffold "Connection String" Microsoft.EntityFrameworkCore.SqlServer -o Models
```

### Formatting and Analysis

```bash
# Format code
dotnet format

# Analyze code
dotnet build --no-incremental /p:TreatWarningsAsErrors=true

# Code style analysis
dotnet build /p:EnforceCodeStyleInBuild=true
```

## Best Practices

### ✅ Recommendations

1. **Use .NET 8 or newer** (LTS)
2. **Enable nullable reference types** (`<Nullable>enable</Nullable>`)
3. **Use appsettings.json** for configuration
4. **User Secrets** for sensitive data in development
5. **Dependency Injection** for decoupling
6. **Structured logging** (Serilog, NLog)
7. **Unit tests** with coverage > 80%
8. **Semantic versioning** for NuGet packages
9. **CI/CD** with GitHub Actions, Azure DevOps, etc.
10. **XML documentation** for public APIs

### ❌ To Avoid

1. ❌ Storing secrets in appsettings.json
2. ❌ Using `#pragma warning disable`
3. ❌ Circular references between projects
4. ❌ Business logic in controllers
5. ❌ Generic catch without logging: `catch (Exception) { }`

## Resources

- [.NET Documentation](https://learn.microsoft.com/dotnet/)
- [C# Guide](https://learn.microsoft.com/dotnet/csharp/)
- [ASP.NET Core](https://learn.microsoft.com/aspnet/core/)
- [Entity Framework Core](https://learn.microsoft.com/ef/core/)
- [NuGet Gallery](https://www.nuget.org/)
- [.NET CLI Reference](https://learn.microsoft.com/dotnet/core/tools/)
