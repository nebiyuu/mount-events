/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('discount_codes', function(table) {
    table.increments('discount_id').primary(); 
    table.string('code', 50).notNullable().unique(); 
    table.enu('discount_type', ['percentage', 'fixed']).notNullable();
    table.decimal('value').notNullable(); 
    table.timestamp('start_date').notNullable(); 
    table.timestamp('end_date').notNullable();
    table.integer('usage_limit'); 
    table.integer('usage_count').defaultTo(0); 
    table.string('eventId').unsigned().references('eventId').inTable('events').onDelete('SET NULL');
    table.integer('ticket_type_id').unsigned().references('ticket_type_id').inTable('ticket_type').onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('discount_codes');
};
