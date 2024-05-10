/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let invalidBookId = '263ded1ae4f28258b59dd31d';
let validBookId;

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'Test'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'commentcount', 'Book in body should contain commentcount');
            assert.property(res.body, 'title', 'Book in body should contain title');
            assert.property(res.body, '_id', 'Book in body should contain _id');

            validBookId = res.body._id;

            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.notProperty(res.body, 'commentcount', 'Body should not contain commentcount if failed to create new Book');
            assert.notProperty(res.body, 'title', 'Body should not contain title if failed to create new Book');
            assert.notProperty(res.body, '_id', 'Body should not contain _id if failed to create new Book');
            assert.equal(res.text, 'missing required field title', 'Text should say "missing required field title" if no title was given');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get(`/api/books/${invalidBookId}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.notProperty(res.body, 'commentcount', 'Body should not contain commentcount if no Book was found based on the given id');
            assert.notProperty(res.body, 'title', 'Body should not contain title if no Book was found based on the given id');
            assert.notProperty(res.body, '_id', 'Body should not contain _id if no Book was found based on the given id');
            assert.equal(res.text, 'no book exists', 'Text should say "no book exists" if no book was found based on the given id');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${validBookId}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'commentcount', 'Body should contain commentcount if Book was found based on the given id');
            assert.property(res.body, 'title', 'Body should contain title if Book was found based on the given id');
            assert.property(res.body, '_id', 'Body should contain _id if Book was found based on the given id');
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${validBookId}`)
          .send({comment: 'This is a comment'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'commentcount', 'Body should contain commentcount if Book was updated successfully based on the given id');
            assert.property(res.body, 'title', 'Body should contain title if Book was updated successfully based on the given id');
            assert.property(res.body, '_id', 'Body should contain _id if Book was updated successfully based on the given id');
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post(`/api/books/${validBookId}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.notProperty(res.body, 'commentcount', 'Body should not contain commentcount if it failed to update a Book based on the given id');
            assert.notProperty(res.body, 'title', 'Body should not contain title if it failed to update a Book based on the given id');
            assert.notProperty(res.body, '_id', 'Body should not contain _id if it failed to update a Book based on the given id');
            assert.equal(res.text, 'missing required field comment', 'Text should say "missing required field comment" if no comment was provided when attempting to add a new comment for a Book');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post(`/api/books/${invalidBookId}`)
          .send({comment: 'This is a comment'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.notProperty(res.body, 'commentcount', 'Body should not contain commentcount if it failed to update a Book based on the given id');
            assert.notProperty(res.body, 'title', 'Body should not contain title if it failed to update a Book based on the given id');
            assert.notProperty(res.body, '_id', 'Body should not contain _id if it failed to update a Book based on the given id');
            assert.equal(res.text, 'no book exists', 'Text should say "no book exists" if no Book was found based on the given id');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${validBookId}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.notProperty(res.body, 'commentcount', 'Body should not contain commentcount if it deleted a Book based on the given id');
            assert.notProperty(res.body, 'title', 'Body should not contain title if it deleted a Book based on the given id');
            assert.notProperty(res.body, '_id', 'Body should not contain _id if it deleted a Book based on the given id');
            assert.equal(res.text, 'delete successful', 'Text should say "delete successful" if a Book with a given id was deleted');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete(`/api/books/${invalidBookId}`)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.notProperty(res.body, 'commentcount', 'Body should not contain commentcount if it failed to delete a Book based on the given id');
            assert.notProperty(res.body, 'title', 'Body should not contain title if it failed to delete a Book based on the given id');
            assert.notProperty(res.body, '_id', 'Body should not contain _id if it failed to delete a Book based on the given id');
            assert.equal(res.text, 'no book exists', 'Text should say "no book exists" if no Book was found based on a given id');
            done();
          });
      });

    });

  });

});
