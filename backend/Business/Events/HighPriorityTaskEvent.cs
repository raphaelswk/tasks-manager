using MediatR;

namespace Business.Events;

/// <summary>
/// Represents the event that is published when a high-priority task is created or updated.
/// This is a simple data carrier class (a record) that implements INotification from MediatR.
/// </summary>
/// <param name="TaskId">The ID of the task.</param>
/// <param name="Title">The title of the task.</param>
/// <param name="Action">The action performed, e.g., "created" or "updated".</param>
public record HighPriorityTaskEvent(int TaskId, string Title, string Action) : INotification;

