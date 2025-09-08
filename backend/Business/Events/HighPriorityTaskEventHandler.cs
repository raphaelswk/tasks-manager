using Business.Interfaces;
using MediatR;

namespace Business.Events;

/// <summary>
/// This class handles the HighPriorityTaskEvent.
/// It implements INotificationHandler from MediatR, which tells the system
/// to execute the Handle method whenever a HighPriorityTaskEvent is published.
/// Its single responsibility is to log critical updates.
/// </summary>
public class HighPriorityTaskEventHandler(IFileLogger logger) : INotificationHandler<HighPriorityTaskEvent>
{
    public Task Handle(HighPriorityTaskEvent notification, CancellationToken cancellationToken)
    {
        var logMessage = $"CRITICAL UPDATE: Task '{notification.Title}' (ID: {notification.TaskId}) was {notification.Action}.";
        
        // Use the singleton logger instance to write to a separate critical log file
        logger.LogCritical(logMessage);
        
        return Task.CompletedTask;
    }
}

