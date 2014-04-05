module.exports = function (Schema) {
  var Route = new Schema({
    name   : { type: String },
    number : { type: String }
  });

  return Route;
}
