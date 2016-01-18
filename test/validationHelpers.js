var assert = require('chai').assert;
var validator = require('../lib/validationHelpers');
var data = getData();

describe('validationHelpers', function() {

  describe('type validations', function() {

    it('should identify strings properly', function(done) {
      var string = validator.schema.isType.string(data.string);
      var float = validator.schema.isType.string(data.float);
      var boolean = validator.schema.isType.string(data.boolean);
      var date = validator.schema.isType.string(data.date);

      assert(string, 'accepts strings');
      assert(!boolean, 'rejects boolean');
      assert(!float, 'rejects float');
      assert(!date, 'rejects date');
      done();
    });

    it('should identify integers properly', function(done) {
      var integer = validator.schema.isType.integer(data.integer);
      var string = validator.schema.isType.integer(data.string);
      var float = validator.schema.isType.integer(data.float);
      var boolean = validator.schema.isType.integer(data.boolean);
      var date = validator.schema.isType.integer(data.date);

      assert(integer, 'accepts integers');
      assert(!boolean, 'rejects boolean');
      assert(!float, 'rejects float');
      assert(!string, 'rejects strings');
      assert(!date, 'rejects date');
      done();
    });

    it('should identify floats properly', function(done) {
      var float = validator.schema.isType.float(data.float);
      var string = validator.schema.isType.float(data.string);
      var integer = validator.schema.isType.float(data.integer);
      var boolean = validator.schema.isType.float(data.boolean);
      var date = validator.schema.isType.float(data.date);

      assert(float, 'accepts float');
      assert(integer, 'accepts integers');
      assert(!boolean, 'rejects boolean');
      assert(!string, 'rejects strings');
      assert(!date, 'rejects date');
      done();
    });

    it('should identify booleans properly', function(done) {
      var boolean = validator.schema.isType.boolean(data.boolean);
      var float = validator.schema.isType.boolean(data.float);
      var string = validator.schema.isType.boolean(data.string);
      var integer = validator.schema.isType.boolean(data.integer);
      var date = validator.schema.isType.boolean(data.date);

      assert(boolean, 'accepts boolean');
      assert(!float, 'rejects float');
      assert(!integer, 'rejects integers');
      assert(!string, 'rejects strings');
      assert(!date, 'rejects date');
      done();
    });

    it('should identify dates properly', function(done) {
      var boolean = validator.schema.isType.date(data.boolean);
      var float = validator.schema.isType.date(data.float);
      var string = validator.schema.isType.date(data.string);
      var integer = validator.schema.isType.date(data.integer);
      var date = validator.schema.isType.date(data.date);

      // FIXME should date validation accept an integer?
      assert(date, 'accepts date');
      assert(integer, 'accepts integers');
      assert(!boolean, 'rejects boolean');
      assert(!float, 'rejects float');
      assert(!string, 'rejects strings');
      done();
    });
  });

});

// FIXME make sure the types being checked are correct
function getData() {
  return {
    string: "buttchicken",
    integer: 2013,
    bigInt: 2013234234234234234,
    text: "buttchicken",
    float: 2.3424,
    decimal: 12.34,
    boolean: true,
    date: new Date(),
    dateTime: new Date(),
    time: new Date(),
    timestamp: new Date(),
  }
}
