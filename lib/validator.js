'use strict';

var validator = require('validator');

// var validate = {};
var validatorKeys = Object.keys(validator);

// // Wrap validator methods so we can pass in secondary params before the value
// // param we wish to validate against.
// validatorKeys.forEach(function(key) {
//   validate[key] = function() {
//     var opts = Array.prototype.slice.call(arguments);
//     return function(val) {
//       var args = [val].concat(opts);
//       return validator[key].apply(null, args);
//     };
//   };
// });

validator.min = min;
validator.max = max;
validator.custom = custom;
validator.isString = isString;

module.exports = validator;


function min(num) {
  return function minClosure(val) {
    var isValid = false;
    if (toType(val) === 'number') {
      isValid = val >= num;
    } else {
      isValid = val.length >= num;
    }
    return isValid;
  }
}

function max(num) {
  return function maxClosure(val) {
    var isValid = false;
    if (toType(val) === 'number') {
      isValid = val <= num;
    } else {
      isValid = val.length <= num;
    }
    return isValid;
  }
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
