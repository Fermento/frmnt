/** 
Url Shortner
**/

// Módulos
var express = require('express');
var sys = require('./sys');
var config = require('./config')

// Aplicativo Web
var app = express();

// Configurações
app.engine('.html', require('ejs').__express);
app.set('view engine','html');
app.set('view cache',false);

app.use(express.cookieParser())
// Change the secret key (for session)
app.use(express.session({ secret: '<change this secret key>', key: 'sid' }))
app.use(express.urlencoded());
app.use(app.router);

// Redireciona
app.get('/', function(req,res) {
	res.redirect(config.redirecionamento);
});

// Autenticação
var auth = express.basicAuth(config.acesso.usuario, config.acesso.senha);

// Arquivos Estáticos
app.use('/ativo', auth);
app.use('/ativo', express.static(__dirname + '/ativo'));

// Gerenciamento


// Novos Links
app.get('/novo', auth, sys.novo);
app.post('/novo', auth, sys.post);
app.get('/lista', auth, sys.lista);

// Redir
app.get('/:id', sys.redireciona);

// Servidor Web
var server = app.listen(config.porta, function() {
	console.log('Iniciando servidor na porta %d', server.address().port);
});
