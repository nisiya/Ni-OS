///<reference path="../globals.ts" />

/* ------------
     MEMORYACCESSOR.ts

     Memory Accessor
        - Read and write to memory
        - Translate physical address to logical and vice versa
        
     Requires global.ts.
     ------------ */

     module TSOS {
            // please ignore for project 2
            export class MemoryAccessor {

                public init(): void {
                    // all partitions are available

                    // load table on user interface
                    // Control.loadMemoryTable();
                }

                public writeMemory(addr, data){
                    var baseReg = _CpuScheduler.runningProcess.pBase;
                    var limitReg = baseReg + 255;
                    var index: number = parseInt(addr, 16) + baseReg;  
                    if(index > limitReg){
                        _KernelInterruptQueue.enqueue(new Interrupt(MEMACCESS_ERROR_IRQ, _CpuScheduler.runningProcess.pid));
                    } else {
                        _Memory.memory[index] = data.toString(16).toUpperCase();
                        // 0 for now bc only one parition
                        Control.updateMemoryTable(0);
                    }
                }

                public readMemory(addr){
                    var baseReg = _CpuScheduler.runningProcess.pBase;
                    var limitReg = baseReg + 255;
                    var index: number = baseReg + addr;
                    if (index > limitReg){
                        _KernelInterruptQueue.enqueue(new Interrupt(MEMACCESS_ERROR_IRQ, _CpuScheduler.runningProcess.pid));
                    } else{
                        var value = _Memory.memory[index];
                        return value;
                    }
                }

            }
        }
        