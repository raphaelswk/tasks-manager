using Domain.Entities;
using Domain.Enums;

namespace Business.Interfaces;

public interface ITaskItemService
{
    Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetAllTasks(
        int pageNumber,
        int pageSize,
        Priority? priority = null,
        Status? status = null
    );
    Task<TaskItem?> GetTaskById(int id);
    Task<TaskItem> CreateTaskItem(TaskItem taskItem);
    Task<TaskItem?> UpdateTaskItem(int id, TaskItem taskItem);
    Task<bool> DeleteTaskItem(int id);
}
