/* ============================================================
   AugustinNOTES — script.js
   Companion script for index.html
   Usage: <script src="script.js"></script> (before </body>)
   ============================================================ */

/* ════ AUTH ══════════════════════════════════════════════════════════════════ */
function doLogin(){
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const err   = document.getElementById('loginErr');

  if(!email || !pass){
    err.textContent = 'Please fill in all fields.';
    err.style.display = 'block'; return;
  }
  // Demo credentials check
  if(email !== 'student@adnu.edu.ph' || pass !== 'password123'){
    err.textContent = 'Invalid credentials. Please try again.';
    err.style.display = 'block';
    document.getElementById('loginPass').value = '';
    return;
  }
  err.style.display = 'none';
  // set today as default validation date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('valDate').value = today;
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('appShell').style.display = 'flex';
  refreshStats(); renderNotesList(); renderRecent(); renderDashboard();
  toast('Welcome back, Augustinian! 🎓','success');
}

function doLogout(){
  if(!confirm('Are you sure you want to log out?')) return;
  document.getElementById('appShell').style.display = 'none';
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('loginPass').value = '';
  document.getElementById('loginErr').style.display = 'none';
  toast('Logged out successfully','info');
}

/* ════ DATA ══════════════════════════════════════════════════════════════════ */
let NOTES = [
  { id:1, title:'ITFE Module 7 Notes', subject:'ITFE – IT Fundamentals',
    author:'Ben Marie Loyola', pages:4, rating:5, saves:18, saved:true, fav:true,
    validated:true, validatedBy:'Prof. R. Santos', validatedAt:'2026-04-10',
    comments:[
      {id:101,user:'Juan D.',text:'Great notes! The OSI model breakdown is super clear.',ts:'Apr 11',likes:4,liked:false},
      {id:102,user:'Maria C.',text:'Thanks for the protocol list — really helped in the exam.',ts:'Apr 12',likes:2,liked:false}
    ]
  },
  { id:2, title:'APDEV Notes – React Fundamentals', subject:'APDEV – App Development',
    author:'Ben Marie Loyola', pages:6, rating:4, saves:12, saved:false, fav:false,
    validated:false, validatedBy:null, validatedAt:null,
    comments:[
      {id:201,user:'Carlo M.',text:'Can you add more on useEffect cleanup? That part confused me.',ts:'Apr 14',likes:1,liked:false}
    ]
  },
  { id:3, title:'IT 333 Module 5 Exam Reviewer', subject:'IT 333 – Software Engineering',
    author:'Ben Marie Loyola', pages:8, rating:5, saves:24, saved:true, fav:true,
    validated:true, validatedBy:'Prof. L. Reyes', validatedAt:'2026-04-08',
    comments:[
      {id:301,user:'Ana P.',text:'This reviewer is gold. Passed because of this! 🙌',ts:'Apr 9',likes:9,liked:false},
      {id:302,user:'Ben L.',text:'Behavioral patterns section is spot on.',ts:'Apr 9',likes:5,liked:false},
      {id:303,user:'Rose T.',text:'Could you add UML diagrams in the next version?',ts:'Apr 10',likes:3,liked:false}
    ]
  },
  { id:4, title:'ITE Exam Note Review', subject:'EXAM REVIEW',
    author:'Ben Marie Loyola', pages:9, rating:4, saves:11, saved:false, fav:false,
    validated:false, validatedBy:null, validatedAt:null,
    comments:[]
  },
  { id:5, title:'CS Fundamentals – Module 1: Introduction to Programming', subject:'ITFE – IT Fundamentals',
    author:'Prof. R. Santos', pages:5, rating:5, saves:30, saved:false, fav:false,
    validated:true, validatedBy:'Prof. R. Santos', validatedAt:'2026-05-01',
    comments:[
      {id:501,user:'Mhike G.',text:'This module is super clear — exactly what we need for the pre-finals!',ts:'May 2',likes:7,liked:false},
      {id:502,user:'Ana P.',text:'The problem-solving steps section is really practical.',ts:'May 3',likes:4,liked:false}
    ]
  },
  { id:6, title:'APDEV Module 3 – Database Design & SQL', subject:'APDEV – App Development',
    author:'Prof. L. Reyes', pages:7, rating:5, saves:22, saved:false, fav:false,
    validated:true, validatedBy:'Prof. L. Reyes', validatedAt:'2026-05-10',
    comments:[
      {id:601,user:'Carlo M.',text:'The normalization part finally clicked for me after reading this.',ts:'May 11',likes:6,liked:false}
    ]
  }
];
const CONTENT = {
  1:`ITFE MODULE 7 – IT INFRASTRUCTURE FUNDAMENTALS
Published by: Ben Marie Loyola
✅ Validated by: Prof. R. Santos  (2026-04-10)

───────────────────────────────────────
CHAPTER 7: NETWORK FUNDAMENTALS
───────────────────────────────────────

I. INTRODUCTION TO NETWORKING
   A network is a collection of computers and hardware interconnected
   by communication channels that allow resource and data sharing.

II. TYPES OF NETWORKS
   1. LAN – Local Area Network  (office, home)
   2. WAN – Wide Area Network   (the Internet)
   3. MAN – Metropolitan Area Network (city-wide)

III. OSI MODEL (7 Layers)
   Layer 7: Application  – HTTP, FTP, SMTP
   Layer 6: Presentation – Encryption, compression
   Layer 5: Session      – Session management
   Layer 4: Transport    – TCP, UDP
   Layer 3: Network      – IP addressing, routing
   Layer 2: Data Link    – MAC addresses, switches
   Layer 1: Physical     – Cables, signals, hubs

IV. KEY PROTOCOLS
   • TCP/IP  – Transmission Control Protocol
   • HTTP/S  – Secure Web Browsing
   • FTP     – File Transfer Protocol
   • DNS     – Domain Name System

─────────────────────────────────
END OF MODULE 7 – Good luck! 📚`,
  2:`APDEV – APPLICATION DEVELOPMENT
React Fundamentals Study Guide
Published by: Ben Marie Loyola
⏳ Pending professor validation

I. WHAT IS REACT?
   JavaScript library for building UIs. Developed by Meta.
   Component-based, declarative, uses Virtual DOM.

II. KEY CONCEPTS
   1. Components – Functional (hooks) · Class (legacy)
   2. JSX        – JavaScript XML syntax extension
   3. Props      – Data parent → child (read-only)
   4. State      – useState() hook, triggers re-render
   5. Hooks      – useState, useEffect, useContext, useMemo

III. LIFECYCLE (Functional)
   Mount → Update → Unmount
   useEffect(()=>{}, [])      – runs once on mount
   useEffect(()=>{}, [dep])   – runs when dep changes`,
  3:`IT 333 – SOFTWARE ENGINEERING
Module 5 Exam Reviewer: Design Patterns
Published by: Ben Marie Loyola
✅ Validated by: Prof. L. Reyes  (2026-04-08)

A. CREATIONAL PATTERNS
   Singleton · Factory · Abstract Factory · Builder · Prototype

B. STRUCTURAL PATTERNS
   Adapter · Bridge · Composite · Decorator · Facade

C. BEHAVIORAL PATTERNS
   Observer · Strategy · Command · Iterator · Template Method

EXAM TIPS
   • Know the purpose of each pattern
   • Identify which pattern to use given a scenario
   • Distinguish Factory from Abstract Factory`,
  4:`ITE BOARD EXAM REVIEW
Data Structures & Algorithms
Compiled by: Ben Marie Loyola
⏳ Pending professor validation

DATA STRUCTURES
   Arrays     – O(1) access, O(n) search (unsorted)
   Linked     – O(n) access, O(1) head insert
   Stacks     – LIFO: push, pop, peek
   Queues     – FIFO: enqueue, dequeue
   Trees      – Binary, BST, AVL
   Graphs     – BFS (Queue), DFS (Stack)

SORTING
   Bubble  O(n²)
   Merge   O(n log n)
   Quick   O(n log n) avg
   Heap    O(n log n)`,
  5:`CS FUNDAMENTALS – MODULE 1
Introduction to Programming
Course: ITFE – IT Fundamentals | 1st Semester, A.Y. 2026-2027
Published by: Prof. R. Santos
✅ Validated by: Prof. R. Santos (2026-05-01)

────────────────────────────────────────────
LEARNING OUTCOMES
────────────────────────────────────────────
By the end of this module, students will be able to:
  1. Define programming and explain its role in computing
  2. Identify the core concepts of any programming language
  3. Trace and write simple algorithms using pseudocode
  4. Classify programming paradigms and their use cases

────────────────────────────────────────────
I. WHAT IS PROGRAMMING?
────────────────────────────────────────────
Programming is the process of designing and writing instructions
(source code) that a computer can interpret and execute to
perform a specific task or solve a particular problem.

A PROGRAM is a sequence of instructions stored in a file
that the CPU reads and executes.

Source Code → Compiler/Interpreter → Machine Code → Execution

────────────────────────────────────────────
II. CORE CONCEPTS
────────────────────────────────────────────
1. VARIABLE
   A named memory location used to store a value.
   Example: int age = 20;

2. DATA TYPES
   Integer  – Whole numbers (e.g., 5, -3, 100)
   Float    – Decimal numbers (e.g., 3.14, -0.5)
   String   – Text (e.g., "Hello")
   Boolean  – True or False
   Array    – Collection of same-type values

3. OPERATORS
   Arithmetic : + - * / % (modulo)
   Relational : == != > < >= <=
   Logical    : && (AND)  || (OR)  ! (NOT)

4. CONTROL FLOW
   a. Sequence    – Execute line by line, top to bottom
   b. Selection   – if / else if / else / switch
   c. Repetition  – for loop / while loop / do-while loop

5. FUNCTIONS (Procedures / Methods)
   A reusable block of code that performs a specific task.
   Has: name, parameters (input), return type (output)

6. ARRAYS
   A fixed-size, ordered collection of elements of the same type.
   Index starts at 0. Example: int scores[5] = {90,85,78,92,88};

────────────────────────────────────────────
III. PROGRAMMING PARADIGMS
────────────────────────────────────────────
• Procedural    – Top-down approach; uses functions & procedures
                  Languages: C, Pascal
• Object-Oriented (OOP) – Models using Classes and Objects
                  Pillars: Encapsulation, Inheritance,
                           Polymorphism, Abstraction
                  Languages: Java, C++, Python
• Functional    – Treats computation as math functions; avoids
                  side effects. Languages: Haskell, Erlang
• Declarative   – Describes WHAT to do, not HOW
                  Languages: SQL, HTML, CSS

────────────────────────────────────────────
IV. ALGORITHM & PROBLEM SOLVING
────────────────────────────────────────────
An ALGORITHM is a step-by-step, finite set of well-defined
instructions to solve a problem.

Properties of a good algorithm:
  • Input       – Accepts zero or more inputs
  • Output      – Produces at least one output
  • Definiteness– Each step is precisely defined
  • Finiteness  – Terminates after a finite number of steps
  • Effectiveness– Steps are basic enough to be carried out

Problem-Solving Steps:
  1. Understand the problem
  2. Identify inputs and outputs
  3. Design the algorithm (pseudocode/flowchart)
  4. Code the solution
  5. Test with sample data
  6. Debug and optimize

────────────────────────────────────────────
V. PSEUDOCODE EXAMPLE
────────────────────────────────────────────
Problem: Find the largest of three numbers A, B, C

  BEGIN
    INPUT A, B, C
    SET largest = A
    IF B > largest THEN SET largest = B
    IF C > largest THEN SET largest = C
    OUTPUT "Largest is: ", largest
  END

────────────────────────────────────────────
END OF MODULE 1 — Study hard, Augustinians! 🎓`,
  6:`APDEV – MODULE 3
Database Design & Structured Query Language (SQL)
Course: APDEV – App Development | 2nd Semester, A.Y. 2026-2027
Published by: Prof. L. Reyes
✅ Validated by: Prof. L. Reyes (2026-05-10)

────────────────────────────────────────────
I. DATABASE FUNDAMENTALS
────────────────────────────────────────────
A DATABASE is an organized collection of structured data
stored electronically and managed by a DBMS.

DBMS Examples: MySQL, PostgreSQL, SQLite, Oracle, MS SQL Server

Key Terms:
  Table   – A set of rows and columns (like a spreadsheet)
  Row     – A single record / tuple
  Column  – An attribute / field
  Primary Key (PK) – Uniquely identifies each row
  Foreign Key (FK) – References the PK of another table

────────────────────────────────────────────
II. DATABASE NORMALIZATION
────────────────────────────────────────────
Normalization removes data redundancy and ensures integrity.

1NF (First Normal Form)
  – Atomic values; no repeating groups

2NF (Second Normal Form)
  – 1NF + no partial dependencies (applies to composite PKs)

3NF (Third Normal Form)
  – 2NF + no transitive dependencies
  – Non-key attributes depend ONLY on the PK

────────────────────────────────────────────
III. SQL COMMANDS
────────────────────────────────────────────
DDL – Data Definition Language
  CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    grade FLOAT
  );
  ALTER TABLE ... / DROP TABLE ...

DML – Data Manipulation Language
  INSERT INTO students (name, grade) VALUES ('Ana', 95.5);
  SELECT * FROM students WHERE grade >= 90 ORDER BY name;
  UPDATE students SET grade = 98 WHERE id = 1;
  DELETE FROM students WHERE id = 3;

DCL – Data Control Language
  GRANT SELECT ON students TO 'user'@'localhost';
  REVOKE INSERT ON students FROM 'user'@'localhost';

────────────────────────────────────────────
IV. JOINS
────────────────────────────────────────────
INNER JOIN  – Returns rows with matching values in both tables
LEFT JOIN   – All rows from left table + matches from right
RIGHT JOIN  – All rows from right table + matches from left
FULL JOIN   – All rows when there is a match in either table

Example:
  SELECT s.name, e.course
  FROM students s
  INNER JOIN enrollments e ON s.id = e.student_id;

────────────────────────────────────────────
END OF MODULE 3 — Good luck on your project! 💻`
};

