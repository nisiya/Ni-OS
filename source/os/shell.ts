///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />


/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereami,
                                  "whereami",
                                  "- Displays the users current location.");
            this.commandList[this.commandList.length] = sc;

            // whomai
            sc = new ShellCommand(this.shellWhoami,
                                  "whoami",
                                  "- Displays the users identity.");
            this.commandList[this.commandList.length] = sc;

            // meow
            sc = new ShellCommand(this.shellMeow,
                                  "meow",
                                  "- Flushes the toilet. [audio warning]");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                "load",
                "<int> - Validates and loads user program input into memory with given or default priority of 10.");
            this.commandList[this.commandList.length] = sc;

            // run <id>
            sc = new ShellCommand(this.shellRun,
                "run",
                "<pid> - Runs the process with the id.");
            this.commandList[this.commandList.length] = sc;

            // runall
            sc = new ShellCommand(this.shellRunall,
                "runall",
                "- Runs all loaded process.");
            this.commandList[this.commandList.length] = sc;

            // quantum <int>
            sc = new ShellCommand(this.shellQuantum,
                "quantum",
                "- <int> - Sets the Round Robin quantum to this value.");
            this.commandList[this.commandList.length] = sc;

            // ps
            sc = new ShellCommand(this.shellPs,
                "ps",
                "Outputs pid of active processes.");
            this.commandList[this.commandList.length] = sc;

            // kill <pid>
            sc = new ShellCommand(this.shellKill,
                "kill",
                "<pid> - Kills the specified process id.");
            this.commandList[this.commandList.length] = sc;


            // welp
            sc = new ShellCommand(this.shellWelp,
                "welp",
                "- Displays BSOD when the kernel traps an OS error.");
            this.commandList[this.commandList.length] = sc;


            // prompt <string>
            sc = new ShellCommand(this.shellStatus,
                "status",
                "<string> - Sets the user status.");
            this.commandList[this.commandList.length] = sc;

            // clearmem
            sc = new ShellCommand(this.shellClearmem,
                "clearmem",
                "clear all memory partition");
            this.commandList[this.commandList.length] = sc;

            // create <string>
            sc = new ShellCommand(this.shellCreate,
                "create",
                "<string> - Creates a filename with that name");
            this.commandList[this.commandList.length] = sc;
        
            // write <string> "string"
            sc = new ShellCommand(this.shellWrite,
                "write",
                "<string> \"string\" - Writes content in \"\" to file with that name");
            this.commandList[this.commandList.length] = sc;

            // read <filename>
            sc = new ShellCommand(this.shellRead,
                "read",
                "<string> - Reads content of file with that name");
            this.commandList[this.commandList.length] = sc;

            // delete <filename>
            sc = new ShellCommand(this.shellDelete,
                "delete",
                "<string> - deletes file with that name");
            this.commandList[this.commandList.length] = sc;

            // ls
            sc = new ShellCommand(this.shellLs,
                "ls",
                "list the files currently stored on the disk");
            this.commandList[this.commandList.length] = sc;
            
            // format <string>
            sc = new ShellCommand(this.shellFormat,
                "format",
                "<string> - quick or full formats the drive");
            this.commandList[this.commandList.length] = sc;

            // getschedule
            sc = new ShellCommand(this.shellGetSchedule,
                "getschedule",
                "get the currently selected cpu scheduling algorithm");
            this.commandList[this.commandList.length] = sc;

            // setschedule <string>
            sc = new ShellCommand(this.shellSetSchedule,
                "setschedule",
                "<string> - set CPU scheduling algorithm to rr (Round Robin), fcfs (First-come, First-serve), or priority (non-preemptive)");
            this.commandList[this.commandList.length] = sc;

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //

        // Invalid commands
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, " + TEST_SUBJECT + ",");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        // Curse
        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        // apology
        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // ver
        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION + " or so I thought");
        }

        // help
        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        // shutdown
        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        // cls
        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        // man
        public shellMan(args) {
            if (args.length > 0) {
                // explains what each topic does

                var topic = args[0];
                switch (topic) {

                    // help
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // Descriptive MANual page entries for the the rest of the shell commands here.

                    // ver
                    case "ver":
                        _StdOut.putText("Ver displays the version of the OS");
                        break;

                    // shutdown
                    case "shutdown":
                        _StdOut.putText("Shuts down the OS.");
                        break;

                    // cls
                    case "cls":
                        _StdOut.putText("Cls clears the CLI");
                        break;

                    // trace
                    case "trace":
                        _StdOut.putText("Trace followed by on would turn on the OS trace on and ");
                        _StdOut.advanceLine();
                        _StdOut.putText("followed by off would turn it off.");
                        break;

                    // rot13
                    case "rot13":
                        _StdOut.putText("Rot13 followed by a string would rotate each letter of the string by 13 places. E.g. 'ace' would be 'npr'.");
                        break;

                    // prompt
                    case "prompt":
                        _StdOut.putText("Prompt followed by a string would set the prompt as the string instead of the default >.");
                        break;

                    // date
                    case "date":
                        _StdOut.putText("Date displays the current date and time in EST.");
                        break;

                    // whereami
                    case "whereami":
                        _StdOut.putText("Whereami displays the users current location.");
                        break;

                    // whoami
                    case "whoami":
                        _StdOut.putText("Whoami displays the users identity.");
                        break;

                    // meow
                    case "meow":
                        _StdOut.putText("Meow flushes the toilet.");
                        break;

                    // load
                    case "load":
                        _StdOut.putText("Validates and loads the 6502a op codes in User Program Input.");
                        break;

                    // run <pid>
                    case "run":
                        _StdOut.putText("Runs the process with id <pid>.");
                        break;

                    // runall
                    case "runall":
                        _StdOut.putText("Runs all the loaded processes.");
                        break;

                    // quantum <int>
                    case "quantum":
                        _StdOut.putText("Sets the Round Robin quantum to <int>.");
                        break;

                    // ps
                     case "ps":
                     _StdOut.putText("Ps displays a list of current processes and their IDs.");
                     break;

                    // kill <pid>
                    case "kill":
                     _StdOut.putText("Kill followed by the process ID would kill that process.");
                     break;
                        
                    // welp
                    case "welp":
                        _StdOut.putText("Welp triggers the BSOD, when the kernel traps an OS error.");
                        break;

                    // status
                    case "status":
                        _StdOut.putText("Status followed by a string would set the user status as the string.");
                        break;

                    // clearmem
                    case "clearmem":
                        _StdOut.putText("Clears all memory partitions.");
                        break;
                    
                    // create
                    case "create":
                        _StdOut.putText("Create followed by a string for filename would create a file with that name.");
                        break;

                    // write
                    case "write":
                        _StdOut.putText("Write followed by a string for filename and another string in double quotes for file contents would write the contents to the file with that name.");
                        break;
                    
                    // read
                    case "read":
                        _StdOut.putText("Read followed by a string for filename would print the contents of the file with that name.");
                        break;

                    // delete
                    case "delete":
                    _StdOut.putText("Delete followed by a string for filename would delete the file with that name.");
                    break;
                
                    // ls
                    case "ls":
                        _StdOut.putText("Ls would list the files currently stored on the disk.");
                        break;
                    
                    // format
                    case "format":
                    _StdOut.putText("Format followed by an option would quick or full format the disk. Quick = just deletes the pointers. Full = zero fills the rest of the block too.");
                    break;

                    // getschedule
                    case "getschedule":
                    _StdOut.putText("Get the currently seleced CPU scheduling algorithm.");
                    break;

                    // setschedule <string>
                    case "setschedule":
                    _StdOut.putText("Set CPU scheduling algorithm to rr (Round Robin), fcfs (First-come, First-serve), or priority (non-preemptive).");
                    break;

                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");

                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        // date
        public shellDate(args) {
            var currDate: string = _Datetime;
            _StdOut.putText(currDate);
        }

        // whereami
        public shellWhereami(args) {
            _StdOut.putText("Definitely not here.");
        }

        // whoami
        public shellWhoami(args) {
            _StdOut.putText("Nope. Wrong. Not my father.");
        }

        // meow
        public shellMeow(args) {
            var audio = new Audio('distrib/audio/meow.mp3');
            audio.play();
            _StdOut.putText("He's a cat~ Meow~ Flushing the toliet~");
        }

        // load <string>
        public shellLoad(args) {
            var priority:number = 10;
            var valText = /^\d*$/;
            if(valText.test(args[0]) || args[0]==null){
                if(args[0]!=null){
                    priority = args[0];
                }
                // gets text of textarea
                var userProgram: string = (<HTMLInputElement> document.getElementById("taProgramInput")).value;
                // remove line breaks and extra spaces
                userProgram = userProgram.replace(/(\r\n|\n|\r)/gm,"");              
                // checks if text only contains hex decimals and spaces and is not empty
                var valText = /^[a-f\d\s]+$/i;
                if (valText.test(userProgram)) {
                    var inputOpCodes: string[] = userProgram.split(" ");
                    if (inputOpCodes.length > 256){
                        _StdOut.putText("Process is too big for memory.");
                    } else {
                        // base register value from when memory was loaded
                        var baseReg: number = _MemoryManager.loadMemory(inputOpCodes);
                        if (baseReg == 999){
                            // ask kernel to load user program into disk 
                            var tsb: string = _Kernel.krnWriteProcess(inputOpCodes);
                            if (tsb){
                                var pid: number = _Kernel.krnCreateProcess(baseReg, priority ,tsb);
                            } else {
                                _StdOut.putText("ERROR_DISK_FULL");
                            }
                        } else {
                            var pid: number = _Kernel.krnCreateProcess(baseReg, priority ,null);
                        }
                        _StdOut.putText("Process id: " + pid + " is in Resident Queue");
                    }
                } else if(userProgram == ""){
                    _StdOut.putText("Please enter 6502a op codes in the input area below.");
                } else {
                    _StdOut.putText("Only hex digits and spaces are allowed. Please enter a new set of codes.");
                }
            } else{
                _StdOut.putText("Priority must be an integer, starting from 0. Or leave it blank for default of 10. Lower number means higher priority. ");
            }
        }

        // run <pid>
        public shellRun(args) {
            var valText = /^\d*$/;
            // validate input for integer
            if (valText.test(args) && args != ""){
                if (_ResidentQueue.isEmpty()){
                    _StdOut.putText("No process is loaded in memory.");
                } else {
                    _Kernel.krnExecuteProcess(args);
                } 
            } else {
                _StdOut.putText("Please enter an integer for process id after run command.");
            }  
        }

        // runall
        public shellRunall(args) {
            if (_ResidentQueue.isEmpty()){
                _StdOut.putText("No process is loaded in memory.");
            } else {
                _Kernel.krnExecuteAllProcess();
            } 
        }

        // quantum
        public shellQuantum(args) {
            var valText = /^\d*$/;
            // validate input for integer
            if (valText.test(args) && args != ""){
                _CpuScheduler.quantum = args;
            } else {
                _StdOut.putText("Please enter an integer for quantum value after quantum command.");
            }  
        }

        // ps
        public shellPs(args) {
            if (_CpuScheduler.activePIDs.length == 0){
                _StdOut.putText("No process is active");
            } else {
                _StdOut.putText("Active process id(s): [" + _CpuScheduler.activePIDs.toString() + "]");
            }
        }

        // kill
        public shellKill(args) {
            var valText = /^\d*$/;
            // validate input for integer
            if (valText.test(args) && args != ""){
                _KernelInterruptQueue.enqueue(new Interrupt(KILL_PROCESS_IRQ, args));
            } else {
                _StdOut.putText("Please enter an integer for process id after kill command.");
            }  
        }

        // welp aka BSOD
        public shellWelp(args) {
            // adds element that Interrupt Handler does not know how to handle
            _KernelInterruptQueue.enqueue(777);
        }

        // status
        public shellStatus(args) {
            if (args.length > 0) {
                var status: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("usrStatus");
                // change user status
                status.innerHTML = args.join(" ");
                _StdOut.putText("Your status has changed.");
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }

        // clearmem
        public shellClearmem(args){
            if (_CPU.isExecuting){
                _StdOut.putText("Cannot clear memory. A process is currently running. Use kill command to terminate process.")
            } else {
                _MemoryManager.clearMemory();
                Control.removeProcessTable(-1);
                while(!_ResidentQueue.isEmpty()){
                    _ResidentQueue.dequeue();
                }
            }
        }

        // create
        public shellCreate(args){
            var valTextReg = /^[a-z]+$/i;
            var valTextHidden = /^\.[a-z]+$/i;
            var filename: string;
            if(args.length<60){
                if(valTextReg.test(args) || valTextHidden.test(args)){
                    filename = args;
                    _Kernel.krnCreateFile(filename);
                } else{ 
                    _StdOut.putText("Please only use letters for filename. Place'.' in front to create hidden files.");
                }
            } else{
                _StdOut.putText("Maximum length for filename: 60");
            }
        }

        // write
        public shellWrite(args){
            var valName = /^[a-z\d]+$/i;
            // var valText = /^[a-z\d\s\"]+$/i;
            var filename: string;
            var fileContent: string;
            if(valName.test(args[0])){
                filename = args[0];
                if(args.length<2){
                    _StdOut.putText("Missing argument: Please enter the content to be written in double quotes");
                } else{
                    fileContent = args[1];                
                    for (var i=2; i<args.length; i++){
                        fileContent = fileContent + " " + args[i];
                    }
                    if(fileContent.charAt(0)!='"' || fileContent.charAt(fileContent.length-1)!='"'){
                        _StdOut.putText("File content must be in double quotes");
                    // } else if(!valText.test(fileContent)){
                    //     _StdOut.putText("Please only use letters, numbers, and spaces for file content");
                    } else{
                        fileContent = fileContent.slice(1,fileContent.length-1);
                        _Kernel.krnWriteFile(filename, fileContent);
                    }
                }
            } else{
                _StdOut.putText("Please only use letters for filename");
            }
        }

        // read
        public shellRead(args){
            var valText = /^[a-z]+$/i;
            var filename: string;
            if(valText.test(args)){
                filename = args;
                _Kernel.krnReadFile(filename);
            } else{
                _StdOut.putText("Please only use letters for filename")
            }
        }

        // delete
        public shellDelete(args){
            var valText = /^[a-z]+$/i;
            var filename: string;
            if(valText.test(args)){
                filename = args;
                _Kernel.krnDeleteFile(filename);
            } else{
                _StdOut.putText("Please only use letters for filename")
            }
        }

        // ls
        public shellLs(args){
            var files: string[] = _krnFileSystemDriver.listFiles();
            _StdOut.putText("Files: ");
            for(var file in files){
                _StdOut.putText(files[file] + "   ");
            }
        }

        // format
        public shellFormat(args){
            if(_CPU.isExecuting){
                _StdOut.putText("Cannot format disk. A process is currently running. Use kill command to terminate process.");
            } else if(!_ResidentQueue.isEmpty()){
                _StdOut.putText("Cannot format disk. Process have been loaded on it.");
            } else{
                if(args == "quick"){
                    _StdOut.putText(_krnFileSystemDriver.quickFormat());
                } else if(args == "full"){
                    _StdOut.putText(_krnFileSystemDriver.fullFormat());
                } else if(args == ""){
                    _StdOut.putText("Please enter quick or full format after format command.");
                    _StdOut.advanceLine();
                    _StdOut.putText("quick = just deletes the pointers."); 
                    _StdOut.advanceLine();
                    _StdOut.putText("full = zero fills the rest of the block too.");
                }
                
            }
        }

        public shellGetSchedule(args){
            _StdOut.putText("Current CPU scheduling algortithm: " + _CpuScheduler.schedule);
        }

        public shellSetSchedule(args){
            _StdOut.putText(_CpuScheduler.setSchedule(args));
        }
    }
}
