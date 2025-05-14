/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('organizers', function(table) {
    table.increments('organizer_id').primary();
    table.integer('user_id').unsigned().notNullable()
         .references('id').inTable('users').onDelete('CASCADE');
    table.string('company_phone_number', 20).notNullable();
    table.string('company_logo', 255);
    table.string('company_name', 100).notNullable();
    table.string('tin_number', 30);
    table.string('bank_name', 50).notNullable();
    table.string('bank_account_number', 30).notNullable();
    table.string('business_license_path', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('organizers');
};
