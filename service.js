// module variables
const config = require('./config.json');
const request = require('request');
var _servers = require('./servers.json');

const AVAIL_URL = 'https://www.ovh.com/engine/api/dedicated/server/availabilities?country=fr&hardware=';

console.log('New instance of Kimsufi Alert');

_servers = _servers.filter(function(s) {
  return s.monitor === true;
});

if(Object.keys(_servers).length < 1) {
  console.log('No server to monitor, this application will now stop. Please select at least one server to monitor in servers.json');
  process.exit()
}

var interval = setInterval(isAvailable, 10000, _servers);

function isAvailable(servers)
{
  for(var server in _servers)
  {
    var name = _servers[server].name;
    var code = _servers[server].code;
    console.log('Is server "' + code + '" available?');
    request(AVAIL_URL + code, function (error, response, body) {
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
  if(config.pushover.enabled)
  {
    alertByPushover(datacenter, server)
  }
  if(config.sendmail.enabled)
  {
    alertByMail(datacenter, server)
  }
  delete _servers.server;
  if(Object.keys(_servers).length < 1) {
    clearInterval(interval);
  }
}

function alertByMail(datacenter, server)
{
  console.log('The server ' + server + ' is available in datacenter ' + datacenter.datacenter + ' with code ' + datacenter.availability);
  console.log('Mail notification sent');
}

function alertByPushover(datacenter, server)
{
  console.log('The server ' + server + ' is available in datacenter ' + datacenter.datacenter + ' with code ' + datacenter.availability);
  console.log('Pushover notification sent');
}
