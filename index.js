var _knex;

var models = {};

module.exports = {
  init: function init(knex) {
    if(_knex === undefined) _knex = knex;
  },

  register: function register(modelName, model) {
    if(!_knex) {
      throw new Error('Must initialize with Knex instance');
    }

    var schema = model.schema;

    var fields = Object.keys(schema);

    _knex.schema.createTableIfNotExists(model.tableName, function populateTable(table) {

      for (var i=0; i < fields.length; i++) {
        var field = fields[i];

        switch (field) {
          case 'increments':
            table.increments();
            break;
          case 'timestamps':
            table.timestamps();
            break;
          default:
            var column = table[schema[field].type](field);
            if (schema[field].required) {
              column.notNullable();
            }
        }
      }
    })
    .then(function success(result) {
      model.table = function getTable() {
        return _knex(model.tableName);
      };
      models[modelName] = model;
    })
    .catch(function error(err) {
      throw err;
    });
  }
};