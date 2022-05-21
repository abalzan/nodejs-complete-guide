const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[0].trim().split(';')[0] === 'true';
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    // isAuthenticated: isLoggedIn
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
  User.findById('6273b67187f108a20ba90fcc')
      .then(user => {
        console.log(user);
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      })
      .catch(err => console.log(err));
}
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email: email})
      .then(user => {
        if (user) {
          console.log('User already exists');
          return res.redirect('/signup');
        }
        const newUser = new User({
          email: email,
          password: password,
          cart: {
            items: []
          }
        });
        return newUser.save();
      }).then(result => {
          console.log(result);
          res.redirect('/login');
        })
      .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}
