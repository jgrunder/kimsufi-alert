// module variables
const config = require('./config.json');
const request = require('request');
var _servers = require('./servers.json');

const AVAIL_URL = 'https://www.ovh.com/engine/api/dedicated/server/availabilities?country=fr&hardware=';

console.log('New instance of Kimsufi Alert');

// Apply a filter to only get the servers to monitor
_servers = _servers.filter(function(s) {
  return s.monitor === true;
});

// Security: stop application if there is no server to monitor
if(Object.keys(_servers).length < 1) {
  console.log('No server to monitor, this application will now stop. Please select at least one server to monitor in servers.json');
  process.exit()
}

// Set interval, we call the function while there is at least one server to monitor
var interval = setInterval(isAvailable, 10000, _servers);

/**
 * This function is the main function of the programm, it is called
 * every tick defined in the setInterval function and will send a
 * HTTP request to AVAIL_URL for each monitored server.
 * If a monitored server is available, it will be removed from the
 * monitored list and the application will still run to monitor
 * the other servers until the list is empty.
 * @param  {[Object]}  servers A list with all the monitored servers
 * @return {Void}
 */
function isAvailable(servers)
{
  // Loop on each server to monitor
  for(var server in _servers)
  {
    // Get comon data from the server object
    var name = _servers[server].name;
    var code = _servers[server].code;
    console.log('Is server "' + code + '" available?');
    // HTTP request to OVH api with the server code
    request(AVAIL_URL + code, function (error, response, body) {
      var jsonContent = JSON.parse(body);
      // First loop on each cluster (Europe, NA, etc.)
      for(var cluster in jsonContent)
      {
        var region = jsonContent[cluster];
        // At this time we only check Europe datacenters
        if(region.region == 'europe')
        {
          var available = false;
          // Set a new variable used into notifications and logs
          var hardware = region.hardware;
          // Second loop on each datacenter from the cluster
          for(var datacenterNb in region.datacenters)
          {
            // New datacenter var that contains the data to check
            var datacenter = region.datacenters[datacenterNb];
            // Exclude default datacenter because it is set to true regardless of the datacenter where the server is available
            if(datacenter.availability != 'unavailable' && datacenter.datacenter != 'default')
            {
              // Call the function that will remove this server from the monitored list and send notifications
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

/**
 * Deletes the server from the monitored list and send notifications if set to true
 * @param  {[Object]} datacenter [The datacenter where the server is located]
 * @param  {[String]} server     [The monitored server]
 * @return {[Void]}
 */
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
  // Removing the server from the monitored list
  delete _servers.server;
  // If the server list is empty, we clear the interval and exit application
  if(Object.keys(_servers).length < 1) {
    clearInterval(interval); // TODO: Useless?
    process.exit()
  }
}

/**
 * We send a mail to inform the user that the server is available in this datacenter
 * @param  {[Object]} datacenter [The datacenter where the server is located]
 * @param  {[String]} server     [The monitored server]
 * @return {[Void]}
 */
function alertByMail(datacenter, server)
{
  console.log('The server ' + server + ' is available in datacenter ' + datacenter.datacenter + ' with code ' + datacenter.availability);
  console.log('Mail notification sent');
}

/**
 * We send a Pushover notification to inform the user that the server is available in this datacenter
 * @param  {[Object]} datacenter [The datacenter where the server is located]
 * @param  {[String]} server     [The monitored server]
 * @return {[Void]}
 */
function alertByPushover(datacenter, server)
{
  console.log('The server ' + server + ' is available in datacenter ' + datacenter.datacenter + ' with code ' + datacenter.availability);
  console.log('Pushover notification sent');
}
