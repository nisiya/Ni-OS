///<reference path="../globals.ts" />

/* ------------
     MEMORY.ts

     Memory
        - array of 768 bytes
        - 3 partitions
        
     Requires global.ts.
     ------------ */

     module TSOS {
        
            export class Memory {
                
                // array of bytes as memory
                public memory: string[];

                // checks if memory partition is loaded
                public memoryS1: boolean = false;
                public memoryS2: boolean = false;
                public memoryS3: boolean = false;

                public init(): void {
                    // creates the memory at boot
                    this.memory = new Array<string>();
                    for (var i = 0; i<768; i++){
                        this.memory.push("00");
                    }

                    // all partitions are available
                    this.memoryS1 = false;
                    this.memoryS2 = false;
                    this.memoryS3 = false;

                    // load table on user interface
                    Control.loadMemoryTable();
                }

            }
        }
        