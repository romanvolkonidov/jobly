import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });

beforeAll(() => {
  // Set up any global mocks, stubs, or spies
});

afterAll(() => {
  // Clean up any global mocks, stubs, or spies
});
