const fs = require('fs');
const readLine = require('readline');
const fetchData = require('../lib/data');
const readL = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const path = './output/data.csv';

if (fs.existsSync(path)) {
  readL.question(
    'data.csv already exist, type yes to re-write or no to exit\n',
    (userInput) => {
      if (userInput.toLowerCase().trim() === 'no') {
        readL.close();
      } else if (userInput.toLowerCase().trim() === 'yes') {
        // Remove the file
        fs.unlink(path, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
        fetchData();
        readL.close();
      }
    },
  );
  readL.on('close', () => {
    console.log('Processing...');
  });
} else {
  fetchData();
  readL.close();
}
