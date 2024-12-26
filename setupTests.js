import { configure } from '@testing-library/react';
import '@testing-library/jest-dom';

configure({ testIdAttribute: 'data-testid' });

beforeAll(() => {
  // Set up global mocks, stubs, or spies
});

afterAll(() => {  
  // Clean up global mocks, stubs, or spies
});