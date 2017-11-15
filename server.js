let path = require("path");
let express = require("express");
let server = express();

server.use('/js', express.static(__dirname + '/public'));

server.set('view engine', 'hbs');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

server.get("/", function (req, res) {
    let fs = require('fs');
    let t = new Date().toLocaleString();

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const {headers} = req;

    const acceptEncoding = headers["accept-encoding"],
	  upgradeInsecureRequests = headers["upgrade-insecure-requests"],
	  cacheControl = headers["cache-control"],
	  acceptLanguage = headers["accept-language"],
	  userAgent = headers["user-agent"];
    const {dnt, connection, pragma, accept} = headers;

    let message = "\n" + "time: " +  t + "\n" + "ip: " + ip + "\n" + "user-agent: " + userAgent + "\n" + "accept: "+ accept +
	"\n" + "accept-language: " + acceptLanguage + "\n" + "accept-encoding:" + acceptEncoding + "\n" + "dnt: " + dnt + "\n" +
	"connection: " + connection + "\n" + "upbrade-insecure-requests: " +  upgradeInsecureRequests + "\n" +
	"pragma: " + pragma + "\n" + "cache-control: " + cacheControl + "\n" +
	"---------------------------------------------------------------------------------------------";
    console.log(
	"-------------------------------------" + t + "------------------------------------------------\n",
	headers);
    
    // запись в лог
    fs.appendFile("log.txt", message, (err) => {
	if(err) {
            return console.log(err);
	}
	return 0;
    }); 

    res.render("ipaddress", {
	headers: headers,
	h: message,
	ip: ip
    });
});

server.get('/public/js', function (req, res) {
    res.render('public/js');
});


server.get("/webrtc", function (req, res) {
    res.render("webrtc");
});

server.use(function (req, res, next) {
    res.status(404);
    res.render("404");
});

server.use(function (err, req, res) {
    console.error(err.stack);
    res.type("text/plain");
    res.status(500);
    res.render("500");
});

server.listen(server_port, server_ip_address, function () {
    console.log("Listening on " + server_ip_address + ", port " + server_port);    
});
