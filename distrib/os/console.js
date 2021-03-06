///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = /** @class */ (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, prevCmd, // store handled commands
            updown, // counter to index through previous commands
            matchCmd, // store all matching commands
            matchIndex) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (prevCmd === void 0) { prevCmd = []; }
            if (updown === void 0) { updown = 0; }
            if (matchCmd === void 0) { matchCmd = []; }
            if (matchIndex === void 0) { matchIndex = 0; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.prevCmd = prevCmd;
            this.updown = updown;
            this.matchCmd = matchCmd;
            this.matchIndex = matchIndex;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // add command to previous command list
                    this.prevCmd.push(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                    this.updown = 0;
                }
                else if (chr === String.fromCharCode(8)) {
                    // delete a character
                    chr = this.buffer[this.buffer.length - 1];
                    this.removeChr(chr);
                }
                else if (chr === '38') {
                    // counter is within length of previous command list
                    if (this.updown < this.prevCmd.length) {
                        this.updown++;
                        // remove current text
                        this.removeLine();
                        // put previous command
                        this.putText(this.prevCmd[this.prevCmd.length - this.updown]);
                        // current text is now previous command so add to buffer
                        this.buffer = this.prevCmd[this.prevCmd.length - this.updown];
                    }
                }
                else if (chr === '40') {
                    // only if up key was used before
                    if (this.updown > 1) {
                        this.updown--;
                        this.removeLine();
                        this.putText(this.prevCmd[this.prevCmd.length - this.updown]);
                        this.buffer = this.prevCmd[this.prevCmd.length - this.updown];
                    }
                }
                else if (chr === String.fromCharCode(9)) {
                    if (this.matchCmd.length == 0) {
                        // first tab on new line
                        var re = new RegExp('^' + this.buffer + '', 'i');
                        // find all commands that start with str in buffer               
                        for (var i = 0; i < _OsShell.commandList.length; i++) {
                            if (re.test(_OsShell.commandList[i].command)) {
                                this.matchCmd.push(_OsShell.commandList[i].command);
                            }
                        }
                        this.matchIndex = 0;
                    }
                    if (this.matchCmd.length > 0) {
                        // replace current text with previous command
                        this.removeLine();
                        this.putText(this.matchCmd[this.matchIndex]);
                        this.buffer = this.matchCmd[this.matchIndex];
                        if (this.matchIndex == (this.matchCmd.length - 1)) {
                            this.matchCmd = [];
                        }
                        else {
                            this.matchIndex++;
                        }
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        };
        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
        };
        Console.prototype.removeChr = function (chr) {
            if (this.buffer !== "") {
                // if beginning of line, move cursor back to previous line
                if (this.currentXPosition <= 0) {
                    this.currentYPosition -= _DefaultFontSize +
                        _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                        _FontHeightMargin;
                    // get end of text position from that line
                    this.currentXPosition = _SaveX;
                }
                // Move cursor back to X position before chr written.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, chr);
                this.currentXPosition = this.currentXPosition - offset;
                // clear chr with clearRect
                var chrHeight = _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;
                // highest point of chr
                var chrTop = this.currentYPosition - (_DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize));
                // offset is the width of the rectangle
                _DrawingContext.clearRect(this.currentXPosition, chrTop, offset, chrHeight);
                // remove chr from buffer
                var newBuffer = this.buffer.substring(0, this.buffer.length - 1);
                this.buffer = newBuffer;
            }
        };
        Console.prototype.removeLine = function () {
            if (this.buffer !== "") {
                var i = this.buffer.length - 1;
                while (this.buffer.length > 0) {
                    this.removeChr(this.buffer[i]);
                    i--;
                }
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            var saveYPosition = this.currentYPosition;
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
            if (this.currentYPosition > _Canvas.height) {
                // keep track of position of last line
                // start copying after first line which will "scroll up"
                var startYPostion = _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;
                var copyHeight = _Canvas.height - startYPostion - _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
                // save screenshot
                var imgData = _DrawingContext.getImageData(0, startYPostion, _Canvas.width, copyHeight);
                // clear screen
                this.init();
                // put screenshot to top of screen
                _DrawingContext.putImageData(imgData, 0, 0);
                // put cursor back to correct
                this.currentYPosition = saveYPosition;
            }
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
