// returns n prime numbers
function primes(n, start) {
    function isPrime(num) {
        if ( num === 0 || num === 1 ) {
            return false;
        }
        for ( var i = 2; i < num; i++ ) {
            if ( num % i === 0 ) {
                return false;
            }
        }
        return true;
    }

    var arr = [2];
    for ( var i = start || 3; arr.length <= n; i+=2 ) {
        if ( isPrime(i) ) {
            arr.push(i);
        }
    }
    return arr;
}