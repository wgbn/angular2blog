var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var Post = require('./model/post');
var User = require('./model/user');

var router = express.Router();

var secretKey = 'theo1605';
var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
mongoose.connect('mongodb://angular2:angular@ds011439.mlab.com:11439/angular2blog', __mongooseConnection);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/public'));
app.use('/libs', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/libs', express.static(__dirname + '/node_modules/systemjs/dist'));
app.use('/libs', express.static(__dirname + '/node_modules/rxjs/bundles/'));
app.use('/libs', express.static(__dirname + '/node_modules/angular2/bundles'));

router.use(__routerUse);

var auth = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, secretKey, __jwtVerify);
    } else {
        return res.status(403).send({
            success: false,
            message: 'Access denied'
        });
    }

    function __jwtVerify(err, decoded) {
        if (err) {
            return res.status(403).send({
                success: false,
                message: 'Access denied'
            });
        } else {
            req.decoded = decoded;
            next();
        }
    }
};

router.get('/', __routerGetRoot);

router.route('/users')
    .get(auth, __routeUsersGet)
    .post(__routeUsersPost);

router.route('/login').post(__routeLoginPost);

router.route('/posts/:post_id?')
    .get(__routePostsGet)
    .post(auth, __routePostsPost)
    .delete(auth, __routePostsDelete);

app.use('/api', router);
app.listen(port);
console.log('Listen: ' + port);

////////////// implementações ////////////

function __mongooseConnection(err){
    if (err)
        console.log('error! ' + err);
}

function __routerUse(req, res, next) {
    console.warn(req.method + " " + req.url +
    " with " + JSON.stringify(req.body));
    next();
}

function __routerGetRoot(req, res) {
    res.json({ message: 'hello world!' });
}

function __routeUsersGet(req, res) {
    User.find(__routeUsersGetFindResult);

    function __routeUsersGetFindResult(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    }
}

function __routeUsersPost(req, res) {
    var user = new User();
    user.name = req.body.name;
    user.login = req.body.login;
    user.pass = req.body.pass;
    user.save(__routeUsersPostSaveResult);

    function __routeUsersPostSaveResult(err) {
    if (err)
        res.send(err);
    res.json(user);
}
}

function __routeLoginPost(req, res) {
    if (req.body.isNew) {
        User.findOne({ login: req.body.login }, 'name')
            .exec(__routeLoginPostIsNewFindOneResult);
    } else {
        User.findOne({ login: req.body.login, pass: req.body.pass }, 'name')
            .exec(__routePostLoginFindOneResult);
    }

    function __routeLoginPostIsNewFindOneResult(err, user) {
        if (err) res.send(err);
        if (user != null) {
            res.status(400).send('Login Existente');
        } else {
            var newUser = new User();
            newUser.name = req.body.name;
            newUser.login = req.body.login;
            newUser.pass = req.body.pass;
            newUser.save(__routeLoginPostSaveUserResult);
        }

        function __routeLoginPostSaveUserResult(err) {
            if (err) res.send(err);
            var token = jwt.sign(newUser, secretKey, {
                expiresIn: "1 day"
            });
            res.json({ user: newUser, token: token });
        }
    }

    function __routePostLoginFindOneResult(err, user) {
        if (err) res.send(err);
        if (user != null) {
            var token = jwt.sign(user, secretKey, {
                expiresIn: "1 day"
            });
            res.json({ user: user, token: token });
        } else {
            res.status(400).send('Login/Senha incorretos');
        }
    }
}

function __routePostsGet(req, res) {
    Post
        .find()
        .sort([['date', 'descending']])
        .populate('user', 'name')
        .exec(__routePostsGetExecResult);

    function __routePostsGetExecResult(err, posts) {
        if (err)
            res.send(err);
        res.json(posts);
    }
}

function __routePostsPost(req, res) {
    var post = new Post();
    post.title = req.body.title;
    post.body = req.body.body;
    post.user = req.body.user._id;

    if (post.title==null)
        res.status(400).send('Título não pode ser nulo');

    post.save(__routePostsPostSaveResult);

    function __routePostsPostSaveResult(err) {
        if (err)
            res.send(err);
        res.json(post);
    }
}

function __routePostsDelete(req, res) {
    Post.remove({
        _id: req.params.post_id
    }, __routePostsDeleteResult);

    function __routePostsDeleteResult(err, post) {
        if (err)
            res.send(err);
        res.json({ message: 'Successfully deleted' });
    }
}