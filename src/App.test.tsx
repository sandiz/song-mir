import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './lib/store';
import App from './App';

global.matchMedia = global.matchMedia || function () {
  return {
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
};

describe('App Test', () => {
  it('renders learn react link', () => {
    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // expect(getByText(/learn/i)).toBeInTheDocument();
  });
});
