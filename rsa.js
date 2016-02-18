;(function () {

function onEncryptButtonClick () {
  var plaintext = $('#message').val();
  var encodedPaintext = encode(plaintext);
  var encryptedText = encryptString(encodedPaintext);
  $('#cipher').html(encryptedText.join(' '));
  $('#cipher-text').val(encryptedText.join(' '));
}

function onDecryptButtonClick () {
  var cipher = $('#cipher-text').val().split(' ');
  var decryptedText = decrypt(cipher);
  $('#plaintext').html(decode(decryptedText));
}



var RSA = (function () {
  function RSA () {
    this.data = { p: 7, q: 11, n: 77, e: 17, d: 53 }
  }

  RSA.prototype.getN = function() { return this.data.n };
  RSA.prototype.getE = function() { return this.data.e };
  RSA.prototype.getD = function() { return this.data.d };
  RSA.prototype.genRandom = function() {
    // not implemented
  };

  return RSA
}());

var rsa = new RSA()

/* // Key pairs would normally be very large modulo in RSA keys, these functions support all utf8
function IntToChar (i) { return String.fromCharCode(i); }
function CharToInt (c) { return String(c).charCodeAt(0); }
*/
var lookup = " abcdefghijklmnopqrstuvwxyz.!?"
function IntToChar (i) { return lookup.charAt(i); }
function CharToInt (c) { return lookup.indexOf(c); }

function encrypt(data, e, n) {
  return (new BigNumber(data))
    .toPower( e )
    .modulo( n )
}

function encryptString(plainTextArray) {
    var encryptionArray = []
    var n = rsa.getN()
    var e = rsa.getE()
    for (var i = 0, len = plainTextArray.length; i < len; i++) {
        var data = plainTextArray[i]
        var encryptedData = encrypt(data, e, n)
        encryptionArray.push(encryptedData)
    }
    return encryptionArray
}

function decrypt(encryptedArray) {
    var decryptedArray = []
    var number
    var n = rsa.getN()
    var d = rsa.getD()
    for (var i = 0, len = encryptedArray.length; i < len; i++) {
        number = new BigNumber(encryptedArray[i])
        number = number
          .toPower(d)
          .modulo(n)

        decryptedArray.push(number)
    }
  return decryptedArray;
}

function decode(encodedResult) {
  var result = '';
  for (var i = 0, len = encodedResult.length; i < len; i++) {
    result += IntToChar(encodedResult[i]);
  }
  return result;
}

function encode(plaintext) {
    var encodedArray = []
    var plaincharsArray = plaintext.split('')
    for (var i = 0, len = plaincharsArray.length; i < len; i++) {
      encodedArray.push(CharToInt(plaincharsArray[i]))
    }
    console.log(encodedArray);
    return encodedArray;
}

// script is loaded after the dom elements, so document ready is unecessary.
$("#encrypt-button").click(onEncryptButtonClick);
$('#decrypt-button').click(onDecryptButtonClick);

// Test
$('#message').val("abcdefg")
onEncryptButtonClick()
onDecryptButtonClick()


}());