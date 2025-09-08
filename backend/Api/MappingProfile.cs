using AutoMapper;
using Api.Dtos;
using Domain.Entities;

namespace Api;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Maps from the domain entity to the DTO for responses
        CreateMap<TaskItem, TaskItemDto>();

        // Maps from the create DTO to the domain entity for creating tasks
        CreateMap<CreateTaskItemDto, TaskItem>();
        
        // Maps from the update DTO to the domain entity for updating tasks
        CreateMap<UpdateTaskItemDto, TaskItem>();
    }
}

