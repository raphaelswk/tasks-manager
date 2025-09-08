using Domain.Enums;

namespace Domain.Entities;

public class TaskItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public Priority Priority { get; set; }
    public DateTime DueDate { get; set; }
    public Status Status { get; set; }
}
