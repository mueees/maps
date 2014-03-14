var rootController = require('../controllers/root')
    , memberController = require('../controllers/member')
    , passport = require('passport')
    , api = require('../controllers/api');


module.exports = function(app) {

    app.get('/', rootController.home);

    app.post('/api/user/register', memberController.register);
    app.post('/api/user/login', passport.authenticate('local', {}), memberController.login);
    app.get('/api/user/logout', memberController.logout);

}