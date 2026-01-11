// File System Module
const FileSystem = (function() {
    let root = {name: '/', type: 'directory', children: [], created: new Date()};
    let currentDir = root;
    
    class File {
        constructor(name, content = '') {
            this.name = name;
            this.type = 'file';
            this.content = content;
            this.size = content.length;
            this.created = new Date();
            this.modified = new Date();
        }
    }
    
    class Directory {
        constructor(name) {
            this.name = name;
            this.type = 'directory';
            this.children = [];
            this.created = new Date();
        }
    }
    
    return {
        init: function() {
            root = new Directory('/');
            currentDir = root;
            this.createFile('readme.txt', 'Welcome to OS File System Simulator');
            this.createDirectory('documents');
            this.createDirectory('pictures');
            this.render();
        },
        
        createFile: function(name, content = '') {
            if (currentDir.children.find(c => c.name === name)) {
                alert(`File ${name} already exists!`);
                return null;
            }
            const file = new File(name, content);
            currentDir.children.push(file);
            this.render();
            return file;
        },
        
        createDirectory: function(name) {
            if (currentDir.children.find(c => c.name === name)) {
                alert(`Directory ${name} already exists!`);
                return null;
            }
            const dir = new Directory(name);
            currentDir.children.push(dir);
            this.render();
            return dir;
        },
        
        readFile: function(name) {
            const file = currentDir.children.find(c => c.name === name && c.type === 'file');
            if (!file) {
                alert(`File ${name} not found!`);
                return null;
            }
            return file.content;
        },
        
        writeFile: function(name, content) {
            const file = currentDir.children.find(c => c.name === name && c.type === 'file');
            if (!file) {
                alert(`File ${name} not found!`);
                return false;
            }
            file.content = content;
            file.size = content.length;
            file.modified = new Date();
            this.render();
            return true;
        },
        
        deleteItem: function(name) {
            currentDir.children = currentDir.children.filter(c => c.name !== name);
            this.render();
        },
        
        render: function() {
            document.getElementById('currentPath').textContent = currentDir.name === '/' ? '/' : `/${currentDir.name}`;
            
            // File tree
            const treeDiv = document.getElementById('fileSystemTree');
            treeDiv.innerHTML = this.buildTree(root, 0);
            
            // File table
            const tbody = document.getElementById('fileTableBody');
            tbody.innerHTML = '';
            
            currentDir.children.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><i class="bi ${item.type === 'file' ? 'bi-file-text' : 'bi-folder'}"></i> ${item.name}</td>
                    <td><span class="badge ${item.type === 'file' ? 'bg-info' : 'bg-warning'}">${item.type}</span></td>
                    <td>${item.size || 0} bytes</td>
                    <td>${item.modified ? item.modified.toLocaleString() : item.created.toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });
        },
        
        buildTree: function(node, depth) {
            const indent = '  '.repeat(depth);
            let result = `${indent}📁 ${node.name}\n`;
            if (node.children) {
                node.children.forEach(child => {
                    if (child.type === 'directory') {
                        result += this.buildTree(child, depth + 1);
                    } else {
                        result += `${indent}  📄 ${child.name}\n`;
                    }
                });
            }
            return result;
        }
    };
})();