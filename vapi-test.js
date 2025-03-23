// This is a test file to check VAPI API usage
const { createVapiClient } = require('@vapi-ai/web');

// Example usage based on documentation
const client = createVapiClient({
  publicKey: 'your-public-key',
});

// Check available methods
console.log(Object.keys(client));