let SAVED = [1,3];
let sharedCt = 7;
let curNote  = null;
let curPage  = 'home';
let activeTab= 'all';
let theme    = 'dark';
let upFile   = null;
let nextCmtId = 1000;

/* ════ INIT — runs after login ═══════════════════════════════════════════════ */
// Warm up theme on page load so login screen matches
(function warmTheme(){
  applyThemeBtns();
})();

/* ════ THEME ═════════════════════════════════════════════════════════════════ */
function toggleTheme(){ setTheme(theme==='dark'?'light':'dark'); }
function setTheme(t){
  theme=t;
  document.documentElement.setAttribute('data-theme',t);
  const btn=document.getElementById('themeBtn');
  const tip=document.getElementById('themeTip');
  btn.textContent=t==='dark'?'☀️':'🌙';
  tip.textContent=t==='dark'?'Switch to Light':'Switch to Dark';
  applyThemeBtns();
  toast('Theme: '+(t==='light'?'☀️ Light':'🌙 Dark'),'info');
}
function applyThemeBtns(){
  const db=document.getElementById('btn-dark');
  const lb=document.getElementById('btn-light');
  if(!db||!lb) return;
  db.className=theme==='dark'?'btn btn-sm btn-primary':'btn btn-sm';
  lb.className=theme==='light'?'btn btn-sm btn-primary':'btn btn-sm';
}

