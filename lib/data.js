const writeOut = require('./writeOut');

const puppeteer = require('puppeteer');

const path = './output/data.csv';
const fetchData = () => {
  (async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://en.wikipedia.org/wiki/Road_safety_in_Europe', {
      waitUntil: 'networkidle2',
    });

    const selectTheaders = await page.$$eval(
      'table.wikitable.sortable.jquery-tablesorter > thead > tr > th',
      (options) => {
        return Array.from(options).map((item) => {
          let res = [];
          if (item.innerText.split('').includes('[')) {
            res = item.innerText.replace(/\n/g, ' ').slice(0, -4);
          } else {
            res = item.innerText.replace(/\n/g, ' ');
          }

          return res;
        });
      },
    );

    const selectTbody = await page.$$eval(
      '#mw-content-text > div.mw-parser-output > table.wikitable.sortable.jquery-tablesorter > tbody > tr',
      (elements) => {
        const tableBody = Array.from(elements).map((ele) => {
          return ele.innerText.split('\t');
        });

        tableBody.pop();

        return tableBody;
      },
    );
    const dataSet = selectTbody.map((row) => {
      const columnsToRemove = ['Network', 'Number of'];
      return row.reduce((acc, col, index) => {
        const heading = selectTheaders[index];
        if (columnsToRemove.some((column) => heading.includes(column)))
          return acc;
        const value = col.replace(/†a|,/g, '');
        acc[heading] = heading === 'Country' ? value : Number(value);

        return acc;
      }, {});
    });

    dataSet.sort(
      (left, right) =>
        left['Road deaths  per Million Inhabitants in 2018'] -
        right['Road deaths  per Million Inhabitants in 2018'],
    );

    await writeOut(path, dataSet);
    await browser.close();
  })();
};

module.exports = fetchData;
