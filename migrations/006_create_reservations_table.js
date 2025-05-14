/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('reservations', function(table){

  table.increments('reservation_id').primary();
  table.integer('id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
  table.string('eventId').unsigned().notNullable().references('eventId').inTable('events').onDelete('CASCADE');
  table.integer('ticket_type_id').unsigned().notNullable().references('ticket_type_id').inTable('ticket_type').onDelete('CASCADE')
  table.integer('quantity').notNullable();
  table.string('status', 20).defaultTo('reserved');
  table.timestamp('reserved_date').defaultTo(knex.fn.now());
  table.timestamp('expiry_date');
  table.string('tx_ref', 255);
  })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.schema.dropTable('reservations');
};
