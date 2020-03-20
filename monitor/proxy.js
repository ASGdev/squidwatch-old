var proxy = {
	token: "lols",
	port: 3001,
	database: "tg"
}

const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'dev',
  database : proxy.database
});

app.use(bodyParser.json())
app.use(function(req, res, next){
	// get token
	console.log(req.body);
	let rt = req.header('apikey');
        if(rt){
		if (rt == proxy.token){
			next();
		} else {
			console.log("API KEY mismatch");
			res.status('401').send();
		}
	} else {
		console.log("API KEY mismatch");
		res.status('401').send();
	}
	
	
})


try {
	connection.connect();
} catch(e){
	console.error("Unable to connect to database");
	console.error(e);
	process.exit(1);
}


app.post('/error', function (req, res) {
	let label = req.body.label;
	let dt = req.body.datetime;
  	connection.query('INSERT INTO tg (type, label, datetime) VALUES (?, ?, ?)', ["error", label, dt], function (error, results, fields) {
	  if (error) throw error;
	});
	res.send();
})

app.post('/info', function (req, res) {
  	let label = req.body.label;
	let dt = req.body.datetime;
  	connection.query('INSERT INTO tg (type, label, datetime) VALUES (?, ?, ?)', ["info", label, dt], function (error, results, fields) {
	  if (error) throw error;
	});
	res.send();
})

app.post('/history', function (req, res) {
  	let qs = req.body.queue;
	let pl = req.body.processed;
	let dt = req.body.datetime;
  	connection.query('INSERT INTO history (datetime, queue_size, processed_links) VALUES (?, ?, ?)', [dt, qs, pl], function (error, results, fields) {
	  if (error) throw error;
	});
	res.send();
})

app.post('/link', function (req, res) {
  	let lk = req.body.link;
	let dt = req.body.datetime;
  	connection.query('INSERT INTO links (datetime, link) VALUES (?, ?)', [dt, lk], function (error, results, fields) {
	  if (error) throw error;
	});
	res.send();
})

app.post('/usage', function (req, res) {
  	let mem = req.body.mem;
	let cpu = req.body.cpu;
	let dsk_p = req.body.disk.p;
	let dsk_s = req.body.disk.s;
	let dt = req.body.datetime;
  	connection.query('INSERT INTO _usage (datetime, mem, cpu, disk_p, disk_s) VALUES (?, ?, ?, ?, ?)', [dt, mem, cpu, dsk_p, dsk_s], function (error, results, fields) {
	  if (error) throw error;
	});
	res.send();
})

app.get('/test', (req,res) => {
	res.send("continued");
});


app.listen(proxy.port, function () {
  console.log('Proxy listening on port ' + proxy.port)
})

