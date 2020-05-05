// module variables
const config = require('./config.json');
const request = require('request');
var _servers = require('./servers.json');

const AVAIL_URL = 'https://www.ovh.com/engine/api/dedicated/server/availabilities?country=fr&hardware=';

console.log('New instance of Kimsufi Alert');
console.log(_servers);

var interval = setInterval(isAvailable, 10000, _servers);

function isAvailable(servers)
{
  for(var server in _servers)
  {
    if(!_servers[server]) continue;
    console.log('Is server "' + server + '" available?');
    request(AVAIL_URL + server, function (error, response, body) {
      var jsonContent = JSON.parse(body);
      for(var cluster in jsonContent)
      {
        var region = jsonContent[cluster];

        if(region.region == 'europe')
        {
          var available = false;
          var hardware = region.hardware;
          for(var datacenterNb in region.datacenters)
          {
            var datacenter = region.datacenters[datacenterNb];
            if(datacenter.availability != 'unavailable' && datacenter.datacenter != 'default')
            {
              serverAvailable(datacenter, hardware);
              available = true;
            }
          }
          if(!available)
          {
              console.log('Server "' + hardware + '" is not available');
          }
        }
      }
    });
  }
}

function serverAvailable(datacenter, server)
{
  console.log('The server ' + server + ' is available in datacenter ' + datacenter.datacenter + ' with code ' + datacenter.availability);
  const index = _servers.indexOf(server);
  if (index > -1) {
    _servers.splice(index, 1);
  }
  if(_servers.length < 1) {
    clearInterval(interval);
  }

  console.log(_servers);
}
