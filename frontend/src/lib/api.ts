/**
 * API Client for interacting with the .NET backend.
 * * This file centralizes all the fetch calls to the API, providing
 * a clean and reusable way to manage data.
 */
import { TaskItem, CreateTaskDto, UpdateTaskDto, Priority, Status } from "@/app/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7123';

type PaginatedResponse<T> = {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export async function getTasks(page = 1, pageSize = 10, priority?: Priority, status?: Status): Promise<PaginatedResponse<TaskItem>> {
    const params = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: pageSize.toString(),
    });
    if (priority) params.append('priority', priority);
    if (status) params.append('status', status);

    console.log(`Fetching tasks from: ${API_BASE_URL}/TaskItems?${params.toString()}`);
    const response = await fetch(`${API_BASE_URL}/TaskItems?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    
    const data = await response.json();
    return {
        items: data.items,
        totalCount: data.totalCount,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPreviousPage: data.hasPreviousPage
    };
}

export async function getTask(id: number): Promise<TaskItem> {
    const response = await fetch(`${API_BASE_URL}/TaskItems/${id}`);
    if (!response.ok) throw new Error("Failed to fetch task");
    return response.json();
}

export async function createTask(task: CreateTaskDto): Promise<TaskItem> {    
    const response = await fetch(`${API_BASE_URL}/TaskItems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
}

export async function updateTask(id: number, task: UpdateTaskDto): Promise<Response> {
    const response = await fetch(`${API_BASE_URL}/TaskItems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response;
}

export async function deleteTask(id: number): Promise<Response> {
    const response = await fetch(`${API_BASE_URL}/TaskItems/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error("Failed to delete task");
    return response;
}
