exports.seed = function(knex) {
  return knex('users').insert([      // hashed password for "password" 
    { username: 'admin', password: '$2b$12$SgjLGZuEdpwdxELIMJyX3ulXkJKueLNKLjE./ObXveVYMsvHluM3G' }
  ]);
};