/* ════ NAVIGATION ════════════════════════════════════════════════════════════ */
function go(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const nb=document.getElementById('nav-'+page);
  if(nb) nb.classList.add('active');
  const titles={home:'Home',dashboard:'Dashboard',upload:'Upload Notes',profile:'My Profile',settings:'Settings',study:'AI Study'};
  document.getElementById('pageTitle').textContent=titles[page]||page;
  curPage=page;
  document.getElementById('searchInput').value='';
  if(page==='home'){renderNotesList();renderRecent();}
  if(page==='dashboard') renderDashboard();
  if(page==='study') study_refreshNoteSelector();
}

/* ════ TABS ══════════════════════════════════════════════════════════════════ */
function switchTab(el,tab){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  if(el) el.classList.add('active');
  activeTab=tab; renderNotesList();
}

/* ════ HELPERS ═══════════════════════════════════════════════════════════════ */
function totalComments(){ return NOTES.reduce((a,n)=>a+(n.comments?n.comments.length:0),0); }
function validCount(){ return NOTES.filter(n=>n.validated).length; }
function esc(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
function autoH(el){ el.style.height=''; el.style.height=Math.min(el.scrollHeight,90)+'px'; }

function validBadge(n){
  return n.validated
    ? `<span class="valid-badge"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Validated · ${n.validatedBy}</span>`
    : `<span class="pend-badge">⏳ Pending Validation</span>`;
}

/* ════ STATS ═════════════════════════════════════════════════════════════════ */
function refreshStats(){
  const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
  set('st-saved', SAVED.length);  set('ps-saved', SAVED.length);
  set('st-shared',sharedCt);      set('ps-shared',sharedCt);
  set('st-valid', validCount());   set('ps-valid', validCount());
  set('st-cmts',  totalComments());
}

/* ════ RENDER NOTES LIST ═════════════════════════════════════════════════════ */
function getFiltered(){
  const q=document.getElementById('searchInput').value.toLowerCase();
  let list=NOTES;
  if(activeTab==='validated') list=NOTES.filter(n=>n.validated);
  if(activeTab==='fav')       list=NOTES.filter(n=>SAVED.includes(n.id));
  if(activeTab==='top')       list=NOTES.filter(n=>n.rating>=5);
  if(q) list=list.filter(n=>(n.title+n.subject+n.author).toLowerCase().includes(q));
  return list;
}
function renderNotesList(){
  const list=getFiltered();
  const c=document.getElementById('notes-list');
  if(!list.length){ c.innerHTML='<div style="padding:30px;text-align:center;color:var(--text3);font-size:13px">No notes match this filter.</div>'; return; }
  c.innerHTML=list.map(n=>`
    <div class="note-card fade-up" onclick="openViewer(${n.id})">
      <div style="width:34px;height:34px;border-radius:8px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <div class="note-info">
        <div class="note-title">${esc(n.title)}</div>
        <div class="note-sub">${esc(n.subject)} · ${esc(n.author)}</div>
        <div class="note-badges-row">
          ${validBadge(n)}
          <span class="badge">${n.pages} pp</span>
          <span class="badge">💬 ${n.comments.length}</span>
          <div class="stars">${'★'.repeat(n.rating)}${'☆'.repeat(5-n.rating)}</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:7px;flex-shrink:0">
        <span style="font-size:11px;color:var(--text3)">${n.saves} saves</span>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm" onclick="event.stopPropagation();openShare(${n.id})">Share</button>
          <button class="btn btn-sm ${SAVED.includes(n.id)?'btn-success':''}" id="sbtn-${n.id}"
            onclick="event.stopPropagation();toggleSave(${n.id})">${SAVED.includes(n.id)?'✓ Saved':'Save'}</button>
        </div>
      </div>
    </div>`).join('');
}
function renderRecent(){
  document.getElementById('recent-list').innerHTML=NOTES.slice(0,3).map(n=>`
    <div class="note-card" onclick="openViewer(${n.id})">
      <div class="note-info">
        <div class="note-title">${esc(n.title)}</div>
        <div class="note-sub">${esc(n.author)} · ${n.pages} pp</div>
        <div class="note-badges-row" style="margin-top:5px">${validBadge(n)}</div>
      </div>
      <button class="btn btn-sm" onclick="event.stopPropagation();dlNote(${n.id})">Download</button>
    </div>`).join('');
}

/* ════ DASHBOARD ═════════════════════════════════════════════════════════════ */
function renderDashboard(){
  document.getElementById('note-count').textContent=NOTES.length+' notes';
  document.getElementById('dash-tbody').innerHTML=NOTES.map((n,i)=>`
    <tr>
      <td style="color:var(--text3)">${i+1}</td>
      <td><div style="font-weight:600;font-size:12.5px">${esc(n.title)}</div><div style="font-size:11px;color:var(--text3);margin-top:1px">${esc(n.subject)}</div></td>
      <td style="color:var(--text2);font-size:12.5px">${esc(n.author)}</td>
      <td>${validBadge(n)}</td>
      <td><span class="badge">💬 ${n.comments.length}</span></td>
      <td><div class="actions-cell">
        <button class="btn btn-sm" onclick="openViewer(${n.id})">View</button>
        <button class="btn btn-sm" onclick="openShare(${n.id})">Share</button>
        <button class="btn btn-sm ${n.validated?'btn-warn':''}" onclick="${n.validated?`dashRemoveVal(${n.id})`:`dashReqVal(${n.id})`}">${n.validated?'✅ Unvalidate':'Validate'}</button>
        <button class="btn btn-sm" onclick="dlNote(${n.id})"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
        <button class="btn btn-sm btn-danger" onclick="deleteNote(${n.id},this)"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg></button>
      </div></td>
    </tr>`).join('');
}

/* ════ NOTE VIEWER ═══════════════════════════════════════════════════════════ */
function openViewer(id){
  const n=NOTES.find(x=>x.id===id); if(!n) return;
  curNote=n;
  document.getElementById('v-title').textContent=n.title;
  document.getElementById('v-author').textContent=n.author;
  document.getElementById('v-pages').textContent=n.pages;
  document.getElementById('v-saves').textContent=n.saves;
  document.getElementById('v-doc').textContent=CONTENT[id]||'Content not available.';
  document.getElementById('v-hdr-badge').innerHTML=validBadge(n);
  renderValidPanel(n);
  renderComments(n);
  document.getElementById('cmt-input').value='';
  // Validate button
  const vb=document.getElementById('v-val-btn');
  if(n.validated){
    vb.className='btn btn-warn';
    vb.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg> Remove Validation';
  } else {
    vb.className='btn';
    vb.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Request Validation';
  }
  document.getElementById('viewerModal').classList.remove('hidden');
}

/* ── Validation Panel ─────────────────────────────────────────────────────── */
function renderValidPanel(n){
  const el=document.getElementById('v-valid-panel');
  if(n.validated){
    el.innerHTML=`
      <div class="valid-panel ok fade-up" style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="valid-icon ok-bg">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--valid-tx)" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <div style="font-weight:700;color:var(--valid-tx);font-size:13px">✅ Validated by ${esc(n.validatedBy)}</div>
            <div style="color:var(--text3);font-size:11.5px;margin-top:2px">Approved on ${n.validatedAt} · This note meets academic standards</div>
          </div>
        </div>
        <button class="btn btn-sm btn-warn" onclick="reqRemoveVal()">Remove</button>
      </div>`;
  } else {
    el.innerHTML=`
      <div class="valid-panel pend fade-up" style="margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="valid-icon pend-bg">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--pend-tx)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <div style="font-weight:700;color:var(--pend-tx);font-size:13px">⏳ Pending Validation</div>
            <div style="color:var(--text3);font-size:11.5px;margin-top:2px">Not yet reviewed by a professor</div>
          </div>
        </div>
        <button class="btn btn-sm" onclick="handleValidate()">Request Now</button>
      </div>`;
  }
}

/* ── Comments ──────────────────────────────────────────────────────────────── */
function renderComments(n){
  const list=document.getElementById('cmt-list');
  const badge=document.getElementById('cmt-badge');
  const cmts=n.comments||[];
  badge.textContent=cmts.length;
  if(!cmts.length){ list.innerHTML='<div class="no-cmt">No comments yet. Start the discussion! 💬</div>'; return; }
  list.innerHTML=cmts.map(c=>cmtHTML(c)).join('');
}
function cmtHTML(c){
  return `<div class="cmt-item fade-up" id="cmt-${c.id}">
    <div class="cmt-row1">
      <div class="cmt-user-wrap">
        <div class="cmt-avatar">${c.user.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)}</div>
        <span class="cmt-user">${esc(c.user)}</span>
      </div>
      <span class="cmt-ts">${c.ts}</span>
    </div>
    <div class="cmt-text">${esc(c.text)}</div>
    <div class="cmt-actions">
      <button class="like-btn ${c.liked?'liked':''}" id="lb-${c.id}" onclick="likeComment(${c.id})">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
        <span id="lc-${c.id}">${c.likes}</span>
      </button>
      <button class="del-cmt" onclick="delComment(${c.id})">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg> Delete
      </button>
    </div>
  </div>`;
}
function postComment(){
  if(!curNote) return;
  const inp=document.getElementById('cmt-input');
  const text=inp.value.trim();
  if(!text){ toast('Comment cannot be empty','danger'); return; }
  const now=new Date();
  const ts=now.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  const c={id:++nextCmtId,user:'Mhike A.',text,ts,likes:0,liked:false};
  curNote.comments.push(c);
  const list=document.getElementById('cmt-list');
  const noEl=list.querySelector('.no-cmt');
  if(noEl) noEl.remove();
  const div=document.createElement('div');
  div.innerHTML=cmtHTML(c);
  list.appendChild(div.firstElementChild);
  document.getElementById('cmt-badge').textContent=curNote.comments.length;
  inp.value=''; inp.style.height='';
  refreshStats(); renderDashboard();
  toast('Comment posted!','success');
}
function likeComment(cid){
  if(!curNote) return;
  const c=curNote.comments.find(x=>x.id===cid); if(!c) return;
  if(c.liked){ c.likes--; c.liked=false; }
  else { c.likes++; c.liked=true; }
  const lc=document.getElementById('lc-'+cid);
  const lb=document.getElementById('lb-'+cid);
  if(lc) lc.textContent=c.likes;
  if(lb) lb.classList.toggle('liked',c.liked);
}
function delComment(cid){
  if(!curNote) return;
  curNote.comments=curNote.comments.filter(x=>x.id!==cid);
  const el=document.getElementById('cmt-'+cid);
  if(el){ el.style.opacity='0'; el.style.transform='translateX(10px)'; el.style.transition='all .2s'; setTimeout(()=>el.remove(),200); }
  document.getElementById('cmt-badge').textContent=curNote.comments.length;
  refreshStats(); renderDashboard();
  toast('Comment deleted','info');
}

/* ── Validation ────────────────────────────────────────────────────────────── */
function handleValidate(){
  if(!curNote) return;
  if(curNote.validated){ reqRemoveVal(); } else { document.getElementById('validateModal').classList.remove('hidden'); }
}
function confirmValidation(){
  const prof=document.getElementById('profSelect').value;
  const date=document.getElementById('valDate').value;
  if(!prof){ toast('Please select a professor','danger'); return; }
  if(!curNote) return;
  curNote.validated=true; curNote.validatedBy=prof; curNote.validatedAt=date||new Date().toISOString().split('T')[0];
  closeModal('validateModal');
  // update viewer
  document.getElementById('v-hdr-badge').innerHTML=validBadge(curNote);
  renderValidPanel(curNote);
  const vb=document.getElementById('v-val-btn');
  vb.className='btn btn-warn';
  vb.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg> Remove Validation';
  refreshStats(); renderNotesList(); renderDashboard();
  toast('Note validated by '+prof+' ✅','success');
}
function reqRemoveVal(){
  if(!curNote||!curNote.validated) return;
  if(!confirm('Remove validation from this note?')) return;
  curNote.validated=false; curNote.validatedBy=null; curNote.validatedAt=null;
  document.getElementById('v-hdr-badge').innerHTML=validBadge(curNote);
  renderValidPanel(curNote);
  const vb=document.getElementById('v-val-btn');
  vb.className='btn';
  vb.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Request Validation';
  refreshStats(); renderNotesList(); renderDashboard();
  toast('Validation removed','info');
}
function dashReqVal(id){
  const n=NOTES.find(x=>x.id===id); if(!n) return;
  curNote=n; document.getElementById('validateModal').classList.remove('hidden');
}
function dashRemoveVal(id){
  const n=NOTES.find(x=>x.id===id); if(!n||!n.validated) return;
  if(!confirm('Remove validation from "'+n.title+'"?')) return;
  n.validated=false; n.validatedBy=null; n.validatedAt=null;
  refreshStats(); renderDashboard(); renderNotesList();
  toast('Validation removed','info');
}

/* ════ SAVE / DOWNLOAD / DELETE / SHARE ══════════════════════════════════════ */
function saveNote(){
  if(!curNote) return;
  if(!SAVED.includes(curNote.id)){
    SAVED.push(curNote.id); curNote.saves++;
    const btn=document.getElementById('sbtn-'+curNote.id);
    if(btn){btn.textContent='✓ Saved';btn.classList.add('btn-success');}
    document.getElementById('v-saves').textContent=curNote.saves;
    refreshStats();
    toast('Note saved to your collection! 📌','success');
  } else { toast('Already in your saved notes','info'); }
}
function toggleSave(id){
  if(SAVED.includes(id)){
    SAVED=SAVED.filter(x=>x!==id);
    const n=NOTES.find(x=>x.id===id); if(n) n.saves=Math.max(0,n.saves-1);
    const btn=document.getElementById('sbtn-'+id);
    if(btn){btn.textContent='Save';btn.classList.remove('btn-success');}
    toast('Removed from saved notes','info');
  } else {
    SAVED.push(id);
    const n=NOTES.find(x=>x.id===id); if(n) n.saves++;
    const btn=document.getElementById('sbtn-'+id);
    if(btn){btn.textContent='✓ Saved';btn.classList.add('btn-success');}
    toast('Note saved! 📌','success');
  }
  refreshStats();
}
function downloadNote(){ if(curNote) dlNote(curNote.id); }
function dlNote(id){
  const n=NOTES.find(x=>x.id===id); if(!n) return;
  const text=CONTENT[id]||n.title;
  const blob=new Blob([text],{type:'text/plain'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=n.title.replace(/\s+/g,'-')+'.txt';
  a.click(); URL.revokeObjectURL(a.href);
  toast('Download started: '+n.title,'success');
}
function deleteNote(id,btn){
  if(!confirm('Remove "'+NOTES.find(n=>n.id===id)?.title+'" from your list?')) return;
  const row=btn.closest('tr');
  row.style.opacity='0'; row.style.transition='opacity .25s';
  setTimeout(()=>{
    NOTES=NOTES.filter(n=>n.id!==id);
    SAVED=SAVED.filter(x=>x!==id);
    row.remove();
    document.getElementById('note-count').textContent=NOTES.length+' notes';
    refreshStats(); renderNotesList();
    toast('Note deleted','danger');
  },260);
}
function openShare(id){
  const n=NOTES.find(x=>x.id===id)||curNote; if(!n) return;
  document.getElementById('share-title').textContent=n.title;
  document.getElementById('share-link').value='https://augustinnotes.adnu.edu.ph/note/'+encodeURIComponent(n.title.toLowerCase().replace(/\s+/g,'-'));
  sharedCt++; refreshStats();
  document.getElementById('shareModal').classList.remove('hidden');
}
function copyLink(){
  const v=document.getElementById('share-link').value;
  navigator.clipboard.writeText(v).catch(()=>{document.getElementById('share-link').select();document.execCommand('copy');});
  toast('Link copied to clipboard!','success');
}
function shareProfile(){
  navigator.clipboard.writeText('https://augustinnotes.adnu.edu.ph/profile/mhike-gacusan')
    .catch(()=>{}).finally(()=>toast('Profile link copied!','success'));
}

/* ════ UPLOAD ════════════════════════════════════════════════════════════════ */
function fileSelected(inp){
  const f=inp.files[0]; if(!f) return;
  if(f.size>200*1024*1024){ toast('File too large! Max 200 MB','danger'); return; }
  upFile={name:f.name.replace(/\.[^.]+$/,''),content:''};
  document.getElementById('up-fname').textContent='📎 '+f.name+' ('+(f.size/1048576).toFixed(1)+' MB)';
  if(!document.getElementById('noteTitle').value) document.getElementById('noteTitle').value=upFile.name;
  if(f.type==='text/plain'||f.name.endsWith('.txt')){
    const r=new FileReader(); r.onload=e=>{upFile.content=e.target.result;}; r.readAsText(f);
  }
}
function handleDrop(e){
  e.preventDefault(); document.getElementById('dropZone').classList.remove('over');
  const f=e.dataTransfer.files[0]; if(!f) return;
  if(f.size>200*1024*1024){ toast('File too large! Max 200 MB','danger'); return; }
  upFile={name:f.name.replace(/\.[^.]+$/,''),content:''};
  document.getElementById('up-fname').textContent='📎 '+f.name+' ('+(f.size/1048576).toFixed(1)+' MB)';
  document.getElementById('noteTitle').value=upFile.name;
}
function startUpload(){
  const title=document.getElementById('noteTitle').value.trim();
  if(!title){ toast('Please enter a note title','danger'); return; }
  const btn=document.getElementById('upBtn');
  const wrap=document.getElementById('prog-wrap');
  const fill=document.getElementById('prog-fill');
  btn.disabled=true;
  btn.innerHTML='<span class="spinner"></span> Uploading…';
  wrap.style.display='block';
  let p=0;
  const iv=setInterval(()=>{
    p+=Math.random()*18+4;
    if(p>=100){ p=100; clearInterval(iv); finishUpload(title,btn,wrap,fill); }
    fill.style.width=p+'%';
  },80);
}
function finishUpload(title,btn,wrap,fill){
  const subj=document.getElementById('noteSubject').value||'General';
  const newNote={
    id:Date.now(),title,subject:subj,
    author:'Mhike Aleen A. Gacusan',
    pages:Math.floor(Math.random()*10)+2,
    rating:5,saves:0,saved:true,fav:false,
    validated:false,validatedBy:null,validatedAt:null,
    comments:[]
  };
  NOTES.push(newNote); SAVED.push(newNote.id);
  btn.disabled=false;
  btn.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg> UPLOAD FILE';
  wrap.style.display='none'; fill.style.width='0%';
  document.getElementById('noteTitle').value='';
  document.getElementById('noteSubject').value='';
  document.getElementById('up-fname').textContent='';
  document.getElementById('fileInput').value='';
  upFile=null;
  CONTENT[newNote.id]=`${title}\n\nPublished by: Mhike Aleen A. Gacusan\nSubject: ${subj}\n⏳ Pending professor validation\n\n[Full content available after processing]`;
  refreshStats(); renderDashboard(); renderNotesList();
  toast('"'+title+'" uploaded successfully! 🎉','success');
  setTimeout(()=>go('dashboard'),700);
}

/* ════ SEARCH ════════════════════════════════════════════════════════════════ */
function onSearch(){
  if(curPage==='home') renderNotesList();
  if(curPage==='dashboard'){
    const q=document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('#dash-tbody tr').forEach(r=>{ r.style.display=r.textContent.toLowerCase().includes(q)?'':'none'; });
  }
}

/* ════ PROFILE ═══════════════════════════════════════════════════════════════ */
function openEditModal(){ document.getElementById('editModal').classList.remove('hidden'); }
function saveProfile(){
  const name=document.getElementById('e-name').value.trim();
  if(!name){ toast('Name cannot be empty','danger'); return; }
  document.getElementById('profName').textContent=name;
  const ini=name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
  document.getElementById('profAvatar').textContent=ini;
  document.getElementById('avtr').textContent=ini;
  closeModal('editModal');
  toast('Profile updated!','success');
}

/* ════ SETTINGS ══════════════════════════════════════════════════════════════ */
function setToggle(el,label){ toast(label+' '+(el.checked?'enabled':'disabled'),'info'); }
function exportData(){
  const data={notes:NOTES,saved:SAVED,exported:new Date().toISOString()};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='AugustinNOTES-export.json'; a.click(); URL.revokeObjectURL(a.href);
  toast('Data exported successfully!','success');
}

/* ════ AI STUDY ══════════════════════════════════════════════════════════════ */
let studyNoteId   = null;
let studyCards    = [];
let studyCurIdx   = 0;
let studyKnown    = new Set();
let studyUnknown  = new Set();

function study_refreshNoteSelector(){
  const sel = document.getElementById('study-note-select');
  const prev = sel.value;
  sel.innerHTML = '<option value="">Choose a note / module…</option>';
  NOTES.forEach(n=>{
    sel.innerHTML += `<option value="${n.id}">${esc(n.title)} — ${esc(n.subject)}</option>`;
  });
  if(prev) sel.value = prev;
}

function onStudyNoteSelect(){
  const id = parseInt(document.getElementById('study-note-select').value);
  if(!id){
    studyNoteId = null;
    document.getElementById('study-selected-info').style.display = 'none';
    setStudyBtns(true); return;
  }
  studyNoteId = id;
  const n = NOTES.find(x=>x.id===id); if(!n) return;
  document.getElementById('study-sel-title').textContent = n.title;
  document.getElementById('study-sel-meta').textContent  =
    `${n.subject} · ${n.author} · ${n.pages} pages · ${n.validated?'✅ Validated':'⏳ Pending Validation'}`;
  document.getElementById('study-selected-info').style.display = 'block';
  setStudyBtns(false);
  clearStudy();
}

function setStudyBtns(disabled){
  document.getElementById('btn-gen-reviewer').disabled = disabled;
  document.getElementById('btn-gen-quizlet').disabled  = disabled;
}

function clearStudy(){
  document.getElementById('study-results').style.display = 'none';
  document.getElementById('study-empty').style.display   = 'flex';
  studyCards = []; studyCurIdx = 0;
  studyKnown.clear(); studyUnknown.clear();
  switchStudyTab('reviewer');
}

function switchStudyTab(tab){
  ['reviewer','quizlet','study'].forEach(t=>{
    document.getElementById('stab-'+t).classList.toggle('active', t===tab);
  });
  document.getElementById('reviewer-shell').classList.toggle('active', tab==='reviewer');
  document.getElementById('quizlet-shell').classList.toggle('active',  tab==='quizlet');
  document.getElementById('study-shell').classList.toggle('active',    tab==='study');
}

function showAILoading(show){
  document.getElementById('ai-loading').classList.toggle('active', show);
  if(show){
    document.getElementById('study-results').style.display = 'none';
    document.getElementById('study-empty').style.display   = 'none';
    setStudyBtns(true);
  } else {
    setStudyBtns(studyNoteId===null);
  }
}

async function generateReviewer(){
  if(!studyNoteId){ toast('Please select a module first','danger'); return; }
  const content = CONTENT[studyNoteId] || 'No content available.';
  showAILoading(true);
  try{
    const resp = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        system:`You are an academic study assistant. Given lecture note content, return ONLY valid JSON with no markdown fences in this exact structure:
{"summary":"2-3 sentence overview","definitions":[{"term":"...","meaning":"..."}],"highlights":["..."],"exam_tips":["..."]}
Include 4-8 definitions, 4-6 highlights, 3-5 exam_tips. Be concise and student-friendly.`,
        messages:[{role:'user',content:`Generate a study reviewer for this module:\n\n${content}`}]
      })
    });
    const data = await resp.json();
    const raw  = (data.content||[]).map(i=>i.text||'').join('');
    const parsed = JSON.parse(raw.replace(/```json|```/g,'').trim());
    showAILoading(false);
    renderReviewer(parsed);
    document.getElementById('study-results').style.display = 'block';
    document.getElementById('study-empty').style.display   = 'none';
    switchStudyTab('reviewer');
    toast('Reviewer generated! 📋','success');
  } catch(e){
    showAILoading(false);
    document.getElementById('study-empty').style.display = 'flex';
    toast('AI generation failed — please try again','danger');
  }
}

