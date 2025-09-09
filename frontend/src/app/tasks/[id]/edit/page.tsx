/**
 * Edit Task Page
 * * This is a dynamic page that fetches a single task by its ID and allows
 * for editing and deletion.
 */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getTask, updateTask, deleteTask } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]),
    status: z.enum(["pending", "inprogress", "completed", "archived"]),
    dueDate: z.date().refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "A due date is required.",
    }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const taskId = parseInt(resolvedParams.id, 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState<TaskFormValues | null>(null);
    
    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        values: initialData || undefined // Set initial values when data is available
    });

    useEffect(() => {
        if (isNaN(taskId)) {
            router.push('/');
            return;
        }
        const fetchTask = async () => {
            try {
                const task = await getTask(taskId);
                const formattedTask = {
                    title: task.title,
                    description: task.description,
                    // Ensure consistent case by converting to lowercase
                    priority: task.priority.toLowerCase() as "low" | "medium" | "high",
                    status: task.status.toLowerCase() as "pending" | "inprogress" | "completed" | "archived",
                    dueDate: new Date(task.dueDate),
                };
                setInitialData(formattedTask);
                form.reset(formattedTask);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch task", error);
                router.push('/');
            }
        };
        fetchTask();
    }, [taskId, router]);

    const onSubmit = async (data: TaskFormValues) => {
        await updateTask(taskId, { ...data, dueDate: data.dueDate.toISOString() });
        router.push("/");
        router.refresh();
    };

    const handleDelete = async () => {
        await deleteTask(taskId);
        router.push("/");
        router.refresh();
    };

    if (isLoading) {
        return <div className="container mx-auto p-4 text-center">Loading...</div>;
    }

    // Modify the Select components to include defaultValue
    const PrioritySelect = ({ field }: { field: any }) => (
        <Select 
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
        >
            <FormControl>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
            </SelectContent>
        </Select>
    );

    const StatusSelect = ({ field }: { field: any }) => (
        <Select 
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
        >
            <FormControl>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
        </Select>
    );

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Edit Task</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                             <div className="grid sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Priority</FormLabel>
                                            <PrioritySelect field={field} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <StatusSelect field={field} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                             <FormField
                                control={form.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Due Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                            >
                                            {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-between pt-4">
                                <Button type="button" variant="destructive" onClick={() => setShowDeleteModal(true)}>Delete</Button>
                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the task.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Yes, Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}