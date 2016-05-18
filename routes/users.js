var express = require('express');
var router = express.Router();

/* GET create user */
router.post('/createuser', function(req, res) {
  users.add(req.body.email, req.body.user, req.body.pass, function(err, success) {
    return res.end(JSON.stringify({
      error: err,
      success: success
    }));
  });
});

router.post('/logintry', function(req, res) {
  users.checkPassword(req.body.user, req.body.pass, function(success) {
    if (success) {
      req.session.user = req.body.user;
      return res.redirect('/app');
    } else {
      req.session.user = void 0;
      return res.redirect('/login.html');
    }
  });
});

module.exports = router;
