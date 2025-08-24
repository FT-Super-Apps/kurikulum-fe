/**
 * Demo Script - Quick GraphQL API Test
 * A simple demonstration of how to test the GraphQL API
 */

const GRAPHQL_ENDPOINT = 'https://kurikulum.if.unismuh.ac.id/graphql';

// Simple fetch wrapper for GraphQL requests
async function queryGraphQL(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Request Error:', error.message);
    return null;
  }
}

// Demo function to test basic queries
async function demoBasicQueries() {
  console.log('🎯 DEMO: Basic GraphQL Queries');
  console.log('==============================\n');

  // Test 1: Get all faculties
  console.log('1. Testing allFakultas query...');
  const fakultasData = await queryGraphQL(`
    query {
      allFakultas {
        id
        kode
        nama
        alias
      }
    }
  `);

  if (fakultasData && fakultasData.allFakultas) {
    console.log(`   ✅ Found ${fakultasData.allFakultas.length} faculties`);
    if (fakultasData.allFakultas.length > 0) {
      console.log(`   📋 First faculty: ${fakultasData.allFakultas[0].nama} (${fakultasData.allFakultas[0].kode})`);
    }
  } else {
    console.log('   ❌ Failed to get faculties');
  }

  console.log('');

  // Test 2: Get all study programs
  console.log('2. Testing prodi query...');
  const prodiData = await queryGraphQL(`
    query {
      prodi {
        id
        kode
        nama
        gelar_pendek
      }
    }
  `);

  if (prodiData && prodiData.prodi) {
    console.log(`   ✅ Found ${prodiData.prodi.length} study programs`);
    if (prodiData.prodi.length > 0) {
      console.log(`   📋 First prodi: ${prodiData.prodi[0].nama} (${prodiData.prodi[0].kode})`);
    }
  } else {
    console.log('   ❌ Failed to get study programs');
  }

  console.log('');

  // Test 3: Get all CPL (learning outcomes)
  console.log('3. Testing cpls query...');
  const cplData = await queryGraphQL(`
    query {
      cpls {
        id
        kode
        deskripsi
        domain
      }
    }
  `);

  if (cplData && cplData.cpls) {
    console.log(`   ✅ Found ${cplData.cpls.length} learning outcomes`);
    if (cplData.cpls.length > 0) {
      console.log(`   📋 First CPL: ${cplData.cpls[0].kode} - ${cplData.cpls[0].domain}`);
    }
  } else {
    console.log('   ❌ Failed to get learning outcomes');
  }
}

// Demo function to test queries with variables
async function demoQueryVariables() {
  console.log('\n🎯 DEMO: Queries with Variables');
  console.log('================================\n');

  // Test 1: Find faculty by code
  console.log('1. Testing findFakultasByKode with variable...');
  const fakultasByKode = await queryGraphQL(`
    query FindFakultasByKode($kode: String!) {
      findFakultasByKode(kode: $kode) {
        kode
        nama
        alias
        prodi {
          kode
          nama
        }
      }
    }
  `, { kode: 'FTI' });

  if (fakultasByKode && fakultasByKode.findFakultasByKode) {
    const fakultas = fakultasByKode.findFakultasByKode;
    console.log(`   ✅ Found faculty: ${fakultas.nama}`);
    if (fakultas.prodi && fakultas.prodi.length > 0) {
      console.log(`   📋 Study programs: ${fakultas.prodi.length}`);
    }
  } else {
    console.log('   ⚠️  Faculty with code "FTI" not found (this might be normal)');
  }

  console.log('');

  // Test 2: Find CPL by domain
  console.log('2. Testing findCplByDomain with variable...');
  const cplByDomain = await queryGraphQL(`
    query FindCplByDomain($domain: String!) {
      findCplByDomain(domain: $domain) {
        kode
        deskripsi
        prodi {
          nama
        }
      }
    }
  `, { domain: 'Knowledge' });

  if (cplByDomain && cplByDomain.findCplByDomain) {
    console.log(`   ✅ Found ${cplByDomain.findCplByDomain.length} CPLs in Knowledge domain`);
  } else {
    console.log('   ⚠️  No CPLs found in Knowledge domain');
  }
}

