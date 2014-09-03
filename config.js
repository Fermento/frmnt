// Fermen.to - frmnt shortner
// Settings

module.exports = {
	// Name
	nome: 'Encurtador da Fermen.to!',
	// Prefix for the generated url
	prefixo: 'http://frmn.to/',
	// Default page (access withou a id)
	redirecionamento: 'http://fermen.to',
	// Http port
	porta: 2588,
	
	// Auth Access (SINGLE)
	acesso: {
		usuario: 'login',
		senha: 'pass'
	},
	
	// Redis
	banco: {
		prefixo: 'frmnt'
	}
}