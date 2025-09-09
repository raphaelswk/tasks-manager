using Business.Events;
using Business.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Persistence.Interfaces;

namespace Business.Implementations;

public class TaskItemService(ITaskItemRepository taskItemRepository, IPublisher mediator) : ITaskItemService
{
    public async Task<TaskItem> CreateTaskItem(TaskItem taskItem)
    {
        var createdTask = await taskItemRepository.Add(taskItem);

        if (createdTask.Priority == Priority.High)
        {
            await mediator.Publish(new HighPriorityTaskEvent(createdTask.Id, createdTask.Title, "created"));
        }

        return createdTask;
    }

    public Task<bool> DeleteTaskItem(int id)
    {
        return taskItemRepository.Delete(id);
    }

    public async Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetAllTasks(
        int pageNumber,
        int pageSize,
        Priority? priority = null,
        Status? status = null)
    {
        return await taskItemRepository.GetAll(pageNumber, pageSize, priority, status);
    }

    public Task<TaskItem?> GetTaskById(int id)
    {
        return taskItemRepository.GetById(id);
    }

    public async Task<TaskItem?> UpdateTaskItem(int id, TaskItem taskItem)
    {
        var existingTask = await taskItemRepository.GetById(id);
        if (existingTask == null) return null;

        existingTask.Title = taskItem.Title;
        existingTask.Description = taskItem.Description;
        existingTask.Priority = taskItem.Priority;
        existingTask.DueDate = taskItem.DueDate;
        existingTask.Status = taskItem.Status;

        await taskItemRepository.Update(existingTask);
        
        if (existingTask.Priority == Priority.High)
        {
            await mediator.Publish(new HighPriorityTaskEvent(existingTask.Id, existingTask.Title, "updated"));
        }

        return existingTask;
    }
}