function renderReviewer(data){
  let html='';
  if(data.summary){
    html+=`<div class="reviewer-section">
      <div class="reviewer-section-title"><span></span>Module Summary</div>
      <div class="summary-block">${esc(data.summary)}</div>
    </div>`;
  }
  if(data.definitions&&data.definitions.length){
    html+=`<div class="reviewer-section">
      <div class="reviewer-section-title"><span></span>Key Terms &amp; Definitions</div>
      ${data.definitions.map(d=>`
        <div class="def-item">
          <div class="def-term">${esc(d.term)}</div>
          <div class="def-meaning">${esc(d.meaning)}</div>
        </div>`).join('')}
    </div>`;
  }
  if(data.highlights&&data.highlights.length){
    html+=`<div class="reviewer-section">
      <div class="reviewer-section-title"><span></span>Important Highlights</div>
      ${data.highlights.map((h,i)=>`
        <div class="highlight-item">
          <div class="highlight-num">${i+1}</div>
          <div class="highlight-text">${esc(h)}</div>
        </div>`).join('')}
    </div>`;
  }
  if(data.exam_tips&&data.exam_tips.length){
    html+=`<div class="reviewer-section">
      <div class="reviewer-section-title"><span></span>Exam Tips</div>
      ${data.exam_tips.map(t=>`
        <div class="highlight-item">
          <div class="highlight-num">💡</div>
          <div class="highlight-text">${esc(t)}</div>
        </div>`).join('')}
    </div>`;
  }
  document.getElementById('reviewer-content').innerHTML = html;
}

