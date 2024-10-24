const https = require('https');
const fs = require('fs');

const LANES = {
  top: 'TOP',
  jungle: 'JUNGLE',
  middle: 'MID',
  bottom: 'ADC',
  support: 'SUPPORT'
};

async function fetchLaneData(lane) {
  return new Promise((resolve, reject) => {
    const url = `https://lolalytics.com/lol/tierlist/json/?lane=${lane}&tier=d2_plus`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const champions = JSON.parse(data);
          resolve(champions);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function getAllRoleData() {
  const roleData = {};
  
  for (const [lane, role] of Object.entries(LANES)) {
    try {
      console.log(`Fetching ${role} data...`);
      const champions = await fetchLaneData(lane);
      
      // Process champions and their roles
      champions.forEach(champion => {
        if (!roleData[champion.name]) {
          roleData[champion.name] = [];
        }
        if (!roleData[champion.name].includes(role)) {
          roleData[champion.name].push(role);
        }
      });
      
      // Wait between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error fetching ${role} data:`, error);
    }
  }
  
  return roleData;
}

async function main() {
  try {
    const roleData = await getAllRoleData();
    
    // Save to file
    fs.writeFileSync(
      'src/data/championRoles.json',
      JSON.stringify(roleData, null, 2)
    );
    
    console.log('Role data has been updated successfully!');
  } catch (error) {
    console.error('Failed to update role data:', error);
  }
}

main();