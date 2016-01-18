var validation = require('./validation.js');

var model = {
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
    },
    buttchicken: {
      type: 'boolean',
      required: true
    }
  }
}

validation.attachTo(model);

var data = {
  name: "batman",
  age: 10,
  email: "batman@example.com",
  birthday: new Date()
  // buttchicken: true
}

model.validateStrict(data, function (err, res) {
  if (err) console.log(err);
  else console.log("passed");
});

// model.validateStrict(data, function (err, res) {
//   if (err) console.log(err);
//   else console.log("passed");
// });
