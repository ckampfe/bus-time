// this is the main entry point for models
// load all models here, and then require in app.js
module.exports = function (Schema) {
  return {
           routeSchema:  require('./route.js')(Schema),
           stopSchema:   require('./stop.js')(Schema)
         }
}
