const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[0].trim().split(';')[0] === 'true';
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login'
  });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  User.findOne({ email: email })
      .then(user => {
          if (!user) {
              return res.redirect('/login');
          }
          bcrypt.compare(password, user.password)
              .then(doMatch => {
                  if (doMatch) {
                      req.session.isLoggedIn = true;
                      req.session.user = user;
                      return req.session.save(err => {
                          console.log(err);
                          res.redirect('/');
                      });
                  }
                  res.redirect('/login');
              })
              .catch(err => {
                  console.log(err);
                  res.redirect('/login');
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
        return bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: {items: []}
                });
                return user.save();
            }).then(result => {
                res.redirect('/login');
      })
    }).catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}
