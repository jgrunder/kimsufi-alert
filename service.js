// module variables
const config = require('./config.json');
const request = require('request');

const AVAIL_URL = 'https://www.ovh.com/engine/api/dedicated/server/availabilities?country=fr&hardware=';

console.log('New instance of Kimsufi Alert');

console.log(config.servers);

var interval = setInterval(isAvailable, 10000, config.servers);

function isAvailable(servers)
{
  for(var data in config.servers)
  {
    var server = config.servers[data];
    console.log('Is server "' + server + '" available?');
    request(AVAIL_URL + server, function (error, response, body) {
      var jsonContent = JSON.parse(body);
      for(var cluster in jsonContent)
      {
        var region = jsonContent[cluster];

        if(region.region == 'europe')
        {
          var available = false;
          for(var datacenterNb in region.datacenters)
          {
            var datacenter = region.datacenters[datacenterNb];
            if(datacenter.availability != 'unavailable' && datacenter.datacenter != 'default')
            {
              serverAvailable(datacenter, server);
              available = true;
            }
          }
          if(!available)
          {
              console.log('Server "' + server + '" is not available');
          }
        }
      }
    });
  }
}

function serverAvailable(datacenter, server)
{
  console.log('The server ' + server + ' is available in datacenter ' + datacenter.datacenter + ' with code ' + datacenter.availability);
  clearInterval(interval);
}
