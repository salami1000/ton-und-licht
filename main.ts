/**
 * Einfaches Lichtsensor-Programm für Calliope mini 3
 */
/**
 * Taste A = Lichtstärke messen und speichern
 */
/**
 * Taste B = Gespeicherte Lichtstärke anzeigen
 */
// Taste A - Lichtstärke messen
input.onButtonPressed(Button.A, function () {
    basic.showString("Messe...")
    gespeicherteLichtstaerke = input.lightLevel()
    basic.showString("Gemessen!")
    basic.showNumber(gespeicherteLichtstaerke)
    basic.pause(1500)
    basic.showString("A=Messen B=Anzeigen")
})
// Taste B - Gespeicherte Lichtstärke anzeigen
input.onButtonPressed(Button.B, function () {
    if (gespeicherteLichtstaerke > 0) {
        basic.showString("Gespeichert:")
        basic.showNumber(gespeicherteLichtstaerke)
        // Zeige auch als Balken
        zeigeAlsBalken(gespeicherteLichtstaerke)
        basic.pause(1500)
        basic.showString("A=Messen B=Anzeigen")
    } else {
        basic.showString("Erst messen!")
        basic.pause(1000)
        basic.showString("A=Messen B=Anzeigen")
    }
})
// Hilfsfunktion - Zeigt Lichtstärke als Balken
function zeigeAlsBalken (wert: number) {
    basic.clearScreen()
    // Umrechnung: 0-255 wird zu 0-5 Balken
    balkenHoehe = Math.round(wert / 51)
    if (balkenHoehe > 5) {
        balkenHoehe = 5
    }
    for (let y = 4; y >= (5 - balkenHoehe); y--) {
        for (let x = 0; x < 5; x++) {
            led.plot(x, y)
        }
    }
basic.pause(2000)
    basic.clearScreen()
}
let balkenHoehe = 0
let gespeicherteLichtstaerke = 0
// Begrüßung
basic.showString("Lichtsensor")
basic.showIcon(IconNames.Heart)
basic.pause(1000)
basic.showString("A=Messen B=Anzeigen")
