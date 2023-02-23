const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(bodyParser.json());

// create mysql connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'interviews_db'
});

connection.connect((err) => {
  if (err) {
    console.log('Error connecting to database');
  } else {
    console.log('Connected to database');
  }
});

// create interview
app.post('/api/interviews', (req, res) => {
  const { participants, startTime, endTime } = req.body;

  // check if participants are available
  connection.query('SELECT * FROM interviews WHERE startTime <= ? AND endTime >= ? AND ? IN (participants)', [endTime, startTime, participants], (err, results) => {
    if (err) {
      console.log('Error fetching interviews');
      res.status(500).send('Server error');
    } else if (results.length > 0) {
      res.status(400).send('One or more participants have another interview scheduled at the same time');
    } else if (participants.length < 2) {
      res.status(400).send('Interview must have at least 2 participants');
    } else {
      // insert new interview
      connection.query('INSERT INTO interviews (participants, startTime, endTime) VALUES (?, ?, ?)', [participants.join(','), startTime, endTime], (err, results) => {
        if (err) {
          console.log('Error creating interview');
          res.status(500).send('Server error');
        } else {
          res.status(201).send('Interview created successfully');
        }
      });
    }
  });
});

// update interview
app.put('/api/interviews/:id', (req, res) => {
  const { participants, startTime, endTime } = req.body;
  const id = req.params.id;

  // check if participants are available
  connection.query('SELECT * FROM interviews WHERE startTime <= ? AND endTime >= ? AND ? IN (participants) AND id != ?', [endTime, startTime, participants, id], (err, results) => {
    if (err) {
      console.log('Error fetching interviews');
      res.status(500).send('Server error');
    } else if (results.length > 0) {
      res.status(400).send('One or more participants have another interview scheduled at the same time');
    } else if (participants.length < 2) {
      res.status(400).send('Interview must have at least 2 participants');
    } else {
      // update interview
      connection.query('UPDATE interviews SET participants = ?, startTime = ?, endTime = ? WHERE id = ?', [participants.join(','), startTime, endTime, id], (err, results) => {
        if (err) {
          console.log('Error updating interview');
          res.status(500).send('Server error');
        } else {
          res.status(200).send('Interview updated successfully');
        }
      });
    }
  });
});

// get all interviews
app.get('/api/interviews', (req, res) => {
  connection.query('SELECT * FROM interviews', (err, results) => {
    if (err) {
      console.log('Error fetching interviews');
      res.status(500).send('Server error');
    } else {
      res.status(200).json(results);
    }
  });
});

// start server
// start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
  