/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const standardModuleConstants      = require('../../../shared/vm/modules/standardModuleConstants');
const screenModuleConstants        = require('../../../shared/vm/modules/screenModuleConstants');
const lightModuleConstants         = require('../../../shared/vm/modules/lightModuleConstants');
const buttonModuleConstants        = require('../../../shared/vm/modules/buttonModuleConstants');
const soundModuleConstants         = require('../../../shared/vm/modules/soundModuleConstants');
const motorModuleConstants         = require('../../../shared/vm/modules/motorModuleConstants');
const sensorModuleConstants        = require('../../../shared/vm/modules/sensorModuleConstants');
const pspModuleConstants           = require('../../../shared/vm/modules/pspModuleConstants');
const multiplexerModuleConstants   = require('../../../shared/vm/modules/multiplexerModuleConstants');
const deviceModuleConstants        = require('../../../shared/vm/modules/deviceModuleConstants');
const poweredUpModuleConstants     = require('../../../shared/vm/modules/poweredUpModuleConstants');
const componentFormModuleConstants = require('../../../shared/vm/modules/components/componentFormModuleConstants');
const Sound                        = require('../../../shared/lib/Sound').Sound;
const dispatcher                   = require('../../lib/dispatcher').dispatcher;
const pluginUuid                   = require('../plugins/pluginUuid');

const callOnObject = function() {
        let args   = Array.from(arguments);
        let object = args.shift();
        if (!object) {
            return 0;
        }
        let method = args.shift();
        if (!object[method]) {
            return 0;
        }
        return object[method].apply(object, args);
    };

