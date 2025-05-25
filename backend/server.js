// Express library used to create a web server that will listen and respond to API calls from the frontend
const express = require('express');

// Instantiate an express object to interact with the server
const app = express();

// Middleware to allow cross-origin requests
const cors = require('cors');
const db = require('./db-connector');

// Set a port in the range: 1024 < PORT < 65535
const PORT = 5183;

const MY_ONID = "haviceh"

// If on FLIP or classwork, use cors() middleware to allow cross-origin requests from the frontend with your port number:
// EX (local): http://localhost:5173
// EX (FLIP/classwork) http://classwork.engr.oregonstate.edu:5173
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests, good thing to know
// Route imports
const peopleRoutes = require('./routes/people');
const usersRoutes = require('./routes/users');
const relationshipsRoutes = require('./routes/relationships');
const relationshipEventsRoutes = require('./routes/relationshipEvents');
const tagsRoutes = require('./routes/tags');
const relationshipTagsRoutes = require('./routes/relationshipTags');
const reset = require('./routes/reset')

// Routes
app.use('/people', peopleRoutes);
app.use('/users', usersRoutes);
app.use('/relationships', relationshipsRoutes);
app.use('/events', relationshipEventsRoutes);
app.use('/tags', tagsRoutes);
app.use('/relationship-tags', relationshipTagsRoutes);
app.use('/reset', reset)


app.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users LIMIT 1');
  res.status(200).json(rows);
});

app.listen(PORT, () => {
    console.log(`Backend running at http://classwork.engr.oregonstate.edu:${PORT}`);
});
