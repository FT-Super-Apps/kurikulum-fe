// Test script untuk mengecek konektivitas GraphQL endpoint
import { apolloClient } from './apollo-client';
import { gql } from '@apollo/client';

const TEST_QUERY = gql`
  query TestConnection {
    __schema {
      queryType {
        name
      }
    }
  }
`;

async function testConnection() {
  try {
    console.log('Testing GraphQL endpoint...');
    const result = await apolloClient.query({
      query: TEST_QUERY,
      errorPolicy: 'all',
      fetchPolicy: 'network-only'
    });
    console.log('Connection successful:', result);
  } catch (error) {
    console.error('Connection failed:', error);

    // Test dengan fetch biasa
    try {
      console.log('Testing with fetch...');
      const response = await fetch('https://kurikulum.if.unismuh.ac.id/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: '{ __schema { queryType { name } } }'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetch successful:', data);
      } else {
        console.error('Fetch failed with status:', response.status, response.statusText);
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
    }
  }
}

export { testConnection };
