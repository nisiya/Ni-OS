///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public clearCPU(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public updateCPUTable(): void {
            var cpuTable: HTMLTableElement = <HTMLTableElement> document.getElementById("taCPU");
            cpuTable.rows[1].cells.namedItem("cPC").innerHTML = this.PC.toString();
            cpuTable.rows[1].cells.namedItem("cIR").innerHTML = this.PC.toString();            
            cpuTable.rows[1].cells.namedItem("cACC").innerHTML = this.Acc.toString();            
            cpuTable.rows[1].cells.namedItem("cX").innerHTML = this.Xreg.toString();            
            cpuTable.rows[1].cells.namedItem("cY").innerHTML = this.Yreg.toString();            
            cpuTable.rows[1].cells.namedItem("cZ").innerHTML = this.Zflag.toString();                        
        } 

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            console.log("CPU cycle");
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            if(this.PC==_PCB.pLimit){
                // stop
                _Kernel.krnExitProcess();
                this.clearCPU();
                this.updateCPUTable();
            }
            else {
                if(this.PC==0){
                    // move pcb from ready queue to running
                    _PCB = _ReadyQueue.dequeue();
                    _PCB.pState = "Running";
                    this.PC = _PCB.pBase;
                    // var pLimit = process.pLimit;
                    // console.log(pLimit+"p");
                }
                // fetch instruction from memory
                var opCode = this.fetch(this.PC);
                console.log(opCode);

                // decode then execute the op codes
                this.decodeExecute(opCode);   
                console.log(this.Acc + "a");
            }
        }

        public fetch(PC) {
            return _Memory.memory[PC];
        }
        public decodeExecute(opCode) {
            if (opCode.length > 0) {
                // take action according to op code ..
                var data: number;
                var addr: string;

                // decode then execute
                switch (opCode) {
                    
                    // load accumulator with value in next byte
                    case "A9":
                        this.PC++;
                        data = parseInt(this.fetch(this.PC), 16);
                        this.Acc = data;
                        this.PC++;
                        break;

                    // load accumulator from memory
                    case "AD":
                        data = this.Acc;
                        this.PC++;
                        addr = this.fetch(this.PC);
                        this.PC++;
                        addr = this.fetch(this.PC) + addr;
                        _MemoryManager.updateMemory(addr, data);
                        this.PC++;
                        break;
                    // store accumulator in memory
                    case "8D":
                    // add with carry
                    /* add content of an address to content of accumulator
                        and keeps resut in the accumulator*/
                    case "6D":
                    // load the x register with a constant
                    case "A2":
                    // load the x register from memory
                    case "AE":
                    // load the y register with a constant
                    case "A0":
                    // load the y register from memory
                    case "AC":
                    // no operation
                    case "EA":
                    // break
                    case "00":
                        _Kernel.krnExitProcess();
                    // compare a byte in memory to the X reg
                    // if equal, set z flag 
                    case "EC":
                    // branch n bytes if z flag = 0
                    case "D0":
                    // increment the value of a byte
                    case "EE":
                    // system call
                    /* #$01 in x reg = print integer stored in Y reg
                        #$02 in x reg = print 00-terminated string stored at
                                        address in y reg */
                    case "FF":


                    default:
                        _StdOut.putText("Error. Op code " + opCode + " does not exist.");
                        break;
                }
                this.updateCPUTable();
                console.log("finish process");
            }
        }

    }
}
