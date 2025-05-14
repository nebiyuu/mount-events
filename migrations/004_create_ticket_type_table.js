/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('ticket_type', function(table){

    table.increments('ticket_type_id').primary();
    table.string('eventId').unsigned().references('eventId').inTable('events').onDelete('CASCADE');
    table.string('type', 50);
    table.decimal('price');
    table.timestamp('start_date').notNullable();
    table.timestamp('end_date').notNullable();
    table.integer('quantity');
    table.boolean('is_active').defaultTo(true);
  } )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('ticket_type');
};
