const mongoose = require( 'mongoose' );

const bookamrkCollectionSchema = mongoose.Schema({
    id : {
        type : String,
        required : true,
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    url : {
        type : String,
        unique :true,
        required : true
    },
    rating : {
        type : Number,
        required : true
    }
});

const bookmarksCollection = mongoose.model( 'bookmarks', bookamrkCollectionSchema );

const Bookmarks = {
    createBookmark : function( newBookmark ){
        return bookmarksCollection
                .create ( newBookmark )
                .then ( createdBookmark  => {
                    return createdBookmark;
                })
                .catch( err => {
                    return err;
                })
    },
    getAllBookmarks : function() {
        return bookmarksCollection
                .find()
                .then( allBookmarks => {
                    return allBookmarks;
                })
                .catch (err => {
                    return err;
                })
    },
    getBookmark : function(query){
        return bookmarksCollection
        .find({title : query})
        .then( bookmark=> {
            return bookmark;
        })
        .catch (err => {
            return err;
        })
    },
    deleteBookmark : function(query) {
        return bookmarksCollection
        .remove({id:query})
        .then(bookmark => {
            return bookmark;
        })
        .catch(err => {
            return err;
        })
    },
    updateBookmark : function(id, qtitle, qdescription, qurl, qrating) {
        return bookmarksCollection
        .updateOne({id:id}, {$set:{title:qtitle,description:qdescription, url:qurl, rating:qrating}})
        .then(bookmark => {
            return bookmark;
        })
        .catch(err => {
            return (err);
        })
    }
    
}


module.exports = {Bookmarks};
