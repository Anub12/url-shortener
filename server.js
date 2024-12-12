const express = require('express')
const crypto = require('crypto')

const app = express();
const port = 3000;

const urlDatabase = {};

function generateShortUrl() {
    return crypto.randomBytes(6).toString('hex');
}

// Serve the homepage with a URL sumbission form
app.get('/', (req, res) => {
    res.send(`
        <form action="/shorten" method="POST">
            <input type="text" name="url" placeholder="Enter URL" required />
            <button type="submit">Shorten</button>
        </form>
    `);
});

// Handle URL shortening
app.post('/shorten', express.urlencoded({ extended : true }), (req, res) => {
    const { url } = req.body;
    const shortUrl = generateShortUrl();

    // Store the URL with the generated short URL
    urlDatabase[shortUrl] = url;
    
    res.send(`
        Shortened URL: <a href="/${shortUrl}">/${shortUrl}</a><br>
        Original Url: ${url}
    `);
});

// Redirect to the original URL from the short URL
app.get('/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;
    const originalUrl = urlDatabase[shortUrl];

    if(originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

app.listen(port, () => {
    console.log(`URL shortener app listening at http:/localhost:${port}`);
});