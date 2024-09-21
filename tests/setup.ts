// mcbcMERNts/tests/setup.ts

import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { expect, afterEach } from 'vitest';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Setup MSW
const server = setupServer();
server.listen();
afterEach(() => server.resetHandlers());

export { server };
