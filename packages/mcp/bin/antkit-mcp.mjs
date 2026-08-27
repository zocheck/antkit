#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { createServer } from '../src/server.mjs';

/**
 * stdout is the JSON-RPC channel. Anything printed there that is not a
 * protocol message corrupts the stream and the client drops the connection —
 * so every message this process writes, including the failures below, goes to
 * stderr.
 */
try {
  const server = await createServer();
  await server.connect(new StdioServerTransport());
} catch (error) {
  console.error(`antkit-mcp: ${error.message}`);
  process.exit(1);
}
