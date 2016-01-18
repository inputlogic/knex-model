'use strict';

var validator = require('validator');
var validate = {};

validate.schema.check = commonValidation;
validate.schema.isType = checkType;
validate.isCustomFunction = isCustomFunction;

module.exports = validate;

/*
 * commonValidation() is for any method that will be reused
 * in schema validations. Methods must be synchronous.
 */
function commonValidation(){
  return validations = {
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
 * checkType()
 */
function checkType() {
  return types = { //TODO add missing validations
    "string": function(val) {
      return "string" === toType(val);
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
}

/**
 *
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

function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
