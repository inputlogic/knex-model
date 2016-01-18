var async = require('async');
var validator = require('./validator.js');

module.exports.attachTo = attachTo;

function attachTo(model) {
  model.validate = _validate;
}

function _validate(data, done) {
  var errors = [];
  async.forEachOf(data, function(value, key, next) {
    validateProperty(key, value, errors, next);
  }, function(err, result) {
    if (err) return done(err);
    if (errors) return done(errors);
    return done();
  });
}

function _validateProperty(property, value, done) {
  var validations;
  var schema;

  if()
}
