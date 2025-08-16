// Simple test to check GraphQL schema
const query = `
query {
  __schema {
    queryType {
      fields {
        name
        type {
          name
        }
      }
    }
  }
}
`;

fetch('https://kurikulum.if.unismuh.ac.id/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query })
})
.then(response => response.json())
.then(data => {
  console.log('Available query fields:');
  data.data.__schema.queryType.fields.forEach(field => {
    console.log(`- ${field.name}: ${field.type.name || 'Complex type'}`);
  });
})
.catch(error => console.error('Error:', error));
