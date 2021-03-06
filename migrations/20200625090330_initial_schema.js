// Creates our table users and collums 
exports.up = function(knex) {
    return knex.schema
        .createTable('users', table => {
            table.increments('id');
            table.string('username').unique().notNullable();
            table.string('password').notNullable();

            table.dateTime('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
            table.timestamp('created_at').defaultTo(knex.fn.now());
        })
};

// Deletes users table
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('users');
};