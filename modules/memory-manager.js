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
            
            // Jika memori masih kosong
            if (totalSize <= 0) {
                container.innerHTML = `
                    <div class="text-center text-muted p-5">
                        <i class="bi bi-memory display-4"></i>
                        <p class="mt-3">Memori belum diinisialisasi</p>
                    </div>
                `;
                return;
            }
            
            // Untuk visualisasi yang lebih baik, batasi jumlah block yang ditampilkan
            const maxDisplayBlocks = 100;
            const blockRepresents = Math.ceil(totalSize / maxDisplayBlocks);
            const displayBlocks = Math.min(totalSize, maxDisplayBlocks);
            
            // Hitung penggunaan memori
            const usedMemory = Object.values(allocations).reduce((sum, alloc) => sum + alloc.size, 0);
            const freeMemory = totalSize - usedMemory;
            
            // Update progress bars jika elemen ada
            const totalMemoryText = document.getElementById('totalMemoryText');
            const usedMemoryText = document.getElementById('usedMemoryText');
            const usedMemoryBar = document.getElementById('usedMemoryBar');
            
            if (totalMemoryText) totalMemoryText.textContent = `${totalSize} MB`;
            if (usedMemoryText) usedMemoryText.textContent = `${usedMemory} MB (${((usedMemory/totalSize)*100).toFixed(1)}%)`;
            if (usedMemoryBar) usedMemoryBar.style.width = `${(usedMemory/totalSize)*100}%`;
            
            // Generate memory blocks
            for (let i = 0; i < displayBlocks; i++) {
                const block = document.createElement('div');
                const startIdx = i * blockRepresents;
                const endIdx = Math.min((i + 1) * blockRepresents, totalSize) - 1;
                const blockSize = endIdx - startIdx + 1;
                
                // Cek apakah block ini teralokasi
                let isAllocated = false;
                let allocatedPid = '';
                let allocationSize = 0;
                
                // Cek setiap alokasi
                for (const [pid, alloc] of Object.entries(allocations)) {
                    if (startIdx <= alloc.start + alloc.size - 1 && endIdx >= alloc.start) {
                        isAllocated = true;
                        allocatedPid = pid;
                        allocationSize = alloc.size;
                        break;
                    }
                }
                
                // Hitung persentase alokasi dalam block ini
                let allocatedPercentage = 0;
                if (isAllocated) {
                    // Hitung berapa banyak dari block ini yang teralokasi
                    const overlapStart = Math.max(startIdx, allocations[allocatedPid].start);
                    const overlapEnd = Math.min(endIdx, allocations[allocatedPid].start + allocations[allocatedPid].size - 1);
                    allocatedPercentage = ((overlapEnd - overlapStart + 1) / blockSize) * 100;
                }
                
                // Atur warna berdasarkan alokasi
                let backgroundColor;
                if (allocatedPercentage === 100) {
                    // Sepenuhnya teralokasi
                    backgroundColor = 'linear-gradient(135deg, #fb5607 0%, #ff006e 100%)';
                } else if (allocatedPercentage > 0) {
                    // Sebagian teralokasi (ini jarang terjadi dengan display block)
                    backgroundColor = `linear-gradient(90deg, #fb5607 ${allocatedPercentage}%, #4cc9f0 ${allocatedPercentage}%)`;
                } else {
                    // Sepenuhnya bebas
                    backgroundColor = 'linear-gradient(135deg, #4cc9f0 0%, #4895ef 100%)';
                }
                
                // Buat elemen block
                block.className = 'memory-block';
                block.style.background = backgroundColor;
                block.style.width = `calc(${100/displayBlocks}% - 6px)`;
                block.style.height = '40px';
                block.style.margin = '3px';
                block.style.borderRadius = '6px';
                block.style.cursor = 'pointer';
                block.style.display = 'flex';
                block.style.alignItems = 'center';
                block.style.justifyContent = 'center';
                block.style.color = 'white';
                block.style.fontWeight = 'bold';
                block.style.fontSize = '11px';
                
                // Tambahkan tooltip
                block.title = `Address: ${startIdx}-${endIdx} (${blockSize}MB)\n` +
                             (isAllocated ? `Dialokasi ke: ${allocatedPid} (${allocationSize}MB)` : 'Memori Bebas');
                
                // Tambahkan teks di dalam block (jika cukup besar)
                if (blockSize >= 5) {
                    block.textContent = isAllocated ? allocatedPid : 'Free';
                } else {
                    block.innerHTML = isAllocated ? '<i class="bi bi-hdd"></i>' : '<i class="bi bi-hdd"></i>';
                }
                
                // Event listener untuk detail
                block.addEventListener('click', () => {
                    this.showBlockDetails(startIdx, endIdx, isAllocated, allocatedPid);
                });
                
                container.appendChild(block);
            }
        },
        
        showBlockDetails: function(start, end, isAllocated, pid) {
            const size = end - start + 1;
            let message = `Detail Block Memori:\n`;
            message += `Address: ${start} - ${end}\n`;
            message += `Ukuran: ${size} MB\n`;
            message += `Status: ${isAllocated ? `Dialokasi ke ${pid}` : 'Bebas'}\n`;
            
            if (isAllocated && allocations[pid]) {
                const alloc = allocations[pid];
                message += `\nDetail Proses ${pid}:\n`;
                message += `Start: ${alloc.start} MB\n`;
                message += `Size: ${alloc.size} MB\n`;
                message += `End: ${alloc.start + alloc.size - 1} MB`;
            }
            
            alert(message);
        },
        
        updateFragmentationInfo: function() {
            const usedMemory = Object.values(allocations).reduce((sum, alloc) => sum + alloc.size, 0);
            const freeMemory = totalSize - usedMemory;
            
            // Hitung fragmentasi eksternal
            let freeBlocks = 0;
            let isInFreeBlock = false;
            let largestFreeBlock = 0;
            let currentFreeBlockSize = 0;
            
            for (let i = 0; i < totalSize; i++) {
                if (memory[i] === 0) { // Free
                    if (!isInFreeBlock) {
                        freeBlocks++;
                        isInFreeBlock = true;
                    }
                    currentFreeBlockSize++;
                } else {
                    if (isInFreeBlock) {
                        largestFreeBlock = Math.max(largestFreeBlock, currentFreeBlockSize);
                        currentFreeBlockSize = 0;
                    }
                    isInFreeBlock = false;
                }
            }
            
            // Update fragmentasi gauge
            const fragmentationPercentage = freeBlocks > 1 ? 
                Math.min(100, ((freeBlocks - 1) / 10) * 100) : 0;
            
            // Update UI elements jika elemen ada
            const freeBlocksEl = document.getElementById('freeBlocks');
            const usedBlocksEl = document.getElementById('usedBlocks');
            const processCountEl = document.getElementById('processCount');
            const fragmentationStatusEl = document.getElementById('fragmentationStatus');
            const fragmentationLevelEl = document.getElementById('fragmentationLevel');
            const fragmentationValueEl = document.getElementById('fragmentationValue');
            
            if (freeBlocksEl) freeBlocksEl.textContent = freeBlocks;
            if (usedBlocksEl) usedBlocksEl.textContent = Object.keys(allocations).length;
            if (processCountEl) processCountEl.textContent = Object.keys(allocations).length;
            
            // Tentukan level fragmentasi
            let fragmentationLevel = 'Rendah';
            let fragmentationStatus = 'Tidak Ada';
            
            if (freeBlocks === 0) {
                fragmentationStatus = 'Tidak Ada Memori Bebas';
            } else if (freeBlocks === 1) {
                fragmentationStatus = 'Tidak Ada Fragmentasi';
                fragmentationLevel = 'Rendah';
            } else if (freeBlocks <= 3) {
                fragmentationStatus = 'Fragmentasi Ringan';
                fragmentationLevel = 'Sedang';
            } else if (freeBlocks <= 6) {
                fragmentationStatus = 'Fragmentasi Sedang';
                fragmentationLevel = 'Tinggi';
            } else {
                fragmentationStatus = 'Fragmentasi Berat';
                fragmentationLevel = 'Sangat Tinggi';
            }
            
            if (fragmentationStatusEl) fragmentationStatusEl.textContent = fragmentationStatus;
            if (fragmentationLevelEl) fragmentationLevelEl.textContent = fragmentationLevel;
            if (fragmentationValueEl) fragmentationValueEl.textContent = `${fragmentationPercentage.toFixed(0)}%`;
            
            // Update allocation list jika elemen ada
            const processList = document.getElementById('processAllocationList');
            if (processList) {
                processList.innerHTML = '';
                
                if (Object.keys(allocations).length === 0) {
                    processList.innerHTML = `
                        <div class="col-12 text-center text-muted">
                            <i class="bi bi-inbox"></i>
                            <p class="mt-2">Belum ada proses yang dialokasikan</p>
                        </div>
                    `;
                } else {
                    Object.entries(allocations).forEach(([pid, alloc]) => {
                        const col = document.createElement('div');
                        col.className = 'col-md-4 mb-2';
                        col.innerHTML = `
                            <div class="card card-hover-effect">
                                <div class="card-body p-3">
                                    <div class="d-flex align-items-center">
                                        <div class="me-3">
                                            <div class="memory-block allocated" style="width: 40px; height: 40px; background: linear-gradient(135deg, #fb5607 0%, #ff006e 100%);">
                                                ${pid}
                                            </div>
                                        </div>
                                        <div>
                                            <h6 class="mb-0">${pid}</h6>
                                            <small class="text-muted">${alloc.size} MB</small>
                                            <br>
                                            <small>Address: ${alloc.start}-${alloc.start + alloc.size - 1}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        processList.appendChild(col);
                    });
                }
            }
            
            // Update gauge visualization jika elemen ada
            this.updateFragmentationGauge(fragmentationPercentage, fragmentationStatus);
        },
        
        updateFragmentationGauge: function(percentage, status) {
            const gauge = document.getElementById('fragmentationGauge');
            if (!gauge) return;
            
            // Buat gauge sederhana dengan CSS
            gauge.innerHTML = '';
            
            const canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            gauge.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            
            // Draw background circle
            ctx.beginPath();
            ctx.arc(30, 30, 25, 0, 2 * Math.PI);
            ctx.fillStyle = '#e9ecef';
            ctx.fill();
            
            // Draw percentage arc
            ctx.beginPath();
            ctx.arc(30, 30, 25, -0.5 * Math.PI, (-0.5 + (percentage/100) * 2) * Math.PI);
            ctx.lineWidth = 8;
            
            // Color based on percentage
            if (percentage < 30) {
                ctx.strokeStyle = '#4cc9f0';
            } else if (percentage < 60) {
                ctx.strokeStyle = '#ffb347';
            } else {
                ctx.strokeStyle = '#fb5607';
            }
            
            ctx.stroke();
            
            // Draw percentage text
            ctx.fillStyle = '#2b2d42';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${percentage.toFixed(0)}%`, 30, 30);
        }
    };
})();