// Process Manager Module
const ProcessManager = (function() {
    let processes = [];
    let pidCounter = 1;
    
    class Process {
        constructor(pid, burstTime, arrivalTime = 0, priority = 1) {
            this.pid = pid;
            this.burstTime = parseInt(burstTime);
            this.arrivalTime = parseInt(arrivalTime);
            this.priority = parseInt(priority);
            this.status = 'New';
            this.remainingTime = this.burstTime;
        }
        
        updateStatus(newStatus) {
            this.status = newStatus;
        }
    }
    
    return {
        init: function() {
            processes = [];
            pidCounter = 1;
            this.renderTable();
        },
        
        addProcess: function(pid, burstTime, arrivalTime = 0, priority = 1) {
            if (!pid) pid = `P${pidCounter++}`;
            const newProcess = new Process(pid, burstTime, arrivalTime, priority);
            processes.push(newProcess);
            this.renderTable();
            return newProcess;
        },
        
        addProcessFromForm: function() {
            const pid = document.getElementById('pid').value;
            const burstTime = document.getElementById('burstTime').value;
            const arrivalTime = document.getElementById('arrivalTime').value || 0;
            const priority = document.getElementById('priority').value || 1;
            
            this.addProcess(pid, burstTime, arrivalTime, priority);
            document.getElementById('pid').value = `P${pidCounter}`;
            document.getElementById('burstTime').value = '';
        },
        
        getAllProcesses: function() {
            return processes.map(p => ({...p}));
        },
        
        getProcess: function(pid) {
            return processes.find(p => p.pid === pid);
        },
        
        updateProcessStatus: function(pid, status) {
            const process = this.getProcess(pid);
            if (process) {
                process.updateStatus(status);
                this.renderTable();
            }
        },
        
        clearAllProcesses: function() {
            if (confirm('Apakah Anda yakin ingin menghapus semua proses?')) {
                processes = [];
                pidCounter = 1;
                this.renderTable();
            }
        },
        
        removeProcess: function(pid) {
            processes = processes.filter(p => p.pid !== pid);
            this.renderTable();
        },
        
        renderTable: function() {
            const tbody = document.getElementById('processTableBody');
            tbody.innerHTML = '';
            
            processes.forEach(process => {
                const row = document.createElement('tr');
                let badgeClass = 'bg-secondary';
                switch(process.status) {
                    case 'Ready': badgeClass = 'bg-warning'; break;
                    case 'Running': badgeClass = 'bg-success'; break;
                    case 'Waiting': badgeClass = 'bg-danger'; break;
                    case 'Terminated': badgeClass = 'bg-dark'; break;
                }
                
                row.innerHTML = `
                    <td>${process.pid}</td>
                    <td>${process.burstTime}</td>
                    <td>${process.arrivalTime}</td>
                    <td>${process.priority}</td>
                    <td><span class="badge ${badgeClass}">${process.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="ProcessManager.updateProcessStatus('${process.pid}', 'Ready')">Ready</button>
                        <button class="btn btn-sm btn-outline-success" onclick="ProcessManager.updateProcessStatus('${process.pid}', 'Running')">Run</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="ProcessManager.removeProcess('${process.pid}')">Hapus</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    };
})();