'use strict';

const path = require('path');
const http = require('http');
const fs = require('fs');
const {Builder, By, Key, until,Capabilities} = require('selenium-webdriver');

const chromeDriver = require('chromedriver');
const chromeCapabilities = Capabilities.chrome();

chromeCapabilities.set('chromeOptions',{
  'args': ['--headless', '--no-sandbox', 'window-size=1024,768' , '--disable-gpu']
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
    'args': [ '--headless', '--disable-gpu']
  })
  .build();


driverPromise.catch(e => {
   console.error('Could not build chrome selenium driver:', e);
});

const s = http.createServer((req, res) => {
  
  if (req.url === '/') {
    fs.createReadStream(path.resolve(__dirname, 'index.html')).pipe(res);
    return;
  }
  
  if (req.url === '/submit_form') {
    
    const url = req.body.url;
    
    if(!url){
      return res.end('Missing "url" body parameter.');
    }
    
    return driverPromise.then(async driver => {
      
      await driver.get(url);
      const pageText = await driver.findElement(By.xpath("//html/body/")).getText();
      res.end(pageText);
  
  
    });
  }
  
  
  res.status = 404;
  res.end('404');
  
});

const port = process.env.interos_port;

s.listen(port, '0.0.0.0', () => {
  console.log(`listening on port ${port}`);
});