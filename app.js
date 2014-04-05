var Q        = require('q'),
    mongoose = require('mongoose'),
    qhttp    = require('q-io/http'),
    Twit     = require('twit'),
    xml2js   = require('xml2js'),
    _        = require('lodash');


// load env, connect to db
mongoose.connect('mongodb://localhost/cta');
require('./env.js')();

// load models, schema
var Schema = mongoose.Schema;
var models = require('./app/models/models.js')(Schema);

// instantiate models
var Route = mongoose.model('Route', models.routeSchema);
var Stop  = mongoose.model('Stop', models.stopSchema);

/*
 * APIs
 */
// var twitter = require('./get_tweets');
var cta     = require('./get_cta.js')();

// CTA query wrapper
function getCTA (resource) {
  return cta.fns.getResource(resource);
}

// get routes xml, parse it
getCTA(cta.resources.routes)
  .then(function (res) {

    /*
     * DROP EACH TIME, FOR TESTING
     */
    mongoose.connection.collections['routes'].drop( function(err) {
      console.log('collection dropped');
    })
    /*
     *
     */

    // return routes collection
    return res['bustime-response'].route;
  })

  // normalize it, taking out unneeded arrays
  // like:
  // { routeNumber: '130', routeName: 'Museum Campus' }
  // this is mostly for programmer readability
  .then(function (routes) {
    return _.map(routes, function (routeObj) {
      return {
               number: routeObj['rt'][0],
               name:   routeObj['rtnm'][0]
             }
    })
  })

  /*
   * ADD ROUTES TO DB
   */
  .then(function (routes) {
    _.each(routes, function (r) {
      var route = new Route();
      route.name   = r['name'];
      route.number = r['number'];
      route.save(function (err) {
        return new Error(err);
      });
    });
  })

  /*
   * SAMPLE QUERY
   */
  .then(function () {
    return Q.ninvoke(Route, 'find', { number: '1' }, 'name number');
  })
  .then(console.log)
  .then(null, console.error)
  .done();

getCTA(cta.resources.systemTime)
  .then(console.log)
  .then(null, console.error)
  .done();
