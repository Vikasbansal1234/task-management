import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<Provider store={store}>
      <App />
    </Provider>
    );
  });
});
