window.electron = true;

const ipcRenderer    = require('electron').ipcRenderer;
const VMRunner       = require('../frontend/vm/VMRunner').VMRunner;
const SettingsState  = require('../frontend/ide/settings/SettingsState').SettingsState;
const UIState        = require('../frontend/lib/UIState').UIState;
const EV3State       = require('../frontend/vm/ev3/EV3State').EV3State;
const PoweredUpState = require('../frontend/vm/poweredup/PoweredUpState').PoweredUpState;

(function() {
    const onIpcMessage = function(event, arg) {
            let data;
            try {
                data = JSON.parse(arg).data;
            } catch (error) {
                return;
            }
            console.log('data:', data);
            const settings = new SettingsState({}).onLoad(data.settings);
            new VMRunner({
                program:   data.program,
                ev3:       new EV3State({layerCount: settings.getDaisyChainMode()}),
                poweredUp: new PoweredUpState({layerCount: settings.getDaisyChainMode()})
            });
        };

    const onDOMContentLoaded = function() {
            ipcRenderer.on('postMessage', onIpcMessage);
            ipcRenderer.send('postMessage', {command: 'vmProgram'});
        };

    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
})();
