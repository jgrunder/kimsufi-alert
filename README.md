#Kimsufi Alert
======

With this Node JS project you have the possibility to monitor in real time the availability of Kimsufi servers and to receive a notification as soon as a monitored one is available.
You can currently receive notifications with the following systems:
- Pushover
- Mail (SMTP Gmail)

## Getting Started

```
git clone https://github.com/Jonathan57500/kimsufi-alert
cd kimsufi-alert
cp config.json.exemple config.json
npm install
```
Update the file config.json with your settings
```
npm start service.js
```
