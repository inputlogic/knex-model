'use strict';

var validator = require('validator');
var validate = {};
var validatorKeys = Object.keys(validator);

/**
 * validator's default methods only need the value to validate and no
 * requirement value.
 * This loop maps validator methods to validate and drops the requirement
 * param.
 */
validatorKeys.forEach(function(key) {
  validate[key] = function(val, requirement) {
    return validator[key](val);
  };
});

validate.min = min;
validate.max = max;
validate.custom = custom;
validate.isString = isString;
validate.isCustomFunction = isCustomFunction;
validate.toType = toType;

module.exports = validate;

/**
 * custom validations are passed the value to validate and a requirement value
 * eg. for minimum number, 30 could be the value, and 3 could be the requirement
 */
function min(val, minNum) {
  var isValid = false;
  if (toType(val) === 'number') {
    isValid = val >= minNum;
  } else {
    isValid = val.length >= minNum;
  }
  return isValid;
}

function max(val, maxNum) {
  var isValid = false;
  if (toType(val) === 'number') {
    isValid = val <= maxNum;
  } else {
    isValid = val.length <= maxNum;
  }
  return isValid;
}


function custom(validFn) {
  if (toType(validFn) !== 'function') {
    throw new Error('You must pass a function as a custom validator.');
  }
  if (validFn.length !== 2) {
    throw new Error('Custom validator has incorrect parameter length.');
  }
  return validFn;
}

function isString(val) {
  return "string" === toType(val);
}

function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

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
