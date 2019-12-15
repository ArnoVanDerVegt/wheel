const express = require('express');
const app     = express();
const port    = 3000;

app.use(express.static('./'));
app.listen(
    port,
    function() {
        console.log('');
        console.log('Wheel IDE is running.');
        console.log('You can start Wheel at http://127.0.0.1:' + port + '/index.html in your browser...');
        console.log('');
    }
);