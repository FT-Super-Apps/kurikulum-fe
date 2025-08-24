# GraphQL Testing Suite

Comprehensive testing suite for the Kurikulum Dashboard GraphQL API. This suite includes multiple test files and utilities to thoroughly test all GraphQL operations.

## 📁 Test Files Overview

### 1. `test-graphql-comprehensive.js`
Complete testing suite that covers all GraphQL operations:
- **Schema Introspection**: Tests GraphQL schema structure
- **Query Tests**: Tests all available queries (Fakultas, Prodi, CPL, CPMK, etc.)
- **Mutation Tests**: Tests all CRUD operations (Create, Update, Delete)
- **Error Handling**: Tests invalid queries, missing variables, etc.
- **Performance Tests**: Response time and concurrent request testing

### 2. `test-apollo-client.js`
Apollo Client specific integration tests:
- **Query Tests**: Tests Apollo Client query functionality
- **Mutation Tests**: Tests Apollo Client mutation functionality
- **Cache Tests**: Tests Apollo Client caching mechanisms
- **Error Handling**: Tests Apollo Client error policies
- **Performance Tests**: Tests batch queries and cache vs network performance

### 3. `test-runner.js`
Flexible test runner with command-line options:
- **Selective Testing**: Run specific types of tests
- **Safety Mode**: Disabled mutations by default
- **Configurable**: Various options for different testing scenarios

### 4. `test-schema.js` & `test-cpmk-schema.js`
Simple schema exploration tests (existing files)

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Basic Tests (Safe Mode - No Mutations)
```bash
npm test
```

### Run All Tests (Including Mutations)
```bash
npm run test:all
```

## 📋 Available Test Commands

### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run safe tests (queries, schema, errors, performance - NO mutations) |
| `npm run test:all` | Run all tests including mutations |
| `npm run test:queries` | Run only query tests |
| `npm run test:schema` | Run only schema introspection tests |
| `npm run test:mutations` | Run only mutation tests (⚠️ use with caution) |
| `npm run test:performance` | Run only performance tests |
| `npm run test:graphql` | Run comprehensive GraphQL tests directly |
| `npm run test:apollo` | Run Apollo Client integration tests |

### Command Line Options

Using `test-runner.js` directly:

```bash
# Basic usage
node test-runner.js --safe              # Safe mode (no mutations)
node test-runner.js --all               # All tests
node test-runner.js --mutations-enabled # Enable mutations

# Specific test types
node test-runner.js --schema            # Schema tests only
node test-runner.js --queries           # Query tests only
node test-runner.js --errors            # Error handling tests only
node test-runner.js --performance       # Performance tests only

# Combinations
node test-runner.js --queries --performance --quiet
node test-runner.js --schema --errors --verbose

# Help
node test-runner.js --help
```

## 🔧 Configuration

### Test Configuration Options

Each test file has configuration options at the top:

```javascript
// test-graphql-comprehensive.js
const TEST_CONFIG = {
  timeout: 10000,           // Test timeout in ms
  retries: 3,               // Number of retries for failed tests
  verbose: true,            // Detailed output
  skipMutations: false      // Skip mutation tests for safety
};

// test-apollo-client.js
const APOLLO_TEST_CONFIG = {
  timeout: 15000,           // Test timeout in ms
  verbose: true,            // Detailed output
  skipMutations: false,     // Skip mutation tests
  testDataCleanup: true     // Clean up test data after mutations
};
```

### Environment Configuration

The tests connect to:
```
GraphQL Endpoint: https://kurikulum.if.unismuh.ac.id/graphql
```

To change the endpoint, modify the `GRAPHQL_ENDPOINT` constant in each test file.

## 📊 Test Categories

### 1. Schema Tests
- Verify GraphQL schema structure
- Check available query and mutation fields
- Validate type definitions

### 2. Query Tests
Tests for all query operations:
- `allFakultas` - Get all faculties
- `prodi` - Get all study programs
- `cpls` - Get all learning outcomes
- `mataKuliah` - Get all courses
- `cpmk` - Get all course learning outcomes
- `stakeholders` - Get all stakeholders
- `surveys` - Get all surveys
- And many more with various filters and parameters

