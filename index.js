const SimplDB = require("simpl.db");
const db = new SimplDB();

const express = require("express");
const app = express();

const fs = require("fs");
const cookieParser = require('cookie-parser');

const config = require("./data/config.json");
const apiKey = require("./api.js")

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("nveadmin09"));

app.get("/", (req, res) => {
    const scores = require("./data/schedule.json");

    const cookie = req.cookies.userToken;

    if(!cookie) return res.render("games", { title: "Games", games: scores, status: "logout" })

    res.render("games", { title: "Games", games: scores, status: "login" });
});

app.get("/games/:id", (req, res) => {
    const scores = require("./data/schedule.json");
    const id = req.params.id;   

    const cookie = req.cookies.userToken;

    if(!cookie) return res.render("game", { title: `${scores[id].title} - Game Details`, game: scores[id].games, status: "logout" })

    if(!scores[id]) {
        return res.redirect("/standings");
    }

    res.render("game", { title: `${scores[id].title} - Game Details`, game: scores[id].games, series: scores[id].series, team: scores[id], status: "login" });
    
})

app.get("/standings", (req, res) => {

    const cookie = req.cookies.userToken;

    if(!cookie) return res.render("Standings", { title: "Standings", status: "logout" })

    res.render("standings", { title: "Standings", status: "login" });
})

app.get("/bracket", (req, res) => {

    const cookie = req.cookies.userToken;

    if(!cookie) return res.render("bracket", { title: "Bracket", status: "logout" })

    res.render("bracket", {  title: "Bracket", status: "login" })
})

app.get("/login", (req, res) => {

    const cookie = req.cookies.userToken;

    if(!cookie) return res.render("login", { title: "Admin", status: "logout" })

    res.render("login", { title: "Login", status: "login" });
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    console.log(username + password)
     
    if(username === config.username && password === config.password) {

        res.setHeader('Set-Cookie', [
            'userToken=admin; Max-Age=34560000; HttpOnly; Secure; SameSite=Lax'
        ]);

        res.redirect(`/admin?username=${username}&password=0`);
    } else {
        res.render("login", { title: "Login", status: "error" });
    }
})

app.get("/teams", (req, res) => {

    const cookie = req.cookies.userToken;

    if(!cookie) return res.render("teams", { title: "Teams", status: "logout" })

    res.render("teams", { title: "Teams", status: "login" });
})

app.get("/admin", (req, res) => {

    const username = req.query.username;

    const cookie = req.cookies.userToken;

    if(!cookie) return res.redirect("/")

    res.render("admin", { title: "Admin", status: "login" })
})

// add a score to the database
app.get("/api/add/:game/:team1/:score1/:team2/:score2", (req, res) => {
    try {
    const game = req.params.game; // what game
    const team1 = req.params.team1; // what team 1
    const score1 = parseInt(req.params.score1); // what score 1
    const team2 = req.params.team2; // what team 2
    const score2 = parseInt(req.params.score2); // what score 2

    res.json({ status: "success" });
    } catch (err) {
    res.json({ status: "error", message: err.message });
    }
})

// show all scores in the database
app.get("/api/scores", (req, res) => {
    const scores = require("./data/schedule.json");
    res.json(scores);
})

app.get("/api/scores/:game", (req, res) => {
    const scores = require("./data/schedule.json");
    const game = req.params.game;   

    res.json( scores[game] )
})

app.get("/api/standings/:id", (req, res) => {

        const standings = require("./data/standings.json");
        const id = req.params.id;
    
        if(!standings[id]) {
           return res.json({ "Not Found": { player: "N/A", wins: "N/A", loss: "N/A" } });
        }

        res.json(standings[id]);
   
})

app.get("/api/seasons", (req, res) => {
    const seasons = require("./data/seasons.json");
    res.json(seasons);
})

app.get("/api/teamsnames", (req, res) => {
    const teamsnames = require("./data/teamsnames.json");
    res.json(teamsnames);
});

app.get("/api/teams/:id", (req, res) => {
    const id = req.params.id;
    const teams = require("./data/teams.json");
    res.json(teams[id]);
})

app.get("/api/bracket/", (req, res) => {
    const bracket = require("./data/bracket.json");
    res.json(bracket);
});

app.listen(80);

console.log("Online");

