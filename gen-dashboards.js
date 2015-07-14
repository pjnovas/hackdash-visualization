var mongoose = require('mongoose')
  , jf = require('jsonfile')
  , path = __dirname + '/dashboards.json'
  , moment = require("moment")
  , _ = require('lodash')
  , async = require('async');

var config = require('./config.json');

mongoose.connect(config.db.url || ('mongodb://' + config.db.host + '/'+ config.db.name));

require('./models')();

var batchSize = 10000;

var Dashboard = mongoose.model('Dashboard');
var Project = mongoose.model('Project');
var User = mongoose.model('User');

Dashboard
  .find({ projectsCount: { $gt : 0 } }) // only dashboards with projects
  .batchSize(batchSize)
  .sort('created_at')
  .exec(function(err, dashboards){
    if (err) throw err;

    var series = [];

    dashboards.forEach(function(dashboard){

      series.push(function(doneSerie){

        var dash = {
          d: dashboard.domain,
          n: dashboard.title || '',
          pc: dashboard.projectsCount,
          t: moment(dashboard.created_at).unix(),
        };

        async.waterfall([

          // get admins
          function(done){
            User.find({ admin_in: dash.d }).select('_id').exec(done);
          },

          // set admins
          function(admins, done){
            admins = admins || [];
            dash.ads = admins.map(function(a) { return a._id.toString(); });
            done();
          },

          // get projects
          function(done){
            Project.find({ domain: dash.d }).exec(done);
          },

          // set contributors
          function(projects, done){

            var people = [];

            // leader is inside contributors
            projects.forEach(function(p){
              p.contributors.forEach(function(c){
                var id = c.toString();
                if (people.indexOf(id) === -1 && dash.ads.indexOf(id) === -1){
                  people.push(id);
                }
              });
            });

            // set people count including admins and contributors
            dash.us = people.length + dash.ads.length;
            done();
          },

        ], function(err){
          doneSerie(err, dash);
        });

      });

    });

    async.series(series, function(err, dashboards){
      if (err) throw err;

      //console.dir(dashboards);

      dashboards.sort(function(a, b){
        return a.t - b.t;
      });

      jf.writeFile(path, dashboards, function(err){
        if (err) throw err;
        console.log('%s dashboards processed', dashboards.length);
        process.exit(0);
      });

    });

  });
