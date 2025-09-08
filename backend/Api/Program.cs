using Api;
using Business.Implementations;
using Business.Interfaces;
using Microsoft.EntityFrameworkCore;
using Persistence.Context;
using Persistence.Interfaces;
using Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);

// --- Add services to the container ---

// Add a permissive CORS policy for local development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure the database context to use SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- Register application services for Dependency Injection ---

// Scoped services are created once per client request
builder.Services.AddScoped<ITaskItemRepository, TaskItemRepository>();
builder.Services.AddScoped<ITaskItemService, TaskItemService>();

// Singleton services are created once and shared for the lifetime of the application
builder.Services.AddSingleton<IFileLogger, FileLogger>();

// --- Configure AutoMapper and MediatR ---

// Add AutoMapper and scan the current assembly for mapping profiles
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// Add MediatR and scan the Business layer's assembly for handlers
builder.Services.AddMediatR(cfg => 
    cfg.RegisterServicesFromAssembly(typeof(TaskItemService).Assembly));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use the CORS policy
app.UseCors("AllowAll");

app.UseAuthorization();

// Add the custom request logging middleware to the pipeline
app.UseMiddleware<RequestLoggingMiddleware>();

app.MapControllers();

// --- Automatically apply database migrations on startup ---
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

app.Run();


