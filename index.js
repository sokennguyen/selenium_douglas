const { By, Builder } = require("selenium-webdriver");
const fs = require("fs");

(async function helloSelenium() {
  //init selenium
  let driver = await new Builder().forBrowser("chrome").build();

  //access site and wait for cookie to pop up
  await driver.get("https://www.douglas.de/de/c/parfum/01");
  await driver.manage().setTimeouts({ implicit: 10000 });

  //accept cookie
  await driver
    .findElement(By.css(".uc-list-button__accept-all"))
    .click()
    .then(() => {
      console.log("Button clicked");
    });

  let cardObjs = [];
  //find cards and extract brand
  let brands = await driver.findElements(
    By.css("a.link.product-tile__main-link .top-brand"),
  );
  const brandsPromisses = brands.map(async (card, index) => {
    const innerHTML = await card.getAttribute("innerHTML");
    cardObjs[index] = {
      brand: innerHTML,
    };
  });
  await Promise.all(brandsPromisses);

  //find cards and extract price
  let cards = await driver.findElements(
    By.css("a.link.product-tile__main-link .price-row__price--discount"),
  );
  const cardPromises = cards.map(async (card, index) => {
    const innerHTML = await card.getText();
    cardObjs[index] = {
      ...cardObjs[index],
      price: innerHTML,
    };
    console.log(cardObjs[index]);
  });
  await Promise.all(cardPromises);

  //turn cards into json string
  let products = {
    products: cardObjs,
  };
  const productsString = JSON.stringify(products);

  //write to file
  fs.writeFile("./result.json", productsString, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });

  await driver.quit();
})();
