const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');


const saltRounds = 5;

router
  .route('/signup')
  .get((req, res) => {
    res.render('users/signup');
  })
  .post(async (req, res, next) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    try{
      const newUser = await User.create({ username: username.trim(), email: email.trim().toLowerCase(), password: await bcrypt.hash(password, saltRounds) });  
      req.session.user = newUser;
      res.json({status: 'ok'});
    } catch (err) {
      res.json({status: 'notOk', err})
    }

  });


router
  .route('/login')
  .get(async (req, res) => {
    res.render('users/login');
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.redirect("/");

    } else {
      const err = "err";
      res.render("users/login", {err});
    }

  })


  router.get("/logout", async (req, res, next) => {
    if (req.session.user) {
      try {
        await req.session.destroy();
        res.clearCookie("user_sid");
        res.redirect("/");
      } catch (error) {
        next(error);
      }
    } else {
      res.redirect("/");
    }
  });

module.exports = router;
