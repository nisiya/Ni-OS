/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
var APP_NAME = "GhOSt"; // Cause I'm craving thoses now
var APP_VERSION = "7"; // The amount that I want to eat
var CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
var TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue; // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue = null; // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers = null; // when clearly 'any' is not what we want. There is likely a better way, but what is it?
// Standard input and output
var _StdIn; // Same "to null or not to null" issue as above.
var _StdOut;
// UI
var _Console;
var _OsShell;
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _hardwareClockID = null;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
// current time and date
var _DateTime = new Date();
var _Date = _DateTime.toDateString();
var _Time = _DateTime.toLocaleTimeString();
// // for punctuation and symbol
// interface keyToChr {
//     key: number;
//     noShChr: number;
//     shChr: number;
// }
// var _ChrCodeArr: keyToChr [] = [
//     // above numbers
//     { "key": 48, "noShChr": 48, "shChr": 41 },
//     { "key": 49, "noShChr": 49, "shChr": 33 },
//     { "key": 50, "noShChr": 50, "shChr": 64 },
//     { "key": 51, "noShChr": 51, "shChr": 35 },
//     { "key": 52, "noShChr": 52, "shChr": 36 },
//     { "key": 53, "noShChr": 53, "shChr": 37 },
//     { "key": 54, "noShChr": 54, "shChr": 94 },
//     { "key": 55, "noShChr": 55, "shChr": 38 },
//     { "key": 56, "noShChr": 56, "shChr": 42 },
//     { "key": 57, "noShChr": 57, "shChr": 40 },
//     // others
//     { "key": 186, "noShChr": 59, "shChr": 58 },
//     { "key": 187, "noShChr": 61, "shChr": 43 },
//     { "key": 188, "noShChr": 44, "shChr": 60 },
//     { "key": 189, "noShChr": 45, "shChr": 95 },
//     { "key": 190, "noShChr": 46, "shChr": 62 },
//     { "key": 191, "noShChr": 47, "shChr": 63 },
//     { "key": 192, "noShChr": 96, "shChr": 126 },
//     { "key": 219, "noShChr": 91, "shChr": 123 },
//     { "key": 220, "noShChr": 92, "shChr": 124 },
//     { "key": 221, "noShChr": 93, "shChr": 125 },
//     { "key": 222, "noShChr": 39, "shChr": 34 }
// ]
var _KeyToChr = {
    "48": { "noShChr": 48, "shChr": 41 },
    "49": { "noShChr": 49, "shChr": 33 },
    "50": { "noShChr": 50, "shChr": 64 },
    "51": { "noShChr": 51, "shChr": 35 },
    "52": { "noShChr": 52, "shChr": 36 },
    "53": { "noShChr": 53, "shChr": 37 },
    "54": { "noShChr": 54, "shChr": 94 },
    "55": { "noShChr": 55, "shChr": 38 },
    "56": { "noShChr": 56, "shChr": 42 },
    "57": { "noShChr": 57, "shChr": 40 },
    // others
    "186": { "noShChr": 59, "shChr": 58 },
    "187": { "noShChr": 61, "shChr": 43 },
    "188": { "noShChr": 44, "shChr": 60 },
    "189": { "noShChr": 45, "shChr": 95 },
    "190": { "noShChr": 46, "shChr": 62 },
    "191": { "noShChr": 47, "shChr": 63 },
    "192": { "noShChr": 96, "shChr": 126 },
    "219": { "noShChr": 91, "shChr": 123 },
    "220": { "noShChr": 92, "shChr": 124 },
    "221": { "noShChr": 93, "shChr": 125 },
    "222": { "noShChr": 39, "shChr": 34 }
};
var onDocumentLoad = function () {
    TSOS.Control.hostInit();
    var clock = document.getElementById("clock");
    clock.innerHTML = _Date + " " + _Time;
};
