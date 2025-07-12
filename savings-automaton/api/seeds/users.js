exports.seed = async function (knex) {
  await knex('users').del();
  await knex('users').insert([{ name: 'harry', email: 'harry@example.com' }]);
};
