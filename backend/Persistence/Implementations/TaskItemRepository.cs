using Domain.Enums;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Persistence.Context;
using Persistence.Interfaces;

namespace Persistence.Repositories;

public class TaskItemRepository(AppDbContext context) : ITaskItemRepository
{ 
    public async Task<TaskItem> Add(TaskItem taskItem)
    {
        context.TaskItems.Add(taskItem);
        await context.SaveChangesAsync();
        return taskItem;
    }

    public async Task<bool> Delete(int id)
    {
        var taskItem = await context.TaskItems.FindAsync(id);
        if (taskItem == null) return false;

        context.TaskItems.Remove(taskItem);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetAll(int pageNumber, int pageSize, Priority? priority, Status? status)
    {
        var query = context.TaskItems.AsQueryable();

        if (priority.HasValue)
        {
            query = query.Where(t => t.Priority == priority.Value);
        }
        
        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<TaskItem?> GetById(int id)
    {
        return await context.TaskItems.FindAsync(id);
    }

    public async Task Update(TaskItem taskItem)
    {
        context.TaskItems.Update(taskItem);
        await context.SaveChangesAsync();
    }
}
