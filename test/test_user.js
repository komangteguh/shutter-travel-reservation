'use strict';

process.env.NODE_ENV = 'test';

describe('/User', function() {
  var server = require('../server/server');
  var request = require('supertest')(server);
  var assert = require('assert');

  var User, accessToken;

  before(function() {
    User = server.models.user;
  });

  beforeEach(function(done) {
    User.login(
        {'username': 'admin', 'password': 'password'},
     function(err, data) {
       accessToken = data;
       done();
     });
  });

  it('create user', function(done) {
    request.post('/api/users?access_token=' + accessToken.id)
      .send(
      {
        'isActive': true,
        'firstName': 'Mocha',
        'lastName': 'Test',
        'address': 'Jl. Bypass Ngurah Rai XI',
        'phone': 8291124,
        'email': 'mochaTest@mail.com',
        'username': 'mochaTest',
        'password': 'password',
      }
      )
    .expect(200, done);
  });
});
