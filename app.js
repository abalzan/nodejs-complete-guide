const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views','views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false, //session will not be saved if it is not modified
    saveUninitialized: false
  })
);

app.use((req, res, next) => {
   User.findById('6273b67187f108a20ba90fcc')
    .then(user => {
      console.log(user);
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://andrei:R9LeoQS78jgS0g04@nodejscompletecourseclu.xgbdg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
          const user = new User({
              name: 'Andrei',
              email: 'andrei@andrei.com',
              cart: {
                  items: []
              }
          });
          user.save();
        }
     });
      app.listen(3000);
  }).catch(err => {
      console.log(err);
  });
