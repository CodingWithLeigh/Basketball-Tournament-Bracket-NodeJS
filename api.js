const apiKey = (req, res, next) => {
  const clientApiKey = req.headers['x-api-key'];
  const { auth_key } = require("./data/config.json")
  
  // Replace with your actual secure key
  if (!clientApiKey || clientApiKey !== auth_key) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }
  
  next(); // Passes the request to your API logic
};

module.exports = apiKey;