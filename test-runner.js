/**
 * Simple Test Runner for GraphQL Tests
 * Provides options to run different types of tests
 */

// Check if we're in Node.js environment
const isNode = typeof module !== 'undefined' && module.exports;

// Import fetch for Node.js if needed
if (isNode && typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

// Test configuration
const TEST_RUNNER_CONFIG = {
  runSchemaTests: true,
  runQueryTests: true,
  runMutationTests: false, // Default to false for safety
  runErrorTests: true,
  runPerformanceTests: true,
  verbose: true,
  timeout: 30000, // 30 seconds total timeout
};

/**
 * Display test runner help
 */
function showHelp() {
  console.log(`
🧪 GraphQL Test Runner
======================

Usage:
  node test-runner.js [options]

Options:
  --schema          Run schema introspection tests only
  --queries         Run query tests only  
  --mutations       Run mutation tests only (use with caution!)
  --errors          Run error handling tests only
  --performance     Run performance tests only
  --all             Run all tests (default)
  --safe            Run all tests except mutations
  --mutations-enabled   Enable mutation tests (disabled by default)
  --quiet           Reduce output verbosity
  --help            Show this help message

Examples:
  node test-runner.js --safe                    # Run all tests except mutations
  node test-runner.js --queries --performance   # Run only query and performance tests
  node test-runner.js --mutations-enabled --all # Run all tests including mutations
  node test-runner.js --schema                  # Run only schema tests

Safety Note:
  Mutation tests are disabled by default to prevent accidental data modification.
  Use --mutations-enabled flag to enable them.
`);
}

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const config = { ...TEST_RUNNER_CONFIG };

  if (args.includes('--help')) {
    showHelp();
    return null;
  }

  if (args.includes('--quiet')) {
    config.verbose = false;
  }

  if (args.includes('--mutations-enabled')) {
    config.runMutationTests = true;
  }

  // Specific test type flags
  const hasSpecificFlags = args.some(arg =>
    ['--schema', '--queries', '--mutations', '--errors', '--performance'].includes(arg)
  );

  if (hasSpecificFlags) {
    // Disable all by default, then enable specific ones
    config.runSchemaTests = false;
    config.runQueryTests = false;
    config.runMutationTests = false;
    config.runErrorTests = false;
    config.runPerformanceTests = false;

    if (args.includes('--schema')) config.runSchemaTests = true;
    if (args.includes('--queries')) config.runQueryTests = true;
    if (args.includes('--mutations')) config.runMutationTests = true;
    if (args.includes('--errors')) config.runErrorTests = true;
    if (args.includes('--performance')) config.runPerformanceTests = true;
  }

  if (args.includes('--safe')) {
    config.runMutationTests = false;
  }

  if (args.includes('--all')) {
    config.runSchemaTests = true;
    config.runQueryTests = true;
    config.runErrorTests = true;
    config.runPerformanceTests = true;
    // Keep mutation setting as is (don't force enable)
  }

  return config;
}

/**
 * Load and run comprehensive tests
 */
async function runTestsWithConfig(config) {
  console.log('🚀 STARTING GRAPHQL TEST RUNNER');
  console.log('=================================');
  console.log(`Schema Tests: ${config.runSchemaTests ? '✅' : '❌'}`);
  console.log(`Query Tests: ${config.runQueryTests ? '✅' : '❌'}`);
  console.log(`Mutation Tests: ${config.runMutationTests ? '✅' : '❌'}`);
  console.log(`Error Tests: ${config.runErrorTests ? '✅' : '❌'}`);
  console.log(`Performance Tests: ${config.runPerformanceTests ? '✅' : '❌'}`);
  console.log(`Verbose: ${config.verbose}`);
  console.log('');

  if (!config.runMutationTests) {
    console.log('⚠️  Mutation tests are DISABLED for safety');
    console.log('   Use --mutations-enabled flag to enable them\n');
  }

  const startTime = Date.now();

  try {
    // For Node.js, we need to load the test functions differently
    if (isNode) {
      // Use require or dynamic import
      const { runComprehensiveTests } = await loadTestModule();

      // Override test configuration
      const testConfig = {
        skipMutations: !config.runMutationTests,
        verbose: config.verbose,
        runSchema: config.runSchemaTests,
        runQueries: config.runQueryTests,
        runErrors: config.runErrorTests,
        runPerformance: config.runPerformanceTests,
      };

      await runComprehensiveTests(testConfig);
    } else {
      // Browser environment - assume test functions are already loaded
      console.log('Browser environment detected. Make sure to load test-graphql-comprehensive.js first.');
    }
  } catch (error) {
    console.error('❌ Test runner failed:', error.message);
    return false;
  }

  const endTime = Date.now();
  console.log(`\n⏱️  Total test runner time: ${endTime - startTime}ms`);
  return true;
}

