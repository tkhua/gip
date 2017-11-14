    // http://tinyw.in/epJb  //vk.com
    // http://tinyw.in/2rJq  // 109.86.247.221:3000/ipaddress

let path = require("path");
let express = require("express");
let app = express();

app.use('/js', express.static(__dirname + '/public'));
// console.log(express.static);

app.set('view engine', 'hbs');
// let hbs = require('hbs').create({
//     helpers: {
//         static: { function(name) {
//             return require('./public/js/hist').map(name);
//         }
//         }
//     }
// });
// hbs.localsAsTemplateData(app);

app.set("port", process.env.PORT || 3000);

app.get("/", function (req, res) {
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

app.get('/public/js', function (req, res) {
    res.render('public/js')
});


app.get("/webrtc", function (req, res) {
    res.render("webrtc");
});

app.use(function (req, res, next) {
    res.status(404);
    res.render("404");
});

app.use(function (err, req, res) {
    console.error(err.stack);
    res.type("text/plain");
    res.status(500);
    res.render("500");
});

app.listen(app.get("port"), function () {
    console.log("Express запущен на: http://localhost:" + app.get("port") + ":  Нажмите Сtrl+C для завершения");
});
