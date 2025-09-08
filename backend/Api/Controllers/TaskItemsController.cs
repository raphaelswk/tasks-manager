using Api.Dtos;
using AutoMapper;
using Business.Interfaces;
using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Api;

[ApiController]
[Route("[controller]")]
public class TaskItemsController : ControllerBase
{
    private readonly ITaskItemService _taskService;
    private readonly IMapper _mapper;

    public TaskItemsController(ITaskItemService taskService, IMapper mapper)
    {
        _taskService = taskService;
        _mapper = mapper;
    }

    // GET /tasks?page=1&pageSize=20
    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var tasks = await _taskService.GetAllTasks(page, pageSize);
        var taskDtos = _mapper.Map<IEnumerable<TaskItemDto>>(tasks);
        return Ok(taskDtos);
    }

    // GET /tasks/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTaskById(int id)
    {
        var task = await _taskService.GetTaskById(id);
        if (task == null)
        {
            return NotFound();
        }
        var taskDto = _mapper.Map<TaskItemDto>(task);
        return Ok(taskDto);
    }

    // POST /tasks
    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskItemDto createTaskDto)
    {
        var task = _mapper.Map<TaskItem>(createTaskDto);
        var createdTask = await _taskService.CreateTaskItem(task);
        var taskDto = _mapper.Map<TaskItemDto>(createdTask);

        return CreatedAtAction(nameof(GetTaskById), new { id = taskDto.Id }, taskDto);
    }

    // PUT /tasks/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskItemDto updateTaskDto)
    {
        var taskToUpdate = await _taskService.GetTaskById(id);
        if (taskToUpdate == null)
        {
            return NotFound();
        }

        _mapper.Map(updateTaskDto, taskToUpdate);
        await _taskService.UpdateTaskItem(id, taskToUpdate);

        return NoContent();
    }

    // DELETE /tasks/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var success = await _taskService.DeleteTaskItem(id);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}

