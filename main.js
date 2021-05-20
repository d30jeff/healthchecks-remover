const dayjs = require('dayjs');
const axios = require('axios');

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error('$API_KEY is not set');
}

// Modify
const filterFunction = (item) => {
  const neverPinged = item.last_ping === null;
  const olderThan4Weeks = dayjs().diff(dayjs(item.last_ping), 'weeks') > 4;

  return neverPinged || olderThan4Weeks;
}

axios.get('https://healthchecks.io/api/v1/checks/', {
  headers: {
    'X-api-key': API_KEY
  }
}).then(response => {
  const items = response.data.checks;

  const filteredItems = items.filter(filterFunction);

  console.log(`Found: (${filteredItems.length}) checks`);

  if (!filteredItems.length) {
    process.exit(0);
  }

  filteredItems.forEach(item => {
    const id = item.ping_url.replace('https://hc-ping.com/', '');
    console.log(`Deleting ID: ${id}`);
    axios.delete(`https://healthchecks.io/api/v1/checks/${id}`, {
      headers: {
        'X-api-key': API_KEY
      }
    }).then(() => {
      console.log(`Deleted ${id}`);
    }).catch(e => {
      console.log(`Failed to delete ID: ${id}`);
      console.error(e);
    });
  });
})