exports.SimulatorModules = class {
    constructor(opts) {
        this._ide       = opts.ide;
        this._settings  = opts.settings;
        this._simulator = null;
        this._resources = null;
        this._events    = [];
        this._modules   = [];
        this._vm        = null;
    }

    reset() {
    }

    setResources(resources) {
        this._resources = resources;
    }

    drawImage(display, image) {
        let resource = this._resources.get(image.filename);
        if (!resource) {
            return;
        }
        resource.getData(function(data) {
            data && display.drawImage(image.x, image.y, data);
        });
    }

    playSample(sample) {
        let vm = this._vm;
        if (!vm) {
            return;
        }
        let vmData    = vm.getVMData();
        let resources = this._resources;
        let resource  = resources.get(vmData.getStringList()[sample.filename]);
        if (!resource) {
            let filenames = resources.getFilenameList();
            let j         = -sample.filename.length;
            for (let i = 0; i < filenames.length; i++) {
                let filename = filenames[i];
                if (filename.substr(j) === sample.filename) {
                    resource = resources.get(filename);
                    break;
                }
            }
        }
        if (!resource) {
            return;
        }
        resource.getData(function(data) {
            vm.sleep(1000000);
            data = data.data;
            new Sound().create(
                {
                    data:       data,
                    offset1:    0,
                    offset2:    data.length,
                    volume:     sample.volume,
                    onFinished: function() {
                        vm.sleep(0);
                    }
                }
            );
        });
    }

    getActiveDevicePlugin() {
        let uuid = (this._settings.getActiveDevice() === 0) ?
                pluginUuid.SIMULATOR_EV3_UUID : pluginUuid.SIMULATOR_POWERED_UP_UUID;
        return this._simulator.getPluginByUuid(uuid);
    }

    getActiveMotorsPlugin() {
        let uuid = (this._settings.getActiveDevice() === 0) ?
                pluginUuid.SIMULATOR_EV3_MOTORS_UUID : pluginUuid.SIMULATOR_POWERED_UP_UUID;
        return this._simulator.getPluginByUuid(uuid);
    }

    getActiveSensorsPlugin() {
        let uuid = (this._settings.getActiveDevice() === 0) ?
                pluginUuid.SIMULATOR_EV3_SENSORS_UUID : pluginUuid.SIMULATOR_POWERED_UP_UUID;
        return this._simulator.getPluginByUuid(uuid);
    }

    setupStandardModule(vm) {
        let standardModule = this._modules[standardModuleConstants.MODULE_STANDARD];
        if (!standardModule) {
            return this;
        }
        this._events.push(
            standardModule.addEventListener('Console.Log',   this, function(message) { dispatcher.dispatch('Console.Log', message); }),
            standardModule.addEventListener('Console.Clear', this, function()        { dispatcher.dispatch('Console.Clear');        })
        );
        return this;
    }

    setupScreenModule(vm) {
        let screenModule = this._modules[screenModuleConstants.MODULE_SCREEN];
        if (!screenModule) {
            return this;
        }
        const getDisplay = (function() {
                let device = this.getActiveDevicePlugin();
                return device && device.getDisplay ? device.getDisplay() : null;
            }).bind(this);
        let self = this;
        this._events.push(
            screenModule.addEventListener('Screen.Update',     this, function()          { callOnObject(getDisplay(), 'updateScreen');                                          }),
            screenModule.addEventListener('Screen.Clear',      this, function()          { callOnObject(getDisplay(), 'clearScreen');                                           }),
            screenModule.addEventListener('Screen.Fill',       this, function(fill)      { callOnObject(getDisplay(), 'setFill',      fill.fill);                               }),
            screenModule.addEventListener('Screen.FillColor',  this, function(fillColor) { callOnObject(getDisplay(), 'setFillColor', fillColor.fillColor);                     }),
            screenModule.addEventListener('Screen.TextSize',   this, function(textSize)  { callOnObject(getDisplay(), 'setTextSize',  textSize.textSize);                       }),
            screenModule.addEventListener('Screen.TextAlign',  this, function(textAlign) { callOnObject(getDisplay(), 'setTextAlign', textAlign.textAlign);                     }),
            screenModule.addEventListener('Screen.DrawPixel',  this, function(pixel)     { callOnObject(getDisplay(), 'drawPixel',    pixel.x, pixel.y);                        }),
            screenModule.addEventListener('Screen.DrawNum',    this, function(num)       { callOnObject(getDisplay(), 'drawText',     num.x, num.y, num.n);                     }),
            screenModule.addEventListener('Screen.DrawText',   this, function(text)      { callOnObject(getDisplay(), 'drawText',     text.x, text.y, text.s);                  }),
            screenModule.addEventListener('Screen.DrawLine',   this, function(line)      { callOnObject(getDisplay(), 'drawLine',     line.x1, line.y1, line.x2, line.y2);      }),
            screenModule.addEventListener('Screen.DrawRect',   this, function(rect)      { callOnObject(getDisplay(), 'drawRect',     rect.x, rect.y, rect.width, rect.height); }),
            screenModule.addEventListener('Screen.DrawCircle', this, function(circle)    { callOnObject(getDisplay(), 'drawCircle',   circle.x, circle.y, circle.radius);       }),
            screenModule.addEventListener('Screen.DrawImage',  this, function(image)     { self.drawImage(getDisplay(), image);                                                 })
        );
        return this;
    }

    setupLightModule(vm) {
        let lightModule = this._modules[lightModuleConstants.MODULE_LIGHT];
        if (!lightModule) {
            return this;
        }
        const getLight = (function(layer) {
                let device = this.getActiveDevicePlugin();
                return (device && device.getLight) ? device.getLight(layer) : null;
            }).bind(this);
        this._events.push(
            lightModule.addEventListener('Light.Light', this, function(l) { callOnObject(getLight(l.layer), 'setColor', l.mode); })
        );
        return this;
    }

    setupButtonModule(vm) {
        let buttonModule = this._modules[buttonModuleConstants.MODULE_BUTTON];
        if (!buttonModule) {
            return this;
        }
        const getButtons = (function(layer) {
                let device = this.getActiveDevicePlugin();
                return (device && device.getButtons) ? device.getButtons(layer) : 0;
            }).bind(this);
        this._events.push(
            buttonModule.addEventListener('Button.Button',       this, function(b) { b.callback(callOnObject(getButtons(), 'readButton', b.layer)); }),
            buttonModule.addEventListener('Button.WaitForPress', this, function(b) { b.callback(callOnObject(getButtons(), 'readButton', b.layer)); })
        );
        return this;
    }

    setupSoundModule(vm) {
        let soundModule = this._modules[soundModuleConstants.MODULE_SOUND];
        if (!soundModule) {
            return this;
        }
        const getSound = (function() {
                let device = this.getActiveDevicePlugin();
                return device && device.getSound ? device.getSound() : null;
            }).bind(this);
        let self = this;
        this._events.push(
            soundModule.addEventListener('Sound.PlayTone',   this, function(tone)   { callOnObject(getSound(), 'playTone', tone); }),
            soundModule.addEventListener('Sound.PlaySample', this, function(sample) { self.playSample(sample); })
        );
        return this;
    }

    setupMotorModule(vm) {
        let motorModule = this._modules[motorModuleConstants.MODULE_MOTOR];
        if (!motorModule) {
            return this;
        }
        const getMotors = (function() {
                return this.getActiveMotorsPlugin();
            }).bind(this);
        this._events.push(
            motorModule.addEventListener('Motor.SetType',   this, function(motor) { callOnObject(getMotors(), 'setType', motor);                   }),
            motorModule.addEventListener('Motor.SetSpeed',  this, function(motor) { callOnObject(getMotors(), 'setSpeed', motor);                  }),
            motorModule.addEventListener('Motor.GetType',   this, function(motor) { motor.callback(callOnObject(getMotors(), 'getType', motor));   }),
            motorModule.addEventListener('Motor.Reset',     this, function(motor) { callOnObject(getMotors(), 'setPosition', motor);               }),
            motorModule.addEventListener('Motor.MoveTo',    this, function(motor) { callOnObject(getMotors(), 'moveTo', motor);                    }),
            motorModule.addEventListener('Motor.On',        this, function(motor) { callOnObject(getMotors(), 'on', motor);                        }),
            motorModule.addEventListener('Motor.TimeOn',    this, function(motor) { callOnObject(getMotors(), 'timeOn', motor);                    }),
            motorModule.addEventListener('Motor.Stop',      this, function(motor) { callOnObject(getMotors(), 'stop', motor);                      }),
            motorModule.addEventListener('Motor.Read',      this, function(motor) { motor.callback(callOnObject(getMotors(), 'read', motor));      }),
            motorModule.addEventListener('Motor.Ready',     this, function(motor) { motor.callback(callOnObject(getMotors(), 'ready', motor));     }),
            motorModule.addEventListener('Motor.ReadyBits', this, function(motor) {
                motor.callback(callOnObject(getMotors(), 'readyBits', motor));
            })
        );
        return this;
    }

    setupSensorModule(vm) {
        let sensorModule = this._modules[sensorModuleConstants.MODULE_SENSOR];
        if (!sensorModule) {
            return this;
        }
        const getSensors = (function() {
                return this.getActiveSensorsPlugin();
            }).bind(this);
        this._events.push(
            sensorModule.addEventListener('Sensor.SetType', this, function(sensor) { callOnObject(getSensors(), 'setType', sensor);                  }),
            sensorModule.addEventListener('Sensor.GetType', this, function(sensor) { sensor.callback(callOnObject(getSensors(), 'getType', sensor)); }),
            sensorModule.addEventListener('Sensor.SetMode', this, function(sensor) { callOnObject(getSensors(), 'setMode', sensor);                  }),
            sensorModule.addEventListener('Sensor.Reset',   this, function(sensor) { callOnObject(getSensors(), 'reset', sensor);                    }),
            sensorModule.addEventListener('Sensor.Read',    this, function(sensor) { sensor.callback(callOnObject(getSensors(), 'read', sensor));    })
        );
        return this;
    }

    setupPspModule(vm) {
        let pspModule = this._modules[pspModuleConstants.MODULE_PSP];
        if (!pspModule) {
            return this;
        }
        this._events.push(
            dispatcher.on('Sensor.PSP.Changed', pspModule, pspModule.onValueChanged)
        );
        return this;
    }

    setupMultiplexerModule(vm) {
        let multiplexerModule = this._modules[multiplexerModuleConstants.MODULE_MULTIPLEXER];
        if (!multiplexerModule) {
            return this;
        }
        this._events.push(
            dispatcher.on('Sensor.Multiplexer.Changed', multiplexerModule, multiplexerModule.onValueChanged)
        );
        return this;
    }

    setupDeviceModule(vm) {
        let deviceModule = this._modules[deviceModuleConstants.MODULE_DEVICE];
        if (!deviceModule) {
            return this;
        }
        this._events.push(
            deviceModule.addEventListener(
                'Device.Select',
                this,
                function(device) {
                    let signals = ['Button.Device.EV3', 'Button.Device.PoweredUp'];
                    if (signals[device.device]) {
                        dispatcher.dispatch(signals[device.device]);
                    }
                }
            )
        );
        return this;
    }

    setupPoweredUpModule(vm) {
        let poweredUpModule = this._modules[poweredUpModuleConstants.MODULE_POWERED_UP];
        if (!poweredUpModule) {
            return this;
        }
        const getPoweredUpDevice = (function() {
                return this._simulator.getPluginByUuid(pluginUuid.SIMULATOR_POWERED_UP_UUID);
            }).bind(this);
        this._events.push(
            poweredUpModule.addEventListener('PoweredUp.Start',     this, function(readAddress) {}),
            poweredUpModule.addEventListener('PoweredUp.SetDevice', this, function(device) { getPoweredUpDevice().setDeviceType(device.layer, device.type); })
        );
        return this;
    }

    setupComponentFormModule(vm) {
        this._modules[componentFormModuleConstants.MODULE_FORM].setIDE(this._ide);
        return this;
    }

    setupModules(opts) {
        while (this._events.length) {
            this._events.pop()();
        }
        let vm = opts.vm;
        this._vm        = vm;
        this._simulator = opts.simulator;
        this._modules   = opts.modules;
        this
            .setupStandardModule(vm)
            .setupScreenModule(vm)
            .setupLightModule(vm)
            .setupButtonModule(vm)
            .setupSoundModule(vm)
            .setupMotorModule(vm)
            .setupSensorModule(vm)
            .setupPspModule(vm)
            .setupMultiplexerModule(vm)
            .setupDeviceModule(vm)
            .setupPoweredUpModule(vm)
            .setupComponentFormModule(vm);
    }
};
