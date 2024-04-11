const {By,Builder, WebDriverWait} = require('selenium-webdriver');
const fs = require('fs');



(async function helloSelenium() {
  let driver = await new Builder().forBrowser('chrome').build();

  await driver.get('https://www.douglas.de/de/c/parfum/01'); 
  await driver.manage().setTimeouts({ implicit: 10000 });
  await driver.findElement(By.css(".uc-list-button__accept-all"));
  let cookieButton = await driver.findElement(By.css('.uc-list-button__accept-all')).getText();

  await driver.findElement(By.css('.uc-list-button__accept-all')).click();


  console.log(cookieButton);
  fs.writeFileSync("./test.html",cookieButton) ;


      
  await driver.quit();
})();
