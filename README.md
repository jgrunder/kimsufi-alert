# Kimsufi Alert

This NodeJS project allows you to regularly monitor the availability of Kimsufi servers and send you a notification as soon as a monitored server is available.
If one of the monitored servers is available, you receive a notification with the url to pre-purchase this server and it is immediately removed from the list of monitored servers; the application continues to monitor availabilities until there are no more servers to monitor.

## Scope

You can currently receive notifications with the following systems:
- [Pushover](https://pushover.net/)
- Mail (Gmail)

## Getting Started

1. Clone this project in any folder, then:
2. Install the project:
```
cd kimsufi-alert
cp config.json.exemple config.json
npm install
```
3. Update the file config.json with your settings
4. Specify which servers you want to monitor by editing the servers.json file. 
5. Start the service:
```
npm start service.js
```

## Gmail configuration

To use the service with email via Gmail (you must have a valid Gmail account and email address), we recommend that you create a Google application password so that you don't have to write your Google password in plaintext in the configuration file.
Regardless of this security issue, you're required to use Google application password if you've enabled dual authentication on your Google Account. 

To do this :
1. Manage your Google account
2. Go to security
3. Add an application password
4. [More information about Google Application Password](https://support.google.com/mail/answer/185833?hl=en)

Then in this application configuration file, you can specify your email address and then the application password.

## Pushover configuration

This is a paid service (5$ one time for each device where to receive notifications) but you can test it for free during 7 days:
1. Go to [Pushover](https://pushover.net/) website and create an account. You'll receive your user key by email, **keep it**!
2. In Apps and plugins, create a new application (i.e. kimsufi-alert)
3. Save the app key in this config file
