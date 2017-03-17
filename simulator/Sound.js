(function() {

// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
var oscillator = audioCtx.createOscillator();

oscillator.type = 'square';
oscillator.frequency.value = 440; // value in hertz
oscillator.connect(audioCtx.destination);
oscillator.start();
oscillator.stop();


})();