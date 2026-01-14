// CPU Scheduler Module
const CPUScheduler = (function() {
    let ganttChart = null;
    
    return {
        runScheduling: function(processes, algorithm, quantum = 2) {
            const processList = processes.map(p => ({
                ...p,
                remainingTime: p.burstTime,
                finishTime: 0,
                startTime: -1
            }));
            
            let results;
            switch(algorithm) {
                case 'fcfs': results = this.fcfs([...processList]); break;
                case 'sjf': results = this.sjf([...processList]); break;
                case 'priority': results = this.priority([...processList]); break;
                case 'rr': results = this.roundRobin([...processList], quantum); break;
                default: results = this.fcfs([...processList]);
            }
            return results;
        },
        
        fcfs: function(processes) {
            processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
            let currentTime = 0;
            let ganttData = [];
            
            processes.forEach(process => {
                const startTime = Math.max(currentTime, process.arrivalTime);
                const finishTime = startTime + process.burstTime;
                
                process.startTime = startTime;
                process.finishTime = finishTime;
                process.waitingTime = startTime - process.arrivalTime;
                process.turnaroundTime = finishTime - process.arrivalTime;
                process.responseTime = startTime - process.arrivalTime;
                
                ganttData.push({pid: process.pid, start: startTime, end: finishTime});
                currentTime = finishTime;
            });
            
            return {processes, ganttData};
        },
        
        sjf: function(processes) {
            processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
            let currentTime = 0;
            let ganttData = [];
            let completed = 0;
            const n = processes.length;
            let isCompleted = new Array(n).fill(false);
            
            while (completed < n) {
                let idx = -1;
                let minBurst = Infinity;
                
                for (let i = 0; i < n; i++) {
                    if (!isCompleted[i] && processes[i].arrivalTime <= currentTime && processes[i].burstTime < minBurst) {
                        minBurst = processes[i].burstTime;
                        idx = i;
                    }
                }
                
                if (idx !== -1) {
                    const process = processes[idx];
                    const startTime = currentTime;
                    const finishTime = startTime + process.burstTime;
                    
                    process.startTime = startTime;
                    process.finishTime = finishTime;
                    process.waitingTime = startTime - process.arrivalTime;
                    process.turnaroundTime = finishTime - process.arrivalTime;
                    process.responseTime = startTime - process.arrivalTime;
                    
                    ganttData.push({pid: process.pid, start: startTime, end: finishTime});
                    isCompleted[idx] = true;
                    completed++;
                    currentTime = finishTime;
                } else {
                    currentTime++;
                }
            }
            return {processes, ganttData};
        },
        
        priority: function(processes) {
            processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
            let currentTime = 0;
            let ganttData = [];
            let completed = 0;
            const n = processes.length;
            let isCompleted = new Array(n).fill(false);
            
            while (completed < n) {
                let idx = -1;
                let highestPriority = Infinity;
                
                for (let i = 0; i < n; i++) {
                    if (!isCompleted[i] && processes[i].arrivalTime <= currentTime && processes[i].priority < highestPriority) {
                        highestPriority = processes[i].priority;
                        idx = i;
                    }
                }
                
                if (idx !== -1) {
                    const process = processes[idx];
                    const startTime = currentTime;
                    const finishTime = startTime + process.burstTime;
                    
                    process.startTime = startTime;
                    process.finishTime = finishTime;
                    process.waitingTime = startTime - process.arrivalTime;
                    process.turnaroundTime = finishTime - process.arrivalTime;
                    process.responseTime = startTime - process.arrivalTime;
                    
                    ganttData.push({pid: process.pid, start: startTime, end: finishTime});
                    isCompleted[idx] = true;
                    completed++;
                    currentTime = finishTime;
                } else {
                    currentTime++;
                }
            }
            return {processes, ganttData};
        },
        
        roundRobin: function(processes, quantum) {
            let currentTime = 0;
            let ganttData = [];
            let queue = [];
            let remainingTimes = processes.map(p => p.burstTime);
            let startTimes = new Array(processes.length).fill(-1);
            let finishTimes = new Array(processes.length).fill(0);
            let visited = new Array(processes.length).fill(false);
            
            for (let i = 0; i < processes.length; i++) {
                if (processes[i].arrivalTime <= currentTime) {
                    queue.push(i);
                    visited[i] = true;
                }
            }
            
            while (true) {
                if (queue.length === 0) {
                    if (remainingTimes.every(rt => rt === 0)) break;
                    let nextArrival = Math.min(...processes.map((p, i) => remainingTimes[i] > 0 ? p.arrivalTime : Infinity));
                    currentTime = nextArrival;
                    for (let i = 0; i < processes.length; i++) {
                        if (!visited[i] && processes[i].arrivalTime <= currentTime && remainingTimes[i] > 0) {
                            queue.push(i);
                            visited[i] = true;
                        }
                    }
                    continue;
                }
                
                const idx = queue.shift();
                const process = processes[idx];
                
                if (startTimes[idx] === -1) {
                    startTimes[idx] = currentTime;
                }
                
                const execTime = Math.min(quantum, remainingTimes[idx]);
                ganttData.push({pid: process.pid, start: currentTime, end: currentTime + execTime});
                
                remainingTimes[idx] -= execTime;
                currentTime += execTime;
                
                for (let i = 0; i < processes.length; i++) {
                    if (!visited[i] && processes[i].arrivalTime <= currentTime && remainingTimes[i] > 0) {
                        queue.push(i);
                        visited[i] = true;
                    }
                }
                
                if (remainingTimes[idx] > 0) {
                    queue.push(idx);
                } else {
                    finishTimes[idx] = currentTime;
                }
            }
            
            processes.forEach((process, idx) => {
                process.startTime = startTimes[idx];
                process.finishTime = finishTimes[idx];
                process.waitingTime = finishTimes[idx] - process.arrivalTime - process.burstTime;
                process.turnaroundTime = finishTimes[idx] - process.arrivalTime;
                process.responseTime = startTimes[idx] - process.arrivalTime;
            });
            
            return {processes, ganttData};
        },
        
        displayResults: function(results) {
            this.displayGanttChart(results.ganttData);
            this.displayMetrics(results.processes);
        },
        
        displayGanttChart: function(ganttData) {
            const ctx = document.getElementById('ganttChart').getContext('2d');
            if (ganttChart) ganttChart.destroy();
            
            const labels = ganttData.map((_, i) => `T${i + 1}`);
            const uniquePids = [...new Set(ganttData.map(item => item.pid))];
            const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC926', '#1982C4'];
            
            const datasets = uniquePids.map((pid, idx) => ({
                label: pid,
                backgroundColor: colors[idx % colors.length],
                data: ganttData.map(item => item.pid === pid ? item.end - item.start : null),
                borderWidth: 1
            }));
            
            ganttChart = new Chart(ctx, {
                type: 'bar',
                data: {labels, datasets},
                options: {
                    responsive: true,
                    scales: {
                        x: {stacked: true, title: {display: true, text: 'Time Slots'}},
                        y: {stacked: true, title: {display: true, text: 'Duration'}, beginAtZero: true}
                    }
                }
            });
        },
        
        displayMetrics: function(processes) {
            const tbody = document.getElementById('resultTableBody');
            tbody.innerHTML = '';
            
            let totalWT = 0, totalTT = 0, totalRT = 0;
            
            processes.forEach(process => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${process.pid}</td>
                    <td>${process.waitingTime}</td>
                    <td>${process.turnaroundTime}</td>
                    <td>${process.responseTime}</td>
                `;
                tbody.appendChild(row);
                totalWT += process.waitingTime;
                totalTT += process.turnaroundTime;
                totalRT += process.responseTime;
            });
            
            const n = processes.length;
            document.getElementById('averageResults').innerHTML = `
                Rata-rata Waiting Time: <strong>${(totalWT/n).toFixed(2)}</strong> | 
                Rata-rata Turnaround Time: <strong>${(totalTT/n).toFixed(2)}</strong> | 
                Rata-rata Response Time: <strong>${(totalRT/n).toFixed(2)}</strong>
            `;
        },
        
        resetDisplay: function() {
            if (ganttChart) {
                ganttChart.destroy();
                ganttChart = null;
            }
            document.getElementById('resultTableBody').innerHTML = '';
            document.getElementById('averageResults').innerHTML = '';
        }
    };
})();