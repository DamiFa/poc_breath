var express = require("express"),
    app     = express();

var games = [{
        name: "line",
        path: "/scripts/line.js"
    },
    {
        name: "circle",
        path: "/scipts/circle.js"
    }
];


app.set("view engine", "ejs");
app.use(express.static('public'));

app.get("/", function(req, res){
    res.render("home", {games: games});
});

app.get("/game/:id", function(req, res){
    res.render("game", {game: games[req.params.id]});
});

app.listen(process.env.PORT || 3000, function(){
    console.log("PoC started");
});