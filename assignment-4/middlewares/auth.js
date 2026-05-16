const basicAuth = require('express-basic-auth');

// Setup basic HTTP authentication middleware
// Using hardcoded credentials for demonstration purposes (admin/password)
const authMiddleware = basicAuth({
  users: { 'admin': 'password' },
  challenge: true,
  realm: 'Admin Panel',
});

module.exports = authMiddleware;