async function generateQuizlet(){
  if(!studyNoteId){ toast('Please select a module first','danger'); return; }
  const content = CONTENT[studyNoteId] || 'No content available.';
  showAILoading(true);
  try{
    const resp = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        system:`You are an academic study assistant. Given lecture note content, return ONLY a valid JSON array with no markdown fences:
[{"q":"question text","a":"answer text"}]
Generate 8-12 flashcard pairs that test key concepts, definitions, and important details. Keep answers concise.`,
        messages:[{role:'user',content:`Generate flashcards for this module:\n\n${content}`}]
      })
    });
    const data = await resp.json();
    const raw  = (data.content||[]).map(i=>i.text||'').join('');
    const cards = JSON.parse(raw.replace(/```json|```/g,'').trim());
    studyCards  = cards;
    studyCurIdx = 0;
    studyKnown.clear(); studyUnknown.clear();
    showAILoading(false);
    renderQuizlet(cards);
    loadStudyCard();
    document.getElementById('study-results').style.display = 'block';
    document.getElementById('study-empty').style.display   = 'none';
    switchStudyTab('quizlet');
    toast('Quizlet generated! 🃏','success');
  } catch(e){
    showAILoading(false);
    document.getElementById('study-empty').style.display = 'flex';
    toast('AI generation failed — please try again','danger');
  }
}

