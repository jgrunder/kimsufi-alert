// module variables
const config = require('./config.json');
const request = require('request');

const AVAIL_URL = 'https://www.ovh.com/engine/api/dedicated/server/availabilities?country=fr';

console.log(config.servers);

isAvailable("1801sk12");
setInterval(isAvailable, 60000, "1801sk12");

function isAvailable(server)
{
  console.log('Check availability of server ' + server);
}
