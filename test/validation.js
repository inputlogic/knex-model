var assert = require('chai').assert;
var validation = require('../lib/validation');
var model = getModel();
var data = getData();

describe('validation', function() {
  it('should attach to model', function(done){
    validation.attachTo(model);
    assert.isFunction(model.validate, 'validate was attached to model');
    assert.isFunction(model.validateStrict, 'validateStrict was attached to model');
    done();
  });

  describe('validate function', function() {
    it('should say valid (partial) data is valid', function(done) {
      model.validate(data.validWithRequiredPropertiesMissing, function(err){
        assert.isUndefined(err);
        done();
      });
    });

    it('should say data is wrong type', function(done) {
      model.validate(data.invalidType, function(err) {
        assert(err.length > 0, 'error was found');
        done()
      });
    });

    it('should collect errors from custom validations', function(done) {
      model.validate(data.failsCustomValidation, function(err) {
        assert(err.length > 0, 'error was found');
        done()
      });
    });
  });

  describe('validateStrict function', function() {
    it('should say valid (partial) data is invalid', function(done) {
      model.validateStrict(data.validWithRequiredPropertiesMissing, function(err){
        assert(err.length > 0, 'error was found');
        done();
      })
    });

    it('should say valid (complete) data is valid', function(done) {
      model.validateStrict(data.validComplete, function(err){
        assert.isUndefined(err);
        done();
      })
    });

    it('should say when value is the wrong type', function(done) {
      model.validate(data.invalidType, function(err) {
        assert(err.length > 0, 'error was found');
        done()
      });
    })
  });

});

function getModel() {
  return {
    schema : {
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
          }
        },
        beforeInsert: function(value, done) {
          done(null, value.toLowerCase().trim());
        }
      },
      birthday: {
        type: 'dateTime',
        required: false
      },
      buttchicken: {
        type: 'boolean',
        required: true
      },
      bio: {
        type: 'string',
        required: false,
        validate: {
          isAlwaysGoingToFail: function(value, next) {
            return next(new Error('I don\'t accept anything'));
          }
        }
      }
    }
  }
}

function getData() {
  return {
    validWithRequiredPropertiesMissing: {
      name: "batman",
      age: 21,
      email: "batman@example.com",
      birthday: new Date()
    },
    validComplete: {
      name: "batman",
      age: 21,
      email: "batman@example.com",
      birthday: new Date(),
      buttchicken: true
    },
    invalidType: {
      name: 10,
      buttchicken: true
    },
    failsCustomValidation: {
      name: "batman",
      bio: "buttchicken"
    }
  }
}
