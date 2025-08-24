/**
 * Apollo Client Integration Tests
 * Tests the Apollo Client setup and integration with the GraphQL API
 */

import { apolloClient } from './lib/apollo-client.js';
import {
  GET_ALL_FAKULTAS,
  GET_ALL_PRODI,
  GET_ALL_CPL,
  FIND_FAKULTAS_BY_KODE,
  FIND_CPL_BY_DOMAIN
} from './lib/graphql/queries.js';
import {
  CREATE_CPL,
  UPDATE_CPL,
  REMOVE_CPL
} from './lib/graphql/mutations.js';

// Test configuration
const APOLLO_TEST_CONFIG = {
  timeout: 15000,
  verbose: true,
  skipMutations: false,
  testDataCleanup: true
};

// Test results tracking
let apolloTestResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: [],
  timings: {}
};

/**
 * Test runner for Apollo Client tests
 */
async function runApolloTest(testName, testFunction) {
  if (APOLLO_TEST_CONFIG.verbose) {
    console.log(`🧪 Apollo Test: ${testName}`);
  }

  const startTime = Date.now();

  try {
    await testFunction();
    const endTime = Date.now();
    apolloTestResults.passed++;
    apolloTestResults.timings[testName] = endTime - startTime;

    if (APOLLO_TEST_CONFIG.verbose) {
      console.log(`✅ PASSED: ${testName} (${endTime - startTime}ms)`);
    }
  } catch (error) {
    const endTime = Date.now();
    apolloTestResults.failed++;
    apolloTestResults.errors.push({ testName, error: error.message });
    apolloTestResults.timings[testName] = endTime - startTime;

    console.error(`❌ FAILED: ${testName} - ${error.message} (${endTime - startTime}ms)`);
  }
}

/**
 * Test Apollo Client Query functionality
 */
async function testApolloQueries() {
  console.log('\n🔍 APOLLO CLIENT QUERY TESTS');
  console.log('==============================');

  await runApolloTest('Apollo Query - All Fakultas', async () => {
    const result = await apolloClient.query({
      query: GET_ALL_FAKULTAS,
      fetchPolicy: 'network-only'
    });

    if (!result.data || !result.data.allFakultas) {
      throw new Error('Query result is invalid');
    }

    if (!Array.isArray(result.data.allFakultas)) {
      throw new Error('allFakultas should return an array');
    }

    // Test cache
    const cachedResult = await apolloClient.query({
      query: GET_ALL_FAKULTAS,
      fetchPolicy: 'cache-first'
    });

    if (!cachedResult.data || !cachedResult.data.allFakultas) {
      throw new Error('Cached query result is invalid');
    }
  });

  await runApolloTest('Apollo Query - All Prodi', async () => {
    const result = await apolloClient.query({
      query: GET_ALL_PRODI,
      fetchPolicy: 'network-only'
    });

    if (!result.data || !result.data.prodi) {
      throw new Error('Query result is invalid');
    }

    if (!Array.isArray(result.data.prodi)) {
      throw new Error('prodi should return an array');
    }
  });

  await runApolloTest('Apollo Query - All CPL', async () => {
    const result = await apolloClient.query({
      query: GET_ALL_CPL,
      fetchPolicy: 'network-only'
    });

    if (!result.data || !result.data.cpls) {
      throw new Error('Query result is invalid');
    }

    if (!Array.isArray(result.data.cpls)) {
      throw new Error('cpls should return an array');
    }
  });

  await runApolloTest('Apollo Query with Variables - Find Fakultas by Kode', async () => {
    const result = await apolloClient.query({
      query: FIND_FAKULTAS_BY_KODE,
      variables: { kode: 'FTI' },
      fetchPolicy: 'network-only'
    });

    // Note: Result might be null if fakultas not found, which is valid
    if (!result.data) {
      throw new Error('Query result is invalid');
    }
  });

  await runApolloTest('Apollo Query with Variables - Find CPL by Domain', async () => {
    const result = await apolloClient.query({
      query: FIND_CPL_BY_DOMAIN,
      variables: { domain: 'Knowledge' },
      fetchPolicy: 'network-only'
    });

    if (!result.data || !result.data.findCplByDomain) {
      throw new Error('Query result is invalid');
    }

    if (!Array.isArray(result.data.findCplByDomain)) {
      throw new Error('findCplByDomain should return an array');
    }
  });
}

/**
 * Test Apollo Client Mutation functionality
 */
