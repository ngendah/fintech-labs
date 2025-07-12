exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.text('name').notNullable();
    table.text('email').notNullable().unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
  await knex.schema
    .createTable('savings_schedules', (table) => {
      table.increments('id').primary();

      // Use integer FK instead of UUID to match users.id type
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.decimal('amount', 12, 2).notNullable();
      table.string('frequency').notNullable();
      table.date('start_date').notNullable().defaultTo(knex.fn.now());
      table.timestamp('next_run_at');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .then(() => {
      // Add frequency check constraint for PostgreSQL
      if (knex.client.config.client === 'pg') {
        return knex.raw(`
        ALTER TABLE savings_schedules
        ADD CONSTRAINT frequency_check
        CHECK (frequency IN ('daily', 'weekly', 'monthly'))
      `);
      }
    });
  await knex.schema
    .createTable('savings_logs', (table) => {
      table.increments('id').primary();
      table
        .integer('schedule_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('savings_schedules')
        .onDelete('CASCADE');
      table.timestamp('executed_at').defaultTo(knex.fn.now());
      table.string('status').notNullable();
      table.text('message');
    })
    .then(() => {
      // Add status check constraint for PostgreSQL
      if (knex.client.config.client === 'pg') {
        return knex.raw(`
        ALTER TABLE savings_logs
        ADD CONSTRAINT status_check
        CHECK (status IN ('success', 'failed'))
      `);
      }
    });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('savings_schedules');
  await knex.schema.dropTableIfExists('savings_logs');
};
