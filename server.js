const express = require("express");
const path = require("path");
const app = express();

require("dotenv").config();
app.use(express.json());
const { bots, playerRecord } = require("./data");
const { shuffleArray } = require("./utils");

// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

rollbar.log("Hello Duel Duo!");
// endpoint for public/index.html
app.get("/", function (req, res) {
  rollbar.info("USER ACCESSED DUEL DUO MAIN PAGE");
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
//Add new endpoints for your js file
app.get("/js", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.js"));
});
//Use middleware to serve the files on each request.
app.use("/styles", express.static(path.join(__dirname, "./public/index.css")));

app.use(express.json());

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr);
    rollbar.log("getting all the Bots");
  } catch (error) {
    console.log("ERROR GETTING BOTS", error);
    rollbar.error("UNABLE TO  GET BOTS");
    res.sendStatus(400);
  }
});

app.get("/api/robots/five", (req, res) => {
  try {
    let shuffled = shuffleArray(bots);
    let choices = shuffled.slice(0, 5);
    let compDuo = shuffled.slice(6, 8);
    res.status(200).send({ choices, compDuo });
    rollbar.info("GETTING FIVE BOTS FOR CHOICES");
  } catch (error) {
    console.log("ERROR GETTING FIVE BOTS", error);
    rollbar.error("ERROR IN GETTING FIVE BOTS");
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    // getting the duos from the front end
    let { compDuo, playerDuo } = req.body;

    // adding up the computer player's total health and attack damage
    let compHealth = compDuo[0].health + compDuo[1].health;
    let compAttack =
      compDuo[0].attacks[0].damage +
      compDuo[0].attacks[1].damage +
      compDuo[1].attacks[0].damage +
      compDuo[1].attacks[1].damage;

    // adding up the player's total health and attack damage
    let playerHealth = playerDuo[0].health + playerDuo[1].health;
    let playerAttack =
      playerDuo[0].attacks[0].damage +
      playerDuo[0].attacks[1].damage +
      playerDuo[1].attacks[0].damage +
      playerDuo[1].attacks[1].damage;

    // calculating how much health is left after the attacks on each other
    let compHealthAfterAttack = compHealth - playerAttack;
    let playerHealthAfterAttack = playerHealth - compAttack;

    // comparing the total health to determine a winner
    if (compHealthAfterAttack > playerHealthAfterAttack) {
      playerRecord.losses++;
      res.status(200).send("You lost!");
      rollbar.info("PLAYER Lost");
    } else {
      playerRecord.losses++;
      res.status(200).send("You won!");
      rollbar.info("PLAYER  Won");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    rollbar.critical("ERROR DUELING:", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
    rollbar.INFO("GETTING PLAYER STATS");
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    rollbar.error("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
