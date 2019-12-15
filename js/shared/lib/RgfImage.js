/**
 * Wheel, copyright (c) 2017 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.RgfImage = class {
    pack(data) {
        let bytes = [data.width, data.height];
        let image = data.image;
        for (let y = 0; y < data.height; y++) {
            let bit = 1;
            let b   = 0;
            for (let x = 0; x < data.width; x++) {
                if (image[y][x]) {
                    b = b | bit;
                }
                bit <<= 1;
                if (bit === 256) {
                    bytes.push(b);
                    bit = 1;
                    b   = 0;
                }
            }
            if (bit !== 1) {
                bytes.push(b);
            }
        }
        return new Uint8Array(bytes);
    }

    unpack(data) {
        let read = function(offset) {
                return (typeof data === 'string') ? data.charCodeAt(offset) : data[offset];
            };
        let image  = [];
        let width  = read(0);
        let height = read(1);
        let offset = 2;
        for (let y = 0; y < height; y++) {
            let line = [];
            let bit  = 1;
            let b    = read(offset);
            for (let x = 0; x < width; x++) {
                line.push((b & bit) ? 1 : 0);
                bit <<= 1;
                if (bit === 256) {
                    offset++;
                    bit = 1;
                    b   = read(offset);
                }
            }
            image.push(line);
            if (bit !== 1) {
                offset++;
            }
        }
        return {
            width:  width,
            height: height,
            image:  image
        };
    }

    toString(data) {
        let packedString = '';
        for (let i = 0; i < data.length; i++) {
            packedString += String.fromCharCode(data[i]);
        }
        return packedString;
    }
};
