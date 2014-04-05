module.exports = function (Schema) {
  var Stop = new Schema({
    name    : { type: String },
    'id'    : { type: String },
    routes  : { type: Array }
  });

  return Stop;
}
