const { log } = require("console");
const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
///////////////////////////////////////
/// File
//Blocking, Synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// //Write Files
// const textOut = `THIS IS WHAT WE KNOW ABOUT THE AVOCADO ${textIn} ...`;
// fs.writeFileSync("txt/ouput.txt", textOut);

// // Non-blocking, asynchronous way
// fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
//   if (err) console.log("Error :<");
//   else console.log(data);
// });
// ///console log text after when console data beacause of it need proccess in back ground
// console.log("Write read File!!");

///////////////////////////////////////
/// Server
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((require, response) => {
  const { query, pathname } = url.parse(require.url, true);
  //OVERVIEW
  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    response.end(output);

    //PRODUCT PAGE
  } else if (pathname === "/product") {
    response.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    response.end(output);

    //API
  } else if (pathname === "/api") {
    response.writeHead(200, { "Content-type": "application/json" });
    response.end(data);

    //NOT FOUND
  } else {
    response.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    response.end("<h1>Page not found</h1>");
  }
});
server.listen(8000, "localhost", () => {
  console.log("Listening to requests on port 8000");
});
