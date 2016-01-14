var _knex;

module.exports = {
  init: function(knex) {
    if(_knex === undefined) _knex = knex;
  },

  register: function(modelName, model) {
    if (!_knex) {
      throw new Error('Must initialize with Knex instance');
    }
  }
};