var knex = require('knex');
var knexModel = require('../index');

knexModel.init(knex);

knexModel.register('Users', {
  tableName: 'users',

  schema: {
    increments: true,
    timestamps: true,
    name: {
      type: 'string',
      required: true,
      validate: {
        isEmail: true,
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
          this.table().where({email: value}).select().then(function(err, rows) {
            if(rows.length > 0) return done(new Error('email exists'));
            return done(null, value);
          });
        }
      }),
      beforeInsert: function(value, done) {
        done(null, value.toLowerCase().trim());
      }
    },
    birthday: {
      type: 'dateTime',
      required: false
    }
  },

  findOneById: function findOneById(id, done) {
    this.validate(data, function(err, cleanData) {
      createUser(cleanData);
    });

    function createUser(data) {
      this.table().where({id: id}).select()
        .then(done.bind(null, null))
        .catch(done.bind(null));
    }
  } 
});

var Users = knexModel.get('Users');

Users.findOneById
