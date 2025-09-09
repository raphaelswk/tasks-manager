/**
 * Main Task List Page
 * * This is the primary view of the application. It displays a list of tasks,
 * provides filtering options, and implements the advanced features:
 * 1. A dynamic pie chart visualizing task statuses.
 * 2. Lazy-loading (infinite scrolling) for the task list.
 */
"use client";

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { TaskItem, Status, Priority } from './types';
import { getTasks } from '../lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'next/navigation';

// --- Components defined within the page for conciseness ---

/**
 * Pie Chart component for visualizing task status distribution.
 */
const StatusPieChart = ({ tasks }: { tasks: TaskItem[] }) => {
    const chartRef = useRef<am5.Root | null>(null);

    useEffect(() => {
        let root = am5.Root.new("chartdiv");
        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(
            am5percent.PieChart.new(root, {
                layout: root.verticalLayout,
                innerRadius: am5.percent(50)
            })
        );

        let series = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "category",
                alignLabels: false
            })
        );

        series.labels.template.setAll({
            textType: "circular",
            centerX: 0,
            centerY: 0,
            fontSize: 12,
        });

        // Calculate data
        const statusCounts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as Record<Status, number>);

        const chartData = Object.entries(statusCounts).map(([status, count]) => ({
            category: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
        }));

        series.data.setAll(chartData);
        series.appear(1000, 100);
        chart.appear(1000, 100);

        chartRef.current = root;

        return () => {
            root.dispose();
        };
    }, [tasks]);

    return <div id="chartdiv" style={{ width: "100%", height: "300px" }}></div>;
};

/**
 * Represents a single task item in the list.
 */
const TaskCard = ({ task }: { task: TaskItem }) => {
    const router = useRouter();
    
    const priorityColors: Record<Priority, string> = {
        low: "bg-blue-500",
        medium: "bg-yellow-500",
        high: "bg-red-500",
    };

    return (
        <Card onClick={() => router.push(`/tasks/${task.id}/edit`)} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{task.title}</span>
                    <span className={`text-xs text-white px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 break-words">{task.description || "No description"}</p>
                <div className="text-xs text-gray-500 mt-2">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div className="text-xs font-semibold mt-1">Status: {task.status}</div>
            </CardContent>
        </Card>
    );
};


// --- Main Page Component ---

export default function TaskListPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const pageRef = useRef(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<{ priority?: Priority; status?: Status }>({});
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px' // Load more content before reaching the bottom
    });
    const isInitialLoad = useRef(true);

    // Consolidated effect for loading tasks
    useEffect(() => {
        const handleScroll = async () => {
            if (!inView || loading || !hasMore) return;
            
            const currentPage = pageRef.current;
            setLoading(true);

            try {
                const response = await getTasks(currentPage, 10, filters.priority, filters.status);
                setTasks(prev => [...prev, ...response.items]);
                setHasMore(response.hasNextPage);
                pageRef.current = currentPage + 1;
            } catch (error) {
                console.error("Failed to load tasks:", error);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        // Initial load
        if (pageRef.current === 1) {
            handleScroll();
        }
        // Infinite scroll
        else if (inView && !loading && hasMore) {
            handleScroll();
        }
    }, [inView, filters]);

    // When filters change, reset the page
    useEffect(() => {
        pageRef.current = 1;
        setTasks([]);
        setHasMore(true);
    }, [filters]);

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">Task Management System</h1>
            
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle>Task Status Overview</CardTitle></CardHeader>
                    <CardContent>
                        <StatusPieChart tasks={tasks} />
                    </CardContent>
                </Card>
                <div className="lg:col-span-2">
                     <Card>
                        <CardHeader><CardTitle>Controls</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Filter by Priority</label>
                                    <Select onValueChange={(value) => setFilters(f => ({ ...f, priority: value === "all" ? undefined : value as Priority }))}>
                                        <SelectTrigger><SelectValue placeholder="All Priorities" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priorities</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Filter by Status</label>
                                    <Select onValueChange={(value) => setFilters(f => ({ ...f, status: value === "all" ? undefined : value as Status }))}>
                                        <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={() => router.push('/tasks/new')} className="w-full sm:w-auto sm:self-end">Create New Task</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Your Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>

            {loading && (
                <div className="text-center p-4 font-semibold text-gray-600">
                    Loading...
                </div>
            )}

            {hasMore && !loading && (
                <div ref={ref} className="h-10">
                    {/* This is the trigger element for infinite scroll */}
                </div>
            )}
            
            {!hasMore && tasks.length > 0 && (
                 <div className="text-center p-4 text-gray-500">
                    You've reached the end.
                </div>
            )}

             {!hasMore && tasks.length === 0 && !loading && (
                 <div className="text-center p-8 text-gray-500 border-2 border-dashed rounded-lg mt-4">
                    <p className="font-semibold">No tasks found.</p>
                    <p className="text-sm">Try adjusting your filters or creating a new task.</p>
                </div>
            )}
        </div>
    );
}

