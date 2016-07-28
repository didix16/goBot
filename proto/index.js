var ProtoBuf = require("protobufjs");
var path = require("path");

var builder = ProtoBuf.loadProtoFile(path.join(__dirname, "../proto", "Request.proto"));
var builder2 = ProtoBuf.loadProtoFile(path.join(__dirname, "../proto", "AllEnum.proto"));
var builder3 = ProtoBuf.loadProtoFile(path.join(__dirname, "../proto", "Payloads.proto"));
var builder4 = ProtoBuf.loadProtoFile(path.join(__dirname, "../proto", "Response.proto"));
module.exports = {

	Request: builder.build("Request"),
	AllEnum: builder2.build("AllEnum"),
	Payloads: builder3.build("ProtoMessages"),
	Response: builder4.build("Response")

}