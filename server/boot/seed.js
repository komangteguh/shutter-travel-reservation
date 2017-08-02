'use strict';
module.exports = function(app) {
  var User = app.models.user;
  var Vehicle = app.models.vehicle;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  User.find({where: {'email': 'admin@mail.com'}}, function(err, users) {
    if (users.length <= 0) {
      User.create(
        {
          'isActive': true,
          'firstName': 'Admin',
          'lastName': 'Reservation',
          'address': 'Jl. Raya Kuta',
          'phone': 8291124,
          'email': 'admin@mail.com',
          'username': 'admin',
          'password': 'password',
        }, function(err, user) {
        if (err) throw err;
        console.log('Created User:', user);

          // Create role admin
        createRole('admin', user, function(err, res) {
          if (err) throw err;
        });
      });
    }
  });
  User.find({where: {'email': 'CustomerTest@mail.com'}}, function(err, users) {
    if (users.length <= 0) {
      User.create(
        {
          'isActive': true,
          'firstName': 'Customer',
          'lastName': 'Tester',
          'address': 'Jl. Bypass Ngurah Rai XI',
          'phone': 8291124,
          'email': 'CustomerTest@mail.com',
          'username': 'customerTest',
          'password': 'password',
        }, function(err, user) {
        if (err) throw err;
        console.log('Created User:', user);
        if (err) throw err;

        createRole('customer', user, function(err, res) {
          if (err) throw err;
        });
      });
    };
  });

  Vehicle.find({where: {'brand': 'Mitsubishi'}}, function(err, vehicles) {
    if (vehicles.length <= 0) {
      Vehicle.create(
        {
          'vehicleNumber': 'B 1243 RS',
          'type': 'Bus',
          'brand': 'Mitsubishi',
          'seat': 30,
          'color': 'White',
        }, function(err, vehicle) {
        if (err) throw err;
        console.log('Created Vehicle:', vehicle);
        if (err) throw err;
      });
    };
  });

  function createRole(name, user, cb) {
    Role.find({where: {'name': name}}, function(err, roles) {
      if (roles.length <= 0) {
        Role.create({
          name: name,
        }, function(err, role) {
          if (err) cb(err);
          console.log('Created role:', role);
          createPrincipals(role, user, cb);
        });
      } else {
        console.log('Role ' + name + ' already exist');
        var role = roles[0];
        createPrincipals(role, user, cb);
      }
    });
  }

  function createPrincipals(role, user, cb) {
    role.principals({
      where: {
        principalId: user.id,
        principalType: RoleMapping.USER,
      },
    }, function(err, principals) {
      if (principals.length <= 0) {
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: user.id,
        }, function(err, principal) {
          if (err) cb(err);
          console.log('Created principal:', principal);
          cb(null, principal);
        });
      } else {
        console.log('Principal ' + user.id + ' already exist');
        cb(null, principals[0]);
      }
    });
  }
};
