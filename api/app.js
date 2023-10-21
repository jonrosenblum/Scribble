const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in the nongoose models

const { List, Task } = require('./db/models');


// Load middleware 
app.use(bodyParser.json());


/* ROUTE HANDLERS */

/* LIST ROUTES */

/**
 * Get /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    // we want to return an array of all the lists in the database
    List.find({}).then((lists) => {
        res.send(lists);
    })
})

/**
 * POST /lists
 * Purpose: Create a list 
 */
app.post('/lists', (req, res) => {
    // we want to create a new lust and return the new list document back to the user (which includes the id)
    // The list information fields will be passed in via the JSON Request body
    let title = req.body.title;
    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        res.send(listDoc);
    })
});

/**
 * PATCH /lists/:id
 * Purpose: Update specified list 
 */
app.patch('/lists/:id', (req, res) => {
    // We want to update the specified list with the new values in the JSON Request body
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list 
 */
app.delete('/lists/:id', (req, res) => {
    // We want to delete the specified list 
});

app.get('/', (req, res) => {
    res.send('Welcome world');
})


app.listen(3000, () => {
    console.log("Server is listening on port 300");
});