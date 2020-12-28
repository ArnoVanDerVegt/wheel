class SerialPort {
    constructor(port) {
        this._port        = null;
        this._baudRate    = 115200;
        this._events      = {};
        this._closed      = false;
        this._readTimeout = null;
        this._writer      = null;
        this._writing     = false;
        this._queue       = [];
        this._textDecoder = new TextDecoder('utf-8');
    }

    on(event, callback) {
        this._events[event] = callback;
    }

    open(callback) {
        if (this._port === null) {
            setTimeout(this.open.bind(this, callback), 100);
            return;
        }
        this._port.open({baudRate: this._baudRate}).then(() => {
            if (typeof callback === 'function') {
                callback();
            }
            this.startReading();
        });
    }

    writeMessage() {
        if (!this._queue.length || this._writing) {
            return;
        }
        this._writing = true;
        let message = this._queue.shift();
        this._writer.write(message)
            .then(() => {
                this._writing = false;
                this.writeMessage();
            })
            .catch((error) => {
                this._writing = false;
                this.writeMessage();
            });
    }

    write(data) {
        if (this._closed || !this._writer) {
            return;
        }
        this._queue.push(data);
        this.writeMessage();
    }


    drain(callback) {
        callback(false);
    }

    close() {
        this._closed = true;
        try {
            this._reader.close();
            this._writer.close();
            this._port.close();
        } catch (error) {
        }
    }

    read() {
        if (this._readTimeout) {
            clearTimeout(this._readTimeout);
            this._readTimeout = null;
        }
        if (this._closed) {
            return;
        }
        const setReadTimeout = (time) => {
                if (this._readTimeout) {
                    clearTimeout(this._readTimeout);
                }
                this._readTimeout = setTimeout(this.read.bind(this), time);
            };
        let events = this._events;
        let done   = false;
        this._reader.read().then((data) => {
            done = data.done;
            if (typeof events.data === 'function') {
                events.data(data.value);
            }
            if (!done) {
                if (this._readTimeout) {
                    clearTimeout(this._readTimeout);
                }
                setReadTimeout(1);
            }
        });
        if (!done) {
            setReadTimeout(100); // Timeout...
        }
    }

    startReading() {
        const decoder              = new TextDecoderStream();
        const readableStreamClosed = this._port.readable.pipeTo(decoder.writable);
        const encoder              = new TextEncoderStream();
        const writableStreamClosed = encoder.readable.pipeTo(this._port.writable);
        this._reader = decoder.readable.getReader();
        this._writer = encoder.writable.getWriter();
        this.read();
    }

    setPort(port) {
        this._port = port;
    }

    setBaudRate(baudRate) {
        this._baudRate = baudRate;
        return this;
    }
}

exports.WebSerial = class {
    constructor(onError) {
        this._port = new SerialPort();
        navigator.serial.requestPort()
            .then((port) => {
                this._port.setPort(port);
            })
            .catch((error) => {
                if (typeof onError === 'function') {
                    onError(error);
                }
            });
    }

    getPorts(callback) {
        callback([]);
    }

    getPort(deviceName, opts) {
        return this._port.setBaudRate(opts.baudRate);
    }
};
