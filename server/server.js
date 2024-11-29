// server.js

const http = require('http');

const PORT = process.env.PORT || 8000; // Port on which the server will listen
const app = require('./app');


require('dotenv').config();


const server = http.createServer(app);


app.get('/status', (req, res) => res.send({status: "Server is running!"}));


// Start the server and listen for requests on the specified port
server.listen(PORT, '0.0.0.0', () => {
    console.log((new Date()) +` Server listening on port ${PORT}`);
    console.log('\n');

});


