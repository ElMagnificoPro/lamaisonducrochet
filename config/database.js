
if(process.env.production){
	module.exports = {
		'url': 'mongodb://lamaisonducrochet:lamaisonducrochet17062009@ds053874.mlab.com:53874/lamaisonducrochet'
	};
}else{
	module.exports = {
		'url' : 'mongodb://localhost/db'  
  // 'url': 'mongodb://lamaisonducrochet:lamaisonducrochet17062009@ds053874.mongolab.com:53874/lamaisonducrochet'
};	
}