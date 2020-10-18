const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('config');

//const items = require('./routes/api/items');
//const users = require('./routes/api/users');

const app = express();

//body-parser middleware
app.use(bodyParser.json());

//MongoDb configuration
const db = config.get('mongoURI');

//connect to MongoDb
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('>>> MongoDb connected...');
  })
  .catch((error) => {
    console.log(error);
  });

// Use routes
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

//Serve static assests if in production
if(process.env.NODE_ENV === 'production'){
  // Set a static folder
  app.use(express.static('client/build'));
  app.get('*', (request, response, next) => {
    response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`>>> mern_shopping_list Node Server started on port ${PORT}...`);
});
