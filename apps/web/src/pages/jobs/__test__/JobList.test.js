jest.mock('axios');
import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import JobList from '../JobList';
import createJobsMockStore from './mockData';


describe('JobList Component', () => {
    const store = createJobsMockStore();

    beforeEach(() => {
        axios.get.mockResolvedValue({
            data: { data: store.getState().jobs.items, total: store.getState().jobs.totalCount }
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
        renderWithProvider(<JobList />);
        expect(await screen.findByText('Job ID')).toBeInTheDocument();
        expect(await screen.findByText('Total Tasks')).toBeInTheDocument();
    });
    it('confirms deletion when delete button in the dialog is clicked', async () => {
        renderWithProvider(<JobList />);
        const deleteButton = await screen.findByTestId('delete-jobs-66eb234f62c61beaed77a9f4');
        userEvent.click(deleteButton);
        expect(await screen.findByText('Confirm Delete')).toBeInTheDocument();
        const confirmDeleteButton = await screen.findByRole('button', { name: 'Delete' });
        userEvent.click(confirmDeleteButton);
    });

});
