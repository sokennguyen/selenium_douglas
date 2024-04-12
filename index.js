const { By, Builder } = require("selenium-webdriver");
const fs = require("fs");

(async function helloSelenium() {
  //init selenium
  let driver = await new Builder().forBrowser("chrome").build();

  //so perfume page only have 51 pages, not 136 like they say on the page number

  //access site and wait for cookie to pop up
  await driver.get("https://www.douglas.de/de/c/parfum/01?page=1");
  await driver.manage().setTimeouts({ implicit: 20000 });

  //accept cookie
  await driver
    .findElement(By.css(".uc-list-button__accept-all"))
    .click()
    .then(() => {
      console.log("Cookie accpeted");
    });

  let cardObjs = [];
  //find cards and extract brand
  let cards = await driver.findElements(
    By.css("a.link.product-tile__main-link "),
  );
  const promisses = cards.map(async (card, index) => {
    const content = await card.getAttribute("innerHTML");

    if (index === 0) console.log(content);

    //split brand
    const brand = content.split("top-brand")[1].split(">")[1].split("<")[0];

    //split brand-line
    let brandLine = "";
    //a product either have a 'brand-line' or a 'name'
    if (content.indexOf("brand-line") >= 0) {
      brandLine = content.split("brand-line")[1].split(">")[1].split("<")[0];
    } else {
      brandLine = content.split("name")[1].split(">")[1].split("<")[0];
    }

    //split price
    const priceStr = content.substring(
      content.lastIndexOf("price-row__price") + 0,
      content.lastIndexOf("€"),
    );
    const price = priceStr.split('product-price__price">')[1].split("&")[0];

    console.log(index + " " + brand + " " + brandLine + " " + price);
    cardObjs[index] = {
      brand: brand,
      "brand-line": brandLine,
      price: price,
    };
  });
  await Promise.all(promisses);

  //extract price
  let brandLine = await driver.findElements(
    By.css("a.link.product-tile__main-link .brand-line"),
  );

  //extract price
  let prices = await driver.findElements(
    By.css("a.link.product-tile__main-link .price-row__price--discount"),
  );

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
