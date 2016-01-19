var async = require('async');
var validator = require('./validationHelpers');

var schemakit = {
  validate: validate,
  validateSpecific: validateSpecific
};

module.exports.attachTo = attachTo;

/**
 * validate() checks if the property/values included in data pass the schema
 * requirements. It does not check if all required values are included in data
 */
function validateSpecific(schema, data, done) {
  var errors = [];

  async.forEachOf(data, function(value, key, next) {
    validateProperty({
      property: key,
      dirtyValue: value,
      errors: errors,
      schema: schema
    }, next);
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
function validate(schema, data, done) {
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


  this.validateSepcific(data, function(err, res) {
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
function validateProperty(args, done) {
  var validations;
  var propertySchema;

  if (args.schema[args.property]) {
    propertySchema = args.schema[args.property];
  } else {
    args.errors.push(new Error(args.property + ' is not defined in schema'))
    return done();
  }

  if (!validator.schema.isType[propertySchema.type](args.dirtyValue)) {
    args.errors.push(new Error(args.property + ' is not the correct type'))
    return done();
  }

  if (!propertySchema.validate) {
    return done();
  }

  validations = propertySchema.validate;
  async.forEachOf(validations, function(value, key, next) {
    runValidation(args.property, value, key, args.dirtyValue, args.errors, next);
  }, done)

}

/**
 * runValidation() either:
 * - runs validationValue() if validationValue is custom function,
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
