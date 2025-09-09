/**
 * Example Unit Test for the Task List Page.
 * * This test demonstrates how to test a component that fetches data.
 * It uses Jest to mock the API service, allowing us to test the component's
 * rendering logic in isolation without making real network requests.
 */
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import TaskListPage from '../src/app/page';
import * as api from '../src/lib/api';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn()
    }),
}));

// Mock the API module
jest.mock('../lib/api');
const mockedGetTasks = api.getTasks as jest.Mock;

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;


describe('TaskListPage', () => {
    it('renders tasks fetched from the API', async () => {
        const mockTasks = {
            tasks: [
                { id: 1, title: 'Test Task 1', description: 'Desc 1', priority: 'high', status: 'pending', dueDate: new Date().toISOString() },
                { id: 2, title: 'Test Task 2', description: 'Desc 2', priority: 'low', status: 'completed', dueDate: new Date().toISOString() },
            ],
            hasNextPage: false
        };

        mockedGetTasks.mockResolvedValue(mockTasks);

        render(<TaskListPage />);

        // Wait for the tasks to be rendered
        await waitFor(() => {
            expect(screen.getByText('Test Task 1')).toBeInTheDocument();
            expect(screen.getByText('Test Task 2')).toBeInTheDocument();
        });
        
        expect(mockedGetTasks).toHaveBeenCalledTimes(1);
    });

    it('displays a message when no tasks are found', async () => {
        mockedGetTasks.mockResolvedValue({ tasks: [], hasNextPage: false });

        render(<TaskListPage />);

        await waitFor(() => {
            expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
        });
    });
});
