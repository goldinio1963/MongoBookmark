const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const validation = require('./middleware/validationToken');
const { Bookmarks } = require('./bookmarkModel');
const mongoose = require('mongoose');

const app = express();
const jsonParser = bodyParser.json();

app.use(morgan('dev'));
app.use(validation);


let listOfBookmark = [
    {
        id: uuid.v4(),
        title: "WarThunder-wiki",
        description: "Official warthunder wiki page",
        url: "https://wiki.warthunder.com/Main_Page",
        rating: 80
    },
    {
        id: uuid.v4(),
        title: "WorldofTanks-wiki",
        description: "Official worldoftanks wiki page",
        url: "https://wiki.wargaming.net/es/World_of_Tanks",
        rating: 90
    },
    {
        id: uuid.v4(),
        title: "uuid",
        description: "Description of how to use the uuid package",
        url: "https://www.npmjs.com/package/uuid",
        rating: 60
    }
];

app.get('/bookmarks', (req, res) => {

    console.log("Getting all bookmarks.");

    Bookmarks
        .getAllBookmarks()
        .then(result => {
            return res.status(200).json(result);
        });



});

app.get('/bookmark', (req, res) => {

    console.log("Getting bookmark by title");

    let title = req.query.title;


    if (!title) {
        res.statusMessage = "Please send the 'title' as parameter"
        return res.status(406).end();
    }


    Bookmarks
        .getBookmark(title)
        .then(bookmark => {
            if (!bookmark) {
                res.statusMessage = "No bookmark found with the provided 'title'";
                return res.status(404).end();
            }
            else {
                return res.status(200).json(bookmark);
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end()
        });

    // let result = listOfBookmark.find( (bookmark) => {
    //     if(bookmark.title == title) {
    //         return bookmark;
    //     }
    // });

    // if(!result) {
    //     res.statusMessage = `There are no bookmarks with the provided title=${title}`;
    //     return res.status(404).end();
    // }

    //return res.status(200).json(result);

});

app.post('/bookmarks', jsonParser, (req, res) => {
    console.log("Creating a new bookmark");

    let id = uuid.v4();
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;
    let flag = true;

    if (!title || !description || !url || !rating) {
        if (!title) {
            res.statusMessage = "The 'title' parameter is missing in the request";
        } else {
            if (!description) {
                res.statusMessage = "The 'description' parameter is missing in the request";
            } else {
                if (!rating) {
                    res.statusMessage = "The 'rating' parameter is missing in the request";
                } else {
                    res.statusMessage = "The 'url' parameter is missing in the request";
                }
            }
        }
        return res.status(406).end();
    }

    if (typeof (rating) !== 'number') {
        res.statusMessage = "This 'rating' is not a number";
        return res.status(403).end();
    }
    const newBookmark = {
        id,
        title,
        description,
        url,
        rating
    }


    Bookmarks
        .createBookmark(newBookmark)
        .then(result => {
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end()
        });
});

app.delete('/bookmark/:id', (req, res) => {
    console.log("Delete a bookmark");
    let id = req.params.id;

    if (!id) {
        res.statusMessage = "Please send the 'id' to delete a bookmark";
        return res.status(406).end();
    }

    Bookmarks
        .deleteBookmark(id)
        .then(result => {
            if (result.ok === 1) {
                return res.status(200).end();
            } else {
                res.statusMessage = "That 'id' was not found, please input a valid 'id'.";
                return res.status(404).end();
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end()
        });

    // let itemToRemove = listOfBookmark.findIndex( (bookmark) =>{
    //     if(bookmark.id === id) {
    //         return true;
    //     }
    // });

    // if(itemToRemove < 0){
    //     res.statusMessage = "That 'id' was not found in the list of bookmark"
    //     return res.status(404).end();
    // };

    // listOfBookmark.splice(itemToRemove,1);
    // return res.status(200).end();
});

app.patch('/bookmark/:id', jsonParser, (req, res) => {
    let bid = req.body.id;
    let pid = req.params.id;
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;
    let items = true;

    if (!bid || !pid) {
        res.statusMessage = "The 'id' is missing form the parameters or the body"
        return res.status(406).end();
    }

    if (bid !== pid) {
        res.statusMessage = "The 'id' passed as body and the 'id' passed as parameter are different";
        return res.status(409).end()
    }

    if (title != undefined) {
        if (items) {
            items = false;
        }
    }

    if (description != undefined) {
        if (items) {
            items = false;
        }
    }

    if (url != undefined) {
        if (items) {
            items = false;
        }
    }

    if (rating != undefined) {
        if (items) {
            items = false;
        }
    }

    if (items) {
        res.statusMessage = "There are no parameters to change";
        return res.status(400).end();
    }

    Bookmarks
        .updateBookmark(pid, title, description, url, Number(rating))
        .then(item => {
            if (!item) {
                res.statusMessage = "That 'id' was not found, please input a valid 'id'.";
                return res.status(404).end();
            }
            else {
                return res.status(202).json(item)
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end()
        });


    /*
    // let itemToPatch = listOfBookmark.findIndex( (bookmark) =>{
    //     if(bookmark.id === pid) {
    //         return true;
    //     }
    // });

    // if(itemToPatch < 0){
    //     res.statusMessage = "That 'id' was not found in the list of bookmark"
    //     return res.status(400).end();
    // };

    // return res.status(202).json(listOfBookmark[itemToPatch]);
    */
});

app.listen(8080, () => {
    console.log("this server is running on port 8080")
    new Promise((resolve, reject) => {
        mongoose.connect('mongodb://localhost/bookmarksdb', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("bookmarksdb connected successfully")
                return resolve();
            }
        })
    })
        .catch(err => {
            mongoose.disconnect();
            console.log(err);
        })
})
