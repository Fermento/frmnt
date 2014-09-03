// Módulos
var when = require('when');
var redis  = require('then-redis');
var cache = redis.createClient();
var nUrl = require('url');
var u = require('util');

// Configurações
var config = require('../config');
var banco = config.banco;

// Inicializa	
var sys = {};

/// /// Auxiliares
function formatURL(url){
	var urlObj = nUrl.parse(url,false,true);
	if(urlObj.protocol != 'http:' && urlObj.protocol != 'https:' && urlObj.protocol != 'ftp:')
		return null;
	
	// Retorno normal
	return nUrl.format(urlObj);
}

// Pega os últimos links
function getLinks(max) {	
	// Id
	var id = max, 
			min = Math.max(max-20,1),
			links = [];
	
	deferred = when.defer();
	
	when.iterate(function(id) {return --id}, function(id) {return id<min}, function(id) {
		return cache.hgetall(banco.prefixo+':link:'+id)		
			.then(function(link){			
				links.push({id: id, url: link.url, curto: parseInt(id).toString(16), clicks: link.clicks || 0});
		});
	}, max).done(function() {
		deferred.resolve(links);
	});
	
	return deferred.promise;
}

/// /// Rotas
// Novo
sys.novo = function(req,res) {
	res.render('inicial', {
		titulo: config.nome
	});
}

// Lista
sys.lista = function(req,res) {
	var links = [];
	cache.get(banco.prefixo+":id")
		.then(function(max){
			return getLinks(max);
		})
		.then(function(links) {
			res.render('lista', {
				link: req.session.link,
				curto: req.session.curto,
				erro: req.session.erro,
				links: links,
				titulo: config.nome,
				prefixo: config.prefixo
			});
		})
		.then(function(){
			req.session.destroy();
		});
		
}

// Post
sys.post = function(req,res) {	
	url = formatURL(req.param('url'));
	
	if(url) {
		// Adiciona no BD
		cache.incr(banco.prefixo+':id')
		.then(function(id) {
			link = config.prefixo + id.toString(16);
			
			// Salva no banco
			cache.hmset(banco.prefixo+':link:'+id, 'url', url, 'clicks', 0);
			
			req.session['link'] = url;
			req.session['curto'] = link;					
			
		});
	} else 
		req.session['erro'] = "Link inválido!";
	
	// Redireciona
	res.redirect('/lista');
}

// Redireciona
sys.redireciona = function(req,res) {	
	var id = parseInt(req.params.id,16);
	// Incrementa
	cache.hincrby(banco.prefixo+':link:'+id,'clicks',1);
	// Pega o link
	cache.hget(banco.prefixo+':link:'+id,'url')
	.then(function(link){
		if(link) 
			res.redirect(link);
		else
			res.send('Erro 404');
	});
}



// Retorno
module.exports = sys;