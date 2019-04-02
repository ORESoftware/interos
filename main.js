'use strict';

const path = require('path');
const http = require('http');
const fs = require('fs');
const express = require('express');
const {Builder, By, Key, until, Capabilities} = require('selenium-webdriver');

const chromeDriver = require('chromedriver');
const chromeCapabilities = Capabilities.chrome();

chromeCapabilities.set('chromeOptions', {
  'args': ['--headless', '--no-sandbox', 'window-size=1024,768', '--disable-gpu']
});

// https://tecadmin.net/setup-selenium-chromedriver-on-ubuntu/
// var chrome = require('selenium-webdriver/chrome');
// var path = require('chromedriver').path;
// var service = new chrome.ServiceBuilder(path).build();
// chrome.setDefaultService(service);

let driverPromise = new Builder()
  .forBrowser('chrome')
  .withCapabilities(chromeCapabilities)
  .setChromeOptions({
    'args': ['--headless', '--disable-gpu']
  })
  .build();


driverPromise.catch(e => {
  console.error('Could not build chrome selenium driver:', e);
});

const app = express();

app.get('/', (req, res) => {
  const index = path.resolve(__dirname, 'index.html');
  fs.createReadStream(index).pipe(res);
});


app.get('/submit_form',(req, res) => {
  
  const url = req.query.url;
  
  console.log({query: req.query, body: req.body});
  
  if (!url) {
    return res.status(412).end('Missing "url" body parameter.');
  }
  
  return driverPromise.then(async driver => {
      
      await driver.get(url);  // formerly using:  By.xpath("//html/body/")
      const pageText = await driver.findElement(By.tagName('body')).getText();
      console.log('Here is the page length:', pageText.length);
      res.status(200).end(pageText);
      
    })
    .catch(e => {
      console.error(e);
      res.end(e);
    })
});


app.use((req, res) => {
  res.status(404).end('404');
});

const port = process.env.interos_port;

app.listen(port, '0.0.0.0', () => {
  console.log(`listening on port ${port}`);
});