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

exports.postLogin = (req, res, next) => {
  User.findById('6273b67187f108a20ba90fcc')
      .then(user => {
        console.log(user);
        req.session.user = user;
        req.session.isLoggedIn = true;
        res.redirect('/');
      })
      .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}
