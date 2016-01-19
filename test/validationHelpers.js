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

    // FIXME should date validations accept an integer?
    it('should identify dates properly', function(done) {
      var boolean = validator.schema.isType.date(data.boolean);
      var float = validator.schema.isType.date(data.float);
      var string = validator.schema.isType.date(data.string);
      var integer = validator.schema.isType.date(data.integer);
      var date = validator.schema.isType.date(data.date);

      assert(date, 'accepts date');
      assert(integer, 'accepts integers');
      assert(!boolean, 'rejects boolean');
      assert(!float, 'rejects float');
      assert(!string, 'rejects strings');
      done();
    });

    it('should identify dateTimes properly', function(done) {
      var dateTime = validator.schema.isType.dateTime(data.dateTime);
      var date = validator.schema.isType.dateTime(data.date);
      var boolean = validator.schema.isType.dateTime(data.boolean);
      var float = validator.schema.isType.dateTime(data.float);
      var string = validator.schema.isType.dateTime(data.string);
      var integer = validator.schema.isType.dateTime(data.integer);

      assert(dateTime, 'accepts dateTime');
      assert(date, 'accepts date');
      assert(integer, 'accepts integers');
      assert(!boolean, 'rejects boolean');
      assert(!float, 'rejects float');
      assert(!string, 'rejects strings');
      done();
    });

    it('should identify times properly', function(done) {
      var time = validator.schema.isType.time(data.time);
      var date = validator.schema.isType.time(data.date);
      var boolean = validator.schema.isType.time(data.boolean);
      var float = validator.schema.isType.time(data.float);
      var string = validator.schema.isType.time(data.string);
      var integer = validator.schema.isType.time(data.integer);

      assert(time, 'accepts time');
      assert(date, 'accepts date');
      assert(integer, 'accepts integers');
      assert(!boolean, 'rejects boolean');
      assert(!float, 'rejects float');
      assert(!string, 'rejects strings');
      done();
    });

    it('should identify timestamps properly', function(done) {
      var timestamp = validator.schema.isType.timestamp(data.timestamp);
      var date = validator.schema.isType.timestamp(data.date);
      var boolean = validator.schema.isType.timestamp(data.boolean);
      var float = validator.schema.isType.timestamp(data.float);
      var string = validator.schema.isType.timestamp(data.string);
      var integer = validator.schema.isType.timestamp(data.integer);

      assert(timestamp, 'accepts timestamp');
      assert(date, 'accepts date');
      assert(integer, 'accepts integers');
      assert(!boolean, 'rejects boolean');
      assert(!float, 'rejects float');
      assert(!string, 'rejects strings');
      done();
    });
  });

  describe('common validations', function() {
    it('should validate min properly', function(done) {
      var tooSmallInt = validator.schema.check.min(4,5);
      var bigEnoughInt = validator.schema.check.min(6,5);
      var tooShortString = validator.schema.check.min("smal",5);
      var longEnoughString = validator.schema.check.min("big enough",5);

      assert(!tooSmallInt, 'rejected small number');
      assert(bigEnoughInt, 'accepted big enough number');
      assert(!tooShortString, 'rejected short string');
      assert(longEnoughString, 'accepted long enough string');
      done();
    });

    it('should validate max properly', function(done) {
      var tooBigInt = validator.schema.check.max(6,5);
      var smallEnoughInt = validator.schema.check.max(4,5);
      var tooLongString = validator.schema.check.max("too big",5);
      var shortEnoughString = validator.schema.check.max("smal",5);

      assert(!tooBigInt, 'rejected big number');
      assert(smallEnoughInt, 'accepted small enough number');
      assert(!tooLongString, 'rejected long string');
      assert(shortEnoughString, 'accepted short enough string');
      done();
    });

    it('should validate emails properly', function(done) {
      var invalidEmailGivenButRequired = validator.schema.check.isEmail("buttchicken.com", true);
      var validEmailGivenAndRequired = validator.schema.check.isEmail("butt@chicken.com", true);
      var invalidEmailGivenAsRequired = validator.schema.check.isEmail("buttchicken.com", false);
      var validEmailGivenButNotWanted = validator.schema.check.isEmail("butt@chicken.com", false);

      assert(!invalidEmailGivenButRequired, 'rejected invalid email when email required');
      assert(validEmailGivenAndRequired, 'accepted email when email required');
      assert(invalidEmailGivenAsRequired, 'accepted non email when email not wanted');
      assert(!validEmailGivenButNotWanted, 'rejected email when email not wanted');
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
