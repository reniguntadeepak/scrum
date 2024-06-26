const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const { v4: uuidv4 } = require('uuid');
const store = new session.MemoryStore();
const bcrypt = require('bcrypt');
require('dotenv').config();
const pool = require('./db');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket) => {
    socket.on("join_session", async ({ sessionid, username }) => {
        console.log(`User joined session: ${sessionid}, Username: ${username}`);
        const query = 'SELECT * FROM voting WHERE session_id = $1;';
        try {
            const result = await pool.query(query, [sessionid]);

            socket.join(sessionid);
            io.in(sessionid).emit("voters", result.rows);
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("submit_vote", async ({ sessionid, username, vote }) => {
        console.log(`Vote received: SessionID: ${sessionid}, Username: ${username}, Vote: ${vote}`);
        const query = 'UPDATE voting SET vote = $1 WHERE session_id = $2 AND user_name = $3 RETURNING *;';
        const values = [vote, sessionid, username];
        try {
            const result = await pool.query(query, values);
            if (result.rowCount === 1) {
                const updatedResult = await pool.query('SELECT * FROM voting WHERE session_id = $1;', [sessionid]);
                io.in(sessionid).emit("voters", updatedResult.rows);
            } else {
                console.log(`Vote update failed: ${username} in session ${sessionid}`);
            }
        } catch (err) {
            console.error(err);
        }
    });

    socket.on("toggle_votes_visibility", async ({ sessionid }) => {
        console.log(`Toggle vote visibility for session: ${sessionid}`);
        const query = 'UPDATE sessions SET votes_visible = NOT votes_visible WHERE id = $1 RETURNING votes_visible;';
        try {
            const result = await pool.query(query, [sessionid]);
            if (result.rowCount === 1) {
                io.in(sessionid).emit("toggle_votes", result.rows[0].votes_visible);
            } else {
                console.log(`Failed to toggle vote visibility for session: ${sessionid}`);
            }
        } catch (err) {
            console.error('Error toggling vote visibility:', err);
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(session({
    secret: 'f4z4gs$Gcg',
    resave: false,
    saveUninitialized: false,
    store,
    cookie: { maxAge: 300000, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
// Add this route in app.js

app.post('/toggle_votes_visibility', async (req, res) => {
    const { sessionid } = req.body;
    console.log(`Toggling vote visibility for session: ${sessionid}`);
    const query = 'UPDATE sessions SET votes_visible = NOT votes_visible WHERE id = $1 RETURNING votes_visible;';
    try {
        const result = await pool.query(query, [sessionid]);
        if (result.rowCount === 1) {
            const votesVisible = result.rows[0].votes_visible;
            io.in(sessionid).emit("toggle_votes", votesVisible);
            return res.json({ votesVisible });
        } else {
            console.log(`Failed to toggle vote visibility for session: ${sessionid}`);
            return res.status(404).send('Session not found.');
        }
    } catch (err) {
        console.error('Error toggling vote visibility:', err);
        return res.status(500).send('Error');
    }
});

passport.use(new LocalStrategy((username, password, done) => {
    const query = 'SELECT * FROM users WHERE username = $1';
    pool.query(query, [username], async (err, result) => {
        if (err) {
            return done(err);
        }
        if (result.rows.length === 0) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const user = result.rows[0];
        try {
            const matchedPassword = await bcrypt.compare(password, user.password);
            if (!matchedPassword) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (bcryptError) {
            return done(bcryptError);
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get('/public/*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    res.sendFile(filePath);
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/loginpage'
}));

app.post("/signin", async (req, res) => {
    const { username, password, email } = req.body;
    const id = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const query = 'INSERT INTO users (id, username, password, email) VALUES ($1, $2, $3, $4)';
    const values = [id, username, hash, email];

    try {
        const result = await pool.query(query, values);
        console.log("Success");
        res.redirect("/loginpage");
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Try using a different username, password, or email');
    }
});

app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.send('/loginpage');
    });
});

app.get('/api/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

app.post('/session', async (req, res) => {
    const { sessionname, username } = req.body;
    const id = uuidv4();
    const query1 = 'INSERT INTO sessions (id, session_name, user_name, status, date, votes_visible) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)';
    const values1 = [id, sessionname, username, "active", true]; // Assuming the session creator is the moderator
    const query2 = 'INSERT INTO voting (session_id, user_name, is_moderator) VALUES ($1, $2, $3);';
    const values2 = [id, username, true]; // By default, votes are hidden when joining

    try {
        const result1 = await pool.query(query1, values1);
        if (result1.rowCount === 1) {
            const result2 = await pool.query(query2, values2);
            if (result2.rowCount === 1) {
                return res.redirect(`/voting/${id}`);
            } else {
                return res.status(500).send('Failed to join the session.');
            }
        } else {
            return res.status(404).send('Session not found.');
        }
    } catch (err) {
        console.error('Error inserting into the database:', err);
        return res.status(500).send("Error");
    }
});

app.post('/joinsession', async (req, res) => {
    const { sessionid, username } = req.body;
    const query1 = 'SELECT * FROM sessions WHERE id = $1 and status= $2;';
    const values1 = [sessionid, 'active'];
    const query2 = 'INSERT INTO voting (session_id, user_name) VALUES ($1, $2);';
    const values2 = [sessionid, username];

    try {
        const result1 = await pool.query(query1, values1);
        if (result1.rowCount === 1) {
            const result2 = await pool.query(query2, values2);
            if (result2.rowCount === 1) {
                return res.redirect(`/voting/${sessionid}`);
            } else {
                return res.status(500).send('Failed to join the session.');
            }
        } else {
            return res.status(404).send('Session not found.');
        }
    } catch (err) {
        console.error('Error querying the database:', err);
        return res.status(500).send('Error');
    }
});

server.listen(process.env.PORT || 4000, () => {
    console.log(`Server up on port ${process.env.PORT || 4000}`);
});
