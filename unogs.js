const puppeteer = require('puppeteer');
const HTMLParser = require('node-html-parser');
const fs = require('fs');
// Or import puppeteer from 'puppeteer-core';

function getFlagEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
}

function toISOLocal(d) {
  var z  = n =>  ('0' + n).slice(-2);
  var zz = n => ('00' + n).slice(-3);
  var off = d.getTimezoneOffset();
  var sign = off > 0? '-' : '+';
  off = Math.abs(off);

  return d.getFullYear() + '-'
         + z(d.getMonth()+1) + '-' +
         z(d.getDate()) + 'T' +
         z(d.getHours()) + ':'  + 
         z(d.getMinutes()) + ':' +
         z(d.getSeconds()) + '.' +
         zz(d.getMilliseconds()) +
         sign + z(off/60|0) + ':' + z(off%60); 
}

// Launch the browser and open a new blank page
async function doSearch(searchstr, year) {
  let browser;
  try {
    console.log('search '+searchstr +' (year: '+year+')');
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://unogs.com/search/'+encodeURIComponent(searchstr));

    //console.log('New page url:' + page.url());
    await page.waitForSelector('div.results div.videodiv');
    let els = await page.$$('div.results div.videodiv');
    for (let el of els) {
      let match = false;
      let content = await (await el.getProperty('textContent')).jsonValue();
      let html = await (await el.getProperty('innerHTML')).jsonValue();
      let stype = new RegExp('<span data-bind="html:vtype">movie</span>');
      let syear = new RegExp('<span data-bind="html:year">'+year+'</span>');
      let stitle = new RegExp('<span data-bind="html:title">'+searchstr+'</span>','i');
      if (html.search(stype) < 0)
        continue;
      if (html.search(syear) < 0)
        continue;
      console.log(content);
      if (html.search(stitle) > 0) {
        match = true;
        console.log('\x1b[32m', 'Hurray, looks like we have a match!!!');  
        console.log('\x1b[0m'); // color reset
      } else {
        console.log('\x1b[33m', 'Does not look like a match.');  
        console.log('\x1b[0m'); // color reset
      }
      let iels = await el.$$('div.sclist');
      for (let el of iels) {
        let html = await (await el.getProperty('innerHTML')).jsonValue();
        let imgs = HTMLParser.parse(html).querySelectorAll('img');
        for (var i=0; i<imgs.length; i++) {
          let img = imgs[i];
          let lang = img.getAttribute('src').split(/(\\|\/)/g).pop().replace('.svg','');
          console.log(getFlagEmoji(lang) + ' ' + img.getAttribute('title'));
        } 
        if (match)
          break;
      }
      if (match)
        break;
    }
  } catch (e) {
    if (e.name != 'TimeoutError')
      console.log(e);
  } finally {
    browser.close();
  }
}

async function searchUnogs() {
  console.log(toISOLocal(new Date()).replace('T',' ').substring(0,19), 'search unogs started');
  await fs.readFile('wishlist', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      let dlines = data.split(/\r?\n/).filter( n => n);
      (async function () {
      for await (let line of dlines) {
        let match = line.match(/(\d\d\d\d)/);
        let year = match? match[0] : null;
        line = line.replace(/\((\d\d\d\d)\)/, "").trim();
        if (line.startsWith('#')) 
          console.log('skipping ' + line.substring(1));
        else
          await doSearch(line, year);
      }
      })();
  });
}

(async() => {
  await searchUnogs();
})();
