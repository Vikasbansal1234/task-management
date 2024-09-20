jest.mock('axios');
import axios from 'axios';
import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../TaskList';
import createTaskMockStore from './mockdata';

describe('TaskList Component', () => {
    const store = createTaskMockStore();

    beforeEach(() => {
        axios.get.mockResolvedValue({
            data: { data: store.getState().tasks.items, total: store.getState().tasks.totalCount }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderWithProvider = (component) => render(
        <Provider store={store}>
            {component}
        </Provider>
    );

    it('renders TaskList', async () => {
        renderWithProvider(<TaskList />);
        expect(await screen.findByText('Task Management')).toBeInTheDocument();
        expect(await screen.findByText('Add New Task')).toBeInTheDocument();
    });

    it('opens new task modal on button click', async () => {
        renderWithProvider(<TaskList />);
        const addButton = await screen.findByRole('button', { name: /Add New Task/i });
        userEvent.click(addButton);
        expect(await screen.findByText('Add New Task', { selector: 'h2' })).toBeInTheDocument();
        expect(await screen.findByLabelText('Title')).toBeInTheDocument();
    });

    it('handles file upload', async () => {
        renderWithProvider(<TaskList />);
        const fileInput = await screen.findByLabelText('Import Tasks');
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        userEvent.upload(fileInput, file);
    });

    it('confirms deletion when delete button is clicked', async () => {
        renderWithProvider(<TaskList />);
        const deleteButton = await screen.findByTestId('delete-task-66eb235162c61beaed77a9f8');
        userEvent.click(deleteButton);
        expect(await screen.findByText('Confirm Delete')).toBeInTheDocument();
    });
});
