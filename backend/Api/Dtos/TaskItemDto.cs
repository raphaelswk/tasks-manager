using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Api.Dtos;

// DTO for returning task details to the client
public class TaskItemDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public Priority Priority { get; set; }
    public DateTime DueDate { get; set; }
    public Status Status { get; set; }
}

// DTO for creating a new task
public class CreateTaskItemDto
{
    [Required]
    [StringLength(100)]
    public required string Title { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    public Priority Priority { get; set; }

    [Required]
    public DateTime DueDate { get; set; }
}

// DTO for updating an existing task
public class UpdateTaskItemDto
{
    [Required]
    [StringLength(100)]
    public required string Title { get; set; }
    
    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    public Priority Priority { get; set; }

    [Required]
    public DateTime DueDate { get; set; }

    [Required]
    public Status Status { get; set; }
}

