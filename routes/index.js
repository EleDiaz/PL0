"use strict"

var express = require('express');
var passport = require('passport');
var User = require('../model/user');
var Code = require('../model/code');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { select: 'Features', user : req.user });
});

router.get('/register', (req, res)  => {
    res.render('register', { });
});

router.post('/register', (req, res) => {
    User.register(new User({ username : req.body.username }), req.body.password, (err, user) => {
        if (err) {
          return res.render('register', { error : error.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save( (err) => {
                if (err) {
                  return next(err);
                }
                res.redirect('/genHelloWorld');
            });
        });
    });
});

router.get('/login', (req, res) => {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/About', (req, res, next) => {
  res.render('about', { select: 'About', user : req.user})
});

router.get('/Examples', (req, res, next) => {
  res.render('compiler', { select: 'Examples', user : req.user})
});

router.get('/saveCode', (req, res) => {
  let query = Code.saveCode (req.user, req.query.name, req.query.code);
  Promise.all([query]).then((value) => {
    res.send ({result: true});
  });
});

router.get('/updateCode', (req, res) => {
  let query = Code.updateCode (req.user, req.query.name, req.query.code);
  Promise.all([query]).then((value) => {
    res.send ({result: true});
  });
});

router.get('/getCode', (req, res) => {
  let query = Code.getCode (req.user, req.query.name);
  Promise.all([query]).then((value) => {
    res.send ({result: value});
  });
});

router.get('/getListOfCodes', (req, res) => {
  let query = Code.getListOfCodes (req.user);
  Promise.all([query]).then((value) => {
    res.send ({result: value});
  });
});

router.get('/genHelloWorld', (req, res) => {
  let query = Code.genHelloWorld (req.user);
  Promise.all([query]).then((value) => {
    res.redirect('/');
  });
});

module.exports = router;
