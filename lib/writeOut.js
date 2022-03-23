const { appendFile } = require('fs/promises');

module.exports = async function writeOut(filename, data) {
  await appendFile(filename, `${Object.keys(data[0]).join(',')}, Year\n`);
  for (let row of data) {
    await appendFile(filename, `${Object.values(row).join(',')}, 2018\n`);
  }
};
