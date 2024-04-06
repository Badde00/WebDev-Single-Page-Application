(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();class l extends HTMLElement{static windowCount=0;static windowOffset=20;constructor(e,t){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`
    <link rel="stylesheet" href="../../css/window.css">
    `;const s=document.createElement("div");s.id="window";const n=document.createElement("div");n.id="window-topbar",n.style.color="black",n.style.userSelect="none";const i=document.createElement("div");i.id="window-title";const a=document.createElement("button");a.id="window-close-button",a.textContent="X",a.style.float="right",a.style.marginBottom="1px";const r=document.createElement("div");r.id="window-content",n.appendChild(i),n.appendChild(a),s.appendChild(n),s.appendChild(r),this.shadowRoot.appendChild(s),this.topbar=n,this.windowTitle=i,this.closeButton=a,this.contentArea=r,l.windowCount++,this.style.left=`${100+l.windowOffset*l.windowCount}px`,this.style.top=`${0+l.windowOffset*l.windowCount}px`,this.style.position="absolute",console.log("dispatchingListener"),this.addEventListener("themeChange",c=>{this.setWindowTheme(c.detail.theme)}),this.initializeDragAndDrop(),this.initializeFocus(),this.initializeClose()}setWindowTheme(e){console.log("DW new theme: ",e);const t=this.shadowRoot.getElementById("window");e==="dark"?t.style.backgroundColor="#333":t.style.backgroundColor="#fff"}adjustWindowPosition(e,t){const s=window.innerWidth-5-e,n=window.innerHeight-42-t;let i=(100+l.windowOffset*l.windowCount)%s,a=(0+l.windowOffset*l.windowCount)%n;i+e>window.innerWidth&&(i=0),a+t>window.innerHeight&&(a=0),this.style.left=`${i}px`,this.style.top=`${a}px`}setWidthHeight(e,t){this.style.width=`${e}px`,this.style.height=`${t}px`,this.adjustWindowPosition(e,t)}initializeDragAndDrop(){let e=!1,t=50+l.windowOffset*l.windowCount,s=50+l.windowOffset*l.windowCount;const n=r=>{e=!0,t=r.clientX-this.offsetLeft,s=r.clientY-this.offsetTop,this.style.zIndex=u()+10},i=r=>{if(!e)return;let c=r.clientX-t,h=r.clientY-s;const E=window.innerWidth-5-this.offsetWidth,v=window.innerHeight-42-this.offsetHeight;c=Math.max(Math.min(c,E),0),h=Math.max(Math.min(h,v),0),this.style.left=`${c}px`,this.style.top=`${h}px`},a=()=>{e=!1};this.topbar.addEventListener("mousedown",n),document.addEventListener("mousemove",i),document.addEventListener("mouseup",a)}initializeFocus(){this.addEventListener("click",()=>{const t=u()+1;this.style.zIndex=t,k(t)})}initializeClose(){this.closeButton.addEventListener("click",()=>{this.remove()})}setTitle(e){this.windowTitle.innerText=e}setContent(e){e instanceof HTMLElement?(this.contentArea.innerHTML="",this.contentArea.appendChild(e)):this.contentArea.textContent=e}}window.customElements.define("desktop-window",l);class m extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.createUI()}createUI(){const e=document.createElement("form");e.style.padding="10px",e.style.display="flex",e.style.flexDirection="column",e.style.gap="10px";const t=document.createElement("select"),s=document.createElement("input"),n=document.createElement("input"),i=document.createElement("div"),a=document.createElement("button");a.disabled=!0,t.innerHTML=`
      <option value="" selected="true" disabled="disabled">Select a shape</option>
      <option value="rectangle">Rectangle</option>
      <option value="triangle">Triangle</option>
      <option value="circle">Circle</option>
      <option value="rhombus">Rhombus</option>
    `,t.addEventListener("change",()=>{this.updateInputFields(t.value),a.disabled=!1}),s.type="number",s.style.display="none",n.type="number",n.style.display="none",this.inputA=s,this.inputB=n,this.resultDiv=i,a.textContent="Calculate Area",a.type="button",a.addEventListener("click",()=>{this.calculateArea(t.value)}),e.appendChild(t),e.appendChild(s),e.appendChild(n),e.appendChild(a),e.appendChild(i),this.shadowRoot.appendChild(e)}calculateArea(e){let t=0;const s=parseFloat(this.inputA.value),n=parseFloat(this.inputB.value);if(isNaN(s)||isNaN(n)||s<=0||n<=0){this.resultDiv.textContent="Invalid input";return}switch(e){case"rectangle":t=s*n;break;case"triangle":t=.5*s*n;break;case"circle":t=Math.PI*s*s;break;case"rhombus":t=s*n/2;break;default:this.resultDiv.textContent="Invalid shape";return}this.resultDiv.textContent=`The area of the ${e} is ${t.toFixed(2)} unit²`}updateInputFields(e){switch(this.inputA.value="",this.inputB.value="",this.inputA.style.display="none",this.inputB.style.display="none",e){case"rectangle":this.inputA.style.display="block",this.inputB.style.display="block",this.inputA.placeholder="Length",this.inputB.placeholder="Width";break;case"triangle":this.inputA.style.display="block",this.inputB.style.display="block",this.inputA.placeholder="Base",this.inputB.placeholder="Height";break;case"circle":this.inputA.style.display="block",this.inputA.placeholder="Radius",this.inputB.value="1";break;case"rhombus":this.inputA.style.display="block",this.inputB.style.display="block",this.inputA.placeholder="Diagonal 1",this.inputB.placeholder="Diagonal 2";break}}}customElements.define("area-calculator",m);class g extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.cardsArray=this.generateCards(),this.flippedCards=[],this.matches=0,this.gameStarted=!1,this.createUI()}startTimer(){this.startTime=Date.now(),this.timerInterval=setInterval(()=>this.updateTimer(),1e3)}updateTimer(){const e=Date.now(),t=Math.round((e-this.startTime)/1e3),s=Math.floor(t/60),n=t%60,i=this.shadowRoot.getElementById("timer");i.textContent=`${s}:${n<10?"0":""}${n}`}stopTimer(){clearInterval(this.timerInterval);const e=Math.round((Date.now()-this.startTime)/1e3);this.checkHighScore(e)}checkHighScore(e){const t=JSON.parse(localStorage.getItem("memoryGameHighScores"))||[];t.push({score:e,date:new Date().toLocaleString()}),t.sort((s,n)=>s.score-n.score),t.splice(10),localStorage.setItem("memoryGameHighScores",JSON.stringify(t)),C()}generateCards(){const e=["🍕","🍔","🍟","🌭","🍿","🍦","🍩","🍪"];return[...e,...e].sort(()=>Math.random()-.5)}handleKeyDown(e,t,s,n){let a=t;switch(e.key){case"ArrowRight":a=(t+1)%this.cardsArray.length;break;case"ArrowLeft":a=(t-1+this.cardsArray.length)%this.cardsArray.length;break;case"ArrowUp":a=(t-4+this.cardsArray.length)%this.cardsArray.length;break;case"ArrowDown":a=(t+4)%this.cardsArray.length;break;case"Enter":case" ":this.flipCard(s,n);return}this.shadowRoot.querySelectorAll(".card")[a].focus()}createUI(){const e=document.createElement("div");e.id="timer",e.style.display="flex",e.style.justifyContent="center",e.style.padding="10px 10px 0 10px",e.style.color="black",e.textContent="0:00",e.style.userSelect="none";const t=document.createElement("div");t.style.display="grid",t.style.gridTemplateColumns="repeat(4, 1fr)",t.style.gap="10px",t.style.margin="10px",this.cardsArray.forEach((s,n)=>{const i=document.createElement("div");i.setAttribute("class","card"),i.dataset.symbol=s,i.style.userSelect="none",i.style.border="1px solid #ccc",i.style.borderRadius="2px",i.style.display="flex",i.style.alignItems="center",i.style.justifyContent="center",i.style.aspectRatio="1/0.8",i.style.fontSize="2rem",i.style.backgroundColor="#f3f3f3",i.style.cursor="pointer",i.setAttribute("tabindex",0),i.addEventListener("click",()=>this.flipCard(i,s)),i.addEventListener("keydown",a=>{this.handleKeyDown(a,n,i,s)}),t.appendChild(i)}),this.shadowRoot.appendChild(e),this.shadowRoot.appendChild(t)}flipCard(e,t){if(this.gameStarted||(this.gameStarted=!0,this.startTimer()),console.log("pre-flip",e),e.classList.contains("flipped")||this.flippedCards.includes(e)){console.log(e.classList.contains("flipped"));return}this.flippedCards.length<2&&!e.classList.contains("flipped")&&(e.textContent=t,e.classList.add("flipped"),this.flippedCards.push(e),this.flippedCards.length===2&&this.checkForMatch())}checkForMatch(){const[e,t]=this.flippedCards;e.dataset.symbol===t.dataset.symbol?(this.matches+=1,this.flippedCards=[],this.matches===this.cardsArray.length/2&&(this.stopTimer(),alert("You won!"))):setTimeout(()=>{this.flippedCards.forEach(s=>{s.textContent="",s.classList.remove("flipped")}),this.flippedCards=[]},1e3)}}customElements.define("memory-game",g);class y extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.apiKey="eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd",this.serverUrl="wss://courselab.lnu.se/message-app/socket",this.username="temp",this.username=this.getUsername(),this.initializeWebSocket(),this.createUI()}getUsername(){let e=localStorage.getItem("username");return e||(e=prompt("Enter your username"),localStorage.setItem("username",e)),e}initializeWebSocket(){this.socket=new WebSocket(this.serverUrl),this.socket.addEventListener("open",e=>console.log("Connected! Event:",e)),this.socket.addEventListener("message",e=>{const t=JSON.parse(e.data);t.type!=="heartbeat"&&this.displayMessage(t)}),this.socket.addEventListener("error",e=>{console.log("Error",e)})}createUI(){const e=document.createElement("div");e.style.display="flex",e.style.flexDirection="column",e.style.height="90%",e.style.maxHeight="400px",e.style.width="95%",e.style.padding="10px",this.chatContainer=e;const t=document.createElement("ul");t.id="messageList",t.style.flexGrow=".85",t.style.overflowY="auto",t.style.listStyle="none",t.style.paddingLeft="10px";const s=document.createElement("div");s.style.display="flex",s.style.marginTop="auto",s.style.flexShrink="0",this.inputContainer=s;const n=document.createElement("textarea");n.id="messageInput",n.placeholder="Write a message...",n.style.width="70%",n.style.height="85%",n.style.marginLeft="5px",n.style.resize="none",this.messageInput=n;const i=document.createElement("button");i.textContent="Send",i.addEventListener("click",()=>this.sendMessage()),this.addEventListener("keypress",r=>{r.key==="Enter"&&r.ctrlKey&&this.sendMessage()}),i.style.width="20%",i.style.height="100%",i.style.marginLeft="5px",i.style.marginTop="1px",i.style.padding="2px",this.sendButton=i;const a=document.createElement("button");a.textContent="Toggle Theme",a.addEventListener("click",()=>{const c=localStorage.getItem("theme")==="light"?"dark":"light";localStorage.setItem("theme",c),this.setTheme(c)}),s.appendChild(n),s.appendChild(i),e.appendChild(a),e.appendChild(t),e.appendChild(s),this.shadowRoot.appendChild(e)}setTheme(e){console.log("CA new theme: ",e),e==="light"?(this.chatContainer.style.color="black",this.messageInput.style.backgroundColor="white",this.messageInput.style.color="black",this.sendButton.style.backgroundColor="white",this.sendButton.style.color="black"):(this.chatContainer.style.color="white",this.messageInput.style.backgroundColor="#555",this.messageInput.style.color="white",this.sendButton.style.backgroundColor="#555",this.sendButton.style.color="white"),console.log("dispatching themeChange"),this.dispatchEvent(new CustomEvent("themeChange",{detail:{theme:e},bubbles:!0,composed:!0}))}sendMessage(){const e=this.shadowRoot.getElementById("messageInput"),t=e.value.trim();if(t){const s={type:"message",data:t,username:this.username,channel:this.channel,key:this.apiKey};this.socket.send(JSON.stringify(s)),e.value=""}}displayMessage(e){const t=this.shadowRoot.getElementById("messageList"),s=document.createElement("li");for(s.textContent=`${e.username}: ${e.data}`,t.appendChild(s);t.children.length>20;)t.removeChild(t.firstChild);t.scrollTop=t.scrollHeight}}customElements.define("chat-app",y);const p=[];let d=100;const x=900;function f(o){const e=new l;e.setTitle(o),e.style.zIndex=d+1,p.push(e);let t=null,s=localStorage.getItem("theme");switch(o){case"memoryGame":e.setWidthHeight(420,400),e.setContent(new g);break;case"chatApp":e.setWidthHeight(500,450),t=new y,e.setContent(t),s||(s="light"),localStorage.setItem("theme",s),t.setTheme(s);break;case"calculator":e.setWidthHeight(400,300),e.setContent(new m);break;default:console.log("error","Error: Program not found")}document.getElementById("programs").appendChild(e)}function u(){return d}function k(o){I(),o instanceof Number?d=o:d=parseInt(o)}function I(){d>x&&(p.forEach((o,e)=>{o.style.zIndex=100+e}),d=100+p.length)}const L=document.getElementById("main"),w=[{id:"memoryGame",iconPath:"img/memoryIcon.svg",label:"Memory Game"},{id:"chatApp",iconPath:"img/chatIcon.svg",label:"Chat App"},{id:"calculator",iconPath:"img/calculatorIcon.svg",label:"Area Calculator"}];function S(){B(),H(),z()}function A(){const o=document.getElementById("clock"),e=new Date;o.textContent=e.getHours()+":"+(e.getMinutes()<10?"0":"")+e.getMinutes()}function T(){const o=document.getElementById("date"),e=new Date;o.textContent=e.toISOString().slice(0,10)}function B(){const o=document.createElement("footer");o.setAttribute("id","taskbar"),o.style.zIndex=1e3;const e=document.createElement("div");e.setAttribute("id","logo"),e.innerHTML='<img src="../../img/winLogo.png" alt="logo" />';const t=document.createElement("div");t.setAttribute("id","clock");const s=new Date;t.textContent=s.getHours()+":"+(s.getMinutes()<10?"0":"")+s.getMinutes();const n=document.createElement("div");n.setAttribute("id","date"),n.textContent=s.toISOString().slice(0,10);const i=document.createElement("div");i.setAttribute("id","closeAllButton"),i.textContent="|",o.appendChild(e),o.appendChild(t),o.appendChild(i),o.appendChild(n),L.appendChild(o)}function M(){const o=document.createElement("div");o.classList.add("highScore"),o.style.padding="10px",o.style.margin="10px",o.style.border="2px solid #ccc",o.style.borderRadius="5px",o.style.backgroundColor="transparent",o.style.textAlign="center",o.style.width="25%",o.style.right="10px",o.style.top="10px",o.style.position="absolute";const e=document.createElement("h3");e.textContent="Top 10 Scores",e.style.margin="0 0 10px 0";const t=document.createElement("ol");return t.id="highScoreList",o.appendChild(e),o.appendChild(t),o}function C(){const o=JSON.parse(localStorage.getItem("memoryGameHighScores"))||[],e=document.getElementById("highScoreList");if(e.innerHTML="",o.length===0){const t=document.createElement("li");t.textContent="No scores yet",e.appendChild(t)}o.forEach(t=>{const s=document.createElement("li");s.textContent=`${t.score} seconds - ${t.date}`,e.appendChild(s)})}function D(o){const e=document.createElement("div");e.classList.add("program"),e.id=o.id,e.style.height="min-content",e.style.width="min-content";const t=document.createElement("div");t.classList.add("programIcon","desktopIcon"),b(o.iconPath).then(n=>{t.innerHTML=n;const i=t.querySelector("svg");i&&(i.setAttribute("width","100%"),i.setAttribute("height","100%"))});const s=document.createElement("figcaption");return s.textContent=o.label,s.style.userSelect="none",s.classList.add("programDesc"),e.appendChild(t),e.appendChild(s),e.addEventListener("click",n=>{n.stopPropagation(),document.querySelectorAll(".program").forEach(i=>{i.style.backgroundColor=""}),e.style.backgroundColor="rgb(0, 0, 255, 0.2)"}),e.addEventListener("dblclick",()=>{f(o.id)}),e}function H(){const o=document.querySelector(".desktop");w.forEach(e=>{o.appendChild(D(e))}),o.addEventListener("click",()=>{document.querySelectorAll(".program").forEach(e=>{e.style.backgroundColor=""})}),o.appendChild(M()),C()}function O(o){const e=document.createElement("div");e.classList.add("program"),e.id=o.id;const t=document.createElement("div");return t.classList.add("programIcon","taskbarIcon"),b(o.iconPath).then(s=>{t.innerHTML=s;const n=t.querySelector("svg");n&&(n.setAttribute("width","100%"),n.setAttribute("height","100%"))}),e.appendChild(t),t.addEventListener("click",()=>{f(o.id)}),t}function z(){const o=document.getElementById("taskbar");w.forEach(e=>{o.appendChild(O(e))})}async function b(o){try{return await(await fetch(o)).text()}catch(e){console.error("Error fetching SVG:",e)}}S();function R(){A(),T()}setInterval(R,1e4);
