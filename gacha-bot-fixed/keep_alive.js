const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('✨ Gacha Bot is alive!');
});

function keepAlive() {
    const port = process.env.PORT || 3003;
    app.listen(port, '0.0.0.0', () => {
        console.log(`Keep-alive server running on port ${port}`);
    });
}

module.exports = keepAlive;
