require('./env.js')();
var Q      = require('q');
var qhttp  = require('q-io/http');
var xml2js = require('xml2js');
var _      = require('lodash');

module.exports = function () {
  var context = this,
      baseUrl = 'http://www.ctabustracker.com/bustime/api/v1/',
      key     = process.env['CTA_API_KEY'];

  var cta = {

    // resources of interest;
    resources: {
                 systemTime: 'gettime',
                 routes: 'getroutes'
               },

    // fns; return promises
    fns: {
          // main entry point
          getResource: function (resource) {
            return qhttp.read(baseUrl + resource + '?' + 'key=' + key)
              .then(_.compose(cta.fns.qParseXml, String))
          },

          qParseXml: function (xml) {
            var parseXml = xml2js.parseString;
            return Q.nfcall(parseXml, xml)
          },
    },
  }

  return cta;
}
