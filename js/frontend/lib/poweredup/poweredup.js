! function(e) {
    var t = {};

    function r(n) {
        if (t[n]) return t[n].exports;
        var i = t[n] = {
            i: n,
            l: !1,
            exports: {}
        };
        return e[n].call(i.exports, i, i.exports, r), i.l = !0, i.exports
    }
    r.m = e, r.c = t, r.d = function(e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
        })
    }, r.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, r.t = function(e, t) {
        if (1 & t && (e = r(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (r.r(n), Object.defineProperty(n, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var i in e) r.d(n, i, function(t) {
                return e[t]
            }.bind(null, i));
        return n
    }, r.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return r.d(t, "a", t), t
    }, r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, r.p = "", r(r.s = 48)
}([function(e, t, r) {
    "use strict";
    var n, i, s;
    Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        function(e) {
            e[e.UNKNOWN = 0] = "UNKNOWN", e[e.WEDO2_SMART_HUB = 1] = "WEDO2_SMART_HUB", e[e.MOVE_HUB = 2] = "MOVE_HUB", e[e.HUB = 3] = "HUB", e[e.REMOTE_CONTROL = 4] = "REMOTE_CONTROL", e[e.DUPLO_TRAIN_BASE = 5] = "DUPLO_TRAIN_BASE", e[e.TECHNIC_MEDIUM_HUB = 6] = "TECHNIC_MEDIUM_HUB"
        }(n = t.HubType || (t.HubType = {})), t.HubTypeNames = n,
        function(e) {
            e[e.UNKNOWN = 0] = "UNKNOWN", e[e.SIMPLE_MEDIUM_LINEAR_MOTOR = 1] = "SIMPLE_MEDIUM_LINEAR_MOTOR", e[e.TRAIN_MOTOR = 2] = "TRAIN_MOTOR", e[e.LIGHT = 8] = "LIGHT", e[e.VOLTAGE_SENSOR = 20] = "VOLTAGE_SENSOR", e[e.CURRENT_SENSOR = 21] = "CURRENT_SENSOR", e[e.PIEZO_BUZZER = 22] = "PIEZO_BUZZER", e[e.HUB_LED = 23] = "HUB_LED", e[e.TILT_SENSOR = 34] = "TILT_SENSOR", e[e.MOTION_SENSOR = 35] = "MOTION_SENSOR", e[e.COLOR_DISTANCE_SENSOR = 37] = "COLOR_DISTANCE_SENSOR", e[e.MEDIUM_LINEAR_MOTOR = 38] = "MEDIUM_LINEAR_MOTOR", e[e.MOVE_HUB_MEDIUM_LINEAR_MOTOR = 39] = "MOVE_HUB_MEDIUM_LINEAR_MOTOR", e[e.MOVE_HUB_TILT_SENSOR = 40] = "MOVE_HUB_TILT_SENSOR", e[e.DUPLO_TRAIN_BASE_MOTOR = 41] = "DUPLO_TRAIN_BASE_MOTOR", e[e.DUPLO_TRAIN_BASE_SPEAKER = 42] = "DUPLO_TRAIN_BASE_SPEAKER", e[e.DUPLO_TRAIN_BASE_COLOR_SENSOR = 43] = "DUPLO_TRAIN_BASE_COLOR_SENSOR", e[e.DUPLO_TRAIN_BASE_SPEEDOMETER = 44] = "DUPLO_TRAIN_BASE_SPEEDOMETER", e[e.TECHNIC_LARGE_LINEAR_MOTOR = 46] = "TECHNIC_LARGE_LINEAR_MOTOR", e[e.TECHNIC_XLARGE_LINEAR_MOTOR = 47] = "TECHNIC_XLARGE_LINEAR_MOTOR", e[e.TECHNIC_MEDIUM_ANGULAR_MOTOR = 48] = "TECHNIC_MEDIUM_ANGULAR_MOTOR", e[e.TECHNIC_LARGE_ANGULAR_MOTOR = 49] = "TECHNIC_LARGE_ANGULAR_MOTOR", e[e.TECHNIC_MEDIUM_HUB_GEST_SENSOR = 54] = "TECHNIC_MEDIUM_HUB_GEST_SENSOR", e[e.REMOTE_CONTROL_BUTTON = 55] = "REMOTE_CONTROL_BUTTON", e[e.REMOTE_CONTROL_RSSI = 56] = "REMOTE_CONTROL_RSSI", e[e.TECHNIC_MEDIUM_HUB_ACCELEROMETER = 57] = "TECHNIC_MEDIUM_HUB_ACCELEROMETER", e[e.TECHNIC_MEDIUM_HUB_GYRO_SENSOR = 58] = "TECHNIC_MEDIUM_HUB_GYRO_SENSOR", e[e.TECHNIC_MEDIUM_HUB_TILT_SENSOR = 59] = "TECHNIC_MEDIUM_HUB_TILT_SENSOR", e[e.TECHNIC_MEDIUM_HUB_TEMPERATURE_SENSOR = 60] = "TECHNIC_MEDIUM_HUB_TEMPERATURE_SENSOR", e[e.TECHNIC_COLOR_SENSOR = 61] = "TECHNIC_COLOR_SENSOR", e[e.TECHNIC_DISTANCE_SENSOR = 62] = "TECHNIC_DISTANCE_SENSOR", e[e.TECHNIC_FORCE_SENSOR = 63] = "TECHNIC_FORCE_SENSOR"
        }(i = t.DeviceType || (t.DeviceType = {})), t.DeviceTypeNames = i,
        function(e) {
            e[e.BLACK = 0] = "BLACK", e[e.PINK = 1] = "PINK", e[e.PURPLE = 2] = "PURPLE", e[e.BLUE = 3] = "BLUE", e[e.LIGHT_BLUE = 4] = "LIGHT_BLUE", e[e.CYAN = 5] = "CYAN", e[e.GREEN = 6] = "GREEN", e[e.YELLOW = 7] = "YELLOW", e[e.ORANGE = 8] = "ORANGE", e[e.RED = 9] = "RED", e[e.WHITE = 10] = "WHITE", e[e.NONE = 255] = "NONE"
        }(s = t.Color || (t.Color = {})), t.ColorNames = s,
        function(e) {
            e[e.PRESSED = 2] = "PRESSED", e[e.RELEASED = 0] = "RELEASED", e[e.UP = 1] = "UP", e[e.DOWN = 255] = "DOWN", e[e.STOP = 127] = "STOP"
        }(t.ButtonState || (t.ButtonState = {})),
        function(e) {
            e[e.FLOAT = 0] = "FLOAT", e[e.HOLD = 126] = "HOLD", e[e.BRAKE = 127] = "BRAKE"
        }(t.BrakingStyle || (t.BrakingStyle = {})),
        function(e) {
            e[e.BRAKE = 3] = "BRAKE", e[e.STATION_DEPARTURE = 5] = "STATION_DEPARTURE", e[e.WATER_REFILL = 7] = "WATER_REFILL", e[e.HORN = 9] = "HORN", e[e.STEAM = 10] = "STEAM"
        }(t.DuploTrainBaseSound || (t.DuploTrainBaseSound = {})),
        function(e) {
            e[e.DUPLO_TRAIN_BASE_ID = 32] = "DUPLO_TRAIN_BASE_ID", e[e.MOVE_HUB_ID = 64] = "MOVE_HUB_ID", e[e.HUB_ID = 65] = "HUB_ID", e[e.REMOTE_CONTROL_ID = 66] = "REMOTE_CONTROL_ID", e[e.TECHNIC_MEDIUM_HUB = 128] = "TECHNIC_MEDIUM_HUB"
        }(t.BLEManufacturerData || (t.BLEManufacturerData = {})),
        function(e) {
            e.WEDO2_SMART_HUB = "00001523-1212-efde-1523-785feabcd123", e.WEDO2_SMART_HUB_2 = "00004f0e-1212-efde-1523-785feabcd123", e.WEDO2_SMART_HUB_3 = "2a19", e.WEDO2_SMART_HUB_4 = "180f", e.WEDO2_SMART_HUB_5 = "180a", e.LPF2_HUB = "00001623-1212-efde-1623-785feabcd123"
        }(t.BLEService || (t.BLEService = {})),
        function(e) {
            e.WEDO2_BATTERY = "2a19", e.WEDO2_FIRMWARE_REVISION = "2a26", e.WEDO2_BUTTON = "00001526-1212-efde-1523-785feabcd123", e.WEDO2_PORT_TYPE = "00001527-1212-efde-1523-785feabcd123", e.WEDO2_LOW_VOLTAGE_ALERT = "00001528-1212-efde-1523-785feabcd123", e.WEDO2_HIGH_CURRENT_ALERT = "00001529-1212-efde-1523-785feabcd123", e.WEDO2_LOW_SIGNAL_ALERT = "0000152a-1212-efde-1523-785feabcd123", e.WEDO2_DISCONNECT = "0000152b-1212-efde-1523-785feabcd123", e.WEDO2_SENSOR_VALUE = "00001560-1212-efde-1523-785feabcd123", e.WEDO2_VALUE_FORMAT = "00001561-1212-efde-1523-785feabcd123", e.WEDO2_PORT_TYPE_WRITE = "00001563-1212-efde-1523-785feabcd123", e.WEDO2_MOTOR_VALUE_WRITE = "00001565-1212-efde-1523-785feabcd123", e.WEDO2_NAME_ID = "00001524-1212-efde-1523-785feabcd123", e.LPF2_ALL = "00001624-1212-efde-1623-785feabcd123"
        }(t.BLECharacteristic || (t.BLECharacteristic = {}))
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(5),
            s = n(r(0));
        class o extends i.EventEmitter {
            constructor(e, t, r = {}, n = s.DeviceType.UNKNOWN) {
                super(), this.autoSubscribe = !0, this.values = {}, this._busy = !1, this._connected = !0, this._modeMap = {}, this._isVirtualPort = !1, this._eventTimer = null, this._hub = e, this._portId = t, this._type = n, this._modeMap = r, this._isWeDo2SmartHub = this.hub.type === s.HubType.WEDO2_SMART_HUB, this._isVirtualPort = this.hub.isPortVirtual(t);
                const i = e => {
                        "detach" !== e && this.autoSubscribe && void 0 !== this._modeMap[e] && this.subscribe(this._modeMap[e])
                    },
                    o = e => {
                        e.portId === this.portId && (this._connected = !1, this.hub.removeListener("detach", o), this.emit("detach"))
                    };
                for (const e in this._modeMap) this.hub.listenerCount(e) > 0 && i(e);
                this.hub.on("newListener", i), this.on("newListener", i), this.hub.on("detach", o)
            }
            get connected() {
                return this._connected
            }
            get hub() {
                return this._hub
            }
            get portId() {
                return this._portId
            }
            get portName() {
                return this.hub.getPortNameForPortId(this.portId)
            }
            get type() {
                return this._type
            }
            get typeName() {
                return s.DeviceTypeNames[this.type]
            }
            get mode() {
                return this._mode
            }
            get isWeDo2SmartHub() {
                return this._isWeDo2SmartHub
            }
            get isVirtualPort() {
                return this._isVirtualPort
            }
            writeDirect(t, r, n) {
                this.isWeDo2SmartHub ? this.send(e.concat([e.from([this.portId, 1, 2]), r]), s.BLECharacteristic.WEDO2_MOTOR_VALUE_WRITE) : this.send(e.concat([e.from([129, this.portId, 17, 81, t]), r]), s.BLECharacteristic.LPF2_ALL, n)
            }
            send(e, t = s.BLECharacteristic.LPF2_ALL, r) {
                this._ensureConnected(), this.hub.send(e, t, r)
            }
            subscribe(e) {
                this._ensureConnected(), e !== this._mode && (this._mode = e, this.hub.subscribe(this.portId, this.type, e))
            }
            unsubscribe(e) {
                this._ensureConnected()
            }
            receive(e) {
                this.notify("receive", {
                    message: e
                })
            }
            notify(e, t) {
                this.values[e] = t, this.emit(e, t), this.hub.listenerCount(e) > 0 && this.hub.emit(e, this, t)
            }
            finish() {
                this._busy = !1, this._finished && (this._finished(), this._finished = void 0)
            }
            setEventTimer(e) {
                this._eventTimer = e
            }
            cancelEventTimer() {
                this._eventTimer && (clearTimeout(this._eventTimer), this._eventTimer = null)
            }
            _ensureConnected() {
                if (!this.connected) throw new Error("Device is not connected")
            }
        }
        t.Device = o
    }).call(this, r(2).Buffer)
}, function(e, t, r) {
    "use strict";
    (function(e) {
        /*!
         * The buffer module from node.js, for the browser.
         *
         * @author   Feross Aboukhadijeh <http://feross.org>
         * @license  MIT
         */
        var n = r(50),
            i = r(51),
            s = r(52);

        function o() {
            return c.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
        }

        function a(e, t) {
            if (o() < t) throw new RangeError("Invalid typed array length");
            return c.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = c.prototype : (null === e && (e = new c(t)), e.length = t), e
        }

        function c(e, t, r) {
            if (!(c.TYPED_ARRAY_SUPPORT || this instanceof c)) return new c(e, t, r);
            if ("number" == typeof e) {
                if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                return f(this, e)
            }
            return u(this, e, t, r)
        }

        function u(e, t, r, n) {
            if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
            return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function(e, t, r, n) {
                if (t.byteLength, r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
                if (t.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");
                t = void 0 === r && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t, r) : new Uint8Array(t, r, n);
                c.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = c.prototype : e = l(e, t);
                return e
            }(e, t, r, n) : "string" == typeof t ? function(e, t, r) {
                "string" == typeof r && "" !== r || (r = "utf8");
                if (!c.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
                var n = 0 | d(t, r),
                    i = (e = a(e, n)).write(t, r);
                i !== n && (e = e.slice(0, i));
                return e
            }(e, t, r) : function(e, t) {
                if (c.isBuffer(t)) {
                    var r = 0 | _(t.length);
                    return 0 === (e = a(e, r)).length ? e : (t.copy(e, 0, 0, r), e)
                }
                if (t) {
                    if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (n = t.length) != n ? a(e, 0) : l(e, t);
                    if ("Buffer" === t.type && s(t.data)) return l(e, t.data)
                }
                var n;
                throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
            }(e, t)
        }

        function h(e) {
            if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
            if (e < 0) throw new RangeError('"size" argument must not be negative')
        }

        function f(e, t) {
            if (h(t), e = a(e, t < 0 ? 0 : 0 | _(t)), !c.TYPED_ARRAY_SUPPORT)
                for (var r = 0; r < t; ++r) e[r] = 0;
            return e
        }

        function l(e, t) {
            var r = t.length < 0 ? 0 : 0 | _(t.length);
            e = a(e, r);
            for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
            return e
        }

        function _(e) {
            if (e >= o()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o().toString(16) + " bytes");
            return 0 | e
        }

        function d(e, t) {
            if (c.isBuffer(e)) return e.length;
            if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
            "string" != typeof e && (e = "" + e);
            var r = e.length;
            if (0 === r) return 0;
            for (var n = !1;;) switch (t) {
                case "ascii":
                case "latin1":
                case "binary":
                    return r;
                case "utf8":
                case "utf-8":
                case void 0:
                    return W(e).length;
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return 2 * r;
                case "hex":
                    return r >>> 1;
                case "base64":
                    return j(e).length;
                default:
                    if (n) return W(e).length;
                    t = ("" + t).toLowerCase(), n = !0
            }
        }

        function p(e, t, r) {
            var n = !1;
            if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
            if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
            if ((r >>>= 0) <= (t >>>= 0)) return "";
            for (e || (e = "utf8");;) switch (e) {
                case "hex":
                    return D(this, t, r);
                case "utf8":
                case "utf-8":
                    return R(this, t, r);
                case "ascii":
                    return g(this, t, r);
                case "latin1":
                case "binary":
                    return C(this, t, r);
                case "base64":
                    return L(this, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return A(this, t, r);
                default:
                    if (n) throw new TypeError("Unknown encoding: " + e);
                    e = (e + "").toLowerCase(), n = !0
            }
        }

        function E(e, t, r) {
            var n = e[t];
            e[t] = e[r], e[r] = n
        }

        function v(e, t, r, n, i) {
            if (0 === e.length) return -1;
            if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
                if (i) return -1;
                r = e.length - 1
            } else if (r < 0) {
                if (!i) return -1;
                r = 0
            }
            if ("string" == typeof t && (t = c.from(t, n)), c.isBuffer(t)) return 0 === t.length ? -1 : T(e, t, r, n, i);
            if ("number" == typeof t) return t &= 255, c.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : T(e, [t], r, n, i);
            throw new TypeError("val must be string, number or Buffer")
        }

        function T(e, t, r, n, i) {
            var s, o = 1,
                a = e.length,
                c = t.length;
            if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                if (e.length < 2 || t.length < 2) return -1;
                o = 2, a /= 2, c /= 2, r /= 2
            }

            function u(e, t) {
                return 1 === o ? e[t] : e.readUInt16BE(t * o)
            }
            if (i) {
                var h = -1;
                for (s = r; s < a; s++)
                    if (u(e, s) === u(t, -1 === h ? 0 : s - h)) {
                        if (-1 === h && (h = s), s - h + 1 === c) return h * o
                    } else -1 !== h && (s -= s - h), h = -1
            } else
                for (r + c > a && (r = a - c), s = r; s >= 0; s--) {
                    for (var f = !0, l = 0; l < c; l++)
                        if (u(e, s + l) !== u(t, l)) {
                            f = !1;
                            break
                        } if (f) return s
                }
            return -1
        }

        function O(e, t, r, n) {
            r = Number(r) || 0;
            var i = e.length - r;
            n ? (n = Number(n)) > i && (n = i) : n = i;
            var s = t.length;
            if (s % 2 != 0) throw new TypeError("Invalid hex string");
            n > s / 2 && (n = s / 2);
            for (var o = 0; o < n; ++o) {
                var a = parseInt(t.substr(2 * o, 2), 16);
                if (isNaN(a)) return o;
                e[r + o] = a
            }
            return o
        }

        function m(e, t, r, n) {
            return k(W(t, e.length - r), e, r, n)
        }

        function y(e, t, r, n) {
            return k(function(e) {
                for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
                return t
            }(t), e, r, n)
        }

        function b(e, t, r, n) {
            return y(e, t, r, n)
        }

        function M(e, t, r, n) {
            return k(j(t), e, r, n)
        }

        function S(e, t, r, n) {
            return k(function(e, t) {
                for (var r, n, i, s = [], o = 0; o < e.length && !((t -= 2) < 0); ++o) r = e.charCodeAt(o), n = r >> 8, i = r % 256, s.push(i), s.push(n);
                return s
            }(t, e.length - r), e, r, n)
        }

        function L(e, t, r) {
            return 0 === t && r === e.length ? n.fromByteArray(e) : n.fromByteArray(e.slice(t, r))
        }

        function R(e, t, r) {
            r = Math.min(e.length, r);
            for (var n = [], i = t; i < r;) {
                var s, o, a, c, u = e[i],
                    h = null,
                    f = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
                if (i + f <= r) switch (f) {
                    case 1:
                        u < 128 && (h = u);
                        break;
                    case 2:
                        128 == (192 & (s = e[i + 1])) && (c = (31 & u) << 6 | 63 & s) > 127 && (h = c);
                        break;
                    case 3:
                        s = e[i + 1], o = e[i + 2], 128 == (192 & s) && 128 == (192 & o) && (c = (15 & u) << 12 | (63 & s) << 6 | 63 & o) > 2047 && (c < 55296 || c > 57343) && (h = c);
                        break;
                    case 4:
                        s = e[i + 1], o = e[i + 2], a = e[i + 3], 128 == (192 & s) && 128 == (192 & o) && 128 == (192 & a) && (c = (15 & u) << 18 | (63 & s) << 12 | (63 & o) << 6 | 63 & a) > 65535 && c < 1114112 && (h = c)
                }
                null === h ? (h = 65533, f = 1) : h > 65535 && (h -= 65536, n.push(h >>> 10 & 1023 | 55296), h = 56320 | 1023 & h), n.push(h), i += f
            }
            return function(e) {
                var t = e.length;
                if (t <= 4096) return String.fromCharCode.apply(String, e);
                var r = "",
                    n = 0;
                for (; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += 4096));
                return r
            }(n)
        }
        t.Buffer = c, t.SlowBuffer = function(e) {
            +e != e && (e = 0);
            return c.alloc(+e)
        }, t.INSPECT_MAX_BYTES = 50, c.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function() {
            try {
                var e = new Uint8Array(1);
                return e.__proto__ = {
                    __proto__: Uint8Array.prototype,
                    foo: function() {
                        return 42
                    }
                }, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
            } catch (e) {
                return !1
            }
        }(), t.kMaxLength = o(), c.poolSize = 8192, c._augment = function(e) {
            return e.__proto__ = c.prototype, e
        }, c.from = function(e, t, r) {
            return u(null, e, t, r)
        }, c.TYPED_ARRAY_SUPPORT && (c.prototype.__proto__ = Uint8Array.prototype, c.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && c[Symbol.species] === c && Object.defineProperty(c, Symbol.species, {
            value: null,
            configurable: !0
        })), c.alloc = function(e, t, r) {
            return function(e, t, r, n) {
                return h(t), t <= 0 ? a(e, t) : void 0 !== r ? "string" == typeof n ? a(e, t).fill(r, n) : a(e, t).fill(r) : a(e, t)
            }(null, e, t, r)
        }, c.allocUnsafe = function(e) {
            return f(null, e)
        }, c.allocUnsafeSlow = function(e) {
            return f(null, e)
        }, c.isBuffer = function(e) {
            return !(null == e || !e._isBuffer)
        }, c.compare = function(e, t) {
            if (!c.isBuffer(e) || !c.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
            if (e === t) return 0;
            for (var r = e.length, n = t.length, i = 0, s = Math.min(r, n); i < s; ++i)
                if (e[i] !== t[i]) {
                    r = e[i], n = t[i];
                    break
                } return r < n ? -1 : n < r ? 1 : 0
        }, c.isEncoding = function(e) {
            switch (String(e).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return !0;
                default:
                    return !1
            }
        }, c.concat = function(e, t) {
            if (!s(e)) throw new TypeError('"list" argument must be an Array of Buffers');
            if (0 === e.length) return c.alloc(0);
            var r;
            if (void 0 === t)
                for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
            var n = c.allocUnsafe(t),
                i = 0;
            for (r = 0; r < e.length; ++r) {
                var o = e[r];
                if (!c.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
                o.copy(n, i), i += o.length
            }
            return n
        }, c.byteLength = d, c.prototype._isBuffer = !0, c.prototype.swap16 = function() {
            var e = this.length;
            if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (var t = 0; t < e; t += 2) E(this, t, t + 1);
            return this
        }, c.prototype.swap32 = function() {
            var e = this.length;
            if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (var t = 0; t < e; t += 4) E(this, t, t + 3), E(this, t + 1, t + 2);
            return this
        }, c.prototype.swap64 = function() {
            var e = this.length;
            if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (var t = 0; t < e; t += 8) E(this, t, t + 7), E(this, t + 1, t + 6), E(this, t + 2, t + 5), E(this, t + 3, t + 4);
            return this
        }, c.prototype.toString = function() {
            var e = 0 | this.length;
            return 0 === e ? "" : 0 === arguments.length ? R(this, 0, e) : p.apply(this, arguments)
        }, c.prototype.equals = function(e) {
            if (!c.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
            return this === e || 0 === c.compare(this, e)
        }, c.prototype.inspect = function() {
            var e = "",
                r = t.INSPECT_MAX_BYTES;
            return this.length > 0 && (e = this.toString("hex", 0, r).match(/.{2}/g).join(" "), this.length > r && (e += " ... ")), "<Buffer " + e + ">"
        }, c.prototype.compare = function(e, t, r, n, i) {
            if (!c.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
            if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw new RangeError("out of range index");
            if (n >= i && t >= r) return 0;
            if (n >= i) return -1;
            if (t >= r) return 1;
            if (this === e) return 0;
            for (var s = (i >>>= 0) - (n >>>= 0), o = (r >>>= 0) - (t >>>= 0), a = Math.min(s, o), u = this.slice(n, i), h = e.slice(t, r), f = 0; f < a; ++f)
                if (u[f] !== h[f]) {
                    s = u[f], o = h[f];
                    break
                } return s < o ? -1 : o < s ? 1 : 0
        }, c.prototype.includes = function(e, t, r) {
            return -1 !== this.indexOf(e, t, r)
        }, c.prototype.indexOf = function(e, t, r) {
            return v(this, e, t, r, !0)
        }, c.prototype.lastIndexOf = function(e, t, r) {
            return v(this, e, t, r, !1)
        }, c.prototype.write = function(e, t, r, n) {
            if (void 0 === t) n = "utf8", r = this.length, t = 0;
            else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;
            else {
                if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                t |= 0, isFinite(r) ? (r |= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0)
            }
            var i = this.length - t;
            if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
            n || (n = "utf8");
            for (var s = !1;;) switch (n) {
                case "hex":
                    return O(this, e, t, r);
                case "utf8":
                case "utf-8":
                    return m(this, e, t, r);
                case "ascii":
                    return y(this, e, t, r);
                case "latin1":
                case "binary":
                    return b(this, e, t, r);
                case "base64":
                    return M(this, e, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return S(this, e, t, r);
                default:
                    if (s) throw new TypeError("Unknown encoding: " + n);
                    n = ("" + n).toLowerCase(), s = !0
            }
        }, c.prototype.toJSON = function() {
            return {
                type: "Buffer",
                data: Array.prototype.slice.call(this._arr || this, 0)
            }
        };

        function g(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var i = t; i < r; ++i) n += String.fromCharCode(127 & e[i]);
            return n
        }

        function C(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var i = t; i < r; ++i) n += String.fromCharCode(e[i]);
            return n
        }

        function D(e, t, r) {
            var n = e.length;
            (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
            for (var i = "", s = t; s < r; ++s) i += x(e[s]);
            return i
        }

        function A(e, t, r) {
            for (var n = e.slice(t, r), i = "", s = 0; s < n.length; s += 2) i += String.fromCharCode(n[s] + 256 * n[s + 1]);
            return i
        }

        function w(e, t, r) {
            if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
            if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
        }

        function P(e, t, r, n, i, s) {
            if (!c.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
            if (t > i || t < s) throw new RangeError('"value" argument is out of bounds');
            if (r + n > e.length) throw new RangeError("Index out of range")
        }

        function I(e, t, r, n) {
            t < 0 && (t = 65535 + t + 1);
            for (var i = 0, s = Math.min(e.length - r, 2); i < s; ++i) e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i)
        }

        function N(e, t, r, n) {
            t < 0 && (t = 4294967295 + t + 1);
            for (var i = 0, s = Math.min(e.length - r, 4); i < s; ++i) e[r + i] = t >>> 8 * (n ? i : 3 - i) & 255
        }

        function B(e, t, r, n, i, s) {
            if (r + n > e.length) throw new RangeError("Index out of range");
            if (r < 0) throw new RangeError("Index out of range")
        }

        function U(e, t, r, n, s) {
            return s || B(e, 0, r, 4), i.write(e, t, r, n, 23, 4), r + 4
        }

        function H(e, t, r, n, s) {
            return s || B(e, 0, r, 8), i.write(e, t, r, n, 52, 8), r + 8
        }
        c.prototype.slice = function(e, t) {
            var r, n = this.length;
            if ((e = ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n), (t = void 0 === t ? n : ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n), t < e && (t = e), c.TYPED_ARRAY_SUPPORT)(r = this.subarray(e, t)).__proto__ = c.prototype;
            else {
                var i = t - e;
                r = new c(i, void 0);
                for (var s = 0; s < i; ++s) r[s] = this[s + e]
            }
            return r
        }, c.prototype.readUIntLE = function(e, t, r) {
            e |= 0, t |= 0, r || w(e, t, this.length);
            for (var n = this[e], i = 1, s = 0; ++s < t && (i *= 256);) n += this[e + s] * i;
            return n
        }, c.prototype.readUIntBE = function(e, t, r) {
            e |= 0, t |= 0, r || w(e, t, this.length);
            for (var n = this[e + --t], i = 1; t > 0 && (i *= 256);) n += this[e + --t] * i;
            return n
        }, c.prototype.readUInt8 = function(e, t) {
            return t || w(e, 1, this.length), this[e]
        }, c.prototype.readUInt16LE = function(e, t) {
            return t || w(e, 2, this.length), this[e] | this[e + 1] << 8
        }, c.prototype.readUInt16BE = function(e, t) {
            return t || w(e, 2, this.length), this[e] << 8 | this[e + 1]
        }, c.prototype.readUInt32LE = function(e, t) {
            return t || w(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
        }, c.prototype.readUInt32BE = function(e, t) {
            return t || w(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
        }, c.prototype.readIntLE = function(e, t, r) {
            e |= 0, t |= 0, r || w(e, t, this.length);
            for (var n = this[e], i = 1, s = 0; ++s < t && (i *= 256);) n += this[e + s] * i;
            return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)), n
        }, c.prototype.readIntBE = function(e, t, r) {
            e |= 0, t |= 0, r || w(e, t, this.length);
            for (var n = t, i = 1, s = this[e + --n]; n > 0 && (i *= 256);) s += this[e + --n] * i;
            return s >= (i *= 128) && (s -= Math.pow(2, 8 * t)), s
        }, c.prototype.readInt8 = function(e, t) {
            return t || w(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
        }, c.prototype.readInt16LE = function(e, t) {
            t || w(e, 2, this.length);
            var r = this[e] | this[e + 1] << 8;
            return 32768 & r ? 4294901760 | r : r
        }, c.prototype.readInt16BE = function(e, t) {
            t || w(e, 2, this.length);
            var r = this[e + 1] | this[e] << 8;
            return 32768 & r ? 4294901760 | r : r
        }, c.prototype.readInt32LE = function(e, t) {
            return t || w(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
        }, c.prototype.readInt32BE = function(e, t) {
            return t || w(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
        }, c.prototype.readFloatLE = function(e, t) {
            return t || w(e, 4, this.length), i.read(this, e, !0, 23, 4)
        }, c.prototype.readFloatBE = function(e, t) {
            return t || w(e, 4, this.length), i.read(this, e, !1, 23, 4)
        }, c.prototype.readDoubleLE = function(e, t) {
            return t || w(e, 8, this.length), i.read(this, e, !0, 52, 8)
        }, c.prototype.readDoubleBE = function(e, t) {
            return t || w(e, 8, this.length), i.read(this, e, !1, 52, 8)
        }, c.prototype.writeUIntLE = function(e, t, r, n) {
            (e = +e, t |= 0, r |= 0, n) || P(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var i = 1,
                s = 0;
            for (this[t] = 255 & e; ++s < r && (i *= 256);) this[t + s] = e / i & 255;
            return t + r
        }, c.prototype.writeUIntBE = function(e, t, r, n) {
            (e = +e, t |= 0, r |= 0, n) || P(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var i = r - 1,
                s = 1;
            for (this[t + i] = 255 & e; --i >= 0 && (s *= 256);) this[t + i] = e / s & 255;
            return t + r
        }, c.prototype.writeUInt8 = function(e, t, r) {
            return e = +e, t |= 0, r || P(this, e, t, 1, 255, 0), c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
        }, c.prototype.writeUInt16LE = function(e, t, r) {
            return e = +e, t |= 0, r || P(this, e, t, 2, 65535, 0), c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : I(this, e, t, !0), t + 2
        }, c.prototype.writeUInt16BE = function(e, t, r) {
            return e = +e, t |= 0, r || P(this, e, t, 2, 65535, 0), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : I(this, e, t, !1), t + 2
        }, c.prototype.writeUInt32LE = function(e, t, r) {
            return e = +e, t |= 0, r || P(this, e, t, 4, 4294967295, 0), c.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : N(this, e, t, !0), t + 4
        }, c.prototype.writeUInt32BE = function(e, t, r) {
            return e = +e, t |= 0, r || P(this, e, t, 4, 4294967295, 0), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : N(this, e, t, !1), t + 4
        }, c.prototype.writeIntLE = function(e, t, r, n) {
            if (e = +e, t |= 0, !n) {
                var i = Math.pow(2, 8 * r - 1);
                P(this, e, t, r, i - 1, -i)
            }
            var s = 0,
                o = 1,
                a = 0;
            for (this[t] = 255 & e; ++s < r && (o *= 256);) e < 0 && 0 === a && 0 !== this[t + s - 1] && (a = 1), this[t + s] = (e / o >> 0) - a & 255;
            return t + r
        }, c.prototype.writeIntBE = function(e, t, r, n) {
            if (e = +e, t |= 0, !n) {
                var i = Math.pow(2, 8 * r - 1);
                P(this, e, t, r, i - 1, -i)
            }
            var s = r - 1,
                o = 1,
                a = 0;
            for (this[t + s] = 255 & e; --s >= 0 && (o *= 256);) e < 0 && 0 === a && 0 !== this[t + s + 1] && (a = 1), this[t + s] = (e / o >> 0) - a & 255;
            return t + r
        }, c.prototype.writeInt8 = function(e, t, r) {
            return e = +e, t |= 0, r || P(this, e, t, 1, 127, -128), c.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
        }, c.prototype.writeInt16LE = function(e, t, r) {
            return e = +e, t |= 0, r || P(this, e, t, 2, 32767, -32768), c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : I(this, e, t, !0), t + 2
        }, c.prototype.writeInt16BE = function(e, t, r) {
            return e = +e, t |= 0, r || P(this, e, t, 2, 32767, -32768), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : I(this, e, t, !1), t + 2
        }, c.prototype.writeInt32LE = function(e, t, r) {
            return e = +e, t |= 0, r || P(this, e, t, 4, 2147483647, -2147483648), c.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : N(this, e, t, !0), t + 4
        }, c.prototype.writeInt32BE = function(e, t, r) {
            return e = +e, t |= 0, r || P(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), c.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : N(this, e, t, !1), t + 4
        }, c.prototype.writeFloatLE = function(e, t, r) {
            return U(this, e, t, !0, r)
        }, c.prototype.writeFloatBE = function(e, t, r) {
            return U(this, e, t, !1, r)
        }, c.prototype.writeDoubleLE = function(e, t, r) {
            return H(this, e, t, !0, r)
        }, c.prototype.writeDoubleBE = function(e, t, r) {
            return H(this, e, t, !1, r)
        }, c.prototype.copy = function(e, t, r, n) {
            if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;
            if (0 === e.length || 0 === this.length) return 0;
            if (t < 0) throw new RangeError("targetStart out of bounds");
            if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
            if (n < 0) throw new RangeError("sourceEnd out of bounds");
            n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
            var i, s = n - r;
            if (this === e && r < t && t < n)
                for (i = s - 1; i >= 0; --i) e[i + t] = this[i + r];
            else if (s < 1e3 || !c.TYPED_ARRAY_SUPPORT)
                for (i = 0; i < s; ++i) e[i + t] = this[i + r];
            else Uint8Array.prototype.set.call(e, this.subarray(r, r + s), t);
            return s
        }, c.prototype.fill = function(e, t, r, n) {
            if ("string" == typeof e) {
                if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), 1 === e.length) {
                    var i = e.charCodeAt(0);
                    i < 256 && (e = i)
                }
                if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
                if ("string" == typeof n && !c.isEncoding(n)) throw new TypeError("Unknown encoding: " + n)
            } else "number" == typeof e && (e &= 255);
            if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
            if (r <= t) return this;
            var s;
            if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e)
                for (s = t; s < r; ++s) this[s] = e;
            else {
                var o = c.isBuffer(e) ? e : W(new c(e, n).toString()),
                    a = o.length;
                for (s = 0; s < r - t; ++s) this[s + t] = o[s % a]
            }
            return this
        };
        var F = /[^+\/0-9A-Za-z-_]/g;

        function x(e) {
            return e < 16 ? "0" + e.toString(16) : e.toString(16)
        }

        function W(e, t) {
            var r;
            t = t || 1 / 0;
            for (var n = e.length, i = null, s = [], o = 0; o < n; ++o) {
                if ((r = e.charCodeAt(o)) > 55295 && r < 57344) {
                    if (!i) {
                        if (r > 56319) {
                            (t -= 3) > -1 && s.push(239, 191, 189);
                            continue
                        }
                        if (o + 1 === n) {
                            (t -= 3) > -1 && s.push(239, 191, 189);
                            continue
                        }
                        i = r;
                        continue
                    }
                    if (r < 56320) {
                        (t -= 3) > -1 && s.push(239, 191, 189), i = r;
                        continue
                    }
                    r = 65536 + (i - 55296 << 10 | r - 56320)
                } else i && (t -= 3) > -1 && s.push(239, 191, 189);
                if (i = null, r < 128) {
                    if ((t -= 1) < 0) break;
                    s.push(r)
                } else if (r < 2048) {
                    if ((t -= 2) < 0) break;
                    s.push(r >> 6 | 192, 63 & r | 128)
                } else if (r < 65536) {
                    if ((t -= 3) < 0) break;
                    s.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                } else {
                    if (!(r < 1114112)) throw new Error("Invalid code point");
                    if ((t -= 4) < 0) break;
                    s.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                }
            }
            return s
        }

        function j(e) {
            return n.toByteArray(function(e) {
                if ((e = function(e) {
                        return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
                    }(e).replace(F, "")).length < 2) return "";
                for (; e.length % 4 != 0;) e += "=";
                return e
            }(e))
        }

        function k(e, t, r, n) {
            for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
            return i
        }
    }).call(this, r(9))
}, function(e, t, r) {
    (function(n) {
        t.log = function(...e) {
            return "object" == typeof console && console.log && console.log(...e)
        }, t.formatArgs = function(t) {
            if (t[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + t[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors) return;
            const r = "color: " + this.color;
            t.splice(1, 0, r, "color: inherit");
            let n = 0,
                i = 0;
            t[0].replace(/%[a-zA-Z%]/g, e => {
                "%%" !== e && (n++, "%c" === e && (i = n))
            }), t.splice(i, 0, r)
        }, t.save = function(e) {
            try {
                e ? t.storage.setItem("debug", e) : t.storage.removeItem("debug")
            } catch (e) {}
        }, t.load = function() {
            let e;
            try {
                e = t.storage.getItem("debug")
            } catch (e) {}!e && void 0 !== n && "env" in n && (e = n.env.DEBUG);
            return e
        }, t.useColors = function() {
            if ("undefined" != typeof window && window.process && ("renderer" === window.process.type || window.process.__nwjs)) return !0;
            if ("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return !1;
            return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)
        }, t.storage = function() {
            try {
                return localStorage
            } catch (e) {}
        }(), t.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], e.exports = r(54)(t);
        const {
            formatters: i
        } = e.exports;
        i.j = function(e) {
            try {
                return JSON.stringify(e)
            } catch (e) {
                return "[UnexpectedJSONParseError]: " + e.message
            }
        }
    }).call(this, r(12))
}, function(e, t, r) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const n = r(5);
    t.isWebBluetooth = "undefined" != typeof navigator && navigator && navigator.bluetooth, t.toHex = (e, t = 2) => e.toString(16).padStart(t, "0"), t.toBin = (e, t = 8) => e.toString(2).padStart(t, "0"), t.mapSpeed = e => 127 === e ? 127 : (e > 100 ? e = 100 : e < -100 && (e = -100), e), t.decodeVersion = e => {
        const t = e.toString(16).padStart(8, "0");
        return [t[0], t[1], t.substring(2, 4), t.substring(4)].join(".")
    }, t.decodeMACAddress = e => Array.from(e).map(e => t.toHex(e, 2)).join(":"), t.normalizeAngle = e => e >= 180 ? e - (e + 180) / 360 * 360 : e < -180 ? e + (180 - e) / 360 * 360 : e, t.roundAngleToNearest90 = e => (e = t.normalizeAngle(e)) < -135 ? -180 : e < -45 ? -90 : e < 45 ? 0 : e < 135 ? 90 : -180, t.calculateRamp = (e, t, r, i) => {
        const s = new n.EventEmitter,
            o = Math.abs(r - t);
        let a = i / o,
            c = 1;
        a < 50 && o > 0 && (c = 50 / a, a = 50), t > r && (c = -c);
        let u = 0;
        const h = setInterval(() => {
            let e = Math.round(t + ++u * c);
            r > t && e > r ? e = r : t > r && e < r && (e = r), s.emit("changePower", e), e === r && (clearInterval(h), s.emit("finished"))
        }, a);
        return e.setEventTimer(h), s
    }
}, function(e, t, r) {
    "use strict";
    var n, i = "object" == typeof Reflect ? Reflect : null,
        s = i && "function" == typeof i.apply ? i.apply : function(e, t, r) {
            return Function.prototype.apply.call(e, t, r)
        };
    n = i && "function" == typeof i.ownKeys ? i.ownKeys : Object.getOwnPropertySymbols ? function(e) {
        return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))
    } : function(e) {
        return Object.getOwnPropertyNames(e)
    };
    var o = Number.isNaN || function(e) {
        return e != e
    };

    function a() {
        a.init.call(this)
    }
    e.exports = a, a.EventEmitter = a, a.prototype._events = void 0, a.prototype._eventsCount = 0, a.prototype._maxListeners = void 0;
    var c = 10;

    function u(e) {
        if ("function" != typeof e) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof e)
    }

    function h(e) {
        return void 0 === e._maxListeners ? a.defaultMaxListeners : e._maxListeners
    }

    function f(e, t, r, n) {
        var i, s, o, a;
        if (u(r), void 0 === (s = e._events) ? (s = e._events = Object.create(null), e._eventsCount = 0) : (void 0 !== s.newListener && (e.emit("newListener", t, r.listener ? r.listener : r), s = e._events), o = s[t]), void 0 === o) o = s[t] = r, ++e._eventsCount;
        else if ("function" == typeof o ? o = s[t] = n ? [r, o] : [o, r] : n ? o.unshift(r) : o.push(r), (i = h(e)) > 0 && o.length > i && !o.warned) {
            o.warned = !0;
            var c = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            c.name = "MaxListenersExceededWarning", c.emitter = e, c.type = t, c.count = o.length, a = c, console && console.warn && console.warn(a)
        }
        return e
    }

    function l() {
        if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments)
    }

    function _(e, t, r) {
        var n = {
                fired: !1,
                wrapFn: void 0,
                target: e,
                type: t,
                listener: r
            },
            i = l.bind(n);
        return i.listener = r, n.wrapFn = i, i
    }

    function d(e, t, r) {
        var n = e._events;
        if (void 0 === n) return [];
        var i = n[t];
        return void 0 === i ? [] : "function" == typeof i ? r ? [i.listener || i] : [i] : r ? function(e) {
            for (var t = new Array(e.length), r = 0; r < t.length; ++r) t[r] = e[r].listener || e[r];
            return t
        }(i) : E(i, i.length)
    }

    function p(e) {
        var t = this._events;
        if (void 0 !== t) {
            var r = t[e];
            if ("function" == typeof r) return 1;
            if (void 0 !== r) return r.length
        }
        return 0
    }

    function E(e, t) {
        for (var r = new Array(t), n = 0; n < t; ++n) r[n] = e[n];
        return r
    }
    Object.defineProperty(a, "defaultMaxListeners", {
        enumerable: !0,
        get: function() {
            return c
        },
        set: function(e) {
            if ("number" != typeof e || e < 0 || o(e)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
            c = e
        }
    }), a.init = function() {
        void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0
    }, a.prototype.setMaxListeners = function(e) {
        if ("number" != typeof e || e < 0 || o(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
        return this._maxListeners = e, this
    }, a.prototype.getMaxListeners = function() {
        return h(this)
    }, a.prototype.emit = function(e) {
        for (var t = [], r = 1; r < arguments.length; r++) t.push(arguments[r]);
        var n = "error" === e,
            i = this._events;
        if (void 0 !== i) n = n && void 0 === i.error;
        else if (!n) return !1;
        if (n) {
            var o;
            if (t.length > 0 && (o = t[0]), o instanceof Error) throw o;
            var a = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
            throw a.context = o, a
        }
        var c = i[e];
        if (void 0 === c) return !1;
        if ("function" == typeof c) s(c, this, t);
        else {
            var u = c.length,
                h = E(c, u);
            for (r = 0; r < u; ++r) s(h[r], this, t)
        }
        return !0
    }, a.prototype.addListener = function(e, t) {
        return f(this, e, t, !1)
    }, a.prototype.on = a.prototype.addListener, a.prototype.prependListener = function(e, t) {
        return f(this, e, t, !0)
    }, a.prototype.once = function(e, t) {
        return u(t), this.on(e, _(this, e, t)), this
    }, a.prototype.prependOnceListener = function(e, t) {
        return u(t), this.prependListener(e, _(this, e, t)), this
    }, a.prototype.removeListener = function(e, t) {
        var r, n, i, s, o;
        if (u(t), void 0 === (n = this._events)) return this;
        if (void 0 === (r = n[e])) return this;
        if (r === t || r.listener === t) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete n[e], n.removeListener && this.emit("removeListener", e, r.listener || t));
        else if ("function" != typeof r) {
            for (i = -1, s = r.length - 1; s >= 0; s--)
                if (r[s] === t || r[s].listener === t) {
                    o = r[s].listener, i = s;
                    break
                } if (i < 0) return this;
            0 === i ? r.shift() : function(e, t) {
                for (; t + 1 < e.length; t++) e[t] = e[t + 1];
                e.pop()
            }(r, i), 1 === r.length && (n[e] = r[0]), void 0 !== n.removeListener && this.emit("removeListener", e, o || t)
        }
        return this
    }, a.prototype.off = a.prototype.removeListener, a.prototype.removeAllListeners = function(e) {
        var t, r, n;
        if (void 0 === (r = this._events)) return this;
        if (void 0 === r.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== r[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete r[e]), this;
        if (0 === arguments.length) {
            var i, s = Object.keys(r);
            for (n = 0; n < s.length; ++n) "removeListener" !== (i = s[n]) && this.removeAllListeners(i);
            return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this
        }
        if ("function" == typeof(t = r[e])) this.removeListener(e, t);
        else if (void 0 !== t)
            for (n = t.length - 1; n >= 0; n--) this.removeListener(e, t[n]);
        return this
    }, a.prototype.listeners = function(e) {
        return d(this, e, !0)
    }, a.prototype.rawListeners = function(e) {
        return d(this, e, !1)
    }, a.listenerCount = function(e, t) {
        return "function" == typeof e.listenerCount ? e.listenerCount(t) : p.call(e, t)
    }, a.prototype.listenerCount = p, a.prototype.eventNames = function() {
        return this._eventsCount > 0 ? n(this._events) : []
    }
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(10),
            s = n(r(0)),
            o = r(4),
            a = r(3),
            c = a("lpf2hub"),
            u = a("lpf2hubmodeinfo");
        class h extends i.BaseHub {
            constructor() {
                super(...arguments), this._messageBuffer = e.alloc(0), this._propertyRequestCallbacks = {}
            }
            connect() {
                return new Promise(async (e, t) => {
                    c("LPF2Hub connecting"), await super.connect(), await this._bleDevice.discoverCharacteristicsForService(s.BLEService.LPF2_HUB), this._bleDevice.subscribeToCharacteristic(s.BLECharacteristic.LPF2_ALL, this._parseMessage.bind(this)), await this.sleep(500), this._requestHubPropertyReports(2), await this._requestHubPropertyValue(3), await this._requestHubPropertyValue(4), this._requestHubPropertyReports(5), this._requestHubPropertyReports(6), await this._requestHubPropertyValue(13), this.emit("connect"), c("LPF2Hub connected"), e()
                })
            }
            shutdown() {
                return new Promise((t, r) => {
                    this.send(e.from([2, 1]), s.BLECharacteristic.LPF2_ALL, () => t())
                })
            }
            setName(t) {
                if (t.length > 14) throw new Error("Name must be 14 characters or less");
                return new Promise((r, n) => {
                    let i = e.from([1, 1, 1]);
                    return i = e.concat([i, e.from(t, "ascii")]), this.send(i, s.BLECharacteristic.LPF2_ALL), this.send(i, s.BLECharacteristic.LPF2_ALL), this._name = t, r()
                })
            }
            send(t, r, n) {
                (t = e.concat([e.alloc(2), t]))[0] = t.length, c("Sent Message (LPF2_ALL)", t), this._bleDevice.writeToCharacteristic(r, t, n)
            }
            subscribe(t, r, n) {
                this.send(e.from([65, t, n, 1, 0, 0, 0, 1]), s.BLECharacteristic.LPF2_ALL)
            }
            unsubscribe(t, r) {
                this.send(e.from([65, t, r, 1, 0, 0, 0, 0]), s.BLECharacteristic.LPF2_ALL)
            }
            createVirtualPort(t, r) {
                const n = this.getDeviceAtPort(t);
                if (!n) throw new Error(`Port ${t} does not have an attached device`);
                const i = this.getDeviceAtPort(r);
                if (!i) throw new Error(`Port ${r} does not have an attached device`);
                if (n.type !== i.type) throw new Error("Both devices must be of the same type to create a virtual port");
                this.send(e.from([97, 1, n.portId, i.portId]), s.BLECharacteristic.LPF2_ALL)
            }
            _checkFirmware(e) {}
            _parseMessage(t) {
                if (t && (this._messageBuffer = e.concat([this._messageBuffer, t])), this._messageBuffer.length <= 0) return;
                const r = this._messageBuffer[0];
                if (r >= this._messageBuffer.length) {
                    const e = this._messageBuffer.slice(0, r);
                    switch (this._messageBuffer = this._messageBuffer.slice(r), c("Received Message (LPF2_ALL)", e), e[2]) {
                        case 1: {
                            const t = e[3],
                                r = this._propertyRequestCallbacks[t];
                            r ? r(e) : this._parseHubPropertyResponse(e), delete this._propertyRequestCallbacks[t];
                            break
                        }
                        case 4:
                            this._parsePortMessage(e);
                            break;
                        case 67:
                            this._parsePortInformationResponse(e);
                            break;
                        case 68:
                            this._parseModeInformationResponse(e);
                            break;
                        case 69:
                            this._parseSensorMessage(e);
                            break;
                        case 130:
                            this._parsePortAction(e)
                    }
                    this._messageBuffer.length > 0 && this._parseMessage()
                }
            }
            _requestHubPropertyValue(t) {
                return new Promise(r => {
                    this._propertyRequestCallbacks[t] = e => (this._parseHubPropertyResponse(e), r()), this.send(e.from([1, t, 5]), s.BLECharacteristic.LPF2_ALL)
                })
            }
            _requestHubPropertyReports(t) {
                this.send(e.from([1, t, 2]), s.BLECharacteristic.LPF2_ALL)
            }
            _parseHubPropertyResponse(e) {
                if (2 === e[3]) {
                    if (1 === e[5]) return void this.emit("button", {
                        event: s.ButtonState.PRESSED
                    });
                    if (0 === e[5]) return void this.emit("button", {
                        event: s.ButtonState.RELEASED
                    })
                } else if (3 === e[3]) this._firmwareVersion = o.decodeVersion(e.readInt32LE(5)), this._checkFirmware(this._firmwareVersion);
                else if (4 === e[3]) this._hardwareVersion = o.decodeVersion(e.readInt32LE(5));
                else if (5 === e[3]) {
                    const t = e.readInt8(5);
                    0 !== t && (this._rssi = t, this.emit("rssi", {
                        rssi: this._rssi
                    }))
                } else if (13 === e[3]) this._primaryMACAddress = o.decodeMACAddress(e.slice(5));
                else if (6 === e[3]) {
                    const t = e[5];
                    t !== this._batteryLevel && (this._batteryLevel = t, this.emit("batteryLevel", {
                        batteryLevel: t
                    }))
                }
            }
            _parsePortMessage(e) {
                const t = e[3],
                    r = e[4],
                    n = r ? e.readUInt16LE(5) : 0;
                if (1 === r) {
                    if (u.enabled) {
                        const r = s.DeviceTypeNames[e[5]] || "Unknown";
                        u(`Port ${o.toHex(t)}, type ${o.toHex(n,4)} (${r})`);
                        const i = o.decodeVersion(e.readInt32LE(7)),
                            a = o.decodeVersion(e.readInt32LE(11));
                        u(`Port ${o.toHex(t)}, hardware version ${i}, software version ${a}`), this._sendPortInformationRequest(t)
                    }
                    const r = this._createDevice(n, t);
                    this._attachDevice(r)
                } else if (0 === r) {
                    const e = this._getDeviceByPortId(t);
                    if (e && (this._detachDevice(e), this.isPortVirtual(t))) {
                        const e = this.getPortNameForPortId(t);
                        e && delete this._portMap[e], this._virtualPorts = this._virtualPorts.filter(e => e !== t)
                    }
                } else if (2 === r) {
                    const t = this.getPortNameForPortId(e[7]) + this.getPortNameForPortId(e[8]),
                        r = e[3];
                    this._portMap[t] = r, this._virtualPorts.push(r);
                    const i = this._createDevice(n, r);
                    this._attachDevice(i)
                }
            }
            _sendPortInformationRequest(t) {
                this.send(e.from([33, t, 1]), s.BLECharacteristic.LPF2_ALL), this.send(e.from([33, t, 2]), s.BLECharacteristic.LPF2_ALL)
            }
            _parsePortInformationResponse(e) {
                const t = e[3];
                if (2 === e[4]) {
                    const r = [];
                    for (let t = 5; t < e.length; t += 2) r.push(e.readUInt16LE(t));
                    return void u(`Port ${o.toHex(t)}, mode combinations [${r.map(e=>o.toBin(e,0)).join(", ")}]`)
                }
                const r = e[6],
                    n = o.toBin(e.readUInt16LE(7), r),
                    i = o.toBin(e.readUInt16LE(9), r);
                u(`Port ${o.toHex(t)}, total modes ${r}, input modes ${n}, output modes ${i}`);
                for (let e = 0; e < r; e++) this._sendModeInformationRequest(t, e, 0), this._sendModeInformationRequest(t, e, 1), this._sendModeInformationRequest(t, e, 2), this._sendModeInformationRequest(t, e, 3), this._sendModeInformationRequest(t, e, 4), this._sendModeInformationRequest(t, e, 128)
            }
            _sendModeInformationRequest(t, r, n) {
                this.send(e.from([34, t, r, n]), s.BLECharacteristic.LPF2_ALL)
            }
            _parseModeInformationResponse(e) {
                const t = o.toHex(e[3]),
                    r = e[4];
                switch (e[5]) {
                    case 0:
                        u(`Port ${t}, mode ${r}, name ${e.slice(6,e.length).toString()}`);
                        break;
                    case 1:
                        u(`Port ${t}, mode ${r}, RAW min ${e.readFloatLE(6)}, max ${e.readFloatLE(10)}`);
                        break;
                    case 2:
                        u(`Port ${t}, mode ${r}, PCT min ${e.readFloatLE(6)}, max ${e.readFloatLE(10)}`);
                        break;
                    case 3:
                        u(`Port ${t}, mode ${r}, SI min ${e.readFloatLE(6)}, max ${e.readFloatLE(10)}`);
                        break;
                    case 4:
                        u(`Port ${t}, mode ${r}, SI symbol ${e.slice(6,e.length).toString()}`);
                        break;
                    case 128:
                        const n = e[6],
                            i = ["8bit", "16bit", "32bit", "float"][e[7]],
                            s = e[8],
                            o = e[9];
                        u(`Port ${t}, mode ${r}, Value ${n} x ${i}, Decimal format ${s}.${o}`)
                }
            }
            _parsePortAction(e) {
                const t = e[3],
                    r = this._getDeviceByPortId(t);
                if (r) {
                    10 === e[4] && r.finish()
                }
            }
            _parseSensorMessage(e) {
                const t = e[3],
                    r = this._getDeviceByPortId(t);
                r && r.receive(e)
            }
        }
        t.LPF2Hub = h
    }).call(this, r(2).Buffer)
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(1),
            s = n(r(0)),
            o = r(4);
        class a extends i.Device {
            constructor(e, t, r, n = s.DeviceType.UNKNOWN) {
                super(e, t, r, n)
            }
            setPower(t, r = !0) {
                return r && this.cancelEventTimer(), new Promise(r => (this.writeDirect(0, e.from([o.mapSpeed(t)])), r()))
            }
            rampPower(e, t, r) {
                return this.cancelEventTimer(), new Promise(n => {
                    o.calculateRamp(this, e, t, r).on("changePower", e => {
                        this.setPower(e, !1)
                    }).on("finished", n)
                })
            }
            stop() {
                return this.cancelEventTimer(), this.setPower(0)
            }
            brake() {
                return this.cancelEventTimer(), this.setPower(s.BrakingStyle.BRAKE)
            }
        }
        t.BasicMotor = a
    }).call(this, r(2).Buffer)
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(11),
            s = n(r(0)),
            o = r(4);
        class a extends i.TachoMotor {
            constructor(e, r, n = {}, i = s.DeviceType.UNKNOWN) {
                super(e, r, Object.assign({}, n, t.ModeMap), i)
            }
            receive(e) {
                switch (this._mode) {
                    case c.ABSOLUTE:
                        const t = o.normalizeAngle(e.readInt16LE(this.isWeDo2SmartHub ? 2 : 4));
                        this.notify("absolute", {
                            angle: t
                        });
                        break;
                    default:
                        super.receive(e)
                }
            }
            gotoAngle(t, r = 100) {
                if (!this.isVirtualPort && t instanceof Array) throw new Error("Only virtual ports can accept multiple positions");
                if (this.isWeDo2SmartHub) throw new Error("Absolute positioning is not available on the WeDo 2.0 Smart Hub");
                return this.cancelEventTimer(), new Promise(n => {
                    let i;
                    this._busy = !0, null == r && (r = 100), t instanceof Array ? (i = e.from([129, this.portId, 17, 14, 0, 0, 0, 0, 0, 0, 0, 0, o.mapSpeed(r), 100, this._brakeStyle, 0]), i.writeInt32LE(o.normalizeAngle(t[0]), 4), i.writeInt32LE(o.normalizeAngle(t[1]), 8)) : (i = e.from([129, this.portId, 17, 13, 0, 0, 0, 0, o.mapSpeed(r), 100, this._brakeStyle, 0]), i.writeInt32LE(o.normalizeAngle(t), 4)), this.send(i), this._finished = () => n()
                })
            }
        }
        var c;
        t.AbsoluteMotor = a,
            function(e) {
                e[e.ROTATION = 2] = "ROTATION", e[e.ABSOLUTE = 3] = "ABSOLUTE"
            }(c = t.Mode || (t.Mode = {})), t.ModeMap = {
                rotate: c.ROTATION,
                absolute: c.ABSOLUTE
            }
    }).call(this, r(2).Buffer)
}, function(e, t) {
    var r;
    r = function() {
        return this
    }();
    try {
        r = r || new Function("return this")()
    } catch (e) {
        "object" == typeof window && (r = window)
    }
    e.exports = r
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(5),
            s = r(14),
            o = r(15),
            a = r(1),
            c = r(16),
            u = r(17),
            h = r(18),
            f = r(19),
            l = r(20),
            _ = r(21),
            d = r(22),
            p = r(23),
            E = r(24),
            v = r(25),
            T = r(26),
            O = r(27),
            m = r(28),
            y = r(29),
            b = r(30),
            M = r(31),
            S = r(32),
            L = r(33),
            R = r(34),
            g = r(35),
            C = r(36),
            D = r(37),
            A = r(38),
            w = r(39),
            P = r(40),
            I = r(41),
            N = n(r(0)),
            B = r(3)("basehub");
        class U extends i.EventEmitter {
            constructor(e, t = {}, r = N.HubType.UNKNOWN) {
                super(), this._attachedDevices = {}, this._name = "", this._firmwareVersion = "0.0.00.0000", this._hardwareVersion = "0.0.00.0000", this._primaryMACAddress = "00:00:00:00:00:00", this._batteryLevel = 100, this._rssi = -60, this._portMap = {}, this._virtualPorts = [], this._attachCallbacks = [], this.setMaxListeners(23), this._type = r, this._bleDevice = e, this._portMap = Object.assign({}, t), e.on("disconnect", () => {
                    this.emit("disconnect")
                })
            }
            get name() {
                return this._bleDevice.name
            }
            get type() {
                return this._type
            }
            get ports() {
                return Object.keys(this._portMap)
            }
            get firmwareVersion() {
                return this._firmwareVersion
            }
            get hardwareVersion() {
                return this._hardwareVersion
            }
            get primaryMACAddress() {
                return this._primaryMACAddress
            }
            get uuid() {
                return this._bleDevice.uuid
            }
            get batteryLevel() {
                return this._batteryLevel
            }
            get rssi() {
                return this._rssi
            }
            connect() {
                return new Promise(async (e, t) => this._bleDevice.connecting ? t("Already connecting") : this._bleDevice.connected ? t("Already connected") : (await this._bleDevice.connect(), e()))
            }
            disconnect() {
                return this._bleDevice.disconnect()
            }
            getDeviceAtPort(e) {
                const t = this._portMap[e];
                return void 0 !== t ? this._attachedDevices[t] : void 0
            }
            waitForDeviceAtPort(e) {
                return new Promise(t => {
                    const r = this.getDeviceAtPort(e);
                    if (r) return t(r);
                    this._attachCallbacks.push(r => r.portName === e && (t(r), !0))
                })
            }
            getDevices() {
                return Object.values(this._attachedDevices)
            }
            getDevicesByType(e) {
                return this.getDevices().filter(t => t.type === e)
            }
            waitForDeviceByType(e) {
                return new Promise(t => {
                    const r = this.getDevicesByType(e);
                    if (r.length >= 1) return t(r[0]);
                    this._attachCallbacks.push(r => r.type === e && (t(r), !0))
                })
            }
            getPortNameForPortId(e) {
                for (const t of Object.keys(this._portMap))
                    if (this._portMap[t] === e) return t
            }
            isPortVirtual(e) {
                return this._virtualPorts.indexOf(e) > -1
            }
            sleep(t) {
                return new Promise(r => {
                    e.setTimeout(r, t)
                })
            }
            wait(e) {
                return Promise.all(e)
            }
            send(e, t, r) {
                r && r()
            }
            subscribe(e, t, r) {}
            unsubscribe(e, t, r) {}
            _attachDevice(e) {
                this._attachedDevices[e.portId] = e, this.emit("attach", e), B(`Attached device type ${e.type} (${N.DeviceTypeNames[e.type]}) on port ${e.portName} (${e.portId})`);
                let t = this._attachCallbacks.length;
                for (; t--;) {
                    (0, this._attachCallbacks[t])(e) && this._attachCallbacks.splice(t, 1)
                }
            }
            _detachDevice(e) {
                delete this._attachedDevices[e.portId], this.emit("detach", e), B(`Detached device type ${e.type} (${N.DeviceTypeNames[e.type]}) on port ${e.portName} (${e.portId})`)
            }
            _createDevice(e, t) {
                let r;
                return r = {
                    [N.DeviceType.LIGHT]: _.Light,
                    [N.DeviceType.TRAIN_MOTOR]: P.TrainMotor,
                    [N.DeviceType.SIMPLE_MEDIUM_LINEAR_MOTOR]: m.SimpleMediumLinearMotor,
                    [N.DeviceType.MOVE_HUB_MEDIUM_LINEAR_MOTOR]: E.MoveHubMediumLinearMotor,
                    [N.DeviceType.MOTION_SENSOR]: p.MotionSensor,
                    [N.DeviceType.TILT_SENSOR]: w.TiltSensor,
                    [N.DeviceType.MOVE_HUB_TILT_SENSOR]: v.MoveHubTiltSensor,
                    [N.DeviceType.PIEZO_BUZZER]: T.PiezoBuzzer,
                    [N.DeviceType.TECHNIC_COLOR_SENSOR]: y.TechnicColorSensor,
                    [N.DeviceType.TECHNIC_DISTANCE_SENSOR]: b.TechnicDistanceSensor,
                    [N.DeviceType.TECHNIC_FORCE_SENSOR]: M.TechnicForceSensor,
                    [N.DeviceType.TECHNIC_MEDIUM_HUB_TILT_SENSOR]: D.TechnicMediumHubTiltSensor,
                    [N.DeviceType.TECHNIC_MEDIUM_HUB_GYRO_SENSOR]: C.TechnicMediumHubGyroSensor,
                    [N.DeviceType.TECHNIC_MEDIUM_HUB_ACCELEROMETER]: g.TechnicMediumHubAccelerometerSensor,
                    [N.DeviceType.MEDIUM_LINEAR_MOTOR]: d.MediumLinearMotor,
                    [N.DeviceType.TECHNIC_MEDIUM_ANGULAR_MOTOR]: R.TechnicMediumAngularMotor,
                    [N.DeviceType.TECHNIC_LARGE_ANGULAR_MOTOR]: S.TechnicLargeAngularMotor,
                    [N.DeviceType.TECHNIC_LARGE_LINEAR_MOTOR]: L.TechnicLargeLinearMotor,
                    [N.DeviceType.TECHNIC_XLARGE_LINEAR_MOTOR]: A.TechnicXLargeLinearMotor,
                    [N.DeviceType.COLOR_DISTANCE_SENSOR]: s.ColorDistanceSensor,
                    [N.DeviceType.VOLTAGE_SENSOR]: I.VoltageSensor,
                    [N.DeviceType.CURRENT_SENSOR]: o.CurrentSensor,
                    [N.DeviceType.REMOTE_CONTROL_BUTTON]: O.RemoteControlButton,
                    [N.DeviceType.HUB_LED]: l.HubLED,
                    [N.DeviceType.DUPLO_TRAIN_BASE_COLOR_SENSOR]: c.DuploTrainBaseColorSensor,
                    [N.DeviceType.DUPLO_TRAIN_BASE_MOTOR]: u.DuploTrainBaseMotor,
                    [N.DeviceType.DUPLO_TRAIN_BASE_SPEAKER]: h.DuploTrainBaseSpeaker,
                    [N.DeviceType.DUPLO_TRAIN_BASE_SPEEDOMETER]: f.DuploTrainBaseSpeedometer
                } [e], r ? new r(this, t) : new a.Device(this, t, void 0, e)
            }
            _getDeviceByPortId(e) {
                return this._attachedDevices[e]
            }
        }
        t.BaseHub = U
    }).call(this, r(9))
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(7),
            s = n(r(0)),
            o = r(4);
        class a extends i.BasicMotor {
            constructor(e, r, n = {}, i = s.DeviceType.UNKNOWN) {
                super(e, r, Object.assign({}, n, t.ModeMap), i), this._brakeStyle = s.BrakingStyle.BRAKE
            }
            receive(e) {
                switch (this._mode) {
                    case c.ROTATION:
                        const t = e.readInt32LE(this.isWeDo2SmartHub ? 2 : 4);
                        this.notify("rotate", {
                            degrees: t
                        })
                }
            }
            setBrakingStyle(e) {
                this._brakeStyle = e
            }
            setSpeed(t, r) {
                if (!this.isVirtualPort && t instanceof Array) throw new Error("Only virtual ports can accept multiple speeds");
                if (this.isWeDo2SmartHub) throw new Error("Motor speed is not available on the WeDo 2.0 Smart Hub");
                return this.cancelEventTimer(), new Promise(n => {
                    let i;
                    this._busy = !0, null == t && (t = 100), void 0 !== r ? (i = t instanceof Array ? e.from([129, this.portId, 17, 10, 0, 0, o.mapSpeed(t[0]), o.mapSpeed(t[1]), 100, this._brakeStyle, 0]) : e.from([129, this.portId, 17, 9, 0, 0, o.mapSpeed(t), 100, this._brakeStyle, 0]), i.writeUInt16LE(r, 4)) : i = t instanceof Array ? e.from([129, this.portId, 17, 8, o.mapSpeed(t[0]), o.mapSpeed(t[1]), 100, this._brakeStyle, 0]) : e.from([129, this.portId, 17, 7, o.mapSpeed(t), 100, 3, 100, this._brakeStyle, 0]), this.send(i), this._finished = () => n()
                })
            }
            rotateByDegrees(t, r) {
                if (!this.isVirtualPort && r instanceof Array) throw new Error("Only virtual ports can accept multiple speeds");
                if (this.isWeDo2SmartHub) throw new Error("Rotation is not available on the WeDo 2.0 Smart Hub");
                return this.cancelEventTimer(), new Promise(n => {
                    let i;
                    this._busy = !0, null == r && (r = 100), i = r instanceof Array ? e.from([129, this.portId, 17, 12, 0, 0, 0, 0, o.mapSpeed(r[0]), o.mapSpeed(r[1]), 100, this._brakeStyle, 3]) : e.from([129, this.portId, 17, 11, 0, 0, 0, 0, o.mapSpeed(r), 100, this._brakeStyle, 3]), i.writeUInt32LE(t, 4), this.send(i), this._finished = () => n()
                })
            }
        }
        var c;
        t.TachoMotor = a,
            function(e) {
                e[e.ROTATION = 2] = "ROTATION"
            }(c = t.Mode || (t.Mode = {})), t.ModeMap = {
                rotate: c.ROTATION
            }
    }).call(this, r(2).Buffer)
}, function(e, t) {
    var r, n, i = e.exports = {};

    function s() {
        throw new Error("setTimeout has not been defined")
    }

    function o() {
        throw new Error("clearTimeout has not been defined")
    }

    function a(e) {
        if (r === setTimeout) return setTimeout(e, 0);
        if ((r === s || !r) && setTimeout) return r = setTimeout, setTimeout(e, 0);
        try {
            return r(e, 0)
        } catch (t) {
            try {
                return r.call(null, e, 0)
            } catch (t) {
                return r.call(this, e, 0)
            }
        }
    }! function() {
        try {
            r = "function" == typeof setTimeout ? setTimeout : s
        } catch (e) {
            r = s
        }
        try {
            n = "function" == typeof clearTimeout ? clearTimeout : o
        } catch (e) {
            n = o
        }
    }();
    var c, u = [],
        h = !1,
        f = -1;

    function l() {
        h && c && (h = !1, c.length ? u = c.concat(u) : f = -1, u.length && _())
    }

    function _() {
        if (!h) {
            var e = a(l);
            h = !0;
            for (var t = u.length; t;) {
                for (c = u, u = []; ++f < t;) c && c[f].run();
                f = -1, t = u.length
            }
            c = null, h = !1,
                function(e) {
                    if (n === clearTimeout) return clearTimeout(e);
                    if ((n === o || !n) && clearTimeout) return n = clearTimeout, clearTimeout(e);
                    try {
                        n(e)
                    } catch (t) {
                        try {
                            return n.call(null, e)
                        } catch (t) {
                            return n.call(this, e)
                        }
                    }
                }(e)
        }
    }

    function d(e, t) {
        this.fun = e, this.array = t
    }

    function p() {}
    i.nextTick = function(e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1)
            for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
        u.push(new d(e, t)), 1 !== u.length || h || a(_)
    }, d.prototype.run = function() {
        this.fun.apply(null, this.array)
    }, i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.version = "", i.versions = {}, i.on = p, i.addListener = p, i.once = p, i.off = p, i.removeListener = p, i.removeAllListeners = p, i.emit = p, i.prependListener = p, i.prependOnceListener = p, i.listeners = function(e) {
        return []
    }, i.binding = function(e) {
        throw new Error("process.binding is not supported")
    }, i.cwd = function() {
        return "/"
    }, i.chdir = function(e) {
        throw new Error("process.chdir is not supported")
    }, i.umask = function() {
        return 0
    }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(6),
        s = n(r(0)),
        o = r(3)("duplotrainbase");
    class a extends i.LPF2Hub {
        static IsDuploTrainBase(e) {
            return e.advertisement && e.advertisement.serviceUuids && e.advertisement.serviceUuids.indexOf(s.BLEService.LPF2_HUB.replace(/-/g, "")) >= 0 && e.advertisement.manufacturerData && e.advertisement.manufacturerData.length > 3 && e.advertisement.manufacturerData[3] === s.BLEManufacturerData.DUPLO_TRAIN_BASE_ID
        }
        constructor(e) {
            super(e, t.PortMap, s.HubType.DUPLO_TRAIN_BASE), o("Discovered Duplo Train Base")
        }
        connect() {
            return new Promise(async (e, t) => (o("Connecting to Duplo Train Base"), await super.connect(), o("Connect completed"), e()))
        }
    }
    t.DuploTrainBase = a, t.PortMap = {
        MOTOR: 0,
        COLOR: 18,
        SPEEDOMETER: 19
    }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.COLOR_DISTANCE_SENSOR)
        }
        receive(e) {
            switch (this._mode) {
                case a.COLOR:
                    if (e[this.isWeDo2SmartHub ? 2 : 4] <= 10) {
                        const t = e[this.isWeDo2SmartHub ? 2 : 4];
                        this.notify("color", {
                            color: t
                        })
                    }
                    break;
                case a.DISTANCE:
                    if (this.isWeDo2SmartHub) break;
                    if (e[4] <= 10) {
                        const t = Math.floor(25.4 * e[4]) - 20;
                        this.notify("distance", {
                            distance: t
                        })
                    }
                    break;
                case a.COLOR_AND_DISTANCE:
                    if (this.isWeDo2SmartHub) break;
                    let t = e[5];
                    const r = e[7];
                    if (r > 0 && (t += 1 / r), t = Math.floor(25.4 * t) - 20, e[4] <= 10) {
                        const r = e[4];
                        this.notify("colorAndDistance", {
                            color: r,
                            distance: t
                        })
                    }
            }
        }
    }
    var a;
    t.ColorDistanceSensor = o,
        function(e) {
            e[e.COLOR = 0] = "COLOR", e[e.DISTANCE = 1] = "DISTANCE", e[e.COLOR_AND_DISTANCE = 8] = "COLOR_AND_DISTANCE"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            color: a.COLOR,
            distance: a.DISTANCE,
            colorAndDistance: a.COLOR_AND_DISTANCE
        }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.CURRENT_SENSOR)
        }
        receive(e) {
            switch (this.mode) {
                case a.CURRENT:
                    if (this.isWeDo2SmartHub) {
                        const t = e.readInt16LE(2) / 1e3;
                        this.notify("current", {
                            current: t
                        })
                    } else {
                        let t = c[this.hub.type];
                        void 0 === t && (t = c[s.HubType.UNKNOWN]);
                        let r = u[this.hub.type];
                        void 0 === r && (r = u[s.HubType.UNKNOWN]);
                        const n = e.readUInt16LE(4) * t / r;
                        this.notify("current", {
                            current: n
                        })
                    }
            }
        }
    }
    var a;
    t.CurrentSensor = o,
        function(e) {
            e[e.CURRENT = 0] = "CURRENT"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            current: a.CURRENT
        };
    const c = {
            [s.HubType.UNKNOWN]: 2444,
            [s.HubType.TECHNIC_MEDIUM_HUB]: 4175
        },
        u = {
            [s.HubType.UNKNOWN]: 4095
        }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.DUPLO_TRAIN_BASE_COLOR_SENSOR)
        }
        receive(e) {
            switch (this._mode) {
                case a.COLOR:
                    if (e[4] <= 10) {
                        const t = e[4];
                        this.notify("color", {
                            color: t
                        })
                    }
            }
        }
    }
    var a;
    t.DuploTrainBaseColorSensor = o,
        function(e) {
            e[e.COLOR = 0] = "COLOR"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            color: a.COLOR
        }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(7),
        s = n(r(0));
    class o extends i.BasicMotor {
        constructor(e, t) {
            super(e, t, {}, s.DeviceType.DUPLO_TRAIN_BASE_MOTOR)
        }
    }
    t.DuploTrainBaseMotor = o
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(1),
            s = n(r(0));
        class o extends i.Device {
            constructor(e, t) {
                super(e, t, {}, s.DeviceType.DUPLO_TRAIN_BASE_SPEAKER)
            }
            playSound(t) {
                return new Promise((r, n) => (this.subscribe(a.SOUND), this.writeDirect(1, e.from([t])), r()))
            }
        }
        var a;
        t.DuploTrainBaseSpeaker = o,
            function(e) {
                e[e.SOUND = 1] = "SOUND"
            }(a = t.Mode || (t.Mode = {}))
    }).call(this, r(2).Buffer)
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.DUPLO_TRAIN_BASE_SPEEDOMETER)
        }
        receive(e) {
            switch (this._mode) {
                case a.SPEED:
                    const t = e.readInt16LE(4);
                    this.notify("speed", {
                        speed: t
                    })
            }
        }
    }
    var a;
    t.DuploTrainBaseSpeedometer = o,
        function(e) {
            e[e.SPEED = 0] = "SPEED"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            speed: a.SPEED
        }
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(1),
            s = n(r(0));
        class o extends i.Device {
            constructor(e, t) {
                super(e, t, {}, s.DeviceType.HUB_LED)
            }
            setColor(t) {
                return new Promise((r, n) => ("boolean" == typeof t && (t = 0), this.isWeDo2SmartHub ? (this.send(e.from([6, 23, 1, 1]), s.BLECharacteristic.WEDO2_PORT_TYPE_WRITE), this.send(e.from([6, 4, 1, t]), s.BLECharacteristic.WEDO2_MOTOR_VALUE_WRITE)) : (this.subscribe(a.COLOR), this.writeDirect(0, e.from([t]))), r()))
            }
            setRGB(t, r, n) {
                return new Promise((i, o) => (this.isWeDo2SmartHub ? (this.send(e.from([6, 23, 1, 2]), s.BLECharacteristic.WEDO2_PORT_TYPE_WRITE), this.send(e.from([6, 4, 3, t, r, n]), s.BLECharacteristic.WEDO2_MOTOR_VALUE_WRITE)) : (this.subscribe(a.RGB), this.writeDirect(1, e.from([t, r, n]))), i()))
            }
        }
        var a;
        t.HubLED = o,
            function(e) {
                e[e.COLOR = 0] = "COLOR", e[e.RGB = 1] = "RGB"
            }(a = t.Mode || (t.Mode = {}))
    }).call(this, r(2).Buffer)
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(1),
            s = n(r(0)),
            o = r(4);
        class a extends i.Device {
            constructor(e, t) {
                super(e, t, {}, s.DeviceType.LIGHT)
            }
            setBrightness(t, r = !0) {
                return r && this.cancelEventTimer(), new Promise(r => (this.writeDirect(0, e.from([t])), r()))
            }
            rampBrightness(e, t, r) {
                return this.cancelEventTimer(), new Promise(n => {
                    o.calculateRamp(this, e, t, r).on("changePower", e => {
                        this.setBrightness(e, !1)
                    }).on("finished", n)
                })
            }
        }
        t.Light = a
    }).call(this, r(2).Buffer)
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(11),
        s = n(r(0));
    class o extends i.TachoMotor {
        constructor(e, t) {
            super(e, t, {}, s.DeviceType.MEDIUM_LINEAR_MOTOR)
        }
    }
    t.MediumLinearMotor = o
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.MOTION_SENSOR)
        }
        receive(e) {
            switch (this._mode) {
                case a.DISTANCE:
                    let t = e[this.isWeDo2SmartHub ? 2 : 4];
                    1 === e[this.isWeDo2SmartHub ? 3 : 5] && (t += 255), t *= 10, this.notify("distance", {
                        distance: t
                    })
            }
        }
    }
    var a;
    t.MotionSensor = o,
        function(e) {
            e[e.DISTANCE = 0] = "DISTANCE"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            distance: a.DISTANCE
        }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(11),
        s = n(r(0));
    class o extends i.TachoMotor {
        constructor(e, t) {
            super(e, t, {}, s.DeviceType.MOVE_HUB_MEDIUM_LINEAR_MOTOR)
        }
    }
    t.MoveHubMediumLinearMotor = o
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.MOVE_HUB_TILT_SENSOR)
        }
        receive(e) {
            switch (this._mode) {
                case a.TILT:
                    const t = -e.readInt8(4),
                        r = e.readInt8(5);
                    this.notify("tilt", {
                        x: t,
                        y: r
                    })
            }
        }
    }
    var a;
    t.MoveHubTiltSensor = o,
        function(e) {
            e[e.TILT = 0] = "TILT"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            tilt: a.TILT
        }
}, function(e, t, r) {
    "use strict";
    (function(e, n) {
        var i = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const s = r(1),
            o = i(r(0));
        class a extends s.Device {
            constructor(e, t) {
                super(e, t, {}, o.DeviceType.PIEZO_BUZZER)
            }
            playTone(t, r) {
                return new Promise(i => {
                    const s = e.from([5, 2, 4, 0, 0, 0, 0]);
                    s.writeUInt16LE(t, 3), s.writeUInt16LE(r, 5), this.send(s, o.BLECharacteristic.WEDO2_MOTOR_VALUE_WRITE), n.setTimeout(i, r)
                })
            }
        }
        t.PiezoBuzzer = a
    }).call(this, r(2).Buffer, r(9))
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.REMOTE_CONTROL_BUTTON)
        }
        receive(e) {
            switch (this._mode) {
                case a.BUTTON_EVENTS:
                    const t = e[4];
                    this.notify("remoteButton", {
                        event: t
                    })
            }
        }
    }
    var a;
    t.RemoteControlButton = o,
        function(e) {
            e[e.BUTTON_EVENTS = 0] = "BUTTON_EVENTS"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            remoteButton: a.BUTTON_EVENTS
        }, t.ButtonState = {
            UP: 1,
            DOWN: 255,
            STOP: 127,
            RELEASED: 0
        }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(7),
        s = n(r(0));
    class o extends i.BasicMotor {
        constructor(e, t) {
            super(e, t, {}, s.DeviceType.SIMPLE_MEDIUM_LINEAR_MOTOR)
        }
    }
    t.SimpleMediumLinearMotor = o
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.TECHNIC_COLOR_SENSOR)
        }
        receive(e) {
            switch (this._mode) {
                case a.COLOR:
                    if (e[4] <= 10) {
                        const t = e[4];
                        this.notify("color", {
                            color: t
                        })
                    }
                    break;
                case a.REFLECTIVITY:
                    const t = e[4];
                    this.notify("reflect", {
                        reflect: t
                    });
                    break;
                case a.AMBIENT_LIGHT:
                    const r = e[4];
                    this.notify("ambient", {
                        ambient: r
                    })
            }
        }
    }
    var a;
    t.TechnicColorSensor = o,
        function(e) {
            e[e.COLOR = 0] = "COLOR", e[e.REFLECTIVITY = 1] = "REFLECTIVITY", e[e.AMBIENT_LIGHT = 2] = "AMBIENT_LIGHT"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            color: a.COLOR,
            reflect: a.REFLECTIVITY,
            ambient: a.AMBIENT_LIGHT
        }
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(1),
            s = n(r(0));
        class o extends i.Device {
            constructor(e, r) {
                super(e, r, t.ModeMap, s.DeviceType.TECHNIC_DISTANCE_SENSOR)
            }
            receive(e) {
                switch (this._mode) {
                    case a.DISTANCE:
                        const t = e.readUInt16LE(4);
                        this.notify("distance", {
                            distance: t
                        });
                        break;
                    case a.FAST_DISTANCE:
                        const r = e.readUInt16LE(4);
                        this.notify("fastDistance", {
                            fastDistance: r
                        })
                }
            }
            setBrightness(t, r, n, i) {
                this.writeDirect(5, e.from([t, n, r, i]))
            }
        }
        var a;
        t.TechnicDistanceSensor = o,
            function(e) {
                e[e.DISTANCE = 0] = "DISTANCE", e[e.FAST_DISTANCE = 1] = "FAST_DISTANCE"
            }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
                distance: a.DISTANCE,
                fastDistance: a.FAST_DISTANCE
            }
    }).call(this, r(2).Buffer)
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.TECHNIC_FORCE_SENSOR)
        }
        receive(e) {
            switch (this._mode) {
                case a.FORCE:
                    const t = e[4] / 10;
                    this.notify("force", {
                        force: t
                    });
                    break;
                case a.TOUCHED:
                    const r = !!e[4];
                    this.notify("touched", {
                        touched: r
                    });
                    break;
                case a.TAPPED:
                    const n = e[4];
                    this.notify("tapped", {
                        tapped: n
                    })
            }
        }
    }
    var a;
    t.TechnicForceSensor = o,
        function(e) {
            e[e.FORCE = 0] = "FORCE", e[e.TOUCHED = 1] = "TOUCHED", e[e.TAPPED = 2] = "TAPPED"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            force: a.FORCE,
            touched: a.TOUCHED,
            tapped: a.TAPPED
        }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(8),
        s = n(r(0));
    class o extends i.AbsoluteMotor {
        constructor(e, t) {
            super(e, t, {}, s.DeviceType.TECHNIC_LARGE_ANGULAR_MOTOR)
        }
    }
    t.TechnicLargeAngularMotor = o
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(8),
        s = n(r(0));
    class o extends i.AbsoluteMotor {
        constructor(e, t) {
            super(e, t, {}, s.DeviceType.TECHNIC_LARGE_LINEAR_MOTOR)
        }
    }
    t.TechnicLargeLinearMotor = o
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(8),
        s = n(r(0));
    class o extends i.AbsoluteMotor {
        constructor(e, t) {
            super(e, t, {}, s.DeviceType.TECHNIC_MEDIUM_ANGULAR_MOTOR)
        }
    }
    t.TechnicMediumAngularMotor = o
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.TECHNIC_MEDIUM_HUB_ACCELEROMETER)
        }
        receive(e) {
            switch (this._mode) {
                case a.ACCEL:
                    const t = Math.round(e.readInt16LE(4) / 4.096),
                        r = Math.round(e.readInt16LE(6) / 4.096),
                        n = Math.round(e.readInt16LE(8) / 4.096);
                    this.notify("accel", {
                        x: t,
                        y: r,
                        z: n
                    })
            }
        }
    }
    var a;
    t.TechnicMediumHubAccelerometerSensor = o,
        function(e) {
            e[e.ACCEL = 0] = "ACCEL"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            accel: a.ACCEL
        }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.TECHNIC_MEDIUM_HUB_GYRO_SENSOR)
        }
        receive(e) {
            switch (this._mode) {
                case a.GYRO:
                    const t = Math.round(7 * e.readInt16LE(4) / 400),
                        r = Math.round(7 * e.readInt16LE(6) / 400),
                        n = Math.round(7 * e.readInt16LE(8) / 400);
                    this.notify("gyro", {
                        x: t,
                        y: r,
                        z: n
                    })
            }
        }
    }
    var a;
    t.TechnicMediumHubGyroSensor = o,
        function(e) {
            e[e.GYRO = 0] = "GYRO"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            gyro: a.GYRO
        }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.TECHNIC_MEDIUM_HUB_TILT_SENSOR)
        }
        receive(e) {
            switch (this._mode) {
                case a.TILT:
                    const t = -e.readInt16LE(4),
                        r = e.readInt16LE(6),
                        n = e.readInt16LE(8);
                    this.notify("tilt", {
                        x: n,
                        y: r,
                        z: t
                    })
            }
        }
    }
    var a;
    t.TechnicMediumHubTiltSensor = o,
        function(e) {
            e[e.TILT = 0] = "TILT"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            tilt: a.TILT
        }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(8),
        s = n(r(0));
    class o extends i.AbsoluteMotor {
        constructor(e, t) {
            super(e, t, {}, s.DeviceType.TECHNIC_XLARGE_LINEAR_MOTOR)
        }
    }
    t.TechnicXLargeLinearMotor = o
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.TILT_SENSOR)
        }
        receive(e) {
            switch (this._mode) {
                case a.TILT:
                    const t = e.readInt8(this.isWeDo2SmartHub ? 2 : 4),
                        r = e.readInt8(this.isWeDo2SmartHub ? 3 : 5);
                    this.notify("tilt", {
                        x: t,
                        y: r
                    })
            }
        }
    }
    var a;
    t.TiltSensor = o,
        function(e) {
            e[e.TILT = 0] = "TILT"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            tilt: a.TILT
        }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(7),
        s = n(r(0));
    class o extends i.BasicMotor {
        constructor(e, t) {
            super(e, t, {}, s.DeviceType.TRAIN_MOTOR)
        }
    }
    t.TrainMotor = o
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(1),
        s = n(r(0));
    class o extends i.Device {
        constructor(e, r) {
            super(e, r, t.ModeMap, s.DeviceType.VOLTAGE_SENSOR)
        }
        receive(e) {
            switch (this._mode) {
                case a.VOLTAGE:
                    if (this.isWeDo2SmartHub) {
                        const t = e.readInt16LE(2) / 40;
                        this.notify("voltage", {
                            voltage: t
                        })
                    } else {
                        let t = c[this.hub.type];
                        void 0 === t && (t = c[s.HubType.UNKNOWN]);
                        let r = u[this.hub.type];
                        void 0 === r && (r = u[s.HubType.UNKNOWN]);
                        const n = e.readUInt16LE(4) * t / r;
                        this.notify("voltage", {
                            voltage: n
                        })
                    }
            }
        }
    }
    var a;
    t.VoltageSensor = o,
        function(e) {
            e[e.VOLTAGE = 0] = "VOLTAGE"
        }(a = t.Mode || (t.Mode = {})), t.ModeMap = {
            voltage: a.VOLTAGE
        };
    const c = {
            [s.HubType.UNKNOWN]: 9.615,
            [s.HubType.DUPLO_TRAIN_BASE]: 6.4,
            [s.HubType.REMOTE_CONTROL]: 6.4
        },
        u = {
            [s.HubType.UNKNOWN]: 3893,
            [s.HubType.DUPLO_TRAIN_BASE]: 3047,
            [s.HubType.REMOTE_CONTROL]: 3200,
            [s.HubType.TECHNIC_MEDIUM_HUB]: 4095
        }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        },
        i = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const s = n(r(43)),
        o = r(6),
        a = i(r(0)),
        c = r(3)("hub");
    class u extends o.LPF2Hub {
        constructor(e) {
            super(e, t.PortMap, a.HubType.HUB), this._currentPort = 59, c("Discovered Powered UP Hub")
        }
        static IsHub(e) {
            return e.advertisement && e.advertisement.serviceUuids && e.advertisement.serviceUuids.indexOf(a.BLEService.LPF2_HUB.replace(/-/g, "")) >= 0 && e.advertisement.manufacturerData && e.advertisement.manufacturerData.length > 3 && e.advertisement.manufacturerData[3] === a.BLEManufacturerData.HUB_ID
        }
        connect() {
            return new Promise(async (e, t) => (c("Connecting to Powered UP Hub"), await super.connect(), c("Connect completed"), e()))
        }
        _checkFirmware(e) {
            if (1 === s.default("1.1.00.0004", e)) throw new Error(`Your Powered Up Hub's (${this.name}) firmware is out of date and unsupported by this library. Please update it via the official Powered Up app.`)
        }
    }
    t.Hub = u, t.PortMap = {
        A: 0,
        B: 1,
        HUB_LED: 50,
        CURRENT_SENSOR: 59,
        VOLTAGE_SENSOR: 60
    }
}, function(e, t, r) {
    var n, i, s;
    i = [], void 0 === (s = "function" == typeof(n = function() {
        var e = /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;

        function t(e) {
            var t, r, n = e.replace(/^v/, "").replace(/\+.*$/, ""),
                i = (r = "-", -1 === (t = n).indexOf(r) ? t.length : t.indexOf(r)),
                s = n.substring(0, i).split(".");
            return s.push(n.substring(i + 1)), s
        }

        function r(e) {
            return isNaN(Number(e)) ? e : Number(e)
        }

        function n(t) {
            if ("string" != typeof t) throw new TypeError("Invalid argument expected string");
            if (!e.test(t)) throw new Error("Invalid argument not valid semver ('" + t + "' received)")
        }

        function i(e, i) {
            [e, i].forEach(n);
            for (var s = t(e), o = t(i), a = 0; a < Math.max(s.length - 1, o.length - 1); a++) {
                var c = parseInt(s[a] || 0, 10),
                    u = parseInt(o[a] || 0, 10);
                if (c > u) return 1;
                if (u > c) return -1
            }
            var h = s[s.length - 1],
                f = o[o.length - 1];
            if (h && f) {
                var l = h.split(".").map(r),
                    _ = f.split(".").map(r);
                for (a = 0; a < Math.max(l.length, _.length); a++) {
                    if (void 0 === l[a] || "string" == typeof _[a] && "number" == typeof l[a]) return -1;
                    if (void 0 === _[a] || "string" == typeof l[a] && "number" == typeof _[a]) return 1;
                    if (l[a] > _[a]) return 1;
                    if (_[a] > l[a]) return -1
                }
            } else if (h || f) return h ? -1 : 1;
            return 0
        }
        var s = [">", ">=", "=", "<", "<="],
            o = {
                ">": [1],
                ">=": [0, 1],
                "=": [0],
                "<=": [-1, 0],
                "<": [-1]
            };
        return i.compare = function(e, t, r) {
            ! function(e) {
                if ("string" != typeof e) throw new TypeError("Invalid operator type, expected string but got " + typeof e);
                if (-1 === s.indexOf(e)) throw new TypeError("Invalid operator, expected one of " + s.join("|"))
            }(r);
            var n = i(e, t);
            return o[r].indexOf(n) > -1
        }, i
    }) ? n.apply(t, i) : n) || (e.exports = s)
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importDefault || function(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        },
        i = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const s = n(r(43)),
        o = r(6),
        a = i(r(0)),
        c = r(3)("movehub");
    class u extends o.LPF2Hub {
        static IsMoveHub(e) {
            return e.advertisement && e.advertisement.serviceUuids && e.advertisement.serviceUuids.indexOf(a.BLEService.LPF2_HUB.replace(/-/g, "")) >= 0 && e.advertisement.manufacturerData && e.advertisement.manufacturerData.length > 3 && e.advertisement.manufacturerData[3] === a.BLEManufacturerData.MOVE_HUB_ID
        }
        constructor(e) {
            super(e, t.PortMap, a.HubType.MOVE_HUB), c("Discovered Move Hub")
        }
        connect() {
            return new Promise(async (e, t) => (c("Connecting to Move Hub"), await super.connect(), c("Connect completed"), e()))
        }
        _checkFirmware(e) {
            if (1 === s.default("2.0.00.0017", e)) throw new Error(`Your Move Hub's (${this.name}) firmware is out of date and unsupported by this library. Please update it via the official Powered Up app.`)
        }
    }
    t.MoveHub = u, t.PortMap = {
        A: 0,
        B: 1,
        C: 2,
        D: 3,
        HUB_LED: 50,
        TILT_SENSOR: 58,
        CURRENT_SENSOR: 59,
        VOLTAGE_SENSOR: 60
    }
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = r(6),
        s = n(r(0)),
        o = r(3)("remotecontrol");
    class a extends i.LPF2Hub {
        static IsRemoteControl(e) {
            return e.advertisement && e.advertisement.serviceUuids && e.advertisement.serviceUuids.indexOf(s.BLEService.LPF2_HUB.replace(/-/g, "")) >= 0 && e.advertisement.manufacturerData && e.advertisement.manufacturerData.length > 3 && e.advertisement.manufacturerData[3] === s.BLEManufacturerData.REMOTE_CONTROL_ID
        }
        constructor(e) {
            super(e, t.PortMap, s.HubType.REMOTE_CONTROL), o("Discovered Powered UP Remote")
        }
        connect() {
            return new Promise(async (e, t) => (o("Connecting to Powered UP Remote"), await super.connect(), o("Connect completed"), e()))
        }
    }
    t.RemoteControl = a, t.PortMap = {
        LEFT: 0,
        RIGHT: 1,
        HUB_LED: 52,
        VOLTAGE_SENSOR: 59,
        REMOTE_CONTROL_RSSI: 60
    }
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(6),
            s = n(r(0)),
            o = r(3)("technicmediumhub");
        class a extends i.LPF2Hub {
            static IsTechnicMediumHub(e) {
                return e.advertisement && e.advertisement.serviceUuids && e.advertisement.serviceUuids.indexOf(s.BLEService.LPF2_HUB.replace(/-/g, "")) >= 0 && e.advertisement.manufacturerData && e.advertisement.manufacturerData.length > 3 && e.advertisement.manufacturerData[3] === s.BLEManufacturerData.TECHNIC_MEDIUM_HUB
            }
            constructor(e) {
                super(e, t.PortMap, s.HubType.TECHNIC_MEDIUM_HUB), o("Discovered Control+ Hub")
            }
            connect() {
                return new Promise(async (t, r) => (o("Connecting to Control+ Hub"), await super.connect(), this.send(e.from([65, 61, 0, 10, 0, 0, 0, 1]), s.BLECharacteristic.LPF2_ALL), o("Connect completed"), t()))
            }
        }
        t.TechnicMediumHub = a, t.PortMap = {
            A: 0,
            B: 1,
            C: 2,
            D: 3,
            HUB_LED: 50,
            CURRENT_SENSOR: 59,
            VOLTAGE_SENSOR: 60,
            ACCELEROMETER: 97,
            GYRO_SENSOR: 98,
            TILT_SENSOR: 99
        }
    }).call(this, r(2).Buffer)
}, function(e, t, r) {
    "use strict";
    (function(e) {
        var n = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const i = r(10),
            s = n(r(0)),
            o = r(4),
            a = r(3)("wedo2smarthub");
        class c extends i.BaseHub {
            constructor(e) {
                super(e, t.PortMap, s.HubType.WEDO2_SMART_HUB), this._lastTiltX = 0, this._lastTiltY = 0, a("Discovered WeDo 2.0 Smart Hub")
            }
            static IsWeDo2SmartHub(e) {
                return e.advertisement && e.advertisement.serviceUuids && e.advertisement.serviceUuids.indexOf(s.BLEService.WEDO2_SMART_HUB.replace(/-/g, "")) >= 0
            }
            connect() {
                return new Promise(async (e, t) => {
                    a("Connecting to WeDo 2.0 Smart Hub"), await super.connect(), await this._bleDevice.discoverCharacteristicsForService(s.BLEService.WEDO2_SMART_HUB), await this._bleDevice.discoverCharacteristicsForService(s.BLEService.WEDO2_SMART_HUB_2), o.isWebBluetooth ? (await this._bleDevice.discoverCharacteristicsForService("battery_service"), await this._bleDevice.discoverCharacteristicsForService("device_information")) : (await this._bleDevice.discoverCharacteristicsForService(s.BLEService.WEDO2_SMART_HUB_3), await this._bleDevice.discoverCharacteristicsForService(s.BLEService.WEDO2_SMART_HUB_4), await this._bleDevice.discoverCharacteristicsForService(s.BLEService.WEDO2_SMART_HUB_5)), a("Connect completed"), this.emit("connect"), e(), this._bleDevice.subscribeToCharacteristic(s.BLECharacteristic.WEDO2_PORT_TYPE, this._parsePortMessage.bind(this)), this._bleDevice.subscribeToCharacteristic(s.BLECharacteristic.WEDO2_SENSOR_VALUE, this._parseSensorMessage.bind(this)), this._bleDevice.subscribeToCharacteristic(s.BLECharacteristic.WEDO2_BUTTON, this._parseSensorMessage.bind(this)), o.isWebBluetooth ? (this._bleDevice.readFromCharacteristic("00002a19-0000-1000-8000-00805f9b34fb", (e, t) => {
                        t && this._parseBatteryMessage(t)
                    }), this._bleDevice.subscribeToCharacteristic("00002a19-0000-1000-8000-00805f9b34fb", this._parseHighCurrentAlert.bind(this))) : (this._bleDevice.subscribeToCharacteristic(s.BLECharacteristic.WEDO2_BATTERY, this._parseBatteryMessage.bind(this)), this._bleDevice.readFromCharacteristic(s.BLECharacteristic.WEDO2_BATTERY, (e, t) => {
                        t && this._parseBatteryMessage(t)
                    })), this._bleDevice.subscribeToCharacteristic(s.BLECharacteristic.WEDO2_HIGH_CURRENT_ALERT, this._parseHighCurrentAlert.bind(this)), o.isWebBluetooth ? this._bleDevice.readFromCharacteristic("00002a26-0000-1000-8000-00805f9b34fb", (e, t) => {
                        t && this._parseFirmwareRevisionString(t)
                    }) : this._bleDevice.readFromCharacteristic(s.BLECharacteristic.WEDO2_FIRMWARE_REVISION, (e, t) => {
                        t && this._parseFirmwareRevisionString(t)
                    })
                })
            }
            shutdown() {
                return new Promise((t, r) => {
                    this.send(e.from([0]), s.BLECharacteristic.WEDO2_DISCONNECT, () => t())
                })
            }
            setName(t) {
                if (t.length > 14) throw new Error("Name must be 14 characters or less");
                return new Promise((r, n) => {
                    const i = e.from(t, "ascii");
                    return this.send(i, s.BLECharacteristic.WEDO2_NAME_ID), this.send(i, s.BLECharacteristic.WEDO2_NAME_ID), this._name = t, r()
                })
            }
            send(e, t, r) {
                a.enabled && a(`Sent Message (${this._getCharacteristicNameFromUUID(t)})`, e), this._bleDevice.writeToCharacteristic(t, e, r)
            }
            subscribe(t, r, n) {
                this.send(e.from([1, 2, t, r, n, 1, 0, 0, 0, 0, 1]), s.BLECharacteristic.WEDO2_PORT_TYPE_WRITE)
            }
            unsubscribe(t, r, n) {
                this.send(e.from([1, 2, t, r, n, 1, 0, 0, 0, 0, 0]), s.BLECharacteristic.WEDO2_PORT_TYPE_WRITE)
            }
            _getCharacteristicNameFromUUID(e) {
                const t = Object.keys(s.BLECharacteristic);
                for (let r = 0; r < t.length; r++) {
                    const n = t[r];
                    if (s.BLECharacteristic[n] === e) return n
                }
                return "UNKNOWN"
            }
            _parseHighCurrentAlert(e) {
                a("Received Message (WEDO2_HIGH_CURRENT_ALERT)", e)
            }
            _parseBatteryMessage(e) {
                a("Received Message (WEDO2_BATTERY)", e);
                const t = e[0];
                t !== this._batteryLevel && (this._batteryLevel = t, this.emit("batteryLevel", {
                    batteryLevel: t
                }))
            }
            _parseFirmwareRevisionString(e) {
                a("Received Message (WEDO2_FIRMWARE_REVISION)", e), this._firmwareVersion = e.toString()
            }
            _parsePortMessage(e) {
                a("Received Message (WEDO2_PORT_TYPE)", e);
                const t = e[0],
                    r = e[1],
                    n = r ? e[3] : 0;
                if (1 === r) {
                    const e = this._createDevice(n, t);
                    this._attachDevice(e)
                } else if (0 === r) {
                    const e = this._getDeviceByPortId(t);
                    e && this._detachDevice(e)
                }
            }
            _parseSensorMessage(e) {
                if (a("Received Message (WEDO2_SENSOR_VALUE)", e), 1 === e[0]) return void this.emit("button", {
                    event: s.ButtonState.PRESSED
                });
                if (0 === e[0]) return void this.emit("button", {
                    event: s.ButtonState.RELEASED
                });
                const t = e[1],
                    r = this._getDeviceByPortId(t);
                r && r.receive(e)
            }
        }
        t.WeDo2SmartHub = c, t.PortMap = {
            A: 1,
            B: 2,
            CURRENT_SENSOR: 3,
            VOLTAGE_SENSOR: 4,
            PIEZO_BUZZER: 5,
            HUB_LED: 6
        }
    }).call(this, r(2).Buffer)
}, function(e, t, r) {
    "use strict";
    var n = this && this.__importStar || function(e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e)
            for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    const i = n(r(0)),
        s = r(49),
        o = r(10),
        a = r(13),
        c = r(42),
        u = r(44),
        h = r(45),
        f = r(46),
        l = r(47),
        _ = r(14),
        d = r(15),
        p = r(1),
        E = r(16),
        v = r(17),
        T = r(18),
        O = r(19),
        m = r(20),
        y = r(21),
        b = r(22),
        M = r(23),
        S = r(24),
        L = r(25),
        R = r(26),
        g = r(27),
        C = r(28),
        D = r(29),
        A = r(30),
        w = r(31),
        P = r(32),
        I = r(33),
        N = r(34),
        B = r(35),
        U = r(36),
        H = r(37),
        F = r(38),
        x = r(39),
        W = r(40),
        j = r(41),
        k = r(4);
    window.PoweredUP = {
        PoweredUP: s.PoweredUP,
        BaseHub: o.BaseHub,
        WeDo2SmartHub: l.WeDo2SmartHub,
        TechnicMediumHub: f.TechnicMediumHub,
        Hub: c.Hub,
        RemoteControl: h.RemoteControl,
        DuploTrainBase: a.DuploTrainBase,
        Consts: i,
        ColorDistanceSensor: _.ColorDistanceSensor,
        Device: p.Device,
        DuploTrainBaseColorSensor: E.DuploTrainBaseColorSensor,
        DuploTrainBaseMotor: v.DuploTrainBaseMotor,
        DuploTrainBaseSpeaker: T.DuploTrainBaseSpeaker,
        DuploTrainBaseSpeedometer: O.DuploTrainBaseSpeedometer,
        HubLED: m.HubLED,
        Light: y.Light,
        MediumLinearMotor: b.MediumLinearMotor,
        MotionSensor: M.MotionSensor,
        MoveHub: u.MoveHub,
        MoveHubMediumLinearMotor: S.MoveHubMediumLinearMotor,
        MoveHubTiltSensor: L.MoveHubTiltSensor,
        PiezoBuzzer: R.PiezoBuzzer,
        RemoteControlButton: g.RemoteControlButton,
        SimpleMediumLinearMotor: C.SimpleMediumLinearMotor,
        TechnicColorSensor: D.TechnicColorSensor,
        TechnicDistanceSensor: A.TechnicDistanceSensor,
        TechnicForceSensor: w.TechnicForceSensor,
        TechnicMediumHubAccelerometerSensor: B.TechnicMediumHubAccelerometerSensor,
        TechnicMediumHubGyroSensor: U.TechnicMediumHubGyroSensor,
        TechnicMediumHubTiltSensor: H.TechnicMediumHubTiltSensor,
        TechnicMediumAngularMotor: N.TechnicMediumAngularMotor,
        TechnicLargeAngularMotor: P.TechnicLargeAngularMotor,
        TechnicLargeLinearMotor: I.TechnicLargeLinearMotor,
        TechnicXLargeLinearMotor: F.TechnicXLargeLinearMotor,
        TiltSensor: x.TiltSensor,
        TrainMotor: W.TrainMotor,
        VoltageSensor: j.VoltageSensor,
        CurrentSensor: d.CurrentSensor,
        isWebBluetooth: k.isWebBluetooth
    }
}, function(e, t, r) {
    "use strict";
    (function(e, n) {
        var i = this && this.__importStar || function(e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
                for (var r in e) Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return t.default = e, t
        };
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const s = r(53),
            o = r(13),
            a = r(42),
            c = r(44),
            u = r(45),
            h = r(46),
            f = r(47),
            l = i(r(0)),
            _ = r(5),
            d = r(3)("poweredup");
        class p extends _.EventEmitter {
            constructor() {
                super(), this._connectedHubs = {}, this._discoveryEventHandler = this._discoveryEventHandler.bind(this)
            }
            async scan() {
                try {
                    const e = await navigator.bluetooth.requestDevice({
                            filters: [{
                                services: [l.BLEService.WEDO2_SMART_HUB]
                            }, {
                                services: [l.BLEService.LPF2_HUB]
                            }],
                            optionalServices: [l.BLEService.WEDO2_SMART_HUB_2, "battery_service", "device_information"]
                        }),
                        t = await e.gatt.connect();
                    return this._discoveryEventHandler.call(this, t), !0
                } catch (e) {
                    return !1
                }
            }
            getHubs() {
                return Object.values(this._connectedHubs)
            }
            getHubByUUID(e) {
                return this._connectedHubs[e]
            }
            getHubByPrimaryMACAddress(e) {
                return Object.values(this._connectedHubs).filter(t => t.primaryMACAddress === e)[0]
            }
            getHubsByName(e) {
                return Object.values(this._connectedHubs).filter(t => t.name === e)
            }
            getHubsByType(e) {
                return Object.values(this._connectedHubs).filter(t => t.type === e)
            }
            _determineLPF2HubType(t) {
                return new Promise((r, i) => {
                    let s = e.alloc(0);
                    t.subscribeToCharacteristic(l.BLECharacteristic.LPF2_ALL, i => {
                        s = e.concat([s, i]);
                        const o = s[0];
                        if (o >= s.length) {
                            const e = s.slice(0, o);
                            s = s.slice(o), 1 === e[2] && 11 === e[3] ? n.nextTick(() => {
                                switch (e[5]) {
                                    case l.BLEManufacturerData.REMOTE_CONTROL_ID:
                                        r(l.HubType.REMOTE_CONTROL);
                                        break;
                                    case l.BLEManufacturerData.MOVE_HUB_ID:
                                        r(l.HubType.MOVE_HUB);
                                        break;
                                    case l.BLEManufacturerData.HUB_ID:
                                        r(l.HubType.HUB);
                                        break;
                                    case l.BLEManufacturerData.DUPLO_TRAIN_BASE_ID:
                                        r(l.HubType.DUPLO_TRAIN_BASE);
                                        break;
                                    case l.BLEManufacturerData.TECHNIC_MEDIUM_HUB:
                                        r(l.HubType.TECHNIC_MEDIUM_HUB)
                                }
                                d("Hub type determined")
                            }) : (d("Stashed in mailbox (LPF2_ALL)", e), t.addToCharacteristicMailbox(l.BLECharacteristic.LPF2_ALL, e))
                        }
                    }), t.writeToCharacteristic(l.BLECharacteristic.LPF2_ALL, e.from([5, 0, 1, 11, 5]))
                })
            }
            async _discoveryEventHandler(e) {
                const t = new s.WebBLEDevice(e);
                let r, n = l.HubType.UNKNOWN,
                    i = !1;
                try {
                    await t.discoverCharacteristicsForService(l.BLEService.WEDO2_SMART_HUB), n = l.HubType.WEDO2_SMART_HUB
                } catch (e) {}
                try {
                    n !== l.HubType.WEDO2_SMART_HUB && (await t.discoverCharacteristicsForService(l.BLEService.LPF2_HUB), i = !0)
                } catch (e) {}
                switch (i && (n = await this._determineLPF2HubType(t)), n) {
                    case l.HubType.WEDO2_SMART_HUB:
                        r = new f.WeDo2SmartHub(t);
                        break;
                    case l.HubType.MOVE_HUB:
                        r = new c.MoveHub(t);
                        break;
                    case l.HubType.HUB:
                        r = new a.Hub(t);
                        break;
                    case l.HubType.REMOTE_CONTROL:
                        r = new u.RemoteControl(t);
                        break;
                    case l.HubType.DUPLO_TRAIN_BASE:
                        r = new o.DuploTrainBase(t);
                        break;
                    case l.HubType.TECHNIC_MEDIUM_HUB:
                        r = new h.TechnicMediumHub(t);
                        break;
                    default:
                        return
                }
                t.on("discoverComplete", () => {
                    r.on("connect", () => {
                        d(`Hub ${r.uuid} connected`), this._connectedHubs[r.uuid] = r
                    }), r.on("disconnect", () => {
                        d(`Hub ${r.uuid} disconnected`), delete this._connectedHubs[r.uuid]
                    }), d(`Hub ${r.uuid} discovered`), this.emit("discover", r)
                })
            }
        }
        t.PoweredUP = p
    }).call(this, r(2).Buffer, r(12))
}, function(e, t, r) {
    "use strict";
    t.byteLength = function(e) {
        var t = u(e),
            r = t[0],
            n = t[1];
        return 3 * (r + n) / 4 - n
    }, t.toByteArray = function(e) {
        var t, r, n = u(e),
            o = n[0],
            a = n[1],
            c = new s(function(e, t, r) {
                return 3 * (t + r) / 4 - r
            }(0, o, a)),
            h = 0,
            f = a > 0 ? o - 4 : o;
        for (r = 0; r < f; r += 4) t = i[e.charCodeAt(r)] << 18 | i[e.charCodeAt(r + 1)] << 12 | i[e.charCodeAt(r + 2)] << 6 | i[e.charCodeAt(r + 3)], c[h++] = t >> 16 & 255, c[h++] = t >> 8 & 255, c[h++] = 255 & t;
        2 === a && (t = i[e.charCodeAt(r)] << 2 | i[e.charCodeAt(r + 1)] >> 4, c[h++] = 255 & t);
        1 === a && (t = i[e.charCodeAt(r)] << 10 | i[e.charCodeAt(r + 1)] << 4 | i[e.charCodeAt(r + 2)] >> 2, c[h++] = t >> 8 & 255, c[h++] = 255 & t);
        return c
    }, t.fromByteArray = function(e) {
        for (var t, r = e.length, i = r % 3, s = [], o = 0, a = r - i; o < a; o += 16383) s.push(h(e, o, o + 16383 > a ? a : o + 16383));
        1 === i ? (t = e[r - 1], s.push(n[t >> 2] + n[t << 4 & 63] + "==")) : 2 === i && (t = (e[r - 2] << 8) + e[r - 1], s.push(n[t >> 10] + n[t >> 4 & 63] + n[t << 2 & 63] + "="));
        return s.join("")
    };
    for (var n = [], i = [], s = "undefined" != typeof Uint8Array ? Uint8Array : Array, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, c = o.length; a < c; ++a) n[a] = o[a], i[o.charCodeAt(a)] = a;

    function u(e) {
        var t = e.length;
        if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
        var r = e.indexOf("=");
        return -1 === r && (r = t), [r, r === t ? 0 : 4 - r % 4]
    }

    function h(e, t, r) {
        for (var i, s, o = [], a = t; a < r; a += 3) i = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]), o.push(n[(s = i) >> 18 & 63] + n[s >> 12 & 63] + n[s >> 6 & 63] + n[63 & s]);
        return o.join("")
    }
    i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63
}, function(e, t) {
    t.read = function(e, t, r, n, i) {
        var s, o, a = 8 * i - n - 1,
            c = (1 << a) - 1,
            u = c >> 1,
            h = -7,
            f = r ? i - 1 : 0,
            l = r ? -1 : 1,
            _ = e[t + f];
        for (f += l, s = _ & (1 << -h) - 1, _ >>= -h, h += a; h > 0; s = 256 * s + e[t + f], f += l, h -= 8);
        for (o = s & (1 << -h) - 1, s >>= -h, h += n; h > 0; o = 256 * o + e[t + f], f += l, h -= 8);
        if (0 === s) s = 1 - u;
        else {
            if (s === c) return o ? NaN : 1 / 0 * (_ ? -1 : 1);
            o += Math.pow(2, n), s -= u
        }
        return (_ ? -1 : 1) * o * Math.pow(2, s - n)
    }, t.write = function(e, t, r, n, i, s) {
        var o, a, c, u = 8 * s - i - 1,
            h = (1 << u) - 1,
            f = h >> 1,
            l = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
            _ = n ? 0 : s - 1,
            d = n ? 1 : -1,
            p = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
        for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, o = h) : (o = Math.floor(Math.log(t) / Math.LN2), t * (c = Math.pow(2, -o)) < 1 && (o--, c *= 2), (t += o + f >= 1 ? l / c : l * Math.pow(2, 1 - f)) * c >= 2 && (o++, c /= 2), o + f >= h ? (a = 0, o = h) : o + f >= 1 ? (a = (t * c - 1) * Math.pow(2, i), o += f) : (a = t * Math.pow(2, f - 1) * Math.pow(2, i), o = 0)); i >= 8; e[r + _] = 255 & a, _ += d, a /= 256, i -= 8);
        for (o = o << i | a, u += i; u > 0; e[r + _] = 255 & o, _ += d, o /= 256, u -= 8);
        e[r + _ - d] |= 128 * p
    }
}, function(e, t) {
    var r = {}.toString;
    e.exports = Array.isArray || function(e) {
        return "[object Array]" == r.call(e)
    }
}, function(e, t, r) {
    "use strict";
    (function(e) {
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        const n = r(3),
            i = r(5),
            s = n("bledevice");
        class o extends i.EventEmitter {
            constructor(e) {
                super(), this._name = "", this._listeners = {}, this._characteristics = {}, this._queue = Promise.resolve(), this._mailbox = [], this._connected = !1, this._connecting = !1, this._webBLEServer = e, this._uuid = e.device.id, this._name = e.device.name, e.device.addEventListener("gattserverdisconnected", () => {
                    this._connecting = !1, this._connected = !1, this.emit("disconnect")
                }), setTimeout(() => {
                    this.emit("discoverComplete")
                }, 2e3)
            }
            get uuid() {
                return this._uuid
            }
            get name() {
                return this._name
            }
            get connecting() {
                return this._connecting
            }
            get connected() {
                return this._connected
            }
            connect() {
                return new Promise((e, t) => (this._connected = !0, e()))
            }
            disconnect() {
                return new Promise((e, t) => (this._webBLEServer.device.gatt.disconnect(), e()))
            }
            discoverCharacteristicsForService(e) {
                return new Promise(async (t, r) => {
                    let n;
                    s("Service/characteristic discovery started");
                    try {
                        n = await this._webBLEServer.getPrimaryService(e)
                    } catch (e) {
                        return r(e)
                    }
                    const i = await n.getCharacteristics();
                    for (const e of i) this._characteristics[e.uuid] = e;
                    return s("Service/characteristic discovery finished"), t()
                })
            }
            subscribeToCharacteristic(t, r) {
                this._listeners[t] && this._characteristics[t].removeEventListener("characteristicvaluechanged", this._listeners[t]), this._listeners[t] = t => {
                    const n = e.alloc(t.target.value.buffer.byteLength),
                        i = new Uint8Array(t.target.value.buffer);
                    for (let e = 0; e < n.length; e++) n[e] = i[e];
                    return s("Incoming data", n), r(n)
                }, this._characteristics[t].addEventListener("characteristicvaluechanged", this._listeners[t]);
                for (const e of this._mailbox) s("Replayed from mailbox (LPF2_ALL)", e), r(e);
                this._mailbox = [], this._characteristics[t].startNotifications()
            }
            addToCharacteristicMailbox(e, t) {
                this._mailbox.push(t)
            }
            readFromCharacteristic(t, r) {
                this._characteristics[t].readValue().then(t => {
                    const n = e.alloc(t.buffer.byteLength),
                        i = new Uint8Array(t.buffer);
                    for (let e = 0; e < n.length; e++) n[e] = i[e];
                    r(null, n)
                })
            }
            writeToCharacteristic(e, t, r) {
                this._queue = this._queue.then(() => this._characteristics[e].writeValue(t)).then(() => {
                    r && r()
                })
            }
            _sanitizeUUID(e) {
                return e.replace(/-/g, "")
            }
        }
        t.WebBLEDevice = o
    }).call(this, r(2).Buffer)
}, function(e, t, r) {
    e.exports = function(e) {
        function t(e) {
            let t = 0;
            for (let r = 0; r < e.length; r++) t = (t << 5) - t + e.charCodeAt(r), t |= 0;
            return n.colors[Math.abs(t) % n.colors.length]
        }

        function n(e) {
            let r;

            function o(...e) {
                if (!o.enabled) return;
                const t = o,
                    i = Number(new Date),
                    s = i - (r || i);
                t.diff = s, t.prev = r, t.curr = i, r = i, e[0] = n.coerce(e[0]), "string" != typeof e[0] && e.unshift("%O");
                let a = 0;
                e[0] = e[0].replace(/%([a-zA-Z%])/g, (r, i) => {
                    if ("%%" === r) return r;
                    a++;
                    const s = n.formatters[i];
                    if ("function" == typeof s) {
                        const n = e[a];
                        r = s.call(t, n), e.splice(a, 1), a--
                    }
                    return r
                }), n.formatArgs.call(t, e), (t.log || n.log).apply(t, e)
            }
            return o.namespace = e, o.enabled = n.enabled(e), o.useColors = n.useColors(), o.color = t(e), o.destroy = i, o.extend = s, "function" == typeof n.init && n.init(o), n.instances.push(o), o
        }

        function i() {
            const e = n.instances.indexOf(this);
            return -1 !== e && (n.instances.splice(e, 1), !0)
        }

        function s(e, t) {
            const r = n(this.namespace + (void 0 === t ? ":" : t) + e);
            return r.log = this.log, r
        }

        function o(e) {
            return e.toString().substring(2, e.toString().length - 2).replace(/\.\*\?$/, "*")
        }
        return n.debug = n, n.default = n, n.coerce = function(e) {
            if (e instanceof Error) return e.stack || e.message;
            return e
        }, n.disable = function() {
            const e = [...n.names.map(o), ...n.skips.map(o).map(e => "-" + e)].join(",");
            return n.enable(""), e
        }, n.enable = function(e) {
            let t;
            n.save(e), n.names = [], n.skips = [];
            const r = ("string" == typeof e ? e : "").split(/[\s,]+/),
                i = r.length;
            for (t = 0; t < i; t++) r[t] && ("-" === (e = r[t].replace(/\*/g, ".*?"))[0] ? n.skips.push(new RegExp("^" + e.substr(1) + "$")) : n.names.push(new RegExp("^" + e + "$")));
            for (t = 0; t < n.instances.length; t++) {
                const e = n.instances[t];
                e.enabled = n.enabled(e.namespace)
            }
        }, n.enabled = function(e) {
            if ("*" === e[e.length - 1]) return !0;
            let t, r;
            for (t = 0, r = n.skips.length; t < r; t++)
                if (n.skips[t].test(e)) return !1;
            for (t = 0, r = n.names.length; t < r; t++)
                if (n.names[t].test(e)) return !0;
            return !1
        }, n.humanize = r(55), Object.keys(e).forEach(t => {
            n[t] = e[t]
        }), n.instances = [], n.names = [], n.skips = [], n.formatters = {}, n.selectColor = t, n.enable(n.load()), n
    }
}, function(e, t) {
    var r = 1e3,
        n = 6e4,
        i = 36e5,
        s = 24 * i;

    function o(e, t, r, n) {
        var i = t >= 1.5 * r;
        return Math.round(e / r) + " " + n + (i ? "s" : "")
    }
    e.exports = function(e, t) {
        t = t || {};
        var a = typeof e;
        if ("string" === a && e.length > 0) return function(e) {
            if ((e = String(e)).length > 100) return;
            var t = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
            if (!t) return;
            var o = parseFloat(t[1]);
            switch ((t[2] || "ms").toLowerCase()) {
                case "years":
                case "year":
                case "yrs":
                case "yr":
                case "y":
                    return 315576e5 * o;
                case "weeks":
                case "week":
                case "w":
                    return 6048e5 * o;
                case "days":
                case "day":
                case "d":
                    return o * s;
                case "hours":
                case "hour":
                case "hrs":
                case "hr":
                case "h":
                    return o * i;
                case "minutes":
                case "minute":
                case "mins":
                case "min":
                case "m":
                    return o * n;
                case "seconds":
                case "second":
                case "secs":
                case "sec":
                case "s":
                    return o * r;
                case "milliseconds":
                case "millisecond":
                case "msecs":
                case "msec":
                case "ms":
                    return o;
                default:
                    return
            }
        }(e);
        if ("number" === a && !1 === isNaN(e)) return t.long ? function(e) {
            var t = Math.abs(e);
            if (t >= s) return o(e, t, s, "day");
            if (t >= i) return o(e, t, i, "hour");
            if (t >= n) return o(e, t, n, "minute");
            if (t >= r) return o(e, t, r, "second");
            return e + " ms"
        }(e) : function(e) {
            var t = Math.abs(e);
            if (t >= s) return Math.round(e / s) + "d";
            if (t >= i) return Math.round(e / i) + "h";
            if (t >= n) return Math.round(e / n) + "m";
            if (t >= r) return Math.round(e / r) + "s";
            return e + "ms"
        }(e);
        throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e))
    }
}]);
