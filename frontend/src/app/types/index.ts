/**
 * TypeScript type definitions that mirror the DTOs from the .NET backend.
 * This ensures type safety throughout the frontend application.
 */
export type Status = "pending" | "in progress" | "completed" | "archived";
export type Priority = "low" | "medium" | "high";

export interface TaskItem {
    id: number;
    title: string;
    description?: string;
    priority: Priority;
    status: Status;
    dueDate: string; // ISO string format
}

export type CreateTaskDto = Omit<TaskItem, "id">;
export type UpdateTaskDto = Omit<TaskItem, "id">;