function renderQuizlet(cards){
  document.getElementById('qz-count').textContent     = cards.length+' flashcards';
  document.getElementById('qz-progress').textContent  = 'Click any card to reveal the answer';
  document.getElementById('cards-grid').innerHTML = cards.map((c,i)=>`
    <div class="flashcard fade-up" id="qcard-${i}" onclick="flipCard(this)">
      <div class="flashcard-inner">
        <div class="flashcard-front">
          <div class="fc-label">Question ${i+1}</div>
          <div class="fc-question">${esc(c.q)}</div>
          <div class="fc-hint">tap to flip</div>
        </div>
        <div class="flashcard-back">
          <div class="fc-label">Answer</div>
          <div class="fc-answer">${esc(c.a)}</div>
          <div class="fc-hint">tap to flip</div>
        </div>
      </div>
    </div>`).join('');
}

function flipCard(el){ el.classList.toggle('flipped'); }

function flipAllCards(){
  const cards=[...document.querySelectorAll('#cards-grid .flashcard')];
  const anyFlipped=cards.some(c=>c.classList.contains('flipped'));
  cards.forEach(c=>c.classList.toggle('flipped',!anyFlipped));
}

function shuffleCards(){
  for(let i=studyCards.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [studyCards[i],studyCards[j]]=[studyCards[j],studyCards[i]];
  }
  renderQuizlet(studyCards); loadStudyCard();
  toast('Cards shuffled!','info');
}

/* Study Mode ─────────────────────────────────────────────────── */
function loadStudyCard(){
  if(!studyCards.length) return;
  const c=studyCards[studyCurIdx];
  document.getElementById('study-q-text').textContent  = c.q;
  document.getElementById('study-a-text').textContent  = c.a;
  document.getElementById('study-counter').textContent = `${studyCurIdx+1} / ${studyCards.length}`;
  document.getElementById('study-big-card').classList.remove('flipped');
  updateStudyScore();
}

function flipStudyCard(){
  document.getElementById('study-big-card').classList.toggle('flipped');
}

function studyNext(){
  if(studyCurIdx<studyCards.length-1){ studyCurIdx++; loadStudyCard(); }
  else toast('You reached the last card! 🎉','info');
}

function studyPrev(){
  if(studyCurIdx>0){ studyCurIdx--; loadStudyCard(); }
}

function markKnown(){
  studyKnown.add(studyCurIdx); studyUnknown.delete(studyCurIdx);
  updateStudyScore();
  if(studyCurIdx<studyCards.length-1){ studyCurIdx++; loadStudyCard(); }
  else toast('All cards reviewed! 🎓','success');
}

function markUnknown(){
  studyUnknown.add(studyCurIdx); studyKnown.delete(studyCurIdx);
  updateStudyScore();
  if(studyCurIdx<studyCards.length-1){ studyCurIdx++; loadStudyCard(); }
}

function updateStudyScore(){
  const line=document.getElementById('study-score-line');
  const tot=studyKnown.size+studyUnknown.size;
  line.textContent=tot>0?`✓ ${studyKnown.size} known · ↺ ${studyUnknown.size} to review`:'';
}

/* ════ MODALS ════════════════════════════════════════════════════════════════ */
function closeModal(id){ document.getElementById(id).classList.add('hidden'); }
document.addEventListener('click',e=>{
  ['viewerModal','validateModal','editModal','shareModal'].forEach(id=>{
    if(e.target===document.getElementById(id)) closeModal(id);
  });
});
window.addEventListener('keydown',e=>{
  if(e.key==='Escape') ['viewerModal','validateModal','editModal','shareModal'].forEach(closeModal);
});

/* ════ TOAST ═════════════════════════════════════════════════════════════════ */
let _tt;
function toast(msg,type='info'){
  const t=document.getElementById('toast');
  const ic={success:'✓',danger:'✕',info:'ℹ'};
  const cl={success:'var(--success)',danger:'var(--danger)',info:'var(--text3)'};
  t.innerHTML=`<span style="color:${cl[type]||cl.info};font-weight:700">${ic[type]}</span> ${msg}`;
  t.classList.add('show');
  clearTimeout(_tt); _tt=setTimeout(()=>t.classList.remove('show'),2800);
}
</script>
