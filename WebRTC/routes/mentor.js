var dryLayers = require('dry-layers');
var express = require('express');
var router = express.Router();

router.all('*', dryLayers.SecurityService.authorize(null, function(req){
	console.log('TEST!');
	return -1 != req.user.roles.indexOf('Mentor');
}));


module.exports = router;
