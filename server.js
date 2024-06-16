const app = require('./app');

// Set the port from environment variables or default to 4000
const PORT =  process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Express is running on http://localhost:${PORT}`);
});
