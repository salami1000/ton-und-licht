/**
 * Licht- und Geräuschsensor Steuerung für Calliope mini 3
 */
/**
 * Reagiert auf Licht und Geräusche in der Umgebung
 */
// Logo berühren - Demo starten
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    basic.showString("Demo")
    demoModus()
})
// Geräuschbasierte Steuerung
function soundSteuerung (soundwert: number) {
    if (soundwert > schwellwertSound + 50) {
        // Sehr laut
        basic.showIcon(IconNames.TShirt)
        music.playTone(523, music.beat(BeatFraction.Sixteenth))
        led.setBrightness(255)
    } else if (soundwert > schwellwertSound + 20) {
        // Laut
        basic.showIcon(IconNames.SmallHeart)
        music.playTone(392, music.beat(BeatFraction.Sixteenth))
        led.setBrightness(180)
    } else if (soundwert > schwellwertSound) {
        // Mittel
        basic.showLeds(`
            . . # . .
            . # # # .
            . # # # .
            . # # # .
            . . # . .
            `)
        led.setBrightness(100)
    } else {
        // Leise
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
            `)
        led.setBrightness(50)
    }
}
// Hauptfunktion - Modi anzeigen
function zeigeModus () {
    if (modus == 0) {
        basic.showString("LICHT")
        basic.showIcon(IconNames.Butterfly)
    } else if (modus == 1) {
        basic.showString("SOUND")
        basic.showIcon(IconNames.SmallHeart)
    } else {
        basic.showString("KOMBI")
        basic.showIcon(IconNames.Target)
    }
    basic.pause(1000)
    basic.showString("B=Kalibrieren")
}
// Taste A - Modus wechseln
input.onButtonPressed(Button.A, function () {
    modus = (modus + 1) % 3
    zeigeModus()
})
// Lichtbasierte Steuerung
function lichtSteuerung (lichtwert: number) {
    if (lichtwert > schwellwertLicht + 50) {
        // Sehr hell
        basic.showLeds(`
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            # # # # #
            `)
        led.setBrightness(255)
    } else if (lichtwert > schwellwertLicht) {
        // Mittel hell
        basic.showLeds(`
            . # # # .
            # # # # #
            # # # # #
            # # # # #
            . # # # .
            `)
        led.setBrightness(128)
    } else if (lichtwert > schwellwertLicht - 50) {
        // Dunkel
        basic.showLeds(`
            . . # . .
            . # # # .
            # # # # #
            . # # # .
            . . # . .
            `)
        led.setBrightness(64)
    } else {
        // Sehr dunkel
        basic.showLeds(`
            . . . . .
            . . # . .
            . # # # .
            . . # . .
            . . . . .
            `)
        led.setBrightness(32)
    }
}
// Kombinierte Steuerung
function kombiSteuerung (licht: number, sound: number) {
    // Spezielle Kombinationen
    if (licht > schwellwertLicht && sound > schwellwertSound) {
        // Hell und laut - Party-Modus!
        basic.showIcon(IconNames.Happy)
        music.playTone(440, music.beat(BeatFraction.Quarter))
        led.setBrightness(255)
    } else if (licht < schwellwertLicht - 30 && sound < schwellwertSound - 30) {
        // Dunkel und leise - Schlaf-Modus
        basic.showIcon(IconNames.Asleep)
        led.setBrightness(10)
    } else if (licht < schwellwertLicht - 30 && sound > schwellwertSound) {
        // Dunkel aber laut - Alarm!
        basic.showIcon(IconNames.Skull)
        music.playTone(262, music.beat(BeatFraction.Half))
        led.setBrightness(255)
    } else {
        // Standard - zeige Licht und Sound als Balken
        lichtBalken = Math.round(map(licht, 0, 255, 0, 4))
        soundBalken = Math.round(map(sound, 0, 255, 0, 4))
        // Einfache Balkenanzeige
        basic.clearScreen()
        for (let x = 0; x <= lichtBalken; x++) {
            // Licht-Balken oben
            led.plot(x, 1)
        }
        for (let x2 = 0; x2 <= soundBalken; x2++) {
            // Sound-Balken unten
            led.plot(x2, 3)
        }
    }
}
// Kalibrierung der Sensoren
function kalibrieren () {
    basic.showString("Kalibriere...")
    // Lichtsensor kalibrieren
    basic.showString("Licht:")
    basic.pause(500)
    schwellwertLicht = input.lightLevel()
    basic.showNumber(schwellwertLicht)
    // Geräuschsensor kalibrieren
    basic.showString("Mach Geraeusch!")
    basic.pause(1000)
    schwellwertSound = input.soundLevel()
    basic.showString("Sound:")
    basic.showNumber(schwellwertSound)
    basic.showIcon(IconNames.Yes)
    basic.showString("Fertig!")
    basic.pause(1000)
}
// Schütteln - Aktuelle Werte anzeigen
input.onGesture(Gesture.Shake, function () {
    zeigeWerte()
})
// Hilfsfunktion für Wertebereich-Umrechnung
function map (wert: number, von_min: number, von_max: number, zu_min: number, zu_max: number) {
    return (wert - von_min) * (zu_max - zu_min) / (von_max - von_min) + zu_min
}
// Aktuelle Sensorwerte anzeigen
function zeigeWerte () {
    basic.showString("L:" + input.lightLevel())
    basic.showString("S:" + input.soundLevel())
    basic.pause(1000)
}
// Taste B - Schwellwerte kalibrieren
input.onButtonPressed(Button.B, function () {
    kalibrieren()
})
// Demo-Modus mit verschiedenen Effekten
function demoModus () {
    for (let index = 0; index < 10; index++) {
        // Regenbogen-Effekt basierend auf Licht
        licht = input.lightLevel()
        if (licht > 200) {
            basic.showIcon(IconNames.Butterfly)
            music.playTone(523, music.beat(BeatFraction.Eighth))
        } else if (licht > 100) {
            basic.showIcon(IconNames.Diamond)
            music.playTone(392, music.beat(BeatFraction.Eighth))
        } else {
            basic.showIcon(IconNames.Square)
            music.playTone(262, music.beat(BeatFraction.Eighth))
        }
        basic.pause(300)
    }
    basic.showIcon(IconNames.Happy)
}
let aktuellerSound = 0
let aktuellesLicht = 0
let licht = 0
let soundBalken = 0
let lichtBalken = 0
let modus = 0
let schwellwertSound = 0
let schwellwertLicht = 0
// 0=Lichtmodus, 1=Geräuschmodus, 2=Kombimodus
// Mittlerer Lichtwert
schwellwertLicht = 128
// Mittlerer Geräuschpegel
schwellwertSound = 128
// Begrüßung und Modusauswahl
basic.showString("Licht & Sound")
basic.showIcon(IconNames.Heart)
basic.pause(1000)
zeigeModus()
// Hauptschleife - Sensoren überwachen
basic.forever(function () {
    aktuellesLicht = input.lightLevel()
    aktuellerSound = input.soundLevel()
    if (modus == 0) {
        // Nur Lichtsensor
        lichtSteuerung(aktuellesLicht)
    } else if (modus == 1) {
        // Nur Geräuschsensor
        soundSteuerung(aktuellerSound)
    } else {
        // Kombination aus beiden
        kombiSteuerung(aktuellesLicht, aktuellerSound)
    }
    basic.pause(100)
})
