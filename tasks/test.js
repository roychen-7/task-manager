module.exports = {
  cronTime: '*/20 * * * * *',
  run: run
};

function run(cb) {
  setTimeout(function() {
    cb(null);
  }, 3 * 1000);
}
