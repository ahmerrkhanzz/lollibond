var _ = require('lodash');

function generateLimited(source, chunk) {
  var count = 0;
  var accumulator = _.chunk(source, chunk);
  accumulator = _.map(accumulator, function(n) {
    var result = {};
    result['id'] = count;
    result['data'] = n;
    count++;
    return result;
  });
  return accumulator;
}

module.exports = generateLimited;
