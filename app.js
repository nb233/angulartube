var express = require('express');
var app = express();
var google = require('googleapis');
var youtube = google.youtube('v3');
var data_to_send;

var API_KEY = 'AIzaSyAr9xBlzUbDqg44kU2DahiCr4_DsQ9Fbug'; // specify your API key here

var nextToken;

var data_to_send;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set('views', __dirname + '/views');
app.use(express.static('public'));


app.get('/', function (req, res) {	
	if(typeof req.query.q == "string"){
		youtube.search.list({ key: API_KEY, part: 'snippet',chart: 'mostPopular' , type: 'video',maxResults:20}, function(err, data) {
      	res.send(data); 
  
  		});

	}
	else{
    	res.render('index');
	}
});



app.get('/search/', function(req, res) {
    if(req.query.nextToken == ''){
      youtube.search.list({ key: API_KEY, part: 'snippet',q:req.query.q , type: 'video',maxResults:20}, function(err, data) {
        res.send(data);  
    
      });
    }
    else{
      youtube.search.list({ key: API_KEY, part: 'snippet',q:req.query.q , type: 'video',maxResults:20,pageToken:req.query.nextToken}, function(err, data) {
        res.send(data);  
    
      });
    }

});


app.get('/getVideo/', function(req, res) {

   if (typeof req.query.vidId == 'undefined') {
        res.send(data_to_send);


    } 
    else {

      youtube.videos.list({key: API_KEY,id : req.query.vidId, part : 'snippet,statistics' },function(err,data){
        res.render('videoView');
        data_to_send=data.items[0];


      });
    
    }




});

app.get('/channelInfo/', function(req, res){

  youtube.channels.list({key: API_KEY,id: req.query.chId, part: 'id,snippet'},function(err,data){
    console.log(data.items[0]);
    res.send(data.items[0]);

  });


});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});