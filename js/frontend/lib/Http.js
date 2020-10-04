/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
exports.Http = class {
    constructor(opts) {
        this._xmlHttpRequest = new XMLHttpRequest();
        this._xmlHttpRequest.addEventListener('load', this.onLoad.bind(this));
        this._onLoad = (opts && (typeof opts.onLoad === 'function')) ? opts.onLoad : function() {};
    }

    get(url, params) {
        let s = '';
        for (let p in params) {
            s += (s === '') ? '?' : '&';
            s += p + '=' + encodeURIComponent(params[p]);
        }
        this._xmlHttpRequest.open('GET', url + s);
        this._xmlHttpRequest.send();
        return this;
    }

    post(url, params, arrayBuffer) {
        let data = '';
        for (let i in params) {
            if (data !== '') {
                data += '&';
            }
            if (typeof params[i] === 'string') {
                data += i + '=' + encodeURIComponent(params[i]);
            } else {
                data += i + '=' + encodeURIComponent(JSON.stringify(params[i]));
            }
        }
        this._arrayBuffer = arrayBuffer;
        if (arrayBuffer) {
            this._xmlHttpRequest.responseType = 'arraybuffer';
        }
        this._xmlHttpRequest.open('POST', url, true);
        this._xmlHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        this._xmlHttpRequest.send(data);
        return this;
    }

    onLoad() {
        let xmlHttpRequest = this._xmlHttpRequest;
        let data           = this._arrayBuffer ? xmlHttpRequest.response : xmlHttpRequest.responseText;
        this._onLoad(data);
    }
};