// Demo function to test schema introspection
async function demoSchemaIntrospection() {
  console.log('\n🎯 DEMO: Schema Introspection');
  console.log('=============================\n');

  console.log('1. Getting available query fields...');
  const schemaData = await queryGraphQL(`
    query {
      __schema {
        queryType {
          fields {
            name
            type {
              name
              kind
            }
          }
        }
      }
    }
  `);

  if (schemaData && schemaData.__schema) {
    const fields = schemaData.__schema.queryType.fields;
    console.log(`   ✅ Found ${fields.length} query fields:`);

    // Show first 10 fields
    fields.slice(0, 10).forEach(field => {
      console.log(`      - ${field.name}: ${field.type.name || field.type.kind}`);
    });

    if (fields.length > 10) {
      console.log(`      ... and ${fields.length - 10} more`);
    }
  } else {
    console.log('   ❌ Failed to get schema information');
  }

  console.log('');

  console.log('2. Checking for mutation support...');
  const mutationData = await queryGraphQL(`
    query {
      __schema {
        mutationType {
          name
          fields {
            name
          }
        }
      }
    }
  `);

  if (mutationData && mutationData.__schema && mutationData.__schema.mutationType) {
    const mutations = mutationData.__schema.mutationType.fields;
    console.log(`   ✅ Found ${mutations.length} mutation fields`);
    console.log('   📋 Sample mutations:');
    mutations.slice(0, 5).forEach(mutation => {
      console.log(`      - ${mutation.name}`);
    });
  } else {
    console.log('   ❌ No mutations available or failed to get mutation info');
  }
}

// Demo function to show performance testing
async function demoPerformance() {
  console.log('\n🎯 DEMO: Performance Testing');
  console.log('=============================\n');

  console.log('1. Testing single query response time...');
  const startTime = Date.now();

  const data = await queryGraphQL(`
    query {
      allFakultas {
        id
        nama
      }
      prodi {
        id
        nama
      }
    }
  `);

  const responseTime = Date.now() - startTime;

  if (data) {
    console.log(`   ✅ Query completed in ${responseTime}ms`);
    if (responseTime < 1000) {
      console.log('   🚀 Excellent response time!');
    } else if (responseTime < 3000) {
      console.log('   👍 Good response time');
    } else {
      console.log('   ⚠️  Slow response time');
    }
  } else {
    console.log(`   ❌ Query failed after ${responseTime}ms`);
  }

  console.log('');

  console.log('2. Testing concurrent requests...');
  const concurrentStart = Date.now();

  const promises = [
    queryGraphQL('query { allFakultas { id nama } }'),
    queryGraphQL('query { prodi { id nama } }'),
    queryGraphQL('query { cpls { id kode } }')
  ];

  const results = await Promise.all(promises);
  const concurrentTime = Date.now() - concurrentStart;

  const successCount = results.filter(result => result !== null).length;
  console.log(`   ✅ ${successCount}/3 concurrent requests succeeded in ${concurrentTime}ms`);
}

// Main demo function
async function runDemo() {
  console.log('🚀 GraphQL API Demo Test');
  console.log('========================');
  console.log(`Endpoint: ${GRAPHQL_ENDPOINT}\n`);

  const demoStart = Date.now();

  try {
    await demoBasicQueries();
    await demoQueryVariables();
    await demoSchemaIntrospection();
    await demoPerformance();
  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
  }

  const demoEnd = Date.now();
  console.log(`\n⏱️  Demo completed in ${demoEnd - demoStart}ms`);
  console.log('\n📖 Next Steps:');
  console.log('   - Run "npm test" for comprehensive testing');
  console.log('   - Run "npm run test:all" to include mutation tests');
  console.log('   - Check TESTING.md for detailed documentation');
}

// Check environment and run
if (typeof window !== 'undefined') {
  // Browser environment
  console.log('GraphQL Demo loaded. Run runDemo() to start.');
} else if (typeof module !== 'undefined' && require.main === module) {
  // Node.js environment
  const fetch = require('node-fetch');
  global.fetch = fetch;
  runDemo();
}

// Export for manual use
if (typeof module !== 'undefined') {
  module.exports = {
    runDemo,
    demoBasicQueries,
    demoQueryVariables,
    demoSchemaIntrospection,
    demoPerformance,
    queryGraphQL
  };
}