async function testApolloMutations() {
  if (APOLLO_TEST_CONFIG.skipMutations) {
    console.log('\n⚠️  APOLLO MUTATION TESTS SKIPPED (Safety Mode)');
    return;
  }

  console.log('\n✏️  APOLLO CLIENT MUTATION TESTS');
  console.log('==================================');

  let createdCplId = null;

  await runApolloTest('Apollo Mutation - Create CPL', async () => {
    const testCplData = {
      kode: 'CPL-APOLLO-TEST-001',
      deskripsi: 'Apollo Client Test CPL',
      domain: 'Knowledge',
      prodi_id: '1'
    };

    const result = await apolloClient.mutate({
      mutation: CREATE_CPL,
      variables: {
        createCplInput: testCplData
      }
    });

    if (!result.data || !result.data.createCpl || !result.data.createCpl.id) {
      throw new Error('CPL creation failed');
    }

    createdCplId = result.data.createCpl.id;

    // Verify the created CPL
    if (result.data.createCpl.kode !== testCplData.kode) {
      throw new Error('Created CPL kode does not match');
    }

    if (result.data.createCpl.deskripsi !== testCplData.deskripsi) {
      throw new Error('Created CPL deskripsi does not match');
    }
  });

  await runApolloTest('Apollo Mutation - Update CPL', async () => {
    if (!createdCplId) {
      throw new Error('No CPL ID available for update test');
    }

    const updateData = {
      deskripsi: 'Updated Apollo Client Test CPL'
    };

    const result = await apolloClient.mutate({
      mutation: UPDATE_CPL,
      variables: {
        id: createdCplId,
        updateCplInput: updateData
      }
    });

    if (!result.data || !result.data.updateCpl) {
      throw new Error('CPL update failed');
    }

    if (result.data.updateCpl.deskripsi !== updateData.deskripsi) {
      throw new Error('Updated CPL deskripsi does not match');
    }
  });

  // Cleanup
  if (APOLLO_TEST_CONFIG.testDataCleanup && createdCplId) {
    await runApolloTest('Apollo Mutation - Remove CPL (Cleanup)', async () => {
      const result = await apolloClient.mutate({
        mutation: REMOVE_CPL,
        variables: {
          id: createdCplId
        }
      });

      // The remove mutation might return just a boolean or null
      if (result.errors && result.errors.length > 0) {
        throw new Error('CPL removal failed');
      }
    });
  }
}

/**
 * Test Apollo Client Cache functionality
 */
async function testApolloCache() {
  console.log('\n🗄️  APOLLO CLIENT CACHE TESTS');
  console.log('===============================');

  await runApolloTest('Cache - Cache First Policy', async () => {
    // First request to populate cache
    const firstResult = await apolloClient.query({
      query: GET_ALL_FAKULTAS,
      fetchPolicy: 'network-only'
    });

    // Second request from cache
    const secondResult = await apolloClient.query({
      query: GET_ALL_FAKULTAS,
      fetchPolicy: 'cache-first'
    });

    if (JSON.stringify(firstResult.data) !== JSON.stringify(secondResult.data)) {
      throw new Error('Cached data does not match network data');
    }
  });

  await runApolloTest('Cache - Cache and Network Policy', async () => {
    const result = await apolloClient.query({
      query: GET_ALL_PRODI,
      fetchPolicy: 'cache-and-network'
    });

    if (!result.data || !result.data.prodi) {
      throw new Error('Cache and network query failed');
    }
  });

  await runApolloTest('Cache - Reset Cache', async () => {
    // Clear cache
    await apolloClient.resetStore();

    // Query after cache reset
    const result = await apolloClient.query({
      query: GET_ALL_CPL,
      fetchPolicy: 'cache-first'
    });

    if (!result.data || !result.data.cpls) {
      throw new Error('Query after cache reset failed');
    }
  });
}

/**
 * Test Apollo Client Error Handling
 */
async function testApolloErrorHandling() {
  console.log('\n🚨 APOLLO CLIENT ERROR HANDLING TESTS');
  console.log('=======================================');

  await runApolloTest('Error Handling - Invalid Query', async () => {
    const invalidQuery = `
      query {
        invalidField {
          id
        }
      }
    `;

    try {
      await apolloClient.query({
        query: invalidQuery,
        errorPolicy: 'none'
      });
      throw new Error('Should have thrown an error for invalid query');
    } catch (error) {
      if (!error.graphQLErrors || error.graphQLErrors.length === 0) {
        throw new Error('Expected GraphQL errors for invalid query');
      }
    }
  });

  await runApolloTest('Error Handling - Missing Variables', async () => {
    try {
      await apolloClient.query({
        query: FIND_FAKULTAS_BY_KODE,
        // Missing required variables
        errorPolicy: 'none'
      });
      throw new Error('Should have thrown an error for missing variables');
    } catch (error) {
      if (!error.graphQLErrors || error.graphQLErrors.length === 0) {
        throw new Error('Expected GraphQL errors for missing variables');
      }
    }
  });

  await runApolloTest('Error Handling - Error Policy All', async () => {
    const invalidQuery = `
      query {
        invalidField {
          id
        }
      }
    `;

    const result = await apolloClient.query({
      query: invalidQuery,
      errorPolicy: 'all'
    });

    if (!result.errors || result.errors.length === 0) {
      throw new Error('Expected errors with errorPolicy: all');
    }
  });
}

