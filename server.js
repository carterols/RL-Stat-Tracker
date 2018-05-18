var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var rls = require('rls-api');
var secret = require('./secret.json');
var path = require('path');
var nodeCache = require('node-cache');
const cache = new nodeCache();
var app = express();
var port = process.env.PORT || 8000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function (req, res) {
    res.status(200).render('homepage');
});

function getPlaylistsRanks(rankedSeasons) {
    const playlistsRanks = ["Unranked", "Bronze I","Bronze II","Bronze III","Silver I","Silver II","Silver III","Gold I","Gold II","Gold III","Platinum I","Platinum II","Platinum III","Diamond I","Diamond II","Diamond III","Champion I","Champion II","Champion III","Grand Champion"];
    const playlistsName = ["Solo-Duel", "Doubles", "Solo-Standard", "Standard"];
    var currentSeason = [
        rankedSeasons["7"]["10"],
        rankedSeasons["7"]["11"],
        rankedSeasons["7"]["12"],
        rankedSeasons["7"]["13"]
    ];

    for (var i = 0; i < 4; i++) {
        currentSeason[i].tier = playlistsRanks[currentSeason[i].tier];
        currentSeason[i].division += 1;
        currentSeason[i].playlist = playlistsName[Object.keys(currentSeason)[i]];
    }
    
    return currentSeason;
}
app.get("/getPlayer/:id/:platform", function (req, res) {
    console.log("Recieved a getPlayer request:", req.params);
    var client = new rls.Client({
        token: secret.api_key
    });

    var playerExists = true;
    var playerID;

    cache.get(req.params.id + req.params.platform, (err, value) => {
        if (!err) {
            if (value === undefined) {
                playerExists = false;
                playerID = req.params.id;
            } else {
                playerID = value.uniqueID;
            }
        }
    });

    client.getPlayer(playerID, req.params.platform, function (status, data) {
        if (status === 200) {
            if (!playerExists) {
                var playerObj = {'platform': req.params.platform, 'uniqueID': data.uniqueId};
                cache.set(playerID + req.params.platform, playerObj);
            }
            var currentSeason = getPlaylistsRanks(data.rankedSeasons);
            
            var playerData = {
                displayName: data.displayName,
                platform: req.params.platform,
                stats: data.stats,
                playlists: currentSeason
            };
    
            res.status(200).render('personalPage', playerData);
        } else {
            console.log("-- getPlayer failed: " + status);
            res.status(500).send("Error retrieving player name");
        }
    });
});

app.get("*", function (req, res) {
    res.status(404).send("Does not exist. 404 error");
});

app.listen(port, function () {
    console.log("== Server listening on port:", port);
});

