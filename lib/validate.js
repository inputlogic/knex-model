var async = require('async');
var validator = require('./validator.js');

var schema = {
  _increments: true,
  _timestamps: true,
  name: {
    type: 'string',
    required: true,
    validate: {
      min: 3,
      max: 20
    }
  },
  age: {
    type: 'integer',
    required: true,
    validate: {
      min: 21
    }
  },
  email: {
    type: 'string',
    required: true,
    validate: {
      isEmail: true,
      isEmailInUse: function(value, next) {
        return next(null, true);
        // this.table().where({email: value}).select().then(function(err, rows) {
        //   if(rows.length > 0) return done(new Error('email exists'));
        //   return done(null, value);
        // });
      }
    },
    beforeInsert: function(value, done) {
      done(null, value.toLowerCase().trim());
    }
  },
  birthday: {
    type: 'dateTime',
    required: false
  }
}

var data = {
  name: "batman",
  age: 210,
  email: "batman@example.com",
  birthday: new Date()
}

function validateProperty(property, submittedValue, done) {
  var validations;
  var propertySchema;

  if (!propertyIsDefined(property)) {
    return done(new Error(property + ' is not defined in schema'));
  }

  propertySchema = schema[property];

  if (!isCorrectType(propertySchema.type, submittedValue)) {
    return done(new Error(property + ' is not the correct type'));
  }

  if (!propertySchema.hasOwnProperty('validate')) {
    return done(null, submittedValue);
  }

  validations = propertySchema.validate;
  async.forEachOf(validations, function(value, key, next) {
    if (validator.isCustomFunction(value)) {
      value(submittedValue, function(err, res) {
        return next(err);
      });
    } else if (!validator.hasOwnProperty(key)) {
      return next(new Error(k + ' validation is not defined'));
    } else {
      if (validator[key](submittedValue, validations[key])) {
        return next(null)
      } else {
        return next(new Error(property + ': ' + submittedValue + ' did not pass '
                              + key +' validation'));
      }
    }
  }, done);
}

function validate(data, done) {
  async.forEachOf(data, function(value, key, next){
    validateProperty(key, value, next);
  }, done);
}

// function validate(data) {
//   var key;
//   var value;
//   for (key in data) {
//     value = data[key];
//
//     // 1. check if key is defined in schema
//     if (!propertyIsDefined(key)) return false ; //TODO how to handle errors/rejection?
//
//     // 2. check if value is correct type
//     if (!isCorrectType(value)) return false;
//
//     // 3. check if value passes validate requirements
//     if (!passesValidation(key, value)) return false;
//   }
// }

function validateStrict(data) {
  // 1. ensure required fields are included in data
  // 2. same as validate
}

function propertyIsDefined(key) {
  return schema.hasOwnProperty(key);
}

function passesValidation(key, value, done) {
  var k;
  var v;
  var validation;

  if (!schema[key].hasOwnProperty("validation")) return true;

  validation = schema[key].validation;

  for (k in validation) {
    v = validation[k];

    // if it's a function, run it
    if (validator.isCustomFunction(v)) {
      return v(value, done)
    } else if (!validator.hasOwnProperty(k)) {
      throw new Error(k + ' validation is not defined');
    } else {
      return done(null, validator[k](value));
    }

  }
}

function isCorrectType(type, val) {
  /**
   * Map knex column types to validator functions.
   * If appropriate validator function doesn't exist, add
   * it in ./helpers/validator.js
   */
  var types = { //TODO add missing validations
    "string": function(val) {
      return validator.isString(val)
    },
    "integer": function(val) {
      return validator.isInt(val)
    },
    "bigInteger": function(val) {
      return validator.isInt(val)
    },
    "text": function(val) {
      return validator.isString(val)
    },
    "float": function(val) {
      return validator.isFloat(val)
    },
    "decimal": function(val) {
      return validator.isDecimal(val)
    },
    "boolean": function(val) {
      return validator.isBoolean(val)
    },
    "date": function(val) {
      return validator.isDate(val)
    },
    "dateTime": function(val) {
      return validator.isDate(val)
    },
    "time": function(val) {
      return validator.isDate(val)
    },
    "timestamp": function(val) {
      return validator.isDate(val)
    }
  };
  return types[type](val);
}

// console.log(isValidType("string", data.name));
//validate(data);
// console.log(keyIsDefined('email'));
// validateProperty('age', 25, function(err, result){
//   if (err) console.log(err);
//   else console.log('passed');
// })

validate(data, function(err, res){
  if (err) console.log(err);
  else console.log('passed');
});
