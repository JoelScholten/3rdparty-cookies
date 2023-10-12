const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();


const feurl = 'https://www.scholten.dev';
const mfeurl = 'https://mfe.scholten.dev';
const beurl = 'https://api.scholten.dev';

app.use(cors({
    origin: [feurl, mfeurl],
    credentials: true,
}));

const options = {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    domain: 'api.scholten.dev',
}

app.use(cookieParser());


app.get('/', (req, res) => {
    if (req.headers.origin !== feurl) {
        console.log('invalid origin', req.headers.origin);

        res.status(403).send('Invalid origin');
    }

    // read cookies
    console.log(req.cookies)

    // Set cookie
    res.send({
        id: req.cookies.id_token
    });
});


app.get('/authorize', (req, res) => {
    const state = (new Date()).getTime();
    res.cookie('state', state, {
        ...options,
        sameSite: 'none',
        maxAge: 60000
    });

    console.log(req.headers); // er komt zo te zien wel een referer header mee

    res.send(`<script>window.location.href = "https://joelscholten.eu.auth0.com/authorize?response_type=code&client_id=7wp3x2aJEE6z6gDZTuXV145NwJEtvg8O&redirect_uri=${beurl}/authorize_return&scope=openid+profile+email+photos&state=${state}&nonce=zMDZeydP1Ax_JVdy";</script>`);
});

app.get('/refresh', async (req, res) => {
    if (req.headers.origin !== feurl) {
        console.log('invalid origin', req.headers.origin);

        res.status(403).send('Invalid origin');
    }

    // read cookies
    console.log(req.cookies)

    res.send('');
});

app.get('/authorize_return', async (req, res) => {
    const { state, code } = req.query;
    const cookieState = req.cookies.state;

    if (state != cookieState) {
        res.status(400).send(`Invalid state parameter cookie state: '${cookieState}' query state: '${state}'`);
        return;
    }

    res.clearCookie('state');

    const formBody = [];
    formBody.push(`grant_type=authorization_code`);
    formBody.push(`client_id=7wp3x2aJEE6z6gDZTuXV145NwJEtvg8O`);
    formBody.push(`client_secret=q8JXSNqWflFR85R-5mmC6FYjDKVuQxkDnQd57cOjWQYWzVZ9VnBfmD6JH9GthfZR`);
    formBody.push(`redirect_uri=${beurl}/authorize_return`);
    formBody.push(`code=${code}`);

    const result = await fetch(`https://joelscholten.eu.auth0.com/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody.join('&')
    });

    console.log('status', result.status);
    const tokenData = await result.json();

    res.cookie('access_token', tokenData.access_token, {
        ...options,
        path: '/refresh',
        expires: 0
    });

    res.cookie('id_token', tokenData.id_token, {
        ...options,
        expires: 0,
    });

    res.send('<script>window.location.href = "' + feurl + '";</script>');
});

app.listen(process.env.PORT || 3000, () => console.log(`App listening on port ${process.env.PORT || 3000}`));
