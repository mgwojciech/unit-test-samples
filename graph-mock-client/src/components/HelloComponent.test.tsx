import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { M365Provider } from '../context/M365Context';
import { HelloComponent } from './HelloComponent';
import { MockFileHttpClient } from 'mgwdev-m365-helpers/lib-commonjs/dal/http/MockFileHttpClient';
import * as mock from "../mocks/graph-proxy-mocks.json";
jest.mock('../context/M365Context', () => {
  return {
    useM365: () => {
      return {
        graphClient: new MockFileHttpClient(mock as any)
      }
    }
  }
});

test('renders mocked user name', async () => {

  await act(async ()=>render(<HelloComponent />));
  const linkElement = screen.getByText(/Adele Vance/i);
  expect(linkElement).toBeInTheDocument();
});
