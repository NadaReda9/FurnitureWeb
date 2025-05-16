const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ashrakat:Ash12345678@cluster0.5g1jdl8.mongodb.net/authExample?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.error('Connection error:', err));

module.exports = mongoose;

