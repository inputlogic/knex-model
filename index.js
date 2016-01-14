var _knex;

module.exports = {
  init: function(knex) {
    if(_knex === undefined) _knex = knex;
  },

  register: function(modelName, model) {
    _knex()... 
  }
};