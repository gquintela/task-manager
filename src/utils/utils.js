const parsedId = _id => {
  /// checking all posible length of ID
  let _parsedId = _id;
  while (_parsedId.length < 24) {
    _parsedId = "0" + _parsedId;
  }
  return _parsedId;
};

module.exports = parsedId;
