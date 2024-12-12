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
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>URL Shortener</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background-color: #f8f9fa;
                    font-family: Arial, sans-serif;
                }
                .container {
                    max-width: 600px;
                    margin-top: 50px;
                }
                .short-url {
                    font-size: 18px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2 class="text-center mb-4">URL Shortener</h2>
                <form action="/shorten" method="POST">
                    <div class="input-group">
                        <input type="url" name="url" class="form-control" placeholder="Enter URL" required />
                        <button type="submit" class="btn btn-primary">Shorten</button>
                    </div>
                </form>
                <div id="short-url-result" class="mt-4"></div>
            </div>

            <script>
                // Display result dynamically after form submission
                const form = document.querySelector('form');
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const urlInput = document.querySelector('[name="url"]');
                    const url = urlInput.value;
                    fetch('/shorten', {
                        method: 'POST',
                        body: new URLSearchParams({ url: url }),
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .then(response => response.text())
                    .then(data => {
                        document.getElementById('short-url-result').innerHTML = data;
                        urlInput.value = ''; // Clear the input field after submission
                    });
                });
            </script>
        </body>
        </html>
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