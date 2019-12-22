const fs   = require('fs');
const exec = require('child_process').exec;

let output = '';

const addFileCode = function(filename, code) {
        output += '\n\n' +
            '//=================================================================================================//\n' +
            '//\n' +
            '// File: ' + filename + '\n' +
            '//\n' +
            '//=================================================================================================//\n\n' + code;
    };

const createMotorUpdate = function() {
        let template = fs.readFileSync('vm/modMotorTemplate.lms').toString().trim();
        for (let layer = 1; layer <= 4; layer++) {
            let ports = ['A', 'B', 'C', 'D'];
            for (let port = 0; port < 4; port++) {
                let s = template
                            .split('{A}').join(layer + ports[port])
                            .split('{a}').join(layer + ports[port].toLowerCase())
                            .split('{l}').join((layer - 1).toString())
                            .split('{pn}').join((port + 101).toString())
                            .split('{p}').join(port.toString());
                console.log('    Generating:', 'vm/modMotor' + layer + ports[port] + '.lms');
                addFileCode('vm/modMotor' + layer + ports[port] + '.lms', s);
            }
        }
    };

const files = [
        'vm/vmVars.lms',
        'vm/modScreenVars.lms',
        'vm/modMotorVars.lms',
        'vm/modSensorVars.lms',
        'vm/modPSPVars.lms',
        'vm/vm.lms',
        'vm/vmLoad.lms',
        'vm/vmRun.lms',
        'vm/vmRead.lms',
        'vm/vmWrite.lms',
        'vm/vmMod.lms',
        'vm/vmUtils.lms',
        'vm/modStandard.lms',
        'vm/modMath.lms',
        'vm/modScreenInit.lms',
        'vm/modScreen.lms',
        'vm/modLight.lms',
        'vm/modButton.lms',
        'vm/modSound.lms',
        'vm/modMotorInit.lms',
        'vm/modMotor.lms',
        createMotorUpdate,
        //'vm/modMotor1A.lms',
        'vm/modSensorInit.lms',
        'vm/modSensor.lms',
        'vm/modFileInit.lms',
        'vm/modFile.lms',
        'vm/modBit.lms',
        'vm/modString.lms',
        'vm/modSystem.lms',
        'vm/modPSPInit.lms',
        'vm/modPSP.lms'
    ];

console.log('Building Wheel VM...');

files.forEach(function(file) {
    if (typeof file === 'function') {
        file();
    } else {
        console.log('    Loading:', file);
        addFileCode(file, fs.readFileSync(file).toString().trim());
    }
});

fs.writeFileSync('vm.lms', output.trim());

console.log('Compiling Wheel VM...');
exec(
    'java -jar assembler.jar vm',
    function(err, stdout, stderr) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    }
);
