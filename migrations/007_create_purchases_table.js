/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('purchases', function(table) {
    table.increments('purchase_id').primary();
    table.integer('id').unsigned().references('id').inTable('users').onDelete('CASCADE'); 
    table.integer('ticket_type_id').unsigned().references('ticket_type_id').inTable('ticket_type').onDelete('CASCADE');
    table.integer('quantity').notNullable();
    table.timestamp('purchase_date').defaultTo(knex.fn.now()); 
    table.string('discount_code'); 
    table.decimal('total_price', 10, 2);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('purchases')
};
