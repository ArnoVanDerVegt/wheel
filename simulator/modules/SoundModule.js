(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'vm.modules.SoundModule',
        wheel.Class(wheel.vm.modules.VMModule, function(supr) {
            this.run = function(commandId) {
                var vm     = this._vm;
                var vmData = this._vmData;

                switch (commandId) {
                    case 0: // SOUND_PLAY_TONE
                        this._vm.pause();
                        var playTone   = vmData.getRecordFromAtOffset(['frequency', 'duration', 'volume']);
                        var audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
                        var oscillator = audioCtx.createOscillator();
                        var gainNode   = audioCtx.createGain();

                        gainNode.gain.value = 100;

                        oscillator.type = 'square';
                        oscillator.frequency.value = playTone.frequency;
                        oscillator.connect(audioCtx.destination);
                        oscillator.start();

                        setTimeout(
                            function() {
                                vm.resume();
                                oscillator.stop();
                            },
                            playTone.duration
                        )

                        break;
                }
            };
        })
    );
})();
