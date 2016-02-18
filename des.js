;(function () {

// function to 8-char string into 2 32 bitarrys L & R
function stringToBitArray(str) {
    var bitArray = [];
    for (var i=0; i < str.length; i++) {
        bitArray.push(str[i].charCodeAt(0));
    }
    var bitObject = {
        left: bitArray.slice(0,4),
        right: bitArray.slice(-4)
    };
    return bitObject;
}

function bitsToString (bits) {
    var string = ""
    for (var i=0; i < bits.left.length; i++) {
        string += String.fromCharCode(bits.left[i])
    }
    for (var i=0; i < bits.right.length; i++) {
        string += String.fromCharCode(bits.right[i])
    }
    return string
}

// randomly generate 7 digit key
function generateKey() {
    /*var key = '';
    for (var i=0; i < 7; i++) {
        key += String(Math.floor((Math.random() * 9) + 1));
    }*/
    return Math.floor(Math.random() * 9000000) + 1000000
    // return parseInt(key);
}


// function to generate subkey based on cycle
//generate subkey by xor original key with key / cycle number
function generateSubkey(key, cycle) {
    var orNum = Math.floor(key / cycle);
    var subKey = key ^ orNum;
    return subKey;
}


// funciton to xor right array with sub key
function cycleFunc(bitArray, subKey) {
    var newObjectHalf = [];
    for (var j=0; j < bitArray.length; j++){
        newObjectHalf[j] = bitArray[j] ^ subKey;
    }
    return newObjectHalf;
}

// xor the two halves of the bitarray
function xOrHalves(bitArrayLeft, bitArrayRight) {
    for (var k=0; k < bitArrayLeft.length; k++) {
        bitArrayRight[k] = bitArrayRight[k] ^ bitArrayLeft[k];
    }
    return bitArrayRight;
}


// cycle function takes L, R, cycle#, key
// main cycle funciton, gives new L and R for next cycle.
function desCycle(bitObject, key, cycle) {
    var newObject = {};
    var subKey = generateSubkey(key, cycle);
    newObject.left = bitObject.right;
    newObject.right = xOrHalves(bitObject.left, cycleFunc(bitObject.right, subKey));
    return newObject;
}


// encrypt function
// starts encryptioin and runs through 16 cycles of desCycle
function encrypt(key, bitObject) {
    for (var i=0; i < 16; i++) {
        bitObject = desCycle(bitObject, key, i);
        console.log(bitObject.left);
        console.log(bitObject.right);
        console.log('Iteration: ' + i);
    }
    console.log(key, bitObject)
    return bitObject
}


// decrypt funciton
// runs cycle in reverse order 
function decrypt(bitObject, key) {
    for (var i=16; i > 0; i--) {
        bitObject = desCycle(bitObject, key, i);
    }
    console.log(bitObject)
    return bitObject;
}

function getKey () { return parseInt($('#des-key-input').val()) }
function getStr () { return $('#des-str-input').val() }

function getDecKey() { return parseInt($("#des-deckey-input").val()) }
function getDecData() { return JSON.parse($("#des-dec-input").val()) }

function outputDecrypt (data) {
    $("#des-decrypt-output")
        .text(typeof data === "string"
            ? data
            : JSON.stringify(data,null,2)
        )
}
function outputEncrypt (data) {
    $("#des-encrypt-output")
        .text(typeof data === "string"
            ? data
            : JSON.stringify(data,null,2)
        )
}

// declare onclick events
$('#des-encrypt').click(function () {
    try {
        var str = getStr()
        var key = getKey()
        var bitObj = stringToBitArray(str)
        var resBits = encrypt(key, bitObj)
        var resStr = bitsToString(resBits)
        outputEncrypt({
            input: {
                key: key,
                string: str,
                bits: bitObj
            },
            output: {
                string: resStr,
                bits: resBits
            }
        })
    } catch (error) {
        alert(error)
    }
})

$('#des-decrypt').click(function () {
    // not implemented quite yet
    try {
        var key = getDecKey()
        var bits = getDecData()
        var str = bitsToString(bits)
        var resBits = decrypt(bits, key)
        var resStr = bitsToString(resBits)
        outputDecrypt({
            input: {
                key: key,
                bits: bits
            },
            output: {
                string: resStr,
                bits: resBits
            }
        })
    } catch (error) {
        alert(error)
    }
})

$('#des-gen-randkey').click(function () {
    $("#des-key-input").val(generateKey())
})

$('#des-copy').click(function () {
    try {
        var data = JSON.parse($("#des-encrypt-output").text())
        $("#des-deckey-input").val(data.input.key)
        $("#des-dec-input").val(JSON.stringify(data.output.bits,null,2))
    } catch (error) {
        alert(error)
    }
})

// test
$('#des-gen-randkey').click()
$('#des-encrypt').click()
$('#des-copy').click()
$('#des-decrypt').click()

}());