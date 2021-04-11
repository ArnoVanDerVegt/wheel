window.electron = true;

const ipcRenderer    = require('electron').ipcRenderer;
const VMRunner       = require('../frontend/vm/VMRunner').VMRunner;
const SettingsState  = require('../frontend/ide/settings/SettingsState').SettingsState;
const UIState        = require('../frontend/lib/UIState').UIState;
const NXTState       = require('../frontend/vm/device/nxt/NXTState').NXTState;
const EV3State       = require('../frontend/vm/device/ev3/EV3State').EV3State;
const PoweredUpState = require('../frontend/vm/device/poweredup/PoweredUpState').PoweredUpState;
const SpikeState     = require('../frontend/vm/device/spike/SpikeState').SpikeState;

(function() {
    const onIpcMessage = function(event, arg) {
            let data;
            try {
                data = JSON.parse(arg).data;
            } catch (error) {
                return;
            }
            const settings = new SettingsState({}).onLoad(data.settings);
            new VMRunner({
                projectFilename: data.projectFilename,
                program:         data.program,
                settings:        settings,
                ui:              new UIState({}),
                nxt:             new NXTState({activeLayerCount: settings.getNXTDeviceCount()}),
                ev3:             new EV3State({activeLayerCount: settings.getDaisyChainMode()}),
                poweredUp:       new PoweredUpState({activeLayerCount: settings.getPoweredUpDeviceCount()}),
                spike:           new PoweredUpState({activeLayerCount: settings.getSpikeDeviceCount()})
            });
        };

    const onDOMContentLoaded = function() {
            ipcRenderer.on('postMessage', onIpcMessage);
            ipcRenderer.send('postMessage', {command: 'vmProgram'});
        };

    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
})();
