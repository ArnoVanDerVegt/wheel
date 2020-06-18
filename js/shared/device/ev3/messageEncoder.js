/**
 * Based on example code:
 * https://github.com/kayjtea/ev3-direct
**/
(function() {
    exports.createHexString = function(arr) {
        let result = '';
        for (let i in arr) {
            let str = arr[i].toString(16);
            str = str.toUpperCase();
            switch (str.length) {
                case 0:
                    result += '00';
                    break;
                case 1:
                    result += '0' + str;
                    break;
                case 2:
                    result += str;
                    break;
                default:
                    result += str.substr(str.length - 2, str.length);
                    break;
            }
        }
        return result;
    };

    // Add counter and byte length encoding prefix. return Uint8Array of final message
    exports.packMessageForSending = function(id, str) {
        let length = ((str.length / 2) + 2);
        let a      = new ArrayBuffer(4);
        let c      = new Uint16Array(a);
        let arr    = new Uint8Array(a);
        c[1] = id;
        c[0] = length;
        let mess = new Uint8Array((str.length / 2) + 4);
        for (let i = 0; i < 4; i ++) {
            mess[i] = arr[i];
        }
        for (let i = 0; i < str.length; i += 2) {
            mess[(i / 2) + 4] = parseInt(str.substr(i, 2), 16);
        }
        return mess;
    };

    // Create 8 bit hex couplet
    function byteString(num) {
        let s = num.toString(16).toUpperCase();
        return (s.length === 1) ? '0' + s : s;
    }
    exports.byteString = byteString;

    // Int bytes using weird serialization method
    exports.getPackedOutputHexString = function(num, lc) {
        // Nonsensical unsigned byte packing. see cOutputPackParam in c_output-c in EV3 firmware
        let a    = new ArrayBuffer(4);
        let sarr = new Int32Array(a);
        let uarr = new Uint8Array(a);
        sarr[0] = num;
        switch (lc) {
            case 0:
                let bits = uarr[0];
                bits &= 0x0000003F;
                return exports.byteString(bits);
            case 1:
                return '81' + byteString(uarr[0]);
            case 2:
                return '82' + byteString(uarr[0]) + byteString(uarr[1]);
            case 3:
                return '83' + byteString(uarr[0]) + byteString(uarr[1]) + byteString(uarr[2]) + byteString(uarr[3]);
        }
        return '00';
    };

    exports.decimalToLittleEndianHex = function(d, padding) {
        let hex = Number(d).toString(16);
        padding = (padding === undefined) || (padding === null) ? 2 : padding;
        while (hex.length < padding) {
            hex = '0' + hex;
        }
        let a = hex.match(/../g); // Split number in groups of two
        a.reverse();              // Reverse the groups
        hex = a.join('');         // Join the groups back together
        return hex;
    };

    exports.stringToHexString = function(s) {
        let result = '';
        s.split('').map((c) => {
            let hex = c.charCodeAt(0).toString(16);
            if (hex.length === 2) {
                result += hex;
            } else {
                result += '0' + hex;
            }
        });
        result += '00';
        return result;
    };
})();
