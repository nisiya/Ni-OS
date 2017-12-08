///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverFileSystem.ts

   Requires deviceDriver.ts

   The File System Device Driver.
   ---------------------------------- */

   module TSOS {
    
        // Extends DeviceDriver
        export class DeviceDriverFileSystem extends DeviceDriver {
    
            constructor() {
                // Override the base method pointers.
                super();
                this.driverEntry = this.krnFSDriverEntry;
                // this.isr = this.krnFsDispatchKeyPress;
            }
            
            public krnFSDriverEntry() {
                // Initialization routine for this, the kernel-mode File System Device Driver.
                this.status = "loaded";
                if(sessionStorage){
                    if(sessionStorage.length == 0){ // load new file system driver only if new window
                        // create file system
                        var tsb: string;
                        var value = new Array<string>();
                        for (var i=0; i<4; i++){
                            //first byte and pointer
                            value.push("0");
                        }
                        while (value.length<65){
                            value.push("00");
                        }
                        console.log(value);
                        for (var i=0; i<8; i++){
                            for (var j=0; j<78; j++){
                                tsb = j.toString();
                                if (tsb.length<2){
                                    tsb = "0" + tsb;
                                } 
                                tsb = i.toString() + tsb;
                                sessionStorage.setItem(tsb, JSON.stringify(value));
                            }
                        }
                        Control.loadDiskTable();
                        var sessionLength = sessionStorage.length;
                        console.log(sessionLength.toString());
                    }
                } else{
                    alert("Sorry, your browser do not support session storage.");
                }
            }

            public formatDisk(){
                var tsb: string;
                var value = new Array<string>();
                var sessionLength = sessionStorage.length;
                console.log(sessionLength.toString());
                for (var i=0; i<sessionLength;i++){
                    var tsb = sessionStorage.key(i);
                    value = JSON.parse(sessionStorage.getItem(tsb));
                    value[0] = "1"
                    sessionStorage.setItem(tsb,JSON.stringify(value));
                    Control.updateDiskTable(tsb);
                }
            }

            public createFile(filename): boolean{
                var createdFile:boolean = false;
                var dirTSB: string;
                var value = new Array<string>();
                var asciiFilename: string;
                var sessionLength = sessionStorage.length;
                console.log(sessionLength.toString());
                // 000 is master boot rec
                // 77 is index of last DIR block sector
                for (var i=1; i<78; i++){
                    var dirTSB = sessionStorage.key(i);
                    value = JSON.parse(sessionStorage.getItem(dirTSB));
                    if(value[0]=="0"){
                        var dataTSB = this.findDataTSB();
                        if(dataTSB != null){
                            value[0] = "1";
                            for (var k=1; k<4; k++){
                                value[k] = dataTSB.charAt(k-1);
                            }
                            asciiFilename = filename.toString();
                            for (var j=0; j<asciiFilename.length; j++){
                                value[j+4] = asciiFilename.charCodeAt(j).toString(16).toUpperCase();
                            }
                            sessionStorage.setItem(dirTSB, JSON.stringify(value));
                            Control.updateDiskTable(dirTSB);
                            return true;
                        } else {
                            return false;
                        }
                    }
                }   
                return false;
            }

            public findDataTSB():string {
                var dataTSB: string;
                var value = new Array<string>();
                for (var i=78; i<sessionStorage.length; i++){
                    dataTSB = sessionStorage.key(i);
                    console.log(dataTSB);
                    value = JSON.parse(sessionStorage.getItem(dataTSB));
                    if(value[0]=="0"){
                        value[0] = "1";
                        sessionStorage.setItem(dataTSB, JSON.stringify(value));
                        Control.updateDiskTable(dataTSB);
                        return dataTSB; 
                    }
                }
                return dataTSB;
            }
        
            public lookupDataTSB(filename):string {
                var dirTSB: string;
                var dataTSB: string;
                var value = new Array<string>();
                var dirFilename: string = "";
                for (var i=1; i<78; i++){
                    dirTSB = sessionStorage.key(i);
                    console.log("lookup dir " + dirTSB);
                    value = JSON.parse(sessionStorage.getItem(dirTSB));
                    if(value[0]=="1"){
                        var index = 4;
                        var letter;
                        while(value[index]!="00"){
                            console.log("lookup index " + index);
                            letter = String.fromCharCode(parseInt(value[index],16));
                            console.log("lookup letter " + letter);
                            dirFilename = dirFilename + letter;
                            index++;
                        }
                        console.log("lookup file " + dirFilename);
                        if (dirFilename == filename){
                            dataTSB = value.splice(1,3).toString().replace(/,/g,"");
                            console.log("lookup data " + dataTSB);
                            return dataTSB;
                        }
                    }
                }
                return null;
            }

            public writeFile(filename, fileContent): boolean{
                // look in dir for data tsb with filename
                var dataTSB: string = this.lookupDataTSB(filename);
                var value = new Array<string>();
                var charCode;
                // if found
                if(dataTSB != null){
                    console.log("exist");
                    // modify the value
                    value = JSON.parse(sessionStorage.getItem(dataTSB));
                    var contentIndex = 0;
                    var valueIndex = 4;
                    // add hex value of ascii value of fileContent
                    while(contentIndex<fileContent.length){
                        // if more than one block needed...
                        if(valueIndex == 63){
                            // get new free data block
                            dataTSB = this.findDataTSB();
                            // add pointer to new block in current block
                            for (var k=1; k<4; k++){
                                value[k] = dataTSB.charAt(k-1);
                            }
                            // save current block
                            sessionStorage.setItem(dataTSB, JSON.stringify(value));
                            Control.updateDiskTable(dataTSB);
                            // set working block to new block
                            value = JSON.parse(sessionStorage.getItem(dataTSB));
                            valueIndex = 4;
                        } else{
                            // current block has space
                            charCode = fileContent.charCodeAt(contentIndex);
                            value[valueIndex] = charCode.toString(16).toUpperCase();
                            contentIndex++;
                            valueIndex++;
                        }
                        // save last block
                        for (var k=1; k<4; k++){
                            value[k] = "-1"; // last block indicator
                        }
                        sessionStorage.setItem(dataTSB, JSON.stringify(value));
                        Control.updateDiskTable(dataTSB);
                    }
                    return true;
                } else{
                    return false;
                }
            }

        }
    }
    