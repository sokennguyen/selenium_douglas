const { By, Builder } = require("selenium-webdriver");
const fs = require("fs");

(async function helloSelenium() {
  let driver = await new Builder().forBrowser("chrome").build();

  await driver.get("https://www.douglas.de/de/c/parfum/01");
  await driver.manage().setTimeouts({ implicit: 10000 });

  await driver
    .findElement(By.css(".uc-list-button__accept-all"))
    .click()
    .then(() => {
      console.log("Button clicked");
    });

  let cards = await driver.findElements(
    By.css("a.link.product-tile__main-link .top-brand"),
  );

  const cardPromises = cards.map(async (card) => {
    const innerHTML = await card.getAttribute("innerHTML");
    console.log(innerHTML);
  });

  await Promise.all(cardPromises);
  console.log(cards.length);

  await driver.quit();
})();