### 3. Mutation Tests ⚠️
Tests for all CRUD operations:
- **Create**: Add new records
- **Update**: Modify existing records
- **Delete**: Remove records
- **Cleanup**: Automatic test data cleanup

**⚠️ Safety Notice**: Mutation tests modify the database. They are disabled by default. Only enable when testing against development/staging environments.

### 4. Error Handling Tests
- Invalid query fields
- Missing required variables
- Malformed requests
- Network error simulation

### 5. Performance Tests
- Response time measurement
- Concurrent request handling
- Cache vs network performance
- Large query optimization

## 🛡️ Safety Features

### Mutation Safety
- **Disabled by default**: Mutations are disabled unless explicitly enabled
- **Test data cleanup**: Automatic cleanup of created test data
- **Clear warnings**: Obvious warnings when mutations are enabled

### Test Data
All mutation tests use clearly marked test data:
- Prefixed with "TEST" or "Test"
- Temporary data that gets cleaned up
- Non-production values

### Example Test Data:
```javascript
const TEST_DATA = {
  cpl: {
    kode: 'CPL-TEST-001',
    deskripsi: 'Test CPL description',
    domain: 'Knowledge'
  },
  stakeholder: {
    nama: 'Test Stakeholder',
    tipe: 'Industry',
    organisasi: 'Test Company'
  }
  // ... etc
};
```

## 📈 Test Results

### Example Output
```
🚀 STARTING GRAPHQL TEST RUNNER
=================================
Schema Tests: ✅
Query Tests: ✅
Mutation Tests: ❌
Error Tests: ✅
Performance Tests: ✅
Verbose: true

⚠️  Mutation tests are DISABLED for safety

📋 SCHEMA TESTS
===============
✅ PASSED: Schema Query Type (45ms)
✅ PASSED: Schema Mutation Type (38ms)

🔍 QUERY TESTS
===============
✅ PASSED: All Fakultas (127ms)
✅ PASSED: All Prodi (98ms)
✅ PASSED: All CPL (145ms)
...

📊 TEST RESULTS
================
✅ Passed: 23
❌ Failed: 0
⏭️  Skipped: 0
🎯 Success Rate: 100.0%
⏱️  Total Time: 3,247ms

🎉 ALL TESTS PASSED!
```

## 🔍 Troubleshooting

### Common Issues

1. **Network Connection**
   ```
   Error: Request failed: fetch failed
   ```
   - Check internet connection
   - Verify GraphQL endpoint is accessible

2. **GraphQL Errors**
   ```
   Error: GraphQL Error: [{"message":"Field 'invalidField' is not defined"}]
   ```
   - This is expected for error handling tests
   - Actual schema errors indicate API issues

3. **Timeout Errors**
   ```
   Error: Query too slow: 6000ms
   ```
   - Increase timeout in configuration
   - Check network performance
   - Verify API server performance

4. **Missing Dependencies**
   ```
   Error: Cannot find module 'node-fetch'
   ```
   - Run `npm install` to install dependencies

### Debug Mode

Enable verbose logging:
```javascript
TEST_CONFIG.verbose = true;
```

Or use command line:
```bash
node test-runner.js --verbose
```

## 🤝 Contributing

### Adding New Tests

1. **For new queries**: Add tests to the `testQueries()` function
2. **For new mutations**: Add tests to the `testMutations()` function
3. **For error cases**: Add tests to the `testErrorHandling()` function

### Test Structure
```javascript
await runTest('Test Name', async () => {
  const query = `...`;
  const data = await makeGraphQLRequest(query, variables);
  
  // Assertions
  if (!data.expectedField) {
    throw new Error('Expected field not found');
  }
});
```

### Safety Guidelines
- Always mark test data clearly
- Include cleanup for mutation tests
- Test against development environment first
- Document any new test configurations

## 📝 License

This testing suite is part of the Kurikulum Dashboard project and follows the same license terms.
