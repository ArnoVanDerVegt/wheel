/**
 * Wheel, copyright (c) 2020 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const dispatcher = require('../../dispatcher').dispatcher;
const Component  = require('../Component');

exports.BasicIODevice = class extends Component.Component {
    constructor(opts) {
        super(opts);
        this._canSetSpeed   = !!opts.canSetSpeed;
        this._canSetValue   = !!opts.canSetValue;
        this._canSetColor   = !!opts.canSetColor;
        this._canSetReady   = !!opts.canSetReady;
        this._getImage      = opts.getImage;
        this._hint          = opts.hint;
        this._icon          = opts.icon;
        this._baseClassName = 'io-device';
        this.initDOM(opts.parentNode);
    }

    initDOM(parentNode) {
        let style = this._style || {};
        this.create(
            parentNode,
            {
                id:        this.setElement.bind(this),
                className: this.getClassName(),
                style:     style,
                children: [
                    {
                        className: 'title',
                        children: [
                            {
                                ref:       this.setRef('image'),
                                type:      'img',
                                className: 'type'
                            },
                            {
                                ref:       this.setRef('port'),
                                type:      'span',
                                innerHTML: 'A'
                            },
                            {
                                ref:       this.setRef('ready'),
                                type:      'span',
                                className: 'ready'
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('speed'),
                        className: 'speed',
                        children: [
                            {
                                className: 'speed-bar'
                            },
                            {
                                className: 'speed-bar-center'
                            },
                            {
                                ref:       this.setRef('speedBarValue'),
                                className: 'speed-bar-value'
                            }
                        ]
                    },
                    {
                        ref:       this.setRef('position'),
                        className: 'position',
                        innerHTML: '0'
                    },
                    {
                        ref:       this.setRef('color'),
                        type:      'img',
                        className: 'color',
                        src:       this._getImage('images/constants/colorNone.svg')
                    }
                ]
            }
        );
    }

    onEvent(opts) {
        let element = this._element;
        super.onEvent(opts);
    }

    setImageVisible(imageVisible) {
        this._refs.image.style.display = imageVisible ? 'block' : 'none';
        return this;
    }

    setImage(image) {
        this._refs.image.src = this._getImage(image);
        return this;
    }

    setSpeedVisible(speedVisible) {
        this._refs.speed.style.display = speedVisible ? 'block' : 'none';
        return this;
    }

    setSpeed(speed) {
        let element = this._refs.speedBarValue;
        speed = Math.max(Math.min(speed, 100), -100);
        if (speed < 0) {
            let w = (-speed / 100) * 24;
            element.style.display = 'block';
            element.style.left    = (30 - w) + 'px';
            element.style.width   = w + 'px';
        } else if (speed === 0) {
            element.style.display = 'none';
        } else {
            element.style.display = 'block';
            element.style.left    = '30px';
            element.style.width   = ((speed / 100) * 24) + 'px';
        }
        return this;
    }

    setValueVisible(valueVisible) {
        this._refs.position.style.display = valueVisible ? 'block' : 'none';
        return this;
    }

    setValue(value) {
        value = value + '';
        if (value.length > 5) {
            value = value.substr(-5);
        }
        this._refs.position.innerHTML = value;
    }

    setColorVisible(colorVisible) {
        this._refs.color.style.display = colorVisible ? 'block' : 'none';
        return this;
    }

    setColor(color) {
        const colors = [
                'images/constants/colorNone.svg',
                'images/constants/colorBlack.svg',
                'images/constants/colorBlue.svg',
                'images/constants/colorGreen.svg',
                'images/constants/colorYellow.svg',
                'images/constants/colorRed.svg',
                'images/constants/colorWhite.svg',
                'images/constants/colorBrown.svg'
            ];
        if (color in colors) {
            this._refs.color.src = this._getImage(colors[color]);
            this.setColorVisible(this._canSetColor);
        } else {
            this.setColorVisible(false);
        }
    }

    setPort(port) {
        this._refs.port.innerHTML = port;
    }

    setReadyVisible(readyVisible) {
        this._refs.ready.style.display = readyVisible ? 'block' : 'none';
        return this;
    }

    setReady(ready) {
        let color = false;
        switch (ready) {
            case 1: color = 'var(--color-red)';    break;
            case 2: color = 'var(--color-yellow)'; break;
            case 3: color = 'var(--color-green)';  break;
        }
        if (color) {
            this.setReadyVisible(this._canSetReady);
            this._refs.ready.style.backgroundColor = color;
        } else {
            this.setReadyVisible(false);
        }
    }

    setDevice(type) {
    }

    onEvent(opts) {
        super.onEvent(opts);
        if ('device' in opts) {
            this.setDevice(opts.device);
        }
        if ('port' in opts) {
            this.setPort(opts.port);
        }
        if ('speed' in opts) {
            this
                .setSpeed(opts.speed)
                .setSpeedVisible(this._canSetSpeed);
        }
        if ('ready' in opts) {
            this.setReady(opts.ready);
        }
        if ('value' in opts) {
            this.setValue(opts.value);
        }
    }
};
