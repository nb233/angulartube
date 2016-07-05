var express = require('express');
var app = express();
var google = require('googleapis');
var youtube = google.youtube('v3');
var data_to_send;

var API_KEY = {YOUR_API_KEY}; // specify your API key here

var nextToken;

var data_to_send_search;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set('views', __dirname + '/views');
app.use(express.static('public'));


app.get('/', function (req, res) {	
	if(typeof req.query.page == "string"){
		youtube.search.list({ key: API_KEY, part: 'snippet',chart: 'mostPopular' , type: 'video',maxResults:20}, function(err, data) {
      	res.send(data); 
  
  		});

	}
	else{
    	res.render('index');
	}
});


/* When the link is navigated to search, youtube api is called and data is stored in "data_to_send_search", then when the page
is rendered, ajax call is made from the page from and the "data_to_send_search" is sent
*/

/*
The page parameter identifies whether it's a call to render a page or to send data.
*/
app.get('/search/', function(req, res) {
  if(typeof req.query.page == "undefined"){
    res.send(data_to_send_search);
  }
/*
  This else if is to decide whether it is a call for "more" results or the first 20 results. 
  NextToken decides which call is to be made

*/
  else if(typeof req.query.nextToken =="undefined"){
    youtube.search.list({ key: API_KEY, part: 'snippet',q:req.query.q , type: 'video',maxResults:20}, function(err, data) {
        data.searchTerm = req.query.q;
        data_to_send_search = data; 
        res.render('index');

    
      });
  }

  else{

    youtube.search.list({ key: API_KEY, part: 'snippet',q:req.query.q , type: 'video',maxResults:20,pageToken:req.query.nextToken}, function(err, data) {
      res.send(data);
    
      });

  }


});

/*
This is the call to get the video information
*/

app.get('/getVideo/', function(req, res) {

  /*
  Here also, the href directs the page to the link which only renders 'videoView'. Then once it is rendered,
  it makes the ajax call and displays the data (data_to_send)
  */
   if (typeof req.query.vidId == 'undefined') {
        res.send(data_to_send);


    } 
    else {

      youtube.videos.list({key: API_KEY,id : req.query.vidId, part : 'snippet,statistics' },function(err,data){
        res.render('videoView');
        console.log(data.items[0]);
        data_to_send=data.items[0];


      });
    
    }




});

/*
It is used to get the channel information which is to be displayed 

*/
app.get('/channelInfo/', function(req, res){

  youtube.channels.list({key: API_KEY,id: req.query.chId, part: 'id,snippet'},function(err,data){
    console.log(data.items[0]);
    res.send(data.items[0]);

  });


});



app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
