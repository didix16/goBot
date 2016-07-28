var protoModels = require("../proto");
var extend = require("extend");
module.exports = {

	getInitialRequest: function(options){

		def = {
			authToken: '',
			authType: 0,
			lat: 0.0,
			lng: 0.0,
			altitude: 10.0,
			customRequests: [] //Request.RequestMethod
		};
		extend(def,options);

		var req = new protoModels.Request({
			altitude: def.altitude,
			auth: new protoModels.Request.AuthInfo({
				provider: def.authType === 0 ? "google" : "ptc",
				token: new protoModels.Request.AuthInfo.JWT({
					contents: def.authToken,
					unknown13: 14
				})
			}),
			latitude: def.lat,
			longitude: def.lng,
			rpc_id: 1469378659230941192,
			unknown1: 2,
			unknown12: 989,
			requests: def.customRequests
		});

		return req;

	},

	getInitialRequestByCustomRequestTypes: function(options){

		var requestArray = [];

		//Call getInitialRequest
		def = {
			authToken: '',
			authType: 0,
			lat: 0.0,
			lng: 0.0,
			altitude: 10.0,
			customRequests: [] //Request.RequestMethod
		};
		extend(def,options);

		for(var i = 0;i< def.customRequests.length;i++){

			requestArray.push(new protoModels.Request.Requests({type: def.customRequests[i]}));
		}

		def.customRequests = requestArray;

		return this.getInitialRequest(def);
	}

};