/**
 * Test Apollo Client Performance
 */
async function testApolloPerformance() {
  console.log('\n⚡ APOLLO CLIENT PERFORMANCE TESTS');
  console.log('===================================');

  await runApolloTest('Performance - Batch Queries', async () => {
    const startTime = Date.now();

    const promises = [
      apolloClient.query({ query: GET_ALL_FAKULTAS, fetchPolicy: 'network-only' }),
      apolloClient.query({ query: GET_ALL_PRODI, fetchPolicy: 'network-only' }),
      apolloClient.query({ query: GET_ALL_CPL, fetchPolicy: 'network-only' })
    ];

    await Promise.all(promises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    if (totalTime > 10000) { // 10 seconds
      throw new Error(`Batch queries too slow: ${totalTime}ms`);
    }

    console.log(`   Batch queries completed in: ${totalTime}ms`);
  });

  await runApolloTest('Performance - Cache vs Network', async () => {
    // Network request
    const networkStart = Date.now();
    await apolloClient.query({
      query: GET_ALL_FAKULTAS,
      fetchPolicy: 'network-only'
    });
    const networkTime = Date.now() - networkStart;

    // Cache request
    const cacheStart = Date.now();
    await apolloClient.query({
      query: GET_ALL_FAKULTAS,
      fetchPolicy: 'cache-first'
    });
    const cacheTime = Date.now() - cacheStart;

    console.log(`   Network time: ${networkTime}ms, Cache time: ${cacheTime}ms`);

    if (cacheTime >= networkTime) {
      console.warn('   ⚠️  Cache not faster than network (this might be normal on first run)');
    }
  });
}

/**
 * Main Apollo Client test runner
 */
async function runApolloTests() {
  console.log('🚀 STARTING APOLLO CLIENT TESTS');
  console.log('=================================');
  console.log(`Skip Mutations: ${APOLLO_TEST_CONFIG.skipMutations}`);
  console.log(`Test Data Cleanup: ${APOLLO_TEST_CONFIG.testDataCleanup}`);
  console.log(`Verbose: ${APOLLO_TEST_CONFIG.verbose}`);
  console.log('');

  const startTime = Date.now();

  try {
    await testApolloQueries();
    await testApolloMutations();
    await testApolloCache();
    await testApolloErrorHandling();
    await testApolloPerformance();
  } catch (error) {
    console.error('❌ Apollo test suite failed:', error.message);
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;

  console.log('\n📊 APOLLO CLIENT TEST RESULTS');
  console.log('===============================');
  console.log(`✅ Passed: ${apolloTestResults.passed}`);
  console.log(`❌ Failed: ${apolloTestResults.failed}`);
  console.log(`⏭️  Skipped: ${apolloTestResults.skipped}`);
  console.log(`⏱️  Total Time: ${totalTime}ms`);

  if (apolloTestResults.passed + apolloTestResults.failed > 0) {
    const successRate = (apolloTestResults.passed / (apolloTestResults.passed + apolloTestResults.failed)) * 100;
    console.log(`🎯 Success Rate: ${successRate.toFixed(1)}%`);
  }

  // Show slowest tests
  const sortedTimings = Object.entries(apolloTestResults.timings)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  if (sortedTimings.length > 0) {
    console.log('\n🐌 Slowest Tests:');
    sortedTimings.forEach(([testName, time]) => {
      console.log(`   - ${testName}: ${time}ms`);
    });
  }

  if (apolloTestResults.errors.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    apolloTestResults.errors.forEach(({ testName, error }) => {
      console.log(`   - ${testName}: ${error}`);
    });
  }

  if (apolloTestResults.failed === 0) {
    console.log('\n🎉 ALL APOLLO CLIENT TESTS PASSED!');
  } else {
    console.log(`\n⚠️  ${apolloTestResults.failed} APOLLO CLIENT TESTS FAILED`);
  }

  return apolloTestResults;
}

// Export for module usage
export {
  runApolloTests,
  testApolloQueries,
  testApolloMutations,
  testApolloCache,
  testApolloErrorHandling,
  testApolloPerformance,
  APOLLO_TEST_CONFIG,
  apolloTestResults
};

// Auto-run if called directly
if (typeof window !== 'undefined') {
  console.log('Apollo Client Test Suite loaded. Run runApolloTests() to start testing.');
}
