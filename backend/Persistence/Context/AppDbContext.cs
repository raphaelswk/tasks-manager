using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence.Context;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TaskItem> TaskItems { get; set; }
}
