var loginModule = require("./login");
var protoModels = require("../proto");
var requestBuilder = require("../requestBuilder");

var Client = function(){

	this._apiUrl = '';
	this.authType = loginModule.authTypes.GOOGLE;
	this.accessToken = '';//'eyJhbGciOiJSUzI1NiIsImtpZCI6IjBiZDEwY2JmMDM2OGQ2MWE0NDBiZjYxZjNiM2EyZDI0NGExODQ5NDcifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhdF9oYXNoIjoicGtsME40VmdTajVTNXBidmI3em9xdyIsImF1ZCI6Ijg0ODIzMjUxMTI0MC03M3JpM3Q3cGx2azk2cGo0Zjg1dWo4b3RkYXQyYWxlbS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwNDYyNzUwMzc0ODg4NzkyMjEyMSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiI4NDgyMzI1MTEyNDAtNzNyaTN0N3Bsdms5NnBqNGY4NXVqOG90ZGF0MmFsZW0uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJlbWFpbCI6ImRyb2RyaWd1ZXo4MTZAZ21haWwuY29tIiwiaWF0IjoxNDY5NTY1ODcyLCJleHAiOjE0Njk1Njk0NzJ9.pIQsx4Hw8IByVYNhtAnzyrcgXoaZJN6SUdtou-QpKWCqsmndTk48PHdN8kTm4izSB8SpDoVNAji6qrZqzaaQiLsVF0Yegwl2p4j8hzaD-1Cl9Xx1brMxheNQV5czTXtL_Vwy1U-Rkqt7IMi1CYzYCShnGvMTE3Q3RGFLrvcTOaYoFfwdnT-geXkcAEZQOn9RDCDwyJSvfSV4aVBWZsYPuZ-j3ElvMngCu-rZ9TLJUBGgrK9sdjOvcRoxCl8NhF_T0r-tNQyfk4_mCNcK8WKIdINYn1uZUdzF1AyjvosU6WcIbqtm2LGgz2URmyJpDKML9LiLm2rW6CrZt-nqHSNllA';
	this.currentLat = 41.382282;
	this.currentLng = 2.190485;
	this.currentAltitude = 10.0;

	var that = this;
	loginModule.google.doLogin(function(accessToken){

		if(typeof accessToken === "object"){
			that.accessToken = accessToken.id_token;
		}else{
			that.accessToken = accessToken;
		}
	});

	this.setServer = function(){

		var RequestType = new protoModels.AllEnum.AllEnum.RequestMethod();

		var serverRequest = requestBuilder.getInitialRequestByCustomRequestTypes({
			authToken: this.accessToken,
			authType: this.authType,
			lat: this.currentLat,
			lng: this.currentLng,
			altitude: this.currentAltitude,
			customRequests: [
				RequestType.GET_PLAYER, RequestType.GET_HATCHED_OBJECTS, RequestType.GET_INVENTORY,
                RequestType.CHECK_AWARDED_BADGES, RequestType.DOWNLOAD_SETTINGS
			]
		});


	};
	return this;
};

module.exports = Client;