const validLocales = require('./valid-locales.json');
const fs = require('fs');

const localesJSON = JSON.stringify(validLocales.map((locale) => locale.locale));

fs.writeFileSync('locales.json', localesJSON);