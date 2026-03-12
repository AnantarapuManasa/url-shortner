const { customAlphabet } = require('nanoid');
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 7); // 7 chars, ~3e12 possibilities

function generateShortCode() {
  return nanoid();
}

module.exports = { generateShortCode };

