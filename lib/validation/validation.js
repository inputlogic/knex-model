var async = require('async');
var validator = require('./validator.js');
var schema;

module.exports.attachTo = attachTo;

function attachTo(model) {
  schema = model.schema;
  model.validate = validate;
  model.validateStrict = validateStrict;
}

/**
 * validate() checks if the property/values included in data pass the schema
 * requirements. It does not check if all required values are included in data
 */
function validate(data, done) {
  var errors = [];

  async.forEachOf(data, function(value, key, next) {
    validateProperty(key, value, errors, next);
  }, function(err, result) {
    if (err) return done(err);
    if (errors.length) return done(errors);
    return done();
  });
}

/**
 * validateStrict() does the same thing as validate() but returns errors if
 * required values are missing from data
 */
function validateStrict(data, done) {
  var errors = [];
  var property;
  var value;

  for (property in schema) {
    if (!(property[0] === '_')) {
      value = schema[property];
      if (value.required && !data[property]) {
        errors.push(new Error(property + ' is required but wasn\'t included'));
      }
    }
  }

  validate(data, function(err, res) {
    if (err) errors = errors.concat(err);
    if (errors.length) return done(errors);
    return done();
  });
}

/**
 * NOTE if there is an error in data, push it to errors array.
 * returning err in done(err) will prevent all data errors from
 * being collected.
 * Coding errors can be returned as done(err);
 */
function validateProperty(property, dirtyValue, errors, done) {
  var validations;
  var propertySchema;

  if (schema[property]) {
    propertySchema = schema[property];
  } else {
    errors.push(new Error(property + ' is not defined in schema'))
    return done();
  }

  if (!validator.schema.isType[propertySchema.type](dirtyValue)) {
    errors.push(new Error(property + ' is not the correct type'))
    return done();
  }

  if (!propertySchema.validate) {
    return done();
  }

  validations = propertySchema.validate;
  async.forEachOf(validations, function(value, key, next) {
    runValidation(property, value, key, dirtyValue, errors, next);
  }, done)

}

/**
 * runValidation() either:
 * - runs validationValue() if custom function,
 * - runs the validation as defined in validator.schema.check
 * - returns an error since the validation does not exist
 */

function runValidation(property, validationValue, validation, dirtyValue, errors, done) {
  if (validator.isCustomFunction(validationValue)) {
    validationValue(dirtyValue, function(err, res) {
      if(err) errors.push(err);
      return done();
    });
  } else if (validator.schema.check[validation]) {
    if (validator.schema.check[validation](dirtyValue, validationValue)) {
      return done();
    } else {
      errors.push(new Error(property + ': ' + dirtyValue + ' did not pass '
                            + validation +' validation'));
      return done();
    }
  } else {
    return done(new Error(validation + ' validation is not defined'));
  }
}
