const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "1a6d7662f6d5f7",
        pass: "afa899b5ef8af8"
    }
});

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: req.flash('error')[0]
  });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: req.flash('error')[0]
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  User.findOne({ email: email })
      .then(user => {
          if (!user) {
              req.flash('error', 'Invalid email or password.');
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
                  req.flash('error', 'Invalid email or password.');
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
          req.flash('error', 'Email already exists.');
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
                return transporter.sendMail({
                    to: email,
                    from: 'shop@nodecomplete.com',
                    subject: 'Signup succeeded!',
                    html: '<h1>You successfully signed up!</h1>'
                }).catch(err => console.log(err));
      })
    }).catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: req.flash('error')[0]
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
      if (err) {
          console.log(err);
          return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      User.findOne({email: req.body.email})
          .then(user => {
              if (!user) {
                  req.flash('error', 'No account with that email found.');
                  return res.redirect('/reset');
              }
              user.resetToken = token;
              user.resetTokenExpiration = Date.now() + 3600000;
              return user.save();
          })
          .then(result => {
              res.redirect('/');
              return transporter.sendMail({
                  to: req.body.email,
                  from: 'shop@nodecomplete.com',
                  subject: 'Password reset',
                  html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
              })
          }).catch(err => console.log(err));
  });
};