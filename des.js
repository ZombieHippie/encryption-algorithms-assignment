;(function () {

// function to 8-char string into 2 32 bitarrys L & R
function stringToBitArray(str) {
    var bitArray = [];
    for (i=0; i < str.length; i++) {
        bitArray.push(str[i].charCodeAt(0));
    }
    var bitObject = {
        left: bitArray.slice(0,4),
        right: bitArray.slice(-4)
    };
    return bitObject;
}

// randomly generate 7 digit key
function generateKey() {
    var key = '';
    for (i=0; i < 7; i++) {
        key += Math.floor((Math.random() * 9) + 1).toString();
    }
    return parseInt(key);
}


// function to generate subkey based on cycle
function generateSubkey(key, cycle) {
    var orNum = Math.floor(key / cycle);
    var subKey = key ^ orNum;
    return subKey;
}


// 
function cycleFunc(bitArray, subKey) {
    var newObjectHalf = [];
    for (j=0; j < bitArray.length; j++){
        newObjectHalf[j] = bitArray[j] ^ subKey;
    }
    return newObjectHalf;
}


function xOrHalves(bitArrayLeft, bitArrayRight) {
    for (var k=0; k < bitArrayLeft.length; k++) {
        bitArrayRight[k] = bitArrayRight[k] ^ bitArrayLeft[k];
    }
    return bitArrayRight;
}


// cycle function takes L, R, cycle#, key
function desCycle(bitObject, key, cycle) {
    var newObject = {};
    var subKey = generateSubkey(key, cycle);
    newObject.left = bitObject.right;
    newObject.right = xOrHalves(bitObject.left, cycleFunc(bitObject.right, subKey));
    return newObject;
}


// encrypt function
function encrypt() {
    var str = 'hellowor';
    var key = 1234567;
    var bitObject = stringToBitArray(str);
    for (i=0; i < 16; i++) {
        bitObject = desCycle(bitObject, key, i);
        console.log(bitObject.left);
        console.log(bitObject.right);
        console.log('Iteration: ' + i);
    }
    decrypt(bitObject, key);
    return console.log(bitObject, key);
}


// decrypt funciton
function decrypt(bitObject, key) {
    for (i=16; i > 0; i--) {
        bitObject = desCycle(bitObject, key, i);
    }
    return console.log(bitObject);
}

// declare onclick events
$('#des-encrypt').click(encrypt);
$('#des-decrypt').click(decrypt);

}());