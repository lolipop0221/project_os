// Memory Manager Module
const MemoryManager = (function() {
    let memory = [];
    let totalSize = 256;
    let allocations = {};
    const BLOCK_SIZE = 10;
    
    return {
        init: function(size = 256) {
            totalSize = size;
            memory = new Array(totalSize).fill(0);
            allocations = {};
            this.renderMemory();
            this.updateFragmentationInfo();
        },
        
        reinitialize: function(newSize) {
            if (newSize < totalSize) {
                const usedMemory = Object.values(allocations).reduce((sum, alloc) => sum + alloc.size, 0);
                if (usedMemory > newSize) {
                    alert(`Tidak bisa mengurangi ukuran memori! Memori digunakan: ${usedMemory}MB`);
                    document.getElementById('totalMemory').value = totalSize;
                    return;
                }
            }
            this.init(newSize);
        },
        
        allocateMemory: function(pid, size, method = 'first') {
            if (allocations[pid]) {
                alert(`Process ${pid} sudah dialokasikan memori!`);
                return false;
            }
            
            if (size > totalSize) {
                alert('Ukuran memori melebihi total memori!');
                return false;
            }
            
            let start = -1;
            switch(method) {
                case 'first': start = this.firstFit(size); break;
                case 'best': start = this.bestFit(size); break;
                case 'worst': start = this.worstFit(size); break;
            }
            
            if (start !== -1) {
                for (let i = start; i < start + size; i++) memory[i] = 1;
                allocations[pid] = {start, size, pid};
                this.renderMemory();
                this.updateFragmentationInfo();
                return true;
            } else {
                alert('Memori tidak cukup untuk alokasi!');
                return false;
            }
        },
        
        deallocateMemory: function(pid) {
            if (!allocations[pid]) {
                alert(`Process ${pid} tidak memiliki alokasi memori!`);
                return false;
            }
            
            const alloc = allocations[pid];
            for (let i = alloc.start; i < alloc.start + alloc.size; i++) memory[i] = 0;
            delete allocations[pid];
            this.renderMemory();
            this.updateFragmentationInfo();
            return true;
        },
        
        firstFit: function(size) {
            let freeStart = -1, freeCount = 0;
            for (let i = 0; i < totalSize; i++) {
                if (memory[i] === 0) {
                    if (freeStart === -1) freeStart = i;
                    freeCount++;
                    if (freeCount >= size) return freeStart;
                } else {
                    freeStart = -1;
                    freeCount = 0;
                }
            }
            return -1;
        },
        
        bestFit: function(size) {
            let bestStart = -1, bestSize = Infinity;
            let currentStart = -1, currentSize = 0;
            
            for (let i = 0; i <= totalSize; i++) {
                if (i < totalSize && memory[i] === 0) {
                    if (currentStart === -1) currentStart = i;
                    currentSize++;
                } else {
                    if (currentSize >= size && currentSize < bestSize) {
                        bestStart = currentStart;
                        bestSize = currentSize;
                    }
                    currentStart = -1;
                    currentSize = 0;
                }
            }
            return bestStart;
        },
        
        worstFit: function(size) {
            let worstStart = -1, worstSize = -1;
            let currentStart = -1, currentSize = 0;
            
            for (let i = 0; i <= totalSize; i++) {
                if (i < totalSize && memory[i] === 0) {
                    if (currentStart === -1) currentStart = i;
                    currentSize++;
                } else {
                    if (currentSize >= size && currentSize > worstSize) {
                        worstStart = currentStart;
                        worstSize = currentSize;
                    }
                    currentStart = -1;
                    currentSize = 0;
                }
            }
            return worstStart;
        },
        
        renderMemory: function() {
            const container = document.getElementById('memoryVisualization');
            container.innerHTML = '';
            
            const displayBlocks = Math.min(totalSize, 100);
            const blockRepresents = Math.ceil(totalSize / displayBlocks);
            
            for (let i = 0; i < displayBlocks; i++) {
                const block = document.createElement('div');
                const startIdx = i * blockRepresents;
                const endIdx = Math.min((i + 1) * blockRepresents, totalSize);
                
                let isAllocated = false;
                let allocatedPid = '';
                
                for (let j = startIdx; j < endIdx; j++) {
                    if (memory[j] === 1) {
                        isAllocated = true;
                        for (const [pid, alloc] of Object.entries(allocations)) {
                            if (j >= alloc.start && j < alloc.start + alloc.size) {
                                allocatedPid = pid;
                                break;
                            }
                        }
                        break;
                    }
                }
                
                const blockSize = endIdx - startIdx;
                const widthPercent = 100 / displayBlocks;
                
                block.className = 'memory-block';
                block.style.width = `calc(${widthPercent}% - 4px)`;
                block.style.height = `${BLOCK_SIZE}px`;
                block.style.backgroundColor = isAllocated ? '#dc3545' : '#28a745';
                block.title = `Block ${i+1}: ${startIdx}-${endIdx-1} (${blockSize}MB)\n${isAllocated ? `Allocated to ${allocatedPid}` : 'Free'}`;
                block.textContent = isAllocated ? allocatedPid : 'Free';
                container.appendChild(block);
            }
        },
        
        updateFragmentationInfo: function() {
            const container = document.getElementById('fragmentationInfo');
            const usedMemory = Object.values(allocations).reduce((sum, alloc) => sum + alloc.size, 0);
            const freeMemory = totalSize - usedMemory;
            
            let freeBlocks = 0;
            let inFreeBlock = false;
            
            for (let i = 0; i < totalSize; i++) {
                if (memory[i] === 0) {
                    if (!inFreeBlock) {
                        freeBlocks++;
                        inFreeBlock = true;
                    }
                } else {
                    inFreeBlock = false;
                }
            }
            
            const fragmentation = freeBlocks > 1 ? 'External Fragmentation' : 
                                 freeBlocks === 1 ? 'No External Fragmentation' : 'No Free Memory';
            
            container.innerHTML = `
                <div class="progress mb-2" style="height: 20px;">
                    <div class="progress-bar bg-success" style="width: ${(freeMemory/totalSize)*100}%">Free: ${freeMemory}MB</div>
                    <div class="progress-bar bg-danger" style="width: ${(usedMemory/totalSize)*100}%">Used: ${usedMemory}MB</div>
                </div>
                <p><strong>Total Memori:</strong> ${totalSize}MB</p>
                <p><strong>Fragmentasi:</strong> ${fragmentation} (${freeBlocks} blok bebas)</p>
                <p><strong>Proses yang dialokasi:</strong> ${Object.keys(allocations).length}</p>
            `;
        }
    };
})();