/**
 * Load test module for Node.js
 */
async function loadTestModule() {
  // Simplified implementation - you might need to adjust based on your setup
  const GRAPHQL_ENDPOINT = 'https://kurikulum.if.unismuh.ac.id/graphql';

  // Re-implement key test functions here for Node.js compatibility
  const testResults = { passed: 0, failed: 0, skipped: 0, errors: [] };

  async function makeGraphQLRequest(query, variables = {}) {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(result.errors)}`);
      }

      return result.data;
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  async function runTest(testName, testFunction, config) {
    if (config.verbose) {
      console.log(`🧪 Running: ${testName}`);
    }

    try {
      await testFunction();
      testResults.passed++;
      if (config.verbose) {
        console.log(`✅ PASSED: ${testName}`);
      }
    } catch (error) {
      testResults.failed++;
      testResults.errors.push({ testName, error: error.message });
      console.error(`❌ FAILED: ${testName} - ${error.message}`);
    }
  }

  async function runComprehensiveTests(config) {
    // Schema tests
    if (config.runSchema) {
      console.log('\n📋 SCHEMA TESTS');
      console.log('===============');

      await runTest('Schema Query Type', async () => {
        const query = `
          query {
            __schema {
              queryType {
                fields {
                  name
                }
              }
            }
          }
        `;
        const data = await makeGraphQLRequest(query);
        if (!data.__schema || !data.__schema.queryType) {
          throw new Error('Schema query type not found');
        }
      }, config);
    }

    // Query tests
    if (config.runQueries) {
      console.log('\n🔍 QUERY TESTS');
      console.log('===============');

      await runTest('All Fakultas', async () => {
        const query = `
          query {
            allFakultas {
              id
              kode
              nama
            }
          }
        `;
        const data = await makeGraphQLRequest(query);
        if (!Array.isArray(data.allFakultas)) {
          throw new Error('allFakultas should return an array');
        }
      }, config);

      await runTest('All Prodi', async () => {
        const query = `
          query {
            prodi {
              id
              kode
              nama
            }
          }
        `;
        const data = await makeGraphQLRequest(query);
        if (!Array.isArray(data.prodi)) {
          throw new Error('prodi should return an array');
        }
      }, config);

      await runTest('All CPL', async () => {
        const query = `
          query {
            cpls {
              id
              kode
              deskripsi
            }
          }
        `;
        const data = await makeGraphQLRequest(query);
        if (!Array.isArray(data.cpls)) {
          throw new Error('cpls should return an array');
        }
      }, config);
    }

    // Error tests
    if (config.runErrors) {
      console.log('\n🚨 ERROR TESTS');
      console.log('===============');

      await runTest('Invalid Query Field', async () => {
        const query = `
          query {
            invalidField {
              id
            }
          }
        `;
        try {
          await makeGraphQLRequest(query);
          throw new Error('Should have thrown an error');
        } catch (error) {
          if (!error.message.includes('GraphQL Error')) {
            throw error;
          }
        }
      }, config);
    }

    // Performance tests
    if (config.runPerformance) {
      console.log('\n⚡ PERFORMANCE TESTS');
      console.log('====================');

      await runTest('Response Time', async () => {
        const startTime = Date.now();
        const query = `
          query {
            allFakultas { id nama }
            prodi { id nama }
          }
        `;
        await makeGraphQLRequest(query);
        const responseTime = Date.now() - startTime;

        if (responseTime > 5000) {
          throw new Error(`Query too slow: ${responseTime}ms`);
        }
        console.log(`   Response time: ${responseTime}ms`);
      }, config);
    }

    // Print results
    console.log('\n📊 TEST RESULTS');
    console.log('================');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`⏭️  Skipped: ${testResults.skipped}`);

    if (testResults.errors.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      testResults.errors.forEach(({ testName, error }) => {
        console.log(`   - ${testName}: ${error}`);
      });
    }

    return testResults;
  }

  return { runComprehensiveTests };
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const config = parseArgs(args);

  if (!config) {
    return; // Help was shown
  }

  const success = await runTestsWithConfig(config);

  if (isNode) {
    process.exit(success ? 0 : 1);
  }
}

// Run if called directly
if (isNode && require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Export for module usage
if (isNode) {
  module.exports = {
    runTestsWithConfig,
    parseArgs,
    showHelp,
    TEST_RUNNER_CONFIG
  };
}
