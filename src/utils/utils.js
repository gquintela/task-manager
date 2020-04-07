const parsedId = _id => {
  /// checking all posible length of ID
  let _parsedId = _id;
  while (_parsedId.length < 24) {
    _parsedId = "0" + _parsedId;
  }
  return _parsedId;
};

const getVerificationNumber = () => {
  const numberOfDigits = 6
  const x = 10 ** numberOfDigits
  num = Math.random();
  num = Math.floor((num * x), x)
  return num
}

module.exports = {
  parsedId,
  getVerificationNumber
};