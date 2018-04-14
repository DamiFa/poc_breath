var breathing = {
    delay: 0,
    start: 0,
    current: 0,
    maxVolume: 0,
    bestMaxVolume: 0,
    bestDelay: 0
};
var breathValues = {
    breath: 0,
    curveAmplitude: 0,
    soundThreshold : 0.1,
    breathThreshold : 0.6,
    breathDelta : 0.0005,
    // 0.0001 min avant que la courbe ne bouge plus
    maxBreath: 0
};

function getBreath(){
    breathValues.breath = meter ? meter.volume : breathValues.breathThreshold;

    var distance = breathValues.maxBreath - breathValues.curveAmplitude;

    if(breathValues.breath > breathValues.breathThreshold){
        breathValues.curveAmplitude += breathValues.breathDelta * distance;
        if(breathing.start === 0) {
            breathing.start = new Date();
            breathing.bestMaxVolume = Math.max(breathing.bestMaxVolume, breathing.maxVolume);
            breathing.bestDelay = Math.max(breathing.bestDelay, breathing.delay);
            breathing.maxVolume = 0;
        }
        else {
            breathing.current = new Date();
            breathing.delay = Math.round((breathing.current - breathing.start)/100)/10;
            breathing.maxVolume = Math.max(breathing.maxVolume, breathValues.breath);
        }
    }
    else {
        breathValues.curveAmplitude -= breathValues.breathDelta * breathValues.curveAmplitude;
        if(breathing.start !== 0) resetBreathing();
    }

    return breathValues.curveAmplitude;
}

function getColorFromBreath(){
    
}

function resetBreathing(){
    breathing.start = 0;
    breathing.current = 0;
}