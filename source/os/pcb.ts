/* ------------
   pcb.ts
   
   Process Control Block
   need:
   process ID
   process state
   priority
   program counter: pointer to address of next instruction
   location
   CPU registers: ACC, X, Y, Z flag
   base and limit registers

   ------------ */

   module TSOS {
    export class PCB {

        public pid: number = -1;
        public pCounter: number = 0;
        public pAcc: number = 0;
        public pXreg: number = 0;
        public pYreg: number = 0;
        public pZflag: number = 0; 
        public pPriority: number = 0;
        public pState: string = "New";
        public pLocation: string = "Memory";
        public pBase: number;
        public pLimit: number = 256;

        constructor(pBase) {
            this.pBase = pBase;
            this.pid++;
            this.pState = "Resident";
        }

        public getPid() {
            return this.pid;
        }

        public getPBase() {
            return this.pBase;
        }

        public getPLimit() {
            return this.pLimit;
        }
        
    }
}