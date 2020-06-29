
// Objection.js is an ORM for Node.js that aims to stay out of your way and make it 
// as easy as possible to use the full power of SQL and the underlying database engine 
const { Model } = require('objection');

class User extends Model {
    static tableName = 'users';

}

module.exports = User;