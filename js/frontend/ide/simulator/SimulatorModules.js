/**
 * Wheel, copyright (c) 2019 - present by Arno van der Vegt
 * Distributed under an MIT license: https://arnovandervegt.github.io/wheel/license.txt
**/
const standardModuleConstants = require('../../../shared/vm/modules/standardModuleConstants');
const screenModuleConstants   = require('../../../shared/vm/modules/screenModuleConstants');
const lightModuleConstants    = require('../../../shared/vm/modules/lightModuleConstants');
const buttonModuleConstants   = require('../../../shared/vm/modules/buttonModuleConstants');
const soundModuleConstants    = require('../../../shared/vm/modules/soundModuleConstants');
const motorModuleConstants    = require('../../../shared/vm/modules/motorModuleConstants');
const sensorModuleConstants   = require('../../../shared/vm/modules/sensorModuleConstants');
const Sound                   = require('../../../shared/lib/Sound').Sound;
const dispatcher              = require('../../lib/dispatcher').dispatcher;

exports.SimulatorModules = class {
    constructor() {
        this._simulator = null;
        this._motors    = null;
        this._sensors   = null;
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
        let vmData   = vm.getVMData();
        let resource = this._resources.get(vmData.getStringList()[sample.filename]);
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

    setupStandardModule(vm) {
        let display        = this._simulator.getPlugin('ev3').getDisplay();
        let self           = this;
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
        let display      = this._simulator.getPlugin('ev3').getDisplay();
        let self         = this;
        let screenModule = this._modules[screenModuleConstants.MODULE_SCREEN];
        if (!screenModule) {
            return this;
        }
        this._events.push(
            screenModule.addEventListener('Screen.Clear',      this, function()          { display.clearScreen();                                     }),
            screenModule.addEventListener('Screen.Fill',       this, function(fill)      { display.setFill(fill.fill);                                }),
            screenModule.addEventListener('Screen.FillColor',  this, function(fillColor) { display.setFillColor(fillColor.fillColor);                 }),
            screenModule.addEventListener('Screen.TextSize',   this, function(textSize)  { display.setTextSize(textSize.textSize);                    }),
            screenModule.addEventListener('Screen.TextAlign',  this, function(textAlign) { display.setTextAlign(textAlign.textAlign);                 }),
            screenModule.addEventListener('Screen.DrawPixel',  this, function(pixel)     { display.drawPixel(pixel.x, pixel.y);                       }),
            screenModule.addEventListener('Screen.DrawNum',    this, function(num)       { display.drawText(num.x, num.y, num.n);                     }),
            screenModule.addEventListener('Screen.DrawText',   this, function(text)      { display.drawText(text.x, text.y, text.s);                  }),
            screenModule.addEventListener('Screen.DrawLine',   this, function(line)      { display.drawLine(line.x1, line.y1, line.x2, line.y2);      }),
            screenModule.addEventListener('Screen.DrawRect',   this, function(rect)      { display.drawRect(rect.x, rect.y, rect.width, rect.height); }),
            screenModule.addEventListener('Screen.DrawCircle', this, function(circle)    { display.drawCircle(circle.x, circle.y, circle.radius);     }),
            screenModule.addEventListener('Screen.DrawImage',  this, function(image)     { self.drawImage(display, image);                            })
        );
        return this;
    }

    setupLightModule(vm) {
        let light       = this._simulator.getPlugin('ev3').getLight();
        let lightModule = this._modules[lightModuleConstants.MODULE_LIGHT];
        if (!lightModule) {
            return this;
        }
        this._events.push(
            lightModule.addEventListener('Light.Light', this, function(l) { light.setColor(l.color); })
        );
        return this;
    }

    setupButtonModule(vm) {
        let buttons      = this._simulator.getPlugin('ev3').getButtons();
        let buttonModule = this._modules[buttonModuleConstants.MODULE_BUTTON];
        if (!buttonModule) {
            return this;
        }
        this._events.push(
            buttonModule.addEventListener('Button.Button',       this, function(button) { button(buttons.readButton()); }),
            buttonModule.addEventListener('Button.WaitForPress', this, function(button) { button(buttons.readButton()); })
        );
        return this;
    }

    setupSoundModule(vm) {
        let sound       = this._simulator.getPlugin('ev3').getSound();
        let self        = this;
        let soundModule = this._modules[soundModuleConstants.MODULE_SOUND];
        if (!soundModule) {
            return this;
        }
        this._events.push(
            soundModule.addEventListener('Sound.PlayTone',   this, function(tone)   { sound.playTone(tone); }),
            soundModule.addEventListener('Sound.PlaySample', this, function(sample) { self.playSample(sample); })
        );
        return this;
    }

    setupMotorModule(vm) {
        let motors      = this._motors;
        let motorModule = this._modules[motorModuleConstants.MODULE_MOTOR];
        if (!motorModule) {
            return this;
        }
        this._events.push(
            motorModule.addEventListener('Motor.SetType',  this, function(motor) { motors.setType(motor);                 }),
            motorModule.addEventListener('Motor.SetSpeed', this, function(motor) { motors.setSpeed(motor);                }),
            motorModule.addEventListener('Motor.GetType',  this, function(motor) { motor.callback(motors.getType(motor)); }),
            motorModule.addEventListener('Motor.Reset',    this, function(motor) { motors.setPosition(motor);             }),
            motorModule.addEventListener('Motor.MoveTo',   this, function(motor) { motors.moveTo(motor);                  }),
            motorModule.addEventListener('Motor.On',       this, function(motor) { motors.on(motor);                      }),
            motorModule.addEventListener('Motor.TimeOn',   this, function(motor) { motors.timeOn(motor);                  }),
            motorModule.addEventListener('Motor.Stop',     this, function(motor) { motors.stop(motor);                    }),
            motorModule.addEventListener('Motor.Read',     this, function(motor) { motor.callback(motors.read(motor));    }),
            motorModule.addEventListener('Motor.Ready',    this, function(motor) { motor.callback(motors.ready(motor));   })
        );
        return this;
    }

    setupSensorModule(vm) {
        let sensors      = this._sensors;
        let sensorModule = this._modules[sensorModuleConstants.MODULE_SENSOR];
        if (!sensorModule) {
            return this;
        }
        this._events.push(
            sensorModule.addEventListener('Sensor.SetType', this, function(sensor) { sensors.setType(sensor);                  }),
            sensorModule.addEventListener('Sensor.GetType', this, function(sensor) { sensor.callback(sensors.getType(sensor)); }),
            sensorModule.addEventListener('Sensor.SetMode', this, function(sensor) { sensors.setMode(sensor);                  }),
            sensorModule.addEventListener('Sensor.Reset',   this, function(sensor) { sensors.reset(sensor);                    }),
            sensorModule.addEventListener('Sensor.Read',    this, function(sensor) { sensor.callback(sensors.read(sensor));    })
        );
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
        this._motors    = opts.simulator.getPlugin('motors');
        this._sensors   = opts.simulator.getPlugin('sensors');
        this
            .setupStandardModule(vm)
            .setupScreenModule(vm)
            .setupLightModule(vm)
            .setupButtonModule(vm)
            .setupSoundModule(vm)
            .setupMotorModule(vm)
            .setupSensorModule(vm);
    }
};
