var DEBUG_MSG_PREFIX = "DEBUG::LoginModule::";
var exports = module.exports = {};

/*https://github.com/request/request*/
var request = require("request"); //HttpClient
var querystring = require('querystring');
var config = require('../../config.js');
//https://github.com/chalk/chalk
var chalk = require('chalk');
var Promise = require('promise');
exports.authTypes = {

	GOOGLE: 0,
	PTC: 1
};

exports.vars = {
	_OauthTokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
	_OauthEndpoint: 'https://accounts.google.com/o/oauth2/device/code',
	_ClientId: "848232511240-73ri3t7plvk96pj4f85uj8otdat2alem.apps.googleusercontent.com",
	_ClientSecret: 'NCjF1TLi2CcY6t5mt0ZveuL7'

};

exports.google = {

	/*Gets the deviceCode Model filled by Google Server response if everything goes ok */
	getDeviceCode: function(errorCallback, responseCallback){

		console.log(DEBUG_MSG_PREFIX+"google:getDeviceCode:: getting device code...");

		var post_data = {

		    client_id: exports.vars._ClientId,
			scope: 'openid email https://www.googleapis.com/auth/userinfo.email'
		};

		request.post(exports.vars._OauthEndpoint,{form:post_data},function(err,httpResponse,tokenResp){

			if(!err){
				tokenResp = JSON.parse(tokenResp);
				if(tokenResp.verification_url == null || tokenResp.user_code == null) throw new Error(chalk.red(DEBUG_MSG_PREFIX+"getDeviceCode::ERROR: "+tokenResp.error) )
				console.log("Please visit "+chalk.green(tokenResp.verification_url)+ " and enter "+chalk.green(tokenResp.user_code));
				responseCallback(tokenResp);
			}else{
				errorCallback(err);
			}

				
		});

		return this;
		
		
	},
	getAccessTokenByRefreshToken: function(refreshToken,errorCallback,responseCallback){

		responseCallback({
			token: refreshToken
		});

		return this;
	},
	getAccessTokenByDeviceCode: function(deviceCode,accessTokenCallback){

		console.log(DEBUG_MSG_PREFIX+"google:getAccessTokenByDeviceCode:: getting AccessToken by device code...");
		var tokenResp = null;

		var f0 = function(){

			var p1 = new Promise(function(resolve,reject){

				var errClbk = function(){};
				var resClbk = function(response){
					resolve(response);
				};
				exports.google.pollSubmittedToken(deviceCode.device_code,errClbk,resClbk);
			});

			p1.then(function(tokenResp){

				tokenResp = tokenResp;
				console.log(DEBUG_MSG_PREFIX+"google:getAccessTokenByDeviceCode::AccessToken Response: ",tokenResp);
				if(tokenResp.access_token == null || tokenResp.refresh_token == null){
					sleep(3000,function(){});
					f0();
				}else{
					accessTokenCallback(tokenResp);
				}

			});
		};
		f0();

		console.log("END WHILE",tokenResp.access_token,tokenResp.refresh_token == null);

		return this;
	},

	pollSubmittedToken: function(/*string*/deviceCode,errorCallback,responseCallback){

		var post_data = {

		    client_id: exports.vars._ClientId,
		    client_secret: exports.vars._ClientSecret,
		    code: deviceCode,
		    grant_type: "http://oauth.net/grant_type/device/1.0",
			scope: 'openid email https://www.googleapis.com/auth/userinfo.email'
		};

		request.post(exports.vars._OauthTokenEndpoint,{form:post_data},function(err,httpResponse,tokenResp){

			if(!err){
				tokenResp = JSON.parse(tokenResp);
				console.log(DEBUG_MSG_PREFIX+"::google::pollSubmittedToken:: Token response sucessfull");
				responseCallback(tokenResp);
			}else{
				errorCallback(err);
			}

				
		});
		return this;
	},

	doLogin: function(accessTokenCallback){

		config.authType = exports.authTypes.GOOGLE;
		var tokenResponse = null;

		var f1 = function(){

			if(config.accesToken == null){

				var p1 = new Promise(function(resolve,reject){
					exports.google.getDeviceCode(function(err){

						console.log(DEBUG_MSG_PREFIX+"doLogin:: error",err);
					},
					function(tokenResponse){
						resolve(tokenResponse);
						
					});
				});

				p1.then(function(tokenResponse){

					exports.google.getAccessTokenByDeviceCode(tokenResponse,accessTokenCallback);
				});
					
			}else{
				accessTokenCallback(config.accesToken);
			}
		};

		if(config.googleRefreshToken !== '' && config.googleRefreshToken !== null){

			var p1 = new Promise(function(resolve,reject){

				var errClbk = function(){};
				var resClbk = function(response){
					resolve(response);
				};
				exports.google.getAccessTokenByRefreshToken(config.googleRefreshToken,errClbk,resClbk);
			});

			p1.then(function(responseToken){

				console.log(responseToken);
				f1();

			});
		}else{
			f1();
		}

		return this;
		
	}
};

exports.ptc = {

};

exports.models = {

	tokenResponse: function(){

		this.access_token 	= '';
    	this.token_type 	= '';
    	this.expires_in 	= 0;
    	this.refresh_token 	= '';
    	this.id_token 		= '';
	},

	errorResponse: function(){

		this.error = '';
		this.error_description = '';
	},

	deviceCode: function(){

		this.verification_url 	= '';
		this.expires_in 		= 0;
		this.interval 			= 0;
		this.device_code 		= '';
		this.user_code			= '';
	}

};

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}