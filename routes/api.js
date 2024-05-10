/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose');

  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  let Book;

  let bookSchema = mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    comments: [String],
    commentcount: {
      type: Number,
      required: true,
      default: 0
    }
  });

  Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find(function(err, result) {
        if(err) {
          res.json({error: err});
        } else {
          res.json(result);
        }
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title) {
        res.send('missing required field title');
        return;
      }
      
      let newBook = Book({title: title});

      newBook.save(function(err, doc) {
        if(err) {
          res.json({error: err});
        } else {
          res.json(doc);
        }
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany(function(err, result) {
        if(err) {
          res.json({error: err});
        } else {
          res.send('complete delete successful');
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      if(!bookid) {
        res.send('missing required field _id');
        return;
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, function(err, result) {
        if(err) {
          res.json({error: err});
        } else if (!result) {
          res.send('no book exists');
        } else {
          res.json(result);
        }
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!bookid) {
        res.send('missing required field _id');
        return;
      }
      if(!comment) {
        res.send('missing required field comment');
        return;
      }

      Book.findById(bookid, function(err, existing) {
        if(err) {
          res.json({error: err});
        } else if (!existing) {
          res.send('no book exists');
        } else {
          existing.comments.push(comment);

          existing.commentcount = existing.comments.length;
          existing.save(function(err, result) {
            if(err) {
              res.json({error: err});
            } else {
              res.json(existing);
            }
          });
        }
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if(!bookid) {
        res.send('missing required field _id');
        return;
      }



      Book.findById({_id: bookid}, function(err, existing) {
        if(err) {
          res.json({error: err});
        } else if (!existing) {
          res.send('no book exists');
        } else {
          existing.delete(function(err, result) {
            if(err) {
              res.json({error: err});
            } else {
              res.send('delete successful');
            }
          });
        }
      });
    });
  
};
