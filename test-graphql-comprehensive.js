/**
 * Comprehensive GraphQL Testing Suite
 * Tests all queries, mutations, and error handling for the Kurikulum Dashboard
 * 
 * Usage: 
 * - Run with Node.js: node test-graphql-comprehensive.js
 * - Or copy into browser console for testing
 */

const GRAPHQL_ENDPOINT = 'https://kurikulum.if.unismuh.ac.id/graphql';

// Test configuration
const TEST_CONFIG = {
  timeout: 10000, // 10 seconds
  retries: 3,
  verbose: true,
  skipMutations: false, // Set to true to skip mutation tests (safer for production)
};

// Test data for mutations
const TEST_DATA = {
  fakultas: {
    kode: 'TST',
    nama: 'Test Fakultas',
    alias: 'TF'
  },
  prodi: {
    kode: 'TST001',
    nama: 'Test Program Studi',
    nama_eng: 'Test Study Program',
    gelar_pendek: 'S.T.',
    gelar: 'Sarjana Teknik'
  },
  profilLulusan: {
    nama: 'Test Graduate Profile',
    deskripsi: 'Test description for graduate profile',
    prodi_id: '1'
  },
  cpl: {
    kode: 'CPL-TEST-001',
    deskripsi: 'Test CPL description',
    domain: 'Knowledge',
    prodi_id: '1'
  },
  mataKuliah: {
    kode: 'MK-TEST-001',
    nama: 'Test Mata Kuliah',
    sks: 3,
    semester: 1,
    jenis: 'Wajib',
    prodi_id: '1'
  },
  cpmk: {
    kode: 'CPMK-TEST-001',
    deskripsi: 'Test CPMK description',
    bloom_level: 'C2',
    mata_kuliah_id: '1'
  },
  stakeholder: {
    nama: 'Test Stakeholder',
    tipe: 'Industry',
    organisasi: 'Test Company',
    kontak: 'test@example.com'
  },
  survey: {
    judul: 'Test Survey',
    metode: 'Online',
    periode: '2024-1',
    catatan: 'Test survey notes',
    prodi_id: '1'
  }
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: []
};

/**
 * Utility function to make GraphQL requests
 */
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

/**
 * Test runner utility
 */
async function runTest(testName, testFunction) {
  if (TEST_CONFIG.verbose) {
    console.log(`🧪 Running: ${testName}`);
  }

  try {
    await testFunction();
    testResults.passed++;
    if (TEST_CONFIG.verbose) {
      console.log(`✅ PASSED: ${testName}`);
    }
  } catch (error) {
    testResults.failed++;
    testResults.errors.push({ testName, error: error.message });
    console.error(`❌ FAILED: ${testName} - ${error.message}`);
  }
}

/**
 * Schema Introspection Tests
 */
async function testSchemaIntrospection() {
  console.log('\n📋 SCHEMA INTROSPECTION TESTS');
  console.log('================================');

  await runTest('Schema Query Type Fields', async () => {
    const query = `
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
    `;

    const data = await makeGraphQLRequest(query);
    if (!data.__schema || !data.__schema.queryType || !data.__schema.queryType.fields) {
      throw new Error('Schema query type not found');
    }

    const fields = data.__schema.queryType.fields;
    const expectedFields = ['allFakultas', 'prodi', 'cpls', 'mataKuliah', 'cpmk'];

    for (const field of expectedFields) {
      if (!fields.find(f => f.name === field)) {
        throw new Error(`Required field '${field}' not found in schema`);
      }
    }
  });

  await runTest('Schema Mutation Type Fields', async () => {
    const query = `
      query {
        __schema {
          mutationType {
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
    `;

    const data = await makeGraphQLRequest(query);
    if (!data.__schema || !data.__schema.mutationType) {
      throw new Error('Schema mutation type not found');
    }
  });
}

/**
 * Query Tests
 */
