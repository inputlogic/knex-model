'use strict';

var validator = require('validator');
var validate = {schema: {}};

validate.schema.check = commonValidation();
validate.schema.isType = checkType();
validate.isCustomFunction = isCustomFunction;

module.exports = validate;

/*
 * commonValidation() is for any method that will be reused
 * in schema validations. Methods must be synchronous.
 */
function commonValidation(){
  return {
    isEmail: function(val, requirement) {
      return validator.isEmail(val) === requirement;
    },
    min(val, requirement) {
      if (toType(val) === 'number') return val >= requirement;
      else return val.length >= requirement;
    },
    max(val, requirement) {
      if (toType(val) === 'number') return val <= requirement;
      else return val.length <= requirement;
    }
  }
}

/**
 * checkType() is for checking that the type of a dirty value matches
 * the type in schema
 */
function checkType() {
  return { //TODO add missing validations
    "string": function(val) {
      return toType(val) === 'string';
    },
    "integer": function(val) {
      return (toType(val) === 'number' && validator.isInt(val));
    },
    "bigInteger": function(val) {
      return (toType(val) === 'number' && validator.isInt(val));
    },
    "text": function(val) {
      return toType(val) === 'string';
    },
    "float": function(val) {
      return (toType(val) === 'number' && validator.isFloat(val));
    },
    "decimal": function(val) {
      return (toType(val) === 'number' && validator.isDecimal(val));
    },
    "boolean": function(val) {
      return (toType(val) === 'boolean');
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
}

/**
 * check if a validation in schema is a function, and if it has the right
 * number of parameters
 */
function isCustomFunction(fn) {
 if (toType(fn) !== 'function') {
   return false;
 }
 if (fn.length !==2) {
   throw new Error('Custom validation functions must have two parameters'
                     + ' (value and next/done)');
 }
 return true;
}

/**
 * more useful version of typeof
 */
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
