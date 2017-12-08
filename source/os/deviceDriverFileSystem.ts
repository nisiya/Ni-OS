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
                        while (value.length<64){
                            value.push("00");
                        }
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
                    }
                } else{
                    alert("Sorry, your browser do not support session storage.");
                }
            }

            public formatDisk(){
                var tsb: string;
                var value = new Array<string>();
                var sessionLength = sessionStorage.length;
                for (var i=0; i<sessionLength;i++){
                    var tsb = sessionStorage.key(i);
                    value = JSON.parse(sessionStorage.getItem(tsb));
                    value[0] = "1"
                    sessionStorage.setItem(tsb,JSON.stringify(value));
                    Control.updateDiskTable(tsb);
                }
            }

            public zeroFill(tsb){
                var value = value = JSON.parse(sessionStorage.getItem(tsb));
                for (var i=0; i<4; i++){
                    value[i] = "0";
                }
                for (var j=4; j<value.length; j++){
                    value[j] = "00";
                }
                sessionStorage.setItem(tsb, JSON.stringify(value));
                Control.updateDiskTable(tsb);
            }

            public createFile(filename): string{
                var createdFile:boolean = false;
                var dirTSB: string;
                var value = new Array<string>();
                var asciiFilename: string;
                // make sure no duplicate filename
                var existFilename = this.lookupDataTSB(filename);
                if (existFilename){
                    return "ERROR_DUPLICATE_FILENAME";
                } else{
                    // 000 is master boot rec
                    // 77 is index of last DIR block sector
                    for (var i=1; i<78; i++){
                        var dirTSB = sessionStorage.key(i);
                        value = JSON.parse(sessionStorage.getItem(dirTSB));
                        if(value[0]=="0"){
                            this.zeroFill(dirTSB);
                            value = JSON.parse(sessionStorage.getItem(dirTSB));
                            var dataTSB = this.findDataTSB();
                            if(dataTSB != null){
                                value[0] = "1";
                                for (var k=1; k<4; k++){
                                    // pointer in dir 
                                    value[k] = dataTSB.charAt(k-1);
                                }
                                asciiFilename = filename.toString();
                                for (var j=0; j<asciiFilename.length; j++){
                                    value[j+4] = asciiFilename.charCodeAt(j).toString(16).toUpperCase();
                                }
                                sessionStorage.setItem(dirTSB, JSON.stringify(value));
                                Control.updateDiskTable(dirTSB);
                                return filename + " - SUCCESS_FILE_CREATED";
                            } else {
                                return "ERROR_DISK_FULL";
                            }
                        }
                    }
                    return "ERROR_DIR_FULL";
                }   
            }

            public findDataTSB():string {
                var dataTSB: string;
                var value = new Array<string>();
                for (var i=78; i<sessionStorage.length; i++){
                    dataTSB = sessionStorage.key(i);
                    value = JSON.parse(sessionStorage.getItem(dataTSB));
                    if(value[0]=="0"){
                        this.zeroFill(dataTSB);
                        value = JSON.parse(sessionStorage.getItem(dataTSB));
                        value[0]="1";
                        sessionStorage.setItem(dataTSB, JSON.stringify(value));
                        Control.updateDiskTable(dataTSB);
                        console.log(dataTSB);
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
                    value = JSON.parse(sessionStorage.getItem(dirTSB));
                    if(value[0]=="1"){
                        var index = 4;
                        var letter;
                        while(value[index]!="00"){
                            letter = String.fromCharCode(parseInt(value[index],16));
                            dirFilename = dirFilename + letter;
                            index++;
                        }
                        console.log(dirFilename);
                        console.log(filename);
                        if (dirFilename == filename){
                            dataTSB = value.splice(1,3).toString().replace(/,/g,"");
                            value = JSON.parse(sessionStorage.getItem(dataTSB));
                            return dataTSB;
                        }
                        dirFilename = "";
                    }
                }
                return null;
            }

            public writeFile(filename, fileContent): string{
                // look in dir for data tsb with filename
                var tsbUsed: string[] = new Array<string>();
                var dataTSB: string = this.lookupDataTSB(filename);
                var firstTSB: string = dataTSB;
                var value = new Array<string>();
                var charCode;
                // if found
                if(dataTSB != null){
                    console.log("exist");
                    // modify the value
                    value = JSON.parse(sessionStorage.getItem(dataTSB));
                    var contentIndex: number = 0;
                    var valueIndex: number;
                    var firstIndex: number;
                    var pointer = value[1] + value[2] + value[3];
                    if (pointer == "000"){
                        valueIndex = 4;
                    } else {
                        // if(pointer == "-1-1-1"){
                        //     tsbUsed.push(dataTSB);
                        // } else{
                        while(pointer!="-1-1-1"){
                            dataTSB = pointer;
                            tsbUsed.push(dataTSB);
                            value = JSON.parse(sessionStorage.getItem(dataTSB));      
                            pointer = value[1] + value[2] + value[3];                          
                        }
                            // }
                        for(var i=4; i<value.length; i++){
                            if(value[i]=="00"){
                                valueIndex = i;
                                break;
                            }
                        }
                    }
                    firstIndex = valueIndex;
                    // add hex value of ascii value of fileContent
                    while(contentIndex<fileContent.length){
                        // if more than one block needed...
                        if(valueIndex == 64){
                            // get new free data block
                            var oldDataTSB: string = dataTSB;
                            dataTSB = this.findDataTSB();
                            tsbUsed.push(dataTSB);
                            // free block obtained
                            if(dataTSB!=null){
                                // add pointer to new block in current block
                                for (var k=1; k<4; k++){
                                    value[k] = dataTSB.charAt(k-1);
                                }
                                // save current block
                                sessionStorage.setItem(oldDataTSB, JSON.stringify(value));
                                Control.updateDiskTable(oldDataTSB);
                                // set working block to new block
                                value = JSON.parse(sessionStorage.getItem(dataTSB));
                                valueIndex = 4;
                            } else{
                                // no free block available
                                // undo all file modifications
                                for (var dataTSB in tsbUsed){
                                    this.zeroFill(dataTSB);
                                }
                                for (var m=firstIndex; m<64; m++){
                                    value = JSON.parse(sessionStorage.getItem(firstTSB));
                                    value[m] = "00";
                                    sessionStorage.setItem(firstTSB, JSON.stringify(value));
                                    Control.updateDiskTable(firstTSB);
                                }
                                return "File content was not written - ERROR_DISK_FULL";
                            }
                        } else{
                            // current block has space
                            charCode = fileContent.charCodeAt(contentIndex);
                            value[valueIndex] = charCode.toString(16).toUpperCase();
                            contentIndex++;
                            valueIndex++;
                        }
                    }
                    // save last block
                    for (var k=1; k<4; k++){
                        value[k] = "-1"; // last block indicator
                    }
                    sessionStorage.setItem(dataTSB, JSON.stringify(value));
                    Control.updateDiskTable(dataTSB);
                    return filename + " - SUCCESS_FILE_MODIFIED";
                } else{
                    return "ERROR_FILE_NOT_FOUND";
                }
            }

            public readFile(filename): string{
                var fileContent:string = filename + ": ";
                var dataTSB: string = this.lookupDataTSB(filename);
                var value = new Array<string>();
                var pointer: string;
                var index: number;
                var charCode: number;

                // check if file exist
                if (dataTSB!=null){
                    value = JSON.parse(sessionStorage.getItem(dataTSB));
                    pointer = value[1] + value[2] + value[3];
                    index = 4;
                    while(index<64 && value[index]!="00"){
                        // append letters to fileContent
                        charCode = parseInt(value[index],16);
                        fileContent = fileContent + String.fromCharCode(charCode)
                        index++;
                        // if need to read more than one block
                        if(index==64 && pointer!="-1-1-1"){
                            value = JSON.parse(sessionStorage.getItem(pointer));
                            pointer = value[1] + value[2] + value[3];
                            index = 4;
                        }
                    }
                    return fileContent;
                } else{
                    return "ERROR_FILE_NOT_FOUND";
                }
            }

            public deleteFile(filename): string{
                var dataTSB: string = this.lookupDataTSB(filename);
                var dirTSB: string;
                var value = new Array<string>();
                var pointer: string;

                if (dataTSB!=null){
                    // delete directory first
                    for(var i=0; i<78; i++){
                        dirTSB = sessionStorage.key(i);
                        value = JSON.parse(sessionStorage.getItem(dirTSB));
                        pointer = value[1] + value[2] + value[3];
                        if(pointer == dataTSB){
                            value[0] = "0";
                            sessionStorage.setItem(dirTSB, JSON.stringify(value));
                            break;
                        }
                    }
                    //
                    value = JSON.parse(sessionStorage.getItem(dataTSB));
                    value[0]="0";
                    sessionStorage.setItem(dataTSB, JSON.stringify(value));
                    Control.updateDiskTable(dataTSB);
                    pointer = value[1] + value[2] + value[3];
                    if(pointer != "000"){
                        while(pointer != "-1-1-1"){
                            dataTSB = pointer;
                            value = JSON.parse(sessionStorage.getItem(dataTSB));
                            value[0]="0";
                            sessionStorage.setItem(dataTSB, JSON.stringify(value));
                            Control.updateDiskTable(dataTSB);
                            pointer = value[1] + value[2] + value[3];
                        }
                    }
                    return "SUCCESS_FILE_DELETED";
                } else {
                    return "ERROR_FILE_NOT_FOUND";
                }
            }
        }
    }
    