async function testQueries() {
  console.log('\n🔍 QUERY TESTS');
  console.log('===============');

  // Fakultas Queries
  await runTest('GET_ALL_FAKULTAS', async () => {
    const query = `
      query AllFakultas {
        allFakultas {
          id
          kode
          nama
          alias
          program
          jenjang
        }
      }
    `;

    const data = await makeGraphQLRequest(query);
    if (!Array.isArray(data.allFakultas)) {
      throw new Error('allFakultas should return an array');
    }
  });

  await runTest('FIND_FAKULTAS_BY_KODE', async () => {
    const query = `
      query FindFakultasByKode($kode: String!) {
        findFakultasByKode(kode: $kode) {
          kode
          nama
          alias
          prodi {
            kode
            nama
            gelar_pendek
          }
        }
      }
    `;

    const data = await makeGraphQLRequest(query, { kode: 'FTI' });
    // Note: This might return null if faculty not found, which is valid
  });

  // Prodi Queries
  await runTest('GET_ALL_PRODI', async () => {
    const query = `
      query GetAllProdi {
        prodi {
          id
          kode
          nama
          nama_eng
          gelar_pendek
          gelar
        }
      }
    `;

    const data = await makeGraphQLRequest(query);
    if (!Array.isArray(data.prodi)) {
      throw new Error('prodi should return an array');
    }
  });

  await runTest('FIND_PRODI_BY_KODE', async () => {
    const query = `
      query FindProdiByKode($kode: String!) {
        findProdiByKode(kode: $kode) {
          id
          nama
          fakultas {
            nama
          }
        }
      }
    `;

    const data = await makeGraphQLRequest(query, { kode: 'IF' });
    // Note: This might return null if prodi not found, which is valid
  });

  // CPL Queries
  await runTest('GET_ALL_CPL', async () => {
    const query = `
      query AllCpls {
        cpls {
          id
          kode
          deskripsi
          domain
        }
      }
    `;

    const data = await makeGraphQLRequest(query);
    if (!Array.isArray(data.cpls)) {
      throw new Error('cpls should return an array');
    }
  });

  await runTest('FIND_CPL_BY_DOMAIN', async () => {
    const query = `
      query FindCplByDomain($domain: String!) {
        findCplByDomain(domain: $domain) {
          kode
          deskripsi
          prodi {
            nama
          }
        }
      }
    `;

    const data = await makeGraphQLRequest(query, { domain: 'Knowledge' });
    if (!Array.isArray(data.findCplByDomain)) {
      throw new Error('findCplByDomain should return an array');
    }
  });

  // Mata Kuliah Queries
  await runTest('GET_ALL_MATA_KULIAH', async () => {
    const query = `
      query AllMataKuliah {
        mataKuliah {
          id
          kode
          nama
          sks
          semester
          jenis
          prodi {
            nama
          }
        }
      }
    `;

    const data = await makeGraphQLRequest(query);
    if (!Array.isArray(data.mataKuliah)) {
      throw new Error('mataKuliah should return an array');
    }
  });

  await runTest('FIND_MATA_KULIAH_BY_SEMESTER', async () => {
    const query = `
      query FindMataKuliahBySemester($semester: Int!) {
        findMataKuliahBySemester(semester: $semester) {
          kode
          nama
          sks
          jenis
        }
      }
    `;

    const data = await makeGraphQLRequest(query, { semester: 1 });
    if (!Array.isArray(data.findMataKuliahBySemester)) {
      throw new Error('findMataKuliahBySemester should return an array');
    }
  });

  // CPMK Queries
  await runTest('GET_ALL_CPMK', async () => {
    const query = `
      query AllCpmk {
        cpmk {
          id
          kode
          deskripsi
          bloom_level
          mata_kuliah_id
          created_at
          updated_at
        }
      }
    `;

    const data = await makeGraphQLRequest(query);
    if (!Array.isArray(data.cpmk)) {
      throw new Error('cpmk should return an array');
    }
  });

  await runTest('FIND_CPMK_BY_BLOOM_LEVEL', async () => {
    const query = `
      query FindCpmkByBloomLevel($bloomLevel: String!) {
        findCpmkByBloomLevel(bloomLevel: $bloomLevel) {
          kode
          deskripsi
          mataKuliah {
            nama
          }
        }
      }
    `;

    const data = await makeGraphQLRequest(query, { bloomLevel: 'C2' });
    if (!Array.isArray(data.findCpmkByBloomLevel)) {
      throw new Error('findCpmkByBloomLevel should return an array');
    }
  });

  // CPMK-CPL Mapping Queries
  await runTest('GET_ALL_CPMK_CPL', async () => {
    const query = `
      query GetAllCpmkCpl {
        cpmkCpl {
          id
          cpmk {
            kode
            deskripsi
            mataKuliah {
              nama
            }
          }
          cpl {
            kode
            deskripsi
            domain
          }
        }
      }
    `;

    const data = await makeGraphQLRequest(query);
    if (!Array.isArray(data.cpmkCpl)) {
      throw new Error('cpmkCpl should return an array');
    }
  });

  // Stakeholder Queries
  await runTest('GET_ALL_STAKEHOLDER', async () => {
    const query = `
      query AllStakeholders {
        stakeholders {
          id
          nama
          tipe
          organisasi
          kontak
        }
      }
    `;

    const data = await makeGraphQLRequest(query);
    if (!Array.isArray(data.stakeholders)) {
      throw new Error('stakeholders should return an array');
    }
  });

  await runTest('FIND_STAKEHOLDER_BY_TIPE', async () => {
    const query = `
      query FindStakeholderByTipe($tipe: String!) {
        findStakeholderByTipe(tipe: $tipe) {
          nama
          organisasi
          kontak
        }
      }
    `;

    const data = await makeGraphQLRequest(query, { tipe: 'Industry' });
    if (!Array.isArray(data.findStakeholderByTipe)) {
      throw new Error('findStakeholderByTipe should return an array');
    }
  });

  // Survey Queries
  await runTest('GET_ALL_SURVEY', async () => {
    const query = `
      query AllSurveys {
        surveys {
          id
          judul
          metode
          periode
          catatan
          prodi {
            nama
          }
        }
      }
    `;

    const data = await makeGraphQLRequest(query);
    if (!Array.isArray(data.surveys)) {
      throw new Error('surveys should return an array');
    }
  });

  // Survey Question Queries
  await runTest('GET_ALL_SURVEY_QUESTION', async () => {
    const query = `
      query AllSurveyQuestions {
        surveyQuestions {
          id
          nomor
          pertanyaan
          tipe
          survey {
            judul
          }
        }
      }
    `;

    const data = await makeGraphQLRequest(query);
    if (!Array.isArray(data.surveyQuestions)) {
      throw new Error('surveyQuestions should return an array');
    }
  });

  // Survey Response Queries
  await runTest('GET_ALL_SURVEY_RESPONSE', async () => {
    const query = `
      query AllSurveyResponses {
        surveyResponses {
          id
          ringkasan
          weight
          survey {
            judul
          }
          stakeholder {
            nama
            tipe
          }
          question {
            pertanyaan
          }
        }
      }
    `;

    const data = await makeGraphQLRequest(query);
    if (!Array.isArray(data.surveyResponses)) {
      throw new Error('surveyResponses should return an array');
    }
  });
}

/**
 * Mutation Tests (Create, Update, Delete)
 */
async function testMutations() {
  if (TEST_CONFIG.skipMutations) {
    console.log('\n⚠️  MUTATION TESTS SKIPPED (Safety Mode)');
    return;
  }

  console.log('\n✏️  MUTATION TESTS');
  console.log('==================');

  let createdIds = {}; // Track created entities for cleanup

  // CPL Mutations
  await runTest('CREATE_CPL', async () => {
    const mutation = `
      mutation CreateCpl($createCplInput: CreateCplInput!) {
        createCpl(createCplInput: $createCplInput) {
          id
          kode
          deskripsi
          domain
        }
      }
    `;

    const data = await makeGraphQLRequest(mutation, {
      createCplInput: TEST_DATA.cpl
    });

    if (!data.createCpl || !data.createCpl.id) {
      throw new Error('CPL creation failed');
    }

    createdIds.cpl = data.createCpl.id;
  });

  await runTest('UPDATE_CPL', async () => {
    if (!createdIds.cpl) {
      throw new Error('No CPL ID available for update test');
    }

    const mutation = `
      mutation UpdateCpl($id: String!, $updateCplInput: UpdateCplInput!) {
        updateCpl(id: $id, updateCplInput: $updateCplInput) {
          id
          kode
          deskripsi
        }
      }
    `;

    const data = await makeGraphQLRequest(mutation, {
      id: createdIds.cpl,
      updateCplInput: {
        deskripsi: 'Updated CPL description'
      }
    });

    if (!data.updateCpl) {
      throw new Error('CPL update failed');
    }
  });

  // CPMK Mutations
  await runTest('CREATE_CPMK', async () => {
    const mutation = `
      mutation CreateCpmk($createCpmkInput: CreateCpmkInput!) {
        createCpmk(createCpmkInput: $createCpmkInput) {
          id
          kode
          deskripsi
          bloom_level
        }
      }
    `;

    const data = await makeGraphQLRequest(mutation, {
      createCpmkInput: TEST_DATA.cpmk
    });

    if (!data.createCpmk || !data.createCpmk.id) {
      throw new Error('CPMK creation failed');
    }

    createdIds.cpmk = data.createCpmk.id;
  });

  // Stakeholder Mutations
  await runTest('CREATE_STAKEHOLDER', async () => {
    const mutation = `
      mutation CreateStakeholder($createStakeholderInput: CreateStakeholderInput!) {
        createStakeholder(createStakeholderInput: $createStakeholderInput) {
          id
          nama
          tipe
        }
      }
    `;

    const data = await makeGraphQLRequest(mutation, {
      createStakeholderInput: TEST_DATA.stakeholder
    });

    if (!data.createStakeholder || !data.createStakeholder.id) {
      throw new Error('Stakeholder creation failed');
    }

    createdIds.stakeholder = data.createStakeholder.id;
  });

  // Survey Mutations
  await runTest('CREATE_SURVEY', async () => {
    const mutation = `
      mutation CreateSurvey($createSurveyInput: CreateSurveyInput!) {
        createSurvey(createSurveyInput: $createSurveyInput) {
          id
          judul
          metode
        }
      }
    `;

    const data = await makeGraphQLRequest(mutation, {
      createSurveyInput: TEST_DATA.survey
    });

    if (!data.createSurvey || !data.createSurvey.id) {
      throw new Error('Survey creation failed');
    }

    createdIds.survey = data.createSurvey.id;
  });

  // Cleanup created test data
  await cleanupTestData(createdIds);
}

/**
 * Cleanup function to remove test data
 */
async function cleanupTestData(createdIds) {
  console.log('\n🧹 CLEANUP TEST DATA');
  console.log('====================');

  // Remove CPL
  if (createdIds.cpl) {
    await runTest('REMOVE_CPL', async () => {
      const mutation = `
        mutation RemoveCpl($id: String!) {
          removeCpl(id: $id)
        }
      `;

      await makeGraphQLRequest(mutation, { id: createdIds.cpl });
    });
  }

  // Remove CPMK
  if (createdIds.cpmk) {
    await runTest('REMOVE_CPMK', async () => {
      const mutation = `
        mutation RemoveCpmk($id: String!) {
          removeCpmk(id: $id)
        }
      `;

      await makeGraphQLRequest(mutation, { id: createdIds.cpmk });
    });
  }

  // Remove Stakeholder
  if (createdIds.stakeholder) {
    await runTest('REMOVE_STAKEHOLDER', async () => {
      const mutation = `
        mutation RemoveStakeholder($id: String!) {
          removeStakeholder(id: $id)
        }
      `;

      await makeGraphQLRequest(mutation, { id: createdIds.stakeholder });
    });
  }

  // Remove Survey
  if (createdIds.survey) {
    await runTest('REMOVE_SURVEY', async () => {
      const mutation = `
        mutation RemoveSurvey($id: String!) {
          removeSurvey(id: $id)
        }
      `;

      await makeGraphQLRequest(mutation, { id: createdIds.survey });
    });
  }
}

/**
 * Error Handling Tests
 */
async function testErrorHandling() {
  console.log('\n🚨 ERROR HANDLING TESTS');
  console.log('========================');

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
      throw new Error('Should have thrown an error for invalid field');
    } catch (error) {
      if (!error.message.includes('GraphQL Error')) {
        throw new Error('Expected GraphQL error for invalid field');
      }
    }
  });

  await runTest('Missing Required Variables', async () => {
    const query = `
      query FindFakultasByKode($kode: String!) {
        findFakultasByKode(kode: $kode) {
          kode
          nama
        }
      }
    `;

    try {
      await makeGraphQLRequest(query); // No variables provided
      throw new Error('Should have thrown an error for missing variables');
    } catch (error) {
      if (!error.message.includes('GraphQL Error')) {
        throw new Error('Expected GraphQL error for missing variables');
      }
    }
  });

  await runTest('Invalid Mutation Input', async () => {
    if (TEST_CONFIG.skipMutations) {
      testResults.skipped++;
      return;
    }

    const mutation = `
      mutation CreateCpl($createCplInput: CreateCplInput!) {
        createCpl(createCplInput: $createCplInput) {
          id
        }
      }
    `;

    try {
      await makeGraphQLRequest(mutation, {
        createCplInput: {} // Empty input
      });
      throw new Error('Should have thrown an error for invalid input');
    } catch (error) {
      if (!error.message.includes('GraphQL Error')) {
        throw new Error('Expected GraphQL error for invalid input');
      }
    }
  });
}

/**
 * Performance Tests
 */
async function testPerformance() {
  console.log('\n⚡ PERFORMANCE TESTS');
  console.log('====================');

  await runTest('Large Query Response Time', async () => {
    const startTime = Date.now();

    const query = `
      query LargeQuery {
        allFakultas {
          id
          kode
          nama
          alias
          program
          jenjang
        }
        prodi {
          id
          kode
          nama
          nama_eng
          gelar_pendek
          gelar
        }
        cpls {
          id
          kode
          deskripsi
          domain
        }
        mataKuliah {
          id
          kode
          nama
          sks
          semester
          jenis
        }
      }
    `;

    await makeGraphQLRequest(query);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    if (responseTime > 5000) { // 5 seconds
      throw new Error(`Query too slow: ${responseTime}ms`);
    }

    console.log(`   Response time: ${responseTime}ms`);
  });

  await runTest('Concurrent Requests', async () => {
    const query = `
      query {
        allFakultas {
          id
          nama
        }
      }
    `;

    const promises = Array(5).fill().map(() => makeGraphQLRequest(query));

    const startTime = Date.now();
    await Promise.all(promises);
    const endTime = Date.now();

    console.log(`   5 concurrent requests completed in: ${endTime - startTime}ms`);
  });
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🚀 STARTING COMPREHENSIVE GRAPHQL TESTS');
  console.log('=========================================');
  console.log(`Endpoint: ${GRAPHQL_ENDPOINT}`);
  console.log(`Skip Mutations: ${TEST_CONFIG.skipMutations}`);
  console.log(`Verbose: ${TEST_CONFIG.verbose}`);
  console.log('');

  const startTime = Date.now();

  try {
    await testSchemaIntrospection();
    await testQueries();
    await testMutations();
    await testErrorHandling();
    await testPerformance();
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;

  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⏭️  Skipped: ${testResults.skipped}`);
  console.log(`⏱️  Total Time: ${totalTime}ms`);
  console.log(`🎯 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  if (testResults.errors.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.errors.forEach(({ testName, error }) => {
      console.log(`   - ${testName}: ${error}`);
    });
  }

  if (testResults.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
  } else {
    console.log(`\n⚠️  ${testResults.failed} TESTS FAILED`);
  }
}

// Auto-run if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  const fetch = require('node-fetch');
  runAllTests();
} else {
  // Browser environment
  console.log('GraphQL Test Suite loaded. Run runAllTests() to start testing.');
}

// Export functions for manual testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    testSchemaIntrospection,
    testQueries,
    testMutations,
    testErrorHandling,
    testPerformance,
    makeGraphQLRequest,
    TEST_CONFIG,
    testResults
  };
}
