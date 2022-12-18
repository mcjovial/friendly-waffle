const connectionString =
  "postgresql://[user]:[password]@localhost:[pg_port]/[DB_name]";

// can change port number
const port = process.env.PORT || 5000;

module.exports = {connectionString,port};