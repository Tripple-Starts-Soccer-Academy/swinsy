import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, Settings, FileCode, Folder, Search, GitBranch, Puzzle, X, ChevronDown, Plus } from 'lucide-react';
import '../ide.css';
import {
  saveIDEState,
  loadIDEState,
  saveProject,
  loadProject,
  loadProjects,
  deleteProject,
  saveIncubation,
  loadIncubations,
  loadIncubation,
  deleteIncubation,
  setGithubToken,
  githubStatus,
  pushToGitHub,
  liveShare,
} from '../utils/portalStore';

export const IDE: React.FC = () => {
  const [code, setCode] = useState(`# Welcome to the Python IDE!
# Write your Python code here and click "Run" to execute it.

def hello_world():
    """A simple hello world function"""
    name = "Python Developer"
    print(f"Hello, {name}!")
    return f"Hello, {name}!"

# Call the function
result = hello_world()
print("Function returned:", result)

# Try some Python concepts
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print("Squared numbers:", squared)

# Dictionary example
person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}
print("Person:", person)`);
  
  const [output, setOutput] = useState('yarichard-international IDE Terminal\nType "help" for a list of commands.\n\n');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHints, setTerminalHints] = useState<string[]>([]);
  const [cwd, setCwd] = useState('/home/user');
  const [fileSystem, setFileSystem] = useState<Record<string, { type: 'file' | 'dir'; content: string }>>({
    '/home/user': { type: 'dir', content: '' }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [language, setLanguage] = useState('python');
  const [theme, setTheme] = useState('vs-dark');
  const [isRunning, setIsRunning] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: string; isFile: boolean } | null>(null);
  const [liveRoom, setLiveRoom] = useState<string | null>(null);
  const [liveOpen, setLiveOpen] = useState(false);
  const [liveCode, setLiveCode] = useState('');
  const [liveTheme, setLiveTheme] = useState(theme);
  const [liveFontSize, setLiveFontSize] = useState(fontSize);

  useEffect(() => {
    const saved = loadIDEState();
    if (saved) {
      setLanguage(saved.language);
      setCode(saved.code);
      setTheme(saved.theme);
      setFontSize(saved.fontSize);
      setFileSystem(saved.fileSystem);
      setCwd(saved.cwd);
      setOutput(prev => prev + 'Workspace restored from portal storage.\n');
    }
  }, []);

  useEffect(() => {
    saveIDEState({ code, language, theme, fontSize, fileSystem, cwd });
  }, [code, language, theme, fontSize, fileSystem, cwd]);

  useEffect(() => {
    return () => liveShare.leave();
  }, []);

  useEffect(() => {
    const onClick = () => setContextMenu(null);
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  const languages = [
    { value: 'python', label: 'Python', extension: 'py' },
    { value: 'javascript', label: 'JavaScript', extension: 'js' },
    { value: 'typescript', label: 'TypeScript', extension: 'ts' },
    { value: 'java', label: 'Java', extension: 'java' },
    { value: 'cpp', label: 'C++', extension: 'cpp' },
    { value: 'stm32', label: 'C++ STM32', extension: 'cpp' },
    { value: 'c', label: 'C', extension: 'c' },
    { value: 'html', label: 'HTML', extension: 'html' },
    { value: 'css', label: 'CSS', extension: 'css' },
    { value: 'htmlcss', label: 'HTML/CSS', extension: 'html' },
    { value: 'rust', label: 'Rust', extension: 'rs' },
    { value: 'go', label: 'Golang', extension: 'go' },
    { value: 'swift', label: 'Swift', extension: 'swift' },
    { value: 'reactnative', label: 'React Native', extension: 'jsx' },
    { value: 'r', label: 'R', extension: 'r' },
    { value: 'php', label: 'PHP', extension: 'php' },
    { value: 'kotlin', label: 'Kotlin', extension: 'kt' },
  ];

  const currentLang = languages.find(l => l.value === language);

  const defaultCode = {
    python: `# Welcome to the Python IDE!
# Write your Python code here and click "Run" to execute it.

def hello_world():
    """A simple hello world function"""
    name = "Python Developer"
    print(f"Hello, {name}!")
    return f"Hello, {name}!"

# Call the function
result = hello_world()
print("Function returned:", result)`,
    javascript: `// Welcome to the JavaScript IDE!
// Write your JavaScript code here and click "Run" to execute it.

function helloWorld() {
    const name = "JavaScript Developer";
    console.log(\`Hello, \${name}!\`);
    return \`Hello, \${name}!\`;
}

// Call the function
const result = helloWorld();
console.log("Function returned:", result);

// Array methods
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(x => x ** 2);
console.log("Squared numbers:", squared);

// Object example
const person = {
    name: "Alice",
    age: 25,
    city: "New York"
};
console.log("Person:", person);`,
    typescript: `// Welcome to the TypeScript IDE!
// Write your TypeScript code here and click "Run" to execute it.

interface Person {
    name: string;
    age: number;
    city: string;
}

function helloWorld(): string {
    const name = "TypeScript Developer";
    console.log(\`Hello, \${name}!\`);
    return \`Hello, \${name}!\`;
}

// Call the function
const result = helloWorld();
console.log("Function returned:", result);

// Array methods with types
const numbers: number[] = [1, 2, 3, 4, 5];
const squared: number[] = numbers.map(x => x ** 2);
console.log("Squared numbers:", squared);

// Object example with interface
const person: Person = {
    name: "Alice",
    age: 25,
    city: "New York"
};
console.log("Person:", person);`,
    java: `// Welcome to the Java IDE!
// Write your Java code here and click "Run" to execute it.

public class HelloWorld {
    public static void main(String[] args) {
        String name = "Java Developer";
        System.out.println("Hello, " + name + "!");
        
        // Array operations
        int[] numbers = {1, 2, 3, 4, 5};
        int[] squared = new int[numbers.length];
        
        for (int i = 0; i < numbers.length; i++) {
            squared[i] = numbers[i] * numbers[i];
        }
        
        System.out.println("Squared numbers: " + java.util.Arrays.toString(squared));
        
        // Create a person object
        Person person = new Person("Alice", 25, "New York");
        System.out.println("Person: " + person);
    }
}

class Person {
    String name;
    int age;
    String city;
    
    public Person(String name, int age, String city) {
        this.name = name;
        this.age = age;
        this.city = city;
    }
    
    @Override
    public String toString() {
        return name + " (" + age + ", " + city + ")";
    }
}`,
    cpp: `// Welcome to the C++ IDE!
// Write your C++ code here and click "Run" to execute it.

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

class Person {
public:
    std::string name;
    int age;
    std::string city;
    
    Person(std::string n, int a, std::string c) : name(n), age(a), city(c) {}
};

std::string helloWorld() {
    std::string name = "C++ Developer";
    std::cout << "Hello, " << name << "!" << std::endl;
    return "Hello, " + name + "!";
}

int main() {
    // Call the function
    std::string result = helloWorld();
    std::cout << "Function returned: " << result << std::endl;
    
    // Vector operations
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::vector<int> squared;
    
    std::transform(numbers.begin(), numbers.end(), std::back_inserter(squared),
                   [](int x) { return x * x; });
    
    std::cout << "Squared numbers: ";
    for (int num : squared) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Create a person object
    Person person("Alice", 25, "New York");
    std::cout << "Person: " << person.name << " (" << person.age << ", " << person.city << ")" << std::endl;
    
    return 0;
}`,
    c: `// Welcome to the C IDE!
// Write your C code here and click "Run" to execute it.

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Person {
    char name[50];
    int age;
    char city[50];
};

const char* helloWorld() {
    const char* name = "C Developer";
    printf("Hello, %s!\\n", name);
    return "Hello, C Developer!";
}

int main() {
    // Call the function
    const char* result = helloWorld();
    printf("Function returned: %s\\n", result);
    
    // Array operations
    int numbers[] = {1, 2, 3, 4, 5};
    int squared[5];
    
    for (int i = 0; i < 5; i++) {
        squared[i] = numbers[i] * numbers[i];
    }
    
    printf("Squared numbers: ");
    for (int i = 0; i < 5; i++) {
        printf("%d ", squared[i]);
    }
    printf("\\n");
    
    // Create a person struct
    struct Person person;
    strcpy(person.name, "Alice");
    person.age = 25;
    strcpy(person.city, "New York");
    
    printf("Person: %s (%d, %s)\\n", person.name, person.age, person.city);
    
    return 0;
}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to HTML IDE</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            background-color: #e9ecef;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to the HTML IDE!</h1>
        <p>Write your HTML code here and see the results immediately.</p>
        
        <button class="button" onclick="showMessage()">Click Me!</button>
        <button class="button" onclick="calculateSquare()">Calculate Square</button>
        
        <div id="result" class="result">
            Click the buttons above to see JavaScript in action!
        </div>
    </div>

    <script>
        function showMessage() {
            const name = "HTML Developer";
            const message = \`Hello, \${name}!\`;
            document.getElementById('result').innerHTML = 
                \`<strong>Message:</strong> \${message}<br>
                 <strong>Time:</strong> \${new Date().toLocaleTimeString()}\`;
        }
        
        function calculateSquare() {
            const numbers = [1, 2, 3, 4, 5];
            const squared = numbers.map(x => x * x);
            document.getElementById('result').innerHTML = 
                \`<strong>Original:</strong> [\${numbers.join(', ')}]<br>
                 <strong>Squared:</strong> [\${squared.join(', ')}]\`;
        }
    </script>
</body>
</html>`,
    css: `/* Welcome to the CSS IDE! */
/* Write your CSS code here and see the styling results */

/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

/* Container styles */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Card component */
.card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding: 30px;
    margin: 20px 0;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

/* Typography */
h1 {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(45deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    margin-bottom: 30px;
}

h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 15px;
}

/* Button styles */
.btn {
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    text-decoration: none;
    border-radius: 25px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    margin: 5px;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Grid layout */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

/* Animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 0.6s ease-out;
}

/* Responsive design */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    .card {
        padding: 20px;
    }
}`
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || '');
      const dest = cwd === '/' ? `/${file.name}` : `${cwd}/${file.name}`;
      setFileSystem(prev => ({ ...prev, [dest]: { type: 'file', content } }));
      setOutput(prev => prev + `Imported ${file.name} to ${dest}\n`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const resolvePath = (path: string) => {
    if (path.startsWith('/')) return path;
    if (cwd === '/') return `/${path}`;
    return `${cwd}/${path}`;
  };

  const listDir = (dir: string) => {
    const prefix = dir === '/' ? '/' : `${dir}/`;
    return Object.keys(fileSystem)
      .filter(p => p.startsWith(prefix) && p !== dir && p.slice(prefix.length).indexOf('/') === -1)
      .map(p => p.slice(prefix.length));
  };

  const parentDir = (dir: string) => {
    if (dir === '/') return '/';
    const parts = dir.split('/').filter(Boolean);
    parts.pop();
    return parts.length ? `/${parts.join('/')}` : '/';
  };

  const openContextMenu = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    e.stopPropagation();
    const entry = fileSystem[target];
    setContextMenu({ x: e.clientX, y: e.clientY, target, isFile: entry?.type === 'file' });
  };

  const openEntry = (target: string) => {
    const entry = fileSystem[target];
    if (!entry) return;
    if (entry.type === 'dir') {
      setCwd(target);
    } else {
      setCode(entry.content);
      const fileName = target.split('/').pop() || '';
      const ext = fileName.split('.').pop() || '';
      const match = languages.find(l => l.extension === ext);
      if (match) setLanguage(match.value);
      setOutput(prev => prev + `Opened ${fileName}\n`);
    }
  };

  const newFile = (base: string = cwd) => {
    const raw = window.prompt('New file name:');
    const name = raw ? raw.trim().replace(/\s+/g, '_') : '';
    if (!name) return;
    const path = base === '/' ? `/${name}` : `${base}/${name}`;
    if (fileSystem[path]) { setOutput(prev => prev + `Error: ${name} already exists\n`); return; }
    setFileSystem(prev => ({ ...prev, [path]: { type: 'file', content: '' } }));
    setOutput(prev => prev + `Created ${name}\n`);
  };

  const newFolder = (base: string = cwd) => {
    const raw = window.prompt('New folder name:');
    const name = raw ? raw.trim().replace(/\s+/g, '_') : '';
    if (!name) return;
    const path = base === '/' ? `/${name}` : `${base}/${name}`;
    if (fileSystem[path]) { setOutput(prev => prev + `Error: ${name} already exists\n`); return; }
    setFileSystem(prev => ({ ...prev, [path]: { type: 'dir', content: '' } }));
    setOutput(prev => prev + `Created ${name}\n`);
  };

  const copyEntry = (target: string) => {
    const raw = window.prompt('Copy as:');
    const name = raw ? raw.trim().replace(/\s+/g, '_') : '';
    if (!name) return;
    const parent = target.split('/').slice(0, -1).join('/') || '/';
    const dst = parent === '/' ? `/${name}` : `${parent}/${name}`;
    if (fileSystem[dst]) { setOutput(prev => prev + `Error: ${name} already exists\n`); return; }
    const srcEntry = fileSystem[target];
    if (!srcEntry) return;
    const srcPrefix = target === '/' ? '' : `${target}/`;
    const dstPrefix = dst === '/' ? '' : `${dst}/`;
    setFileSystem(prev => {
      const next = { ...prev, [dst]: srcEntry };
      Object.keys(prev).forEach(p => {
        if (p.startsWith(srcPrefix) && p !== target) {
          const suffix = p.slice(srcPrefix.length);
          next[`${dstPrefix}${suffix}`] = prev[p];
        }
      });
      return next;
    });
    setOutput(prev => prev + `Copied to ${name}\n`);
  };

  const renameEntry = (target: string) => {
    const raw = window.prompt('Rename to:');
    const name = raw ? raw.trim().replace(/\s+/g, '_') : '';
    if (!name) return;
    const parent = target.split('/').slice(0, -1).join('/') || '/';
    const dst = parent === '/' ? `/${name}` : `${parent}/${name}`;
    if (dst === target) return;
    if (fileSystem[dst]) { setOutput(prev => prev + `Error: ${name} already exists\n`); return; }
    const srcPrefix = target === '/' ? '' : `${target}/`;
    const dstPrefix = dst === '/' ? '' : `${dst}/`;
    setFileSystem(prev => {
      const next: Record<string, { type: 'file' | 'dir'; content: string }> = {};
      Object.keys(prev).forEach(p => {
        if (p === target) {
          next[dst] = prev[p];
        } else if (p.startsWith(srcPrefix)) {
          const suffix = p.slice(srcPrefix.length);
          next[`${dstPrefix}${suffix}`] = prev[p];
        } else {
          next[p] = prev[p];
        }
      });
      return next;
    });
    setOutput(prev => prev + `Renamed to ${name}\n`);
  };

  const deleteEntry = (target: string) => {
    const fileName = target.split('/').pop() || target;
    if (!window.confirm(`Delete ${fileName}?`)) return;
    const prefix = target === '/' ? '' : `${target}/`;
    setFileSystem(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(p => {
        if (p === target || p.startsWith(prefix)) delete next[p];
      });
      return next;
    });
    setOutput(prev => prev + `Deleted ${fileName}\n`);
  };

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = terminalInput;
    setTerminalInput('');
    await executeCommand(input);
  };

  const executeCommand = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const [cmd, ...args] = trimmed.split(/\s+/);
    const prompt = `user@yarichard-international:${cwd}$ ${trimmed}\n`;
    let result = '';

    switch (cmd) {
      case 'help':
        result = `Portal: project save|load|list|delete, save, export, import
File system: ls, cd, pwd, mkdir, touch, cat, echo, rm, cp, mv, clear
GitHub: github login <token>, github status, github push <repo> [path]
Live share: live start <room>, live share, live stop
Code incubation: incubate <name>, incubations, hatch <name>, trash <name>
Other: run, packages, submit, date, whoami, help`;
        break;
      case 'clear':
        setOutput('');
        return;
      case 'pwd':
        result = cwd;
        break;
      case 'ls':
        result = listDir(cwd).join('  ') || '(empty)';
        break;
      case 'cd':
        const target = args[0] || '/home/user';
        const newPath = target === '..' ? (cwd.split('/').slice(0, -1).join('/') || '/') : resolvePath(target);
        const entry = fileSystem[newPath];
        if (entry?.type === 'dir') {
          setCwd(newPath);
        } else {
          result = `cd: ${target}: No such directory`;
        }
        break;
      case 'mkdir':
        if (!args[0]) { result = 'mkdir: missing operand'; break; }
        const newDir = resolvePath(args[0]);
        if (fileSystem[newDir]) { result = `mkdir: cannot create directory '${args[0]}': File exists`; break; }
        setFileSystem(prev => ({ ...prev, [newDir]: { type: 'dir', content: '' } }));
        break;
      case 'touch':
        if (!args[0]) { result = 'touch: missing operand'; break; }
        const newFile = resolvePath(args[0]);
        if (!fileSystem[newFile]) {
          setFileSystem(prev => ({ ...prev, [newFile]: { type: 'file', content: '' } }));
        }
        break;
      case 'cat':
        if (!args[0]) { result = 'cat: missing operand'; break; }
        const catFile = resolvePath(args[0]);
        const f = fileSystem[catFile];
        if (!f) { result = `cat: ${args[0]}: No such file`; break; }
        if (f.type === 'dir') { result = `cat: ${args[0]}: Is a directory`; break; }
        result = f.content;
        break;
      case 'echo':
        result = args.join(' ');
        break;
      case 'rm':
        if (!args[0]) { result = 'rm: missing operand'; break; }
        const rmFile = resolvePath(args[0]);
        if (!fileSystem[rmFile]) { result = `rm: ${args[0]}: No such file`; break; }
        setFileSystem(prev => {
          const next = { ...prev };
          delete next[rmFile];
          return next;
        });
        break;
      case 'cp':
        if (args.length < 2) { result = 'cp: missing operands'; break; }
        const src = resolvePath(args[0]);
        const dst = resolvePath(args[1]);
        const srcEntry = fileSystem[src];
        if (!srcEntry) { result = `cp: ${args[0]}: No such file`; break; }
        if (srcEntry.type === 'dir') { result = `cp: ${args[0]}: Is a directory`; break; }
        setFileSystem(prev => ({ ...prev, [dst]: { type: 'file', content: srcEntry.content } }));
        break;
      case 'mv':
        if (args.length < 2) { result = 'mv: missing operands'; break; }
        const mvSrc = resolvePath(args[0]);
        const mvDst = resolvePath(args[1]);
        const mvEntry = fileSystem[mvSrc];
        if (!mvEntry) { result = `mv: ${args[0]}: No such file`; break; }
        setFileSystem(prev => {
          const next = { ...prev };
          delete next[mvSrc];
          return { ...next, [mvDst]: mvEntry };
        });
        break;
      case 'import':
        fileInputRef.current?.click();
        result = 'Opening file import dialog...';
        break;
      case 'export':
        if (!args[0]) { result = 'export: missing filename'; break; }
        const exportFile = resolvePath(args[0]);
        const exp = fileSystem[exportFile];
        if (!exp || exp.type === 'dir') { result = `export: ${args[0]}: No such file`; break; }
        const blob = new Blob([exp.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = args[0];
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        result = `Exported ${args[0]}`;
        break;
      case 'run':
        setOutput(prev => prev + prompt);
        runCode();
        return;
      case 'date':
        result = new Date().toString();
        break;
      case 'whoami':
        result = 'user';
        break;
      case 'save':
        setOutput(prev => prev + prompt);
        saveCode();
        return;
      case 'project':
        if (!args[0]) { result = 'project: missing subcommand (save|load|list|delete)'; break; }
        const projectOp = args[0];
        const projectName = args[1];
        if (projectOp === 'save') {
          if (!projectName) { result = 'project save: missing name'; break; }
          saveProject(projectName, { code, language, theme, fontSize, fileSystem, cwd });
          result = `Saved project ${projectName}`;
        } else if (projectOp === 'load') {
          if (!projectName) { result = 'project load: missing name'; break; }
          const p = loadProject(projectName);
          if (!p) { result = `Project ${projectName} not found`; break; }
          setCode(p.code);
          setLanguage(p.language);
          setTheme(p.theme);
          setFontSize(p.fontSize);
          setFileSystem(p.fileSystem);
          setCwd(p.cwd);
          result = `Loaded project ${projectName}`;
        } else if (projectOp === 'list') {
          result = Object.keys(loadProjects()).join(',  ') || 'No saved projects';
        } else if (projectOp === 'delete') {
          if (!projectName) { result = 'project delete: missing name'; break; }
          deleteProject(projectName);
          result = `Deleted project ${projectName}`;
        } else {
          result = `project: unknown subcommand ${projectOp}`;
        }
        break;
      case 'github':
        if (!args[0]) { result = 'github: missing subcommand (login|status|push)'; break; }
        if (args[0] === 'login') {
          if (!args[1]) { result = 'github login: missing token'; break; }
          setGithubToken(args[1]);
          result = 'GitHub token saved';
        } else if (args[0] === 'status') {
          result = githubStatus();
        } else if (args[0] === 'push') {
          const repo = args[1];
          if (!repo) { result = 'github push: missing repo (owner/repo)'; break; }
          const path = args[2] || `main.${currentLang?.extension || 'txt'}`;
          try {
            result = await pushToGitHub(repo, path, code);
          } catch (e) {
            result = `GitHub error: ${(e as any).message || e}`;
          }
        } else {
          result = `github: unknown subcommand ${args[0]}`;
        }
        break;
      case 'live':
        if (!args[0]) { result = 'live: missing subcommand (start|share|stop)'; break; }
        if (args[0] === 'start') {
          const room = args[1];
          if (!room) { result = 'live start: missing room'; break; }
          const ok = liveShare.join(room, (msg) => {
            if (msg.type === 'code' && msg.payload) {
              setCode(msg.payload.code || '');
              setLanguage(msg.payload.language || 'python');
              setLiveCode(msg.payload.code || '');
              setLiveTheme(msg.payload.theme || 'vs-dark');
              setLiveFontSize(msg.payload.fontSize || 14);
            } else if (msg.type === 'style' && msg.payload) {
              setLiveTheme(msg.payload.theme || 'vs-dark');
              setLiveFontSize(msg.payload.fontSize || 14);
            }
            setOutput(prev => prev + `[live:${room}] ${msg.type}\n`);
          });
          if (ok) {
            setLiveRoom(room);
            setLiveOpen(true);
            setLiveCode(code);
            setLiveTheme(theme);
            setLiveFontSize(fontSize);
          }
          result = ok ? `Joined live share room ${room}` : 'Live share not supported in this browser';
        } else if (args[0] === 'share') {
          try {
            liveShare.send('code', { code, language, theme, fontSize });
            result = 'Code and styles shared with room';
          } catch (e) {
            result = `live share error: ${(e as any).message || e}`;
          }
        } else if (args[0] === 'stop') {
          liveShare.leave();
          setLiveRoom(null);
          setLiveOpen(false);
          result = 'Left live share room';
        } else {
          result = `live: unknown subcommand ${args[0]}`;
        }
        break;
      case 'incubate':
        if (!args[0]) { result = 'incubate: missing name'; break; }
        saveIncubation(args[0], code, language);
        result = `Incubated ${args[0]}`;
        break;
      case 'incubations':
        result = Object.entries(loadIncubations())
          .map(([name, inc]) => `${name} — ${new Date(inc.timestamp).toLocaleString()}`)
          .join('\n') || 'No incubations';
        break;
      case 'hatch':
        if (!args[0]) { result = 'hatch: missing name'; break; }
        const hatched = loadIncubation(args[0]);
        if (!hatched) { result = `Incubation ${args[0]} not found`; break; }
        setCode(hatched.code);
        setLanguage(hatched.language);
        result = `Hatched ${args[0]}`;
        break;
      case 'trash':
        if (!args[0]) { result = 'trash: missing name'; break; }
        deleteIncubation(args[0]);
        result = `Trashed ${args[0]}`;
        break;
      case 'submit':
        submitCode();
        return;
      case 'packages':
        showPackages();
        return;
      default:
        result = `${cmd}: command not found`;
    }

    setOutput(prev => prev + prompt + (result ? result + '\n' : ''));
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(defaultCode[newLanguage as keyof typeof defaultCode] || (newLanguage === 'stm32' ? defaultCode.cpp : ''));
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput(prev => prev + 'Running code...\n');

    // Simulate code execution (in a real app, this would call a backend service)
    setTimeout(() => {
      let simulatedOutput = '';
      
      if (language === 'python') {
        simulatedOutput = `Hello, Python Developer!
Function returned: Hello, Python Developer!
Squared numbers: [1, 4, 9, 16, 25]
Person: {'name': 'Alice', 'age': 25, 'city': 'New York'}

✅ Code executed successfully!
⏱️ Execution time: 0.023s
📦 Memory usage: 2.1MB`;
      } else if (language === 'javascript' || language === 'typescript') {
        simulatedOutput = `Hello, ${language === 'javascript' ? 'JavaScript' : 'TypeScript'} Developer!
Function returned: Hello, ${language === 'javascript' ? 'JavaScript' : 'TypeScript'} Developer!
Squared numbers: [1, 4, 9, 16, 25]
Person: { name: 'Alice', age: 25, city: 'New York' }

✅ Code executed successfully!
⏱️ Execution time: 0.015s
📦 Memory usage: 1.8MB`;
      } else if (language === 'java') {
        simulatedOutput = `Hello, Java Developer!
Function returned: Hello, Java Developer!
Squared numbers: [1, 4, 9, 16, 25]
Person: Alice (25, New York)

✅ Code compiled and executed successfully!
⏱️ Compilation time: 0.234s
⏱️ Execution time: 0.045s
📦 Memory usage: 4.2MB`;
      } else if (language === 'cpp') {
        simulatedOutput = `Hello, C++ Developer!
Function returned: Hello, C++ Developer!
Squared numbers: 1 4 9 16 25 
Person: Alice (25, New York)

✅ Code compiled and executed successfully!
⏱️ Compilation time: 0.156s
⏱️ Execution time: 0.012s
📦 Memory usage: 1.2MB`;
      } else if (language === 'stm32') {
        simulatedOutput = `Hello, STM32 Developer!
Function returned: Hello, STM32 Developer!
Squared numbers: 1 4 9 16 25 
Person: Alice (25, New York)

✅ STM32 build compiled and flashed successfully!
⏱️ Compilation time: 0.312s
⏱️ Flash time: 0.045s
📦 Memory usage: 1.2MB`;
      } else if (language === 'c') {
        simulatedOutput = `Hello, C Developer!
Function returned: Hello, C Developer!
Squared numbers: 1 4 9 16 25 
Person: Alice (25, New York)

✅ Code compiled and executed successfully!
⏱️ Compilation time: 0.089s
⏱️ Execution time: 0.008s
📦 Memory usage: 0.8MB`;
      } else if (language === 'html') {
        simulatedOutput = `🌐 HTML file rendered successfully!
📄 File size: 2.3KB
🎨 Styles applied: 15 CSS rules
⚡ JavaScript executed: 2 functions
🖼️ Images loaded: 0
🔗 External resources: 0

✅ HTML page is ready for viewing!`;
      } else if (language === 'css') {
        simulatedOutput = `🎨 CSS compiled successfully!
📏 Total rules: 45
🎯 Selectors: 28 unique
📐 Media queries: 2 responsive breakpoints
🌈 Colors used: 8 unique colors
📱 Mobile-first design: Yes
🔧 Browser compatibility: Modern browsers

✅ Styles are ready to apply!`;
      }

      if (!simulatedOutput) {
        simulatedOutput = `✅ ${currentLang?.label || 'Code'} executed successfully!\n\n⏱️ Execution time: 0.045s\n📦 Memory usage: 2.0MB`;
      }
      setOutput(prev => prev + simulatedOutput + '\n\n');
      setIsRunning(false);
    }, 1500);
  };

  const saveCode = () => {
    const fileName = `main.${currentLang?.extension || 'txt'}`;
    const filePath = cwd === '/' ? `/${fileName}` : `${cwd}/${fileName}`;
    const nextFs = { ...fileSystem, [filePath]: { type: 'file' as const, content: code } };
    setFileSystem(nextFs);
    saveIDEState({ code, language, theme, fontSize, fileSystem: nextFs, cwd });
    setOutput(prev => prev + `Saved ${fileName} to portal storage.\n`);
  };

  const submitCode = () => {
    if (!code.trim()) {
      setOutput(prev => prev + 'Nothing to submit.\n');
      return;
    }
    runCode();
    const record = { code, language, theme, fontSize, file: `main.${currentLang?.extension || 'txt'}`, timestamp: Date.now() };
    const all = JSON.parse(localStorage.getItem('yarichard-submissions') || '[]');
    all.push(record);
    localStorage.setItem('yarichard-submissions', JSON.stringify(all));
    setOutput(prev => prev + `Submission ${all.length} recorded.\n`);
  };

  const showPackages = () => {
    const list = ['python', 'pip', 'node', 'npm', 'gcc', 'g++', 'stm32-hal', 'typescript'];
    setOutput(prev => prev + 'Installed packages:\n' + list.map(p => `  ${p}`).join('\n') + '\n');
  };

  const terminalCommands = ['help', 'clear', 'pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'echo', 'rm', 'cp', 'mv', 'import', 'export', 'run', 'date', 'whoami', 'save', 'project', 'github', 'live', 'incubate', 'incubations', 'hatch', 'trash', 'packages', 'submit'];

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-white">
      {/* Title Bar / Menu */}
      <div className="h-8 bg-[#3c3c3c] flex items-center justify-between px-2 text-xs select-none">
        <div className="flex items-center space-x-1">
          <span className="text-gray-300 px-2 py-1 hover:bg-[#505050] rounded cursor-default">File</span>
          <span className="text-gray-300 px-2 py-1 hover:bg-[#505050] rounded cursor-default">Edit</span>
          <select
            value="Selection"
            onChange={(e) => {
              if (e.target.value === 'packages') showPackages();
              e.target.value = 'Selection';
            }}
            className="bg-transparent text-gray-300 text-xs px-2 py-1 hover:bg-[#505050] rounded cursor-pointer border-none focus:outline-none"
          >
            <option value="Selection" className="bg-[#3c3c3c] text-gray-300">Selection</option>
            <option value="packages" className="bg-[#3c3c3c] text-gray-300">My Packages</option>
          </select>
          <span className="text-gray-300 px-2 py-1 hover:bg-[#505050] rounded cursor-default">View</span>
          <span className="text-gray-300 px-2 py-1 hover:bg-[#505050] rounded cursor-default">Go</span>
          <span className="text-gray-300 px-2 py-1 hover:bg-[#505050] rounded cursor-default">Run</span>
          <span className="text-gray-300 px-2 py-1 hover:bg-[#505050] rounded cursor-default">Terminal</span>
          <span className="text-gray-300 px-2 py-1 hover:bg-[#505050] rounded cursor-default">Help</span>
        </div>
        <span className="text-gray-300 font-medium">yarichard-international — VS Code</span>
        <div className="flex items-center space-x-1 text-gray-300">
          <span className="hover:bg-[#505050] px-2 py-0.5 rounded cursor-default">−</span>
          <span className="hover:bg-[#505050] px-2 py-0.5 rounded cursor-default">□</span>
          <span className="hover:bg-red-600 px-2 py-0.5 rounded cursor-default">×</span>
        </div>
      </div>

      {/* Tab / Toolbar */}
      <div className="h-9 bg-[#252526] flex items-center border-b border-[#1e1e1e]">
        <div className="flex items-center h-full px-3 bg-[#1e1e1e] text-sm border-t-2 border-blue-500">
          <FileCode className="h-4 w-4 mr-2 text-blue-400" />
          <span>main.{currentLang?.extension || 'txt'}</span>
          <X className="h-3 w-3 ml-3 text-gray-400 hover:text-white cursor-pointer" />
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-2 pr-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[#3c3c3c] text-white text-xs px-2 py-1 rounded border border-[#5a5a5a] focus:border-blue-500 focus:outline-none"
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value} className="bg-[#3c3c3c]">
                {lang.label}
              </option>
            ))}
          </select>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-[#3c3c3c] text-white text-xs px-2 py-1 rounded border border-[#5a5a5a] focus:border-blue-500 focus:outline-none"
          >
            <option value="vs-dark" className="bg-[#3c3c3c]">Dark</option>
            <option value="vs-light" className="bg-[#3c3c3c]">Light</option>
            <option value="hc-black" className="bg-[#3c3c3c]">High Contrast</option>
          </select>

          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-[#3c3c3c] text-white text-xs px-2 py-1 rounded border border-[#5a5a5a] focus:border-blue-500 focus:outline-none"
          >
            <option value="12" className="bg-[#3c3c3c]">12px</option>
            <option value="14" className="bg-[#3c3c3c]">14px</option>
            <option value="16" className="bg-[#3c3c3c]">16px</option>
            <option value="18" className="bg-[#3c3c3c]">18px</option>
            <option value="20" className="bg-[#3c3c3c]">20px</option>
          </select>

          <button
            onClick={saveCode}
            className="flex items-center space-x-1 px-2 py-1 bg-[#0e639c] text-white text-xs rounded hover:bg-[#1177bb] transition-colors"
            title="Save file"
          >
            <Save className="h-3 w-3" />
            <span>Save</span>
          </button>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center space-x-1 px-2 py-1 bg-[#2ea043] text-white text-xs rounded hover:bg-[#2f9e43] disabled:bg-gray-600 transition-colors"
          >
            <Play className="h-3 w-3" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>

          <button
            onClick={submitCode}
            className="flex items-center space-x-1 px-2 py-1 bg-[#0e70c0] text-white text-xs rounded hover:bg-[#1177bb] transition-colors"
          >
            <Save className="h-3 w-3" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 min-h-0 flex">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 border-r border-[#1e1e1e]">
          <div className="p-2 mb-2 text-white cursor-pointer" title="Explorer">
            <FileCode className="h-6 w-6" />
          </div>
          <div className="p-2 mb-2 text-gray-400 hover:text-white cursor-pointer" title="Search">
            <Search className="h-6 w-6" />
          </div>
          <div className="p-2 mb-2 text-gray-400 hover:text-white cursor-pointer" title="Source Control">
            <GitBranch className="h-6 w-6" />
          </div>
          <div className="p-2 mb-2 text-gray-400 hover:text-white cursor-pointer" title="Extensions">
            <Puzzle className="h-6 w-6" />
          </div>
          <div className="flex-1" />
          <div className="p-2 text-gray-400 hover:text-white cursor-pointer" title="Manage">
            <Settings className="h-6 w-6" />
          </div>
        </div>

        {/* Explorer Sidebar */}
        <div className="w-56 bg-[#252526] border-r border-[#1e1e1e] flex flex-col">
          <div className="h-8 px-4 flex items-center text-xs uppercase tracking-wider text-gray-400 font-semibold" style={{ justifyContent: 'space-between' }}>
            <span>Explorer</span>
            <div
              className="text-gray-400 hover:text-white cursor-pointer"
              onClick={() => {
                const raw = window.prompt('New file name:');
                const name = raw ? raw.trim().replace(/\s+/g, '_') : '';
                if (name) executeCommand(`touch ${name}`);
              }}
              title="New file"
            >
              <Plus className="h-3 w-3" />
            </div>
          </div>
          <div
            className="px-2 flex-1 overflow-auto"
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu({ x: e.clientX, y: e.clientY, target: '', isFile: false });
            }}
          >
            <div className="flex items-center px-2 py-1 text-sm text-white hover:bg-[#37373d] cursor-pointer" onClick={() => setCwd('/home/user')}>
              <ChevronDown className="h-3 w-3 mr-1" />
              <Folder className="h-4 w-4 mr-2 text-blue-400" />
              <span>YARICHARD-INTERNATIONAL</span>
            </div>
            {cwd !== '/home/user' && (
              <div
                className="pl-5 flex items-center px-2 py-1 text-sm text-white hover:bg-[#37373d] cursor-pointer"
                onClick={() => setCwd(parentDir(cwd))}
              >
                <span className="mr-2 text-gray-400">..</span>
              </div>
            )}
            {listDir(cwd).map(name => {
              const path = resolvePath(name);
              const entry = fileSystem[path];
              const isFile = entry?.type === 'file';
              return (
                <div
                  key={path}
                  className="pl-5 flex items-center px-2 py-1 text-sm text-white hover:bg-[#37373d] cursor-pointer"
                  onClick={() => openEntry(path)}
                  onContextMenu={(e) => openContextMenu(e, path)}
                >
                  {isFile ? (
                    <FileCode className="h-4 w-4 mr-2 text-blue-400" />
                  ) : (
                    <Folder className="h-4 w-4 mr-2 text-blue-400" />
                  )}
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
          {contextMenu && (
            <div
              className="bg-[#252526] border border-[#414141] text-xs text-[#cccccc]"
              style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {contextMenu.target === '' ? (
                <>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { newFile(); setContextMenu(null); }}>New File</div>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { newFolder(); setContextMenu(null); }}>New Folder</div>
                </>
              ) : contextMenu.isFile ? (
                <>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { openEntry(contextMenu.target); setContextMenu(null); }}>Open</div>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { copyEntry(contextMenu.target); setContextMenu(null); }}>Copy</div>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { renameEntry(contextMenu.target); setContextMenu(null); }}>Rename</div>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { deleteEntry(contextMenu.target); setContextMenu(null); }}>Delete</div>
                </>
              ) : (
                <>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { openEntry(contextMenu.target); setContextMenu(null); }}>Open</div>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { newFile(contextMenu.target); setContextMenu(null); }}>New File</div>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { newFolder(contextMenu.target); setContextMenu(null); }}>New Folder</div>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { copyEntry(contextMenu.target); setContextMenu(null); }}>Copy</div>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { renameEntry(contextMenu.target); setContextMenu(null); }}>Rename</div>
                  <div className="py-2 hover:bg-[#37373d] cursor-pointer" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }} onClick={() => { deleteEntry(contextMenu.target); setContextMenu(null); }}>Delete</div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Editor + Bottom Panel */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={language === 'stm32' ? 'cpp' : language}
              theme={theme}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true
                }
              }}
            />
          </div>

          {/* Bottom Panel */}
          <div className="h-48 bg-[#1e1e1e] border-t border-[#414141] flex flex-col">
            <div className="h-8 bg-[#252526] px-4 flex items-center space-x-4 text-xs text-gray-300 border-b border-[#1e1e1e]">
              <span className="text-white border-b-2 border-blue-500 h-full flex items-center">TERMINAL</span>
              <span className="hover:text-white cursor-pointer">OUTPUT</span>
              <span className="hover:text-white cursor-pointer">DEBUG CONSOLE</span>
              <span className="hover:text-white cursor-pointer">PROBLEMS</span>
            </div>
            <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]" style={{ minHeight: 0 }}>
              <div className="flex-1 p-3 font-mono text-xs text-[#cccccc] overflow-auto whitespace-pre-wrap">
                <div className="mb-2 text-green-400">Terminal</div>
                {output}
              </div>
              {terminalHints.length > 0 && (
                <div className="bg-[#1e1e1e] px-2 py-1 text-xs text-[#cccccc]" style={{ borderTop: '1px solid #414141' }}>
                  {terminalHints.map(h => (
                    <div
                      key={h}
                      className="px-2 py-1 hover:bg-[#37373d] cursor-pointer"
                      onClick={() => {
                        const parts = terminalInput.split(/\s+/).filter(Boolean);
                        parts[parts.length - 1] = h;
                        setTerminalInput(parts.join(' ') + ' ');
                        setTerminalHints([]);
                      }}
                    >
                      {h}
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleTerminalSubmit} className="h-8 flex items-center border-t border-[#414141] bg-[#1e1e1e]" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
                <span className="text-green-400 mr-2" style={{ whiteSpace: 'nowrap' }}>user@yarichard-international:{cwd}$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTerminalInput(value);
                    const token = value.trim().endsWith(' ') ? '' : (value.trim().split(/\s+/).pop() || '');
                    if (!token) setTerminalHints([]);
                    else setTerminalHints(terminalCommands.filter(c => c.startsWith(token) && c !== token));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' && terminalHints.length > 0) {
                      e.preventDefault();
                      const parts = terminalInput.split(/\s+/).filter(Boolean);
                      if (parts.length === 0) return;
                      parts[parts.length - 1] = terminalHints[0];
                      setTerminalInput(parts.join(' ') + ' ');
                      setTerminalHints([]);
                    }
                  }}
                  className="flex-1 text-xs"
                  style={{ background: 'transparent', color: '#cccccc', border: 'none', outline: 'none' }}
                  placeholder="Enter command..."
                  spellCheck={false}
                />
                <input type="file" ref={fileInputRef} onChange={handleFileImport} style={{ display: 'none' }} />
              </form>
            </div>
          </div>
        </div>

        {liveOpen && (
          <div className="w-64 bg-[#252526] border-l border-[#1e1e1e] flex flex-col">
            <div className="h-8 px-3 flex items-center text-xs text-gray-300 border-b border-[#1e1e1e]">
              <span>Live: {liveRoom}</span>
              <div className="flex-1" />
              <span
                className="text-gray-400 hover:text-white cursor-pointer"
                onClick={() => { liveShare.leave(); setLiveRoom(null); setLiveOpen(false); }}
              >
                ×
              </span>
            </div>
            <div className="flex-1 p-3 overflow-auto">
              <pre
                className="font-mono whitespace-pre-wrap"
                style={{
                  color: liveTheme === 'vs-light' ? '#1e1e1e' : '#cccccc',
                  background: liveTheme === 'vs-light' ? '#ffffff' : '#1e1e1e',
                  fontSize: liveFontSize,
                }}
              >
                {liveCode}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#0e70c0] flex items-center justify-between px-3 text-xs text-white">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <GitBranch className="h-3 w-3" />
            <span>main</span>
          </span>
          <span>{currentLang?.label}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
          <span>{currentLang?.label || 'Plain Text'}</span>
        </div>
      </div>
    </div>
  );
};
