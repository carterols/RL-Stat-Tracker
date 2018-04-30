var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var rls = require('./lib/index.js');
var secret = require('./secret.json');

var app = express();
var port = process.env.PORT || 8000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.status(200).render('homepage');
});

app.get('/getPlayer', function (req, res) {
    console.log("Recieved a getPlayer request:", req.body);

    var client = new rls.Client({
        token: secret.api_key
    });
    if (req.body) {
        console.log("GET REQ");
    }

    client.searchPlayers("Olsencar", 3, function (status, data) {
        if(status === 200){
            console.log("-- Player Data:");
            console.log("   Display name: " + data.displayName);
            console.log("   Goals: " + data.stats.goals);
            res.status(200).send("Success");
        } else {
            console.log("-- getPlayer failed: " + status);
            res.status(500).send("Error retrieving player name");
        }
    });
    // client.getPlatformsData(function(status, data){
    //     if(status === 200){
    //         console.log("-- Platforms data:");
    //         console.log(data);
    //     }
    // });

    // client.getSeasonsData(function(status, data){
    //     if(status === 200){
    //         console.log("-- Seasons data:");
    //         console.log(data);
    //     }
    // });

    // client.getPlaylistsData(function(status, data){
    //     if(status === 200){
    //         console.log("-- Playlists data:");
    //         console.log(data);
    //     }
    // });

    // client.getTiersData(function(status, data){
    //     if(status === 200){
    //         console.log("-- Tiers data:");
    //         console.log(data);
    //     }
    // });
});

app.listen(port, function () {
    console.log("== Server listening on port:", port);
});

