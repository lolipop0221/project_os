// Main initialization script
document.addEventListener('DOMContentLoaded', function() {
    // Process Manager
    ProcessManager.init();
    document.getElementById('processForm').addEventListener('submit', function(e) {
        e.preventDefault();
        ProcessManager.addProcessFromForm();
    });
    document.getElementById('clearProcesses').addEventListener('click', () => ProcessManager.clearAllProcesses());
    
    // CPU Scheduler
    const algorithmSelect = document.getElementById('algorithmSelect');
    algorithmSelect.addEventListener('change', function() {
        document.getElementById('quantumGroup').style.display = this.value === 'rr' ? 'block' : 'none';
    });
    
    document.getElementById('runScheduling').addEventListener('click', function() {
        const processes = ProcessManager.getAllProcesses();
        if (processes.length === 0) {
            alert('Tambahkan proses terlebih dahulu!');
            return;
        }
        const algorithm = algorithmSelect.value;
        const quantum = parseInt(document.getElementById('quantumTime').value);
        const results = CPUScheduler.runScheduling(processes, algorithm, quantum);
        CPUScheduler.displayResults(results);
    });
    
    document.getElementById('resetScheduling').addEventListener('click', () => CPUScheduler.resetDisplay());
    
    // Memory Manager
    MemoryManager.init(256);
    document.getElementById('totalMemory').addEventListener('change', function() {
        MemoryManager.reinitialize(parseInt(this.value));
    });
    
    document.getElementById('allocateMemory').addEventListener('click', function() {
        const pid = document.getElementById('memoryPid').value;
        const size = parseInt(document.getElementById('processMemory').value);
        const method = document.getElementById('memoryMethod').value;
        if (!pid || !size) {
            alert('Masukkan PID dan ukuran memori!');
            return;
        }
        MemoryManager.allocateMemory(pid, size, method);
    });
    
    document.getElementById('deallocateMemory').addEventListener('click', function() {
        const pid = document.getElementById('memoryPid').value;
        if (!pid) {
            alert('Masukkan PID untuk dealokasi!');
            return;
        }
        MemoryManager.deallocateMemory(pid);
    });
    
    // Producer-Consumer (ini masih di script.js karena sederhana)
    const ProducerConsumer = (function() {
        let buffer = [];
        let bufferSize = 5;
        let empty, full, mutex;
        let isRunning = false;
        let producerInterval, consumerInterval;
        let itemCounter = 0;
        
        function log(message) {
            const logDiv = document.getElementById('syncLog');
            const time = new Date().toLocaleTimeString();
            logDiv.innerHTML = `<div>[${time}] ${message}</div>` + logDiv.innerHTML;
        }
        
        function updateDisplay() {
            const bufferDiv = document.getElementById('bufferDisplay');
            bufferDiv.innerHTML = '';
            
            for (let i = 0; i < bufferSize; i++) {
                const slot = document.createElement('div');
                slot.className = 'buffer-slot ' + (buffer[i] !== undefined ? 'filled' : 'empty');
                slot.textContent = buffer[i] !== undefined ? buffer[i] : '∅';
                bufferDiv.appendChild(slot);
            }
            
            document.getElementById('emptyCount').textContent = empty;
            document.getElementById('fullCount').textContent = full;
            document.getElementById('mutexStatus').textContent = mutex;
        }
        
        async function produce() {
            if (!isRunning) return;
            
            while (empty === 0 && isRunning) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            if (!isRunning) return;
            
            while (mutex === 0 && isRunning) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            if (!isRunning) return;
            
            mutex = 0;
            updateDisplay();
            
            const item = ++itemCounter;
            buffer.push(item);
            log(`<span class="text-success">PRODUCER: Produced item ${item}</span>`);
            
            mutex = 1;
            empty--;
            full++;
            updateDisplay();
        }
        
        async function consume() {
            if (!isRunning) return;
            
            while (full === 0 && isRunning) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            if (!isRunning) return;
            
            while (mutex === 0 && isRunning) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            if (!isRunning) return;
            
            mutex = 0;
            updateDisplay();
            
            const item = buffer.shift();
            log(`<span class="text-danger">CONSUMER: Consumed item ${item}</span>`);
            
            mutex = 1;
            full--;
            empty++;
            updateDisplay();
        }
        
        return {
            init: function(size) {
                bufferSize = size;
                buffer = [];
                empty = bufferSize;
                full = 0;
                mutex = 1;
                itemCounter = 0;
                updateDisplay();
                document.getElementById('syncLog').innerHTML = '<div class="text-muted">Ready to start...</div>';
            },
            
            start: function() {
                if (isRunning) return;
                isRunning = true;
                
                const produceSpeed = parseInt(document.getElementById('produceSpeed').value);
                const consumeSpeed = parseInt(document.getElementById('consumeSpeed').value);
                
                log('<strong class="text-primary">Simulation STARTED</strong>');
                
                producerInterval = setInterval(() => produce(), produceSpeed);
                consumerInterval = setInterval(() => consume(), consumeSpeed);
            },
            
            stop: function() {
                isRunning = false;
                clearInterval(producerInterval);
                clearInterval(consumerInterval);
                log('<strong class="text-warning">Simulation STOPPED</strong>');
            },
            
            reset: function() {
                this.stop();
                const size = parseInt(document.getElementById('bufferSize').value);
                this.init(size);
            }
        };
    })();
    
    // Producer-Consumer initialization
    ProducerConsumer.init(5);
    document.getElementById('startSync').addEventListener('click', () => ProducerConsumer.start());
    document.getElementById('stopSync').addEventListener('click', () => ProducerConsumer.stop());
    document.getElementById('resetSync').addEventListener('click', () => ProducerConsumer.reset());
    
    // File System
    FileSystem.init();
    document.getElementById('fileType').addEventListener('change', function() {
        document.getElementById('fileContentGroup').style.display = this.value === 'file' ? 'block' : 'none';
    });
    
    document.getElementById('createFileBtn').addEventListener('click', function() {
        const name = document.getElementById('fileName').value;
        const type = document.getElementById('fileType').value;
        const content = document.getElementById('fileContent').value;
        
        if (!name) {
            alert('Masukkan nama file/directory!');
            return;
        }
        
        if (type === 'file') {
            FileSystem.createFile(name, content);
        } else {
            FileSystem.createDirectory(name);
        }
        
        document.getElementById('fileName').value = '';
        document.getElementById('fileContent').value = '';
    });
    
    document.getElementById('readFileBtn').addEventListener('click', function() {
        const name = document.getElementById('fileNameRW').value;
        if (!name) {
            alert('Masukkan nama file!');
            return;
        }
        const content = FileSystem.readFile(name);
        if (content !== null) {
            document.getElementById('fileContentRW').value = content;
            alert(`Content of ${name}:\n\n${content}`);
        }
    });
    
    document.getElementById('writeFileBtn').addEventListener('click', function() {
        const name = document.getElementById('fileNameRW').value;
        const content = document.getElementById('fileContentRW').value;
        if (!name) {
            alert('Masukkan nama file!');
            return;
        }
        if (FileSystem.writeFile(name, content)) {
            alert(`File ${name} updated successfully!`);
        }
    });
    
    document.getElementById('deleteFileBtn').addEventListener('click', function() {
        const name = document.getElementById('fileNameRW').value;
        if (!name) {
            alert('Masukkan nama file/directory!');
            return;
        }
        if (confirm(`Delete ${name}?`)) {
            FileSystem.deleteItem(name);
        }
    });
});