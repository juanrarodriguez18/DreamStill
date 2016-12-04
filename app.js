var express = require('express');
var http = require('http');
var path = require('path');
const passport = require('passport');  
const session = require('express-session'); 
var LocalStrategy = require('passport-local').Strategy;
const firebaseAPI = require('./firebase.api.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(__dirname+'/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(__dirname));
//app.use(express.static(path.join(__dirname, 'views')));
/*app.use(express.cookieParser('cookies monster')); // Cookie secret
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());*/

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
app.use(express.errorHandler());
}

require('./authentication').init(app);

app.use(passport.authenticationMiddleware(), function(req, res) {
  if (req.url.indexOf("/login") !== -1){
    res.render('login');
  }else{
  // Use res.sendfile, as it streams instead of reading the file into memory.
  res.sendfile(__dirname + '/app/index.html');
  }
});

app.get('/logout', function(req, res){
  req.session.destroy();
  req.logout();
  res.redirect('/');
});


app.get('**',  passport.authenticationMiddleware(), function(req, res) {
		res.sendfile(__dirname + '/app/index.html');
	});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      // *** Display message using Express 3 locals
      return res.render('login', {loginMessage: 'Nombre de usuario o contraseña incorrectos'});
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});
/*app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));*/

app.post('/register', function(req, res){
    var body = req.body
    /*console.log(req.body);
    console.log("username:"+req.body.username);
    console.log("email:"+req.body.email);
    console.log("password:"+req.body.password);
    console.log("confirmpassword:"+req.body.confirmPassword);*/
    var reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(firebaseAPI.getUserCredentials(body.username).username!==''){
      res.render('login', {registerFailureMessage: 'Ya existe un usuario con ese nombre'});
    }else if(body.username !== '' && body.email !== '' && reEmail.test(body.email) && body.password !== '' && body.password === body.confirmPassword){
      firebaseAPI.registerUser(body.username, body.email, body.password);
      res.render('login', {registerSuccessMessage: '¡Registro realizado con éxito!'});
    }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});