// Test to check CPMK type schema
const query = `
query {
  __type(name: "Cpmk") {
    name
    fields {
      name
      type {
        name
        kind
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
    console.log('CPMK type fields:');
    if (data.data && data.data.__type && data.data.__type.fields) {
      data.data.__type.fields.forEach(field => {
        console.log(`- ${field.name}: ${field.type.name || field.type.kind}`);
      });
    } else {
      console.log('CPMK type not found or no fields available');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  })
  .catch(error => console.error('Error:', error));
