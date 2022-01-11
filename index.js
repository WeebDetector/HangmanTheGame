const express = require('express');
const gameApp = express();

gameApp.listen(3000, () => console.log('Listening at 3000'));
gameApp.use(express.static('public'));
gameApp.use(express.json());

var possibleWords = ['table', 'hello', 'sunshine', 'knowledge', 'interface'];
var clientsConnected = 0;
var clients = {};

gameApp.post('/checkLetter', (request, response) => {       // A route that receives userId and a letter, checks if the letter is in the word
    const data = request.body;                              // and sends the response whether the guess is correct as well as a number of correct and incorrect guesses
    var client = clients[data.userId - 1];
    if (client.selectedWord.toLowerCase().includes(data.letter.toLowerCase())) {
        var regex = new RegExp("" + data.letter.toLowerCase() + "", "g");
        client.correctGuesses += (client.selectedWord.toLowerCase().match(regex)).length;
        response.json({
            status: "Successful Guess",
            letterReceived: data.letter,
            incorrectGuesses: client.incorrectGuesses,
            correctGuesses: client.correctGuesses
        });
    } else {
        client.incorrectGuesses += 1;
        response.json({
            status: "Unsuccessful Guess",
            letterReceived: data.letter,
            incorrectGuesses: client.incorrectGuesses,
            correctGuesses: client.correctGuesses
        });
    }
});

gameApp.post('/generateWord', (request, response) => {          // A route that receives userId and generates a word for that specific user
    const data = request.body;                                  // after which the word is sent to the user
    var client = clients[data.userId - 1];
    var wordToSend = possibleWords[Math.floor((Math.random() * possibleWords.length))];
    client.selectedWord = wordToSend;
    client.correctGuesses = 0;
    client.incorrectGuesses = 0;
    response.json({
        status: "Sending over generated word to the client side",
        userToSendTo: data.userId,
        word: wordToSend
    });
});

gameApp.get('/userConnected', (request, response) => {         // A route that generates unique Id for each user that connects and creates required variables for that specific user
    console.log("User connected");
    clients[clientsConnected] = { selectedWord: 'ggs', correctGuesses: -1, incorrectGuesses: -1 };
    clientsConnected += 1;
    response.json({
        status: "Sending over unique client identifier",
        uniqId: clientsConnected
    });
});