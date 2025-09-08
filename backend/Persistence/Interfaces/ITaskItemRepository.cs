using Domain.Entities;
using Domain.Enums;

namespace Persistence.Interfaces;

public interface ITaskItemRepository
{
    Task<IEnumerable<TaskItem>> GetAll(int pageNumber, int pageSize, Priority? priority, Status? status);
    Task<TaskItem?> GetById(int id);
    Task<TaskItem> Add(TaskItem taskItem);
    Task Update(TaskItem taskItem);
    Task<bool> Delete(int id);
}
