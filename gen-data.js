var mongoose = require('mongoose')
  , jf = require('jsonfile')
  , path = __dirname + '/data.json'
  , moment = require("moment")
  , _ = require('lodash')
  , async = require('async');

var config = require('./config.json');

mongoose.connect(config.db.url || ('mongodb://' + config.db.host + '/'+ config.db.name));

require('./models')();

var batchSize = 10000;
var sort = 'created_at';

var exec = [

  function(done){
    var User = mongoose.model('User');
    var ufields = '_id created_at';
    User.find().batchSize(batchSize).select(ufields).sort(sort)
      .exec(function(err, users){
        if (err) return done(err);

        var result = users.map(function(user){
          return {
            t: 'u',
            id: user._id,
            tm: moment(user.created_at).unix(),
          };
        });

        console.log('%s users processed', users.length);
        done(null, result);
      });
  },

  function(done){
    var Project = mongoose.model('Project');
    var pfields = '_id domain leader created_at';
    Project.find().batchSize(batchSize).select(pfields).sort(sort)
      .exec(function(err, projects){
        if (err) return done(err);

        var result = projects.map(function(project){
          return {
            t: 'p',
            d: project.domain,
            id: project._id,
            u: [project.leader], //TOOD: add contributors and followers
            tm: moment(project.created_at).unix(),
          };
        });

        console.log('%s projects processed', projects.length);
        done(null, result);
      });
  },

  function(done){
    var Dashboard = mongoose.model('Dashboard');
    var dfields =  'domain created_at';
    Dashboard.find().batchSize(batchSize).select(dfields).sort(sort)
      .exec(function(err, dashboards){
        if (err) return done(err);

        var result = dashboards.map(function(dashboard){
          return {
            t: 'd',
            d: dashboard.domain,
            tm: moment(dashboard.created_at).unix(),
          };
        });

        console.log('%s dashboards processed', dashboards.length);
        done(null, result);
      });
  }

];

async.series(exec, function(err, data){
  if (err) return console.log(err);

  var arr = [];
  data.forEach(function(list){
    arr = arr.concat(list);
  });

  arr.sort(function(a, b){
    return a.tm - b.tm;
  });

  jf.writeFile(path, arr, function(err){
    if (err) console.log(err);
    else console.log('%s items total processed', arr.length);
    process.exit(0);
  });

});
