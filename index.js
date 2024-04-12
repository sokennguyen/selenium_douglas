const { By, Builder } = require("selenium-webdriver");
const fs = require("fs");

(async function helloSelenium() {
  //init selenium
  let driver = await new Builder().forBrowser("chrome").build();

  //so perfume page only have 51 pages, not 136 like they say on the page number

  //access site and wait for cookie to pop up
  await driver.get("https://www.douglas.de/de/c/parfum/01?page=51");
  await driver.manage().setTimeouts({ implicit: 10000 });

  //accept cookie
  await driver
    .findElement(By.css(".uc-list-button__accept-all"))
    .click()
    .then(() => {
      console.log("Cookie accpeted");
    });

  let cardObjs = [];
  //insert data into card object
  const insertCardData = async (data, field) => {
    const promisses = data.map(async (card, index) => {
      const content = await card.getAttribute("innerHTML");
      cardObjs[index] = {
        ...cardObjs[index],
        //field name is dynamic
        [field]: content,
      };
      console.log(cardObjs[index]);
    });
    await Promise.all(promisses);
    console.log(field + " is scraped");
  };

  //find cards and extract brand
  let brands = await driver.findElements(
    By.css("a.link.product-tile__main-link .top-brand"),
  );
  await insertCardData(brands, "brand");

  //extract price
  let brandLine = await driver.findElements(
    By.css("a.link.product-tile__main-link .brand-line"),
  );
  await insertCardData(brandLine, "brand-line");

  //extract price
  let prices = await driver.findElements(
    By.css("a.link.product-tile__main-link .price-row__price--discount"),
  );
  await insertCardData(prices, "price");

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
