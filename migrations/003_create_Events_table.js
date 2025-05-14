/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('events', function(table) {
    table.string('eventId').primary();
    table.string('name').notNullable();
    table.text('eventDetails');
    table.date('date').notNullable();
    table.string('location').notNullable();
    table.string('eventStatus', 50).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('events');
};
