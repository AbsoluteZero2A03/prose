
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , pg = require('pg');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//postgres configuration

var conString = "postgres://ff:a@localhost:5432/prosedb";

//var client = new pg.Client(conString);


app.get('/', function (req,res) {
	fs.readFile('views/index.html', {'encoding': 'utf8'}, function(err,data) {
		res.send(data);
	});
});
app.get('/users', user.list);

app.get('/random', function (req,res) {
	var conString = "postgres://ff:a@localhost:5432/prosedb";

	var client = new pg.Client(conString);
	client.connect(function(err) {
		client.query("SELECT COUNT(*) FROM stories;",function(err,result) {	
			var maxn = result.rows[0].count;
			var rd = parseInt(Math.random() * maxn)+1;
		//	if (rd == 0) { rd = 1; }		
			res.redirect("/#/"+rd);
		});
	});
});

app.get("/404", function(req,res) {
	res.end("404 not found");
});

app.post('/content.json', function (req,res) {
	
	var num = parseInt(req.body.number);
	var conString = "postgres://ff:a@localhost:5432/prosedb";

	var client = new pg.Client(conString);
	var x = {};
	
	client.connect(function (err) {
		if (err) {
			res.redirect('/');
		}
		client.query("SELECT * FROM stories WHERE id = "+num, function (err, result) {
			if (err) {
				res.redirect('/');
			}
			//console.log(result.rows);
			
			if (result.rows.length == 0) {
				story = {
					num: 404,
					title: 404,
					mainContent: 404,
					date: 404,
					post: 404,
				};
				pastStories = [ {id:404,title:404} ];
				res.json({
					story: story,
					pastStories:pastStories
				});
				return;
			}	
			
			var selection = result.rows[0];
			
			story = {
				num: selection.id,
				title: selection.title,
				mainContent: selection.content,
				date: selection.write_date.toUTCString(),
				post: selection.post_content,
			}
			
			
//			console.log(story.num);
			
			client.query("SELECT id,title FROM stories;", function (err,result) {	
				pastStories = result.rows;
//				console.log(pastStories);
				client.query("SELECT COUNT(*) FROM stories;", function(err,result) {
//					console.log(result.rows[0].count);
					res.json({
						story: story,
						pastStories:pastStories.reverse(),
						maxn: result.rows[0].count,
					});
				});
			});
		});
	});
	
	/*console.log(req.body.number);*/
	/*if (req.body.number == "latest") {
		res.json({
			story: {
				title: "a",
				mainContent: "a",
				post: "a",
				num:10,
				date:"a",
			},
			pastStories: [{title: "a",}],	
		});
	} 
	else {
		var n = parseInt(req.body.number);
		
		res.json({
			story: {
				title: n,
				mainContent: n,
				post: n,
				num:n,
				date:n,
			},
			pastStories: [{title: n,}],	
		});
	}*/
});

app.get("/maxnum", function(req,res) {
	var conString = "postgres://ff:a@localhost:5432/prosedb";

	var client = new pg.Client(conString);
	
	client.connect(function(err) {
		client.query("SELECT COUNT(*) FROM stories;",function(err,result) {	
			res.end(result.rows[0].count);
		});
	});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
