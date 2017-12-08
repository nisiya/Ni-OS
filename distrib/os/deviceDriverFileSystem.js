///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* ----------------------------------
   DeviceDriverFileSystem.ts

   Requires deviceDriver.ts

   The File System Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverFileSystem = /** @class */ (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem() {
            var _this = 
            // Override the base method pointers.
            _super.call(this) || this;
            _this.driverEntry = _this.krnFSDriverEntry;
            return _this;
            // this.isr = this.krnFsDispatchKeyPress;
        }
        DeviceDriverFileSystem.prototype.krnFSDriverEntry = function () {
            // Initialization routine for this, the kernel-mode File System Device Driver.
            this.status = "loaded";
            if (sessionStorage) {
                if (sessionStorage.length == 0) {
                    // create file system
                    var tsb;
                    var value = new Array();
                    for (var i = 0; i < 4; i++) {
                        //first byte and pointer
                        value.push("0");
                    }
                    while (value.length < 64) {
                        value.push("00");
                    }
                    for (var i = 0; i < 8; i++) {
                        for (var j = 0; j < 78; j++) {
                            tsb = j.toString();
                            if (tsb.length < 2) {
                                tsb = "0" + tsb;
                            }
                            tsb = i.toString() + tsb;
                            sessionStorage.setItem(tsb, JSON.stringify(value));
                        }
                    }
                    TSOS.Control.loadDiskTable();
                    var sessionLength = sessionStorage.length;
                }
            }
            else {
                alert("Sorry, your browser do not support session storage.");
            }
        };
        DeviceDriverFileSystem.prototype.formatDisk = function () {
            var tsb;
            var value = new Array();
            var sessionLength = sessionStorage.length;
            for (var i = 0; i < sessionLength; i++) {
                var tsb = sessionStorage.key(i);
                value = JSON.parse(sessionStorage.getItem(tsb));
                value[0] = "1";
                sessionStorage.setItem(tsb, JSON.stringify(value));
                TSOS.Control.updateDiskTable(tsb);
            }
        };
        DeviceDriverFileSystem.prototype.zeroFill = function (tsb) {
            var value = value = JSON.parse(sessionStorage.getItem(tsb));
            for (var i = 0; i < 4; i++) {
                value[i] = "0";
            }
            for (var j = 4; j < value.length; j++) {
                value[j] = "00";
            }
        };
        DeviceDriverFileSystem.prototype.createFile = function (filename) {
            var createdFile = false;
            var dirTSB;
            var value = new Array();
            var asciiFilename;
            // make sure no duplicate filename
            var existFilename = this.lookupDataTSB(filename);
            if (existFilename) {
                return "ERROR_DUPLICATE_FILENAME";
            }
            else {
                // 000 is master boot rec
                // 77 is index of last DIR block sector
                for (var i = 1; i < 78; i++) {
                    var dirTSB = sessionStorage.key(i);
                    value = JSON.parse(sessionStorage.getItem(dirTSB));
                    if (value[0] == "0") {
                        var dataTSB = this.findDataTSB();
                        if (dataTSB != null) {
                            value[0] = "1";
                            for (var k = 1; k < 4; k++) {
                                value[k] = dataTSB.charAt(k - 1);
                            }
                            asciiFilename = filename.toString();
                            for (var j = 0; j < asciiFilename.length; j++) {
                                value[j + 4] = asciiFilename.charCodeAt(j).toString(16).toUpperCase();
                            }
                            sessionStorage.setItem(dirTSB, JSON.stringify(value));
                            TSOS.Control.updateDiskTable(dirTSB);
                            return filename + " - SUCCESS_FILE_CREATED";
                        }
                        else {
                            return "ERROR_DISK_FULL";
                        }
                    }
                }
                return "ERROR_DIR_FULL";
            }
        };
        DeviceDriverFileSystem.prototype.findDataTSB = function () {
            var dataTSB;
            var value = new Array();
            for (var i = 78; i < sessionStorage.length; i++) {
                dataTSB = sessionStorage.key(i);
                value = JSON.parse(sessionStorage.getItem(dataTSB));
                if (value[0] == "0") {
                    value[0] = "1";
                    sessionStorage.setItem(dataTSB, JSON.stringify(value));
                    TSOS.Control.updateDiskTable(dataTSB);
                    return dataTSB;
                }
            }
            return dataTSB;
        };
        DeviceDriverFileSystem.prototype.lookupDataTSB = function (filename) {
            var dirTSB;
            var dataTSB;
            var value = new Array();
            var dirFilename = "";
            for (var i = 1; i < 78; i++) {
                dirTSB = sessionStorage.key(i);
                value = JSON.parse(sessionStorage.getItem(dirTSB));
                if (value[0] == "1") {
                    var index = 4;
                    var letter;
                    while (value[index] != "00") {
                        letter = String.fromCharCode(parseInt(value[index], 16));
                        dirFilename = dirFilename + letter;
                        index++;
                    }
                    if (dirFilename == filename) {
                        dataTSB = value.splice(1, 3).toString().replace(/,/g, "");
                        return dataTSB;
                    }
                    dirFilename = "";
                }
            }
            return null;
        };
        DeviceDriverFileSystem.prototype.writeFile = function (filename, fileContent) {
            // look in dir for data tsb with filename
            var tsbUsed = new Array();
            var dataTSB = this.lookupDataTSB(filename);
            var value = new Array();
            var charCode;
            // if found
            if (dataTSB != null) {
                console.log("exist");
                // modify the value
                value = JSON.parse(sessionStorage.getItem(dataTSB));
                var contentIndex = 0;
                var valueIndex = 0;
                var pointer = value[1] + value[2] + value[3];
                if (pointer == "000") {
                    valueIndex = 4;
                    tsbUsed.push(dataTSB);
                }
                else {
                    if (pointer == "-1-1-1") {
                        tsbUsed.push(dataTSB);
                    }
                    else {
                        while (pointer != "-1-1-1") {
                            dataTSB = pointer;
                            tsbUsed.push(dataTSB);
                            value = JSON.parse(sessionStorage.getItem(dataTSB));
                            pointer = value[1] + value[2] + value[3];
                        }
                    }
                    for (var i = 4; i < value.length; i++) {
                        if (value[i] == "00") {
                            valueIndex = i;
                            break;
                        }
                    }
                }
                // add hex value of ascii value of fileContent
                while (contentIndex < fileContent.length) {
                    // if more than one block needed...
                    if (valueIndex == 64) {
                        // get new free data block
                        var oldDataTSB = dataTSB;
                        dataTSB = this.findDataTSB();
                        tsbUsed.push(dataTSB);
                        // free block obtained
                        if (dataTSB != null) {
                            // add pointer to new block in current block
                            for (var k = 1; k < 4; k++) {
                                value[k] = dataTSB.charAt(k - 1);
                            }
                            // save current block
                            sessionStorage.setItem(oldDataTSB, JSON.stringify(value));
                            TSOS.Control.updateDiskTable(oldDataTSB);
                            // set working block to new block
                            value = JSON.parse(sessionStorage.getItem(dataTSB));
                            valueIndex = 4;
                        }
                        else {
                            // no free block available
                            // undo a file modifications
                            for (var dataTSB in tsbUsed) {
                                this.zeroFill(dataTSB);
                            }
                            return "ERROR_DISK_FULL";
                        }
                    }
                    else {
                        // current block has space
                        charCode = fileContent.charCodeAt(contentIndex);
                        value[valueIndex] = charCode.toString(16).toUpperCase();
                        contentIndex++;
                        valueIndex++;
                    }
                }
                // save last block
                for (var k = 1; k < 4; k++) {
                    value[k] = "-1"; // last block indicator
                }
                sessionStorage.setItem(dataTSB, JSON.stringify(value));
                TSOS.Control.updateDiskTable(dataTSB);
                return filename + " - SUCCESS_FILE_MODIFIED";
            }
            else {
                return "ERROR_FILE_NOT_FOUND";
            }
        };
        return DeviceDriverFileSystem;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));