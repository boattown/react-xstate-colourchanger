(this["webpackJsonpxstate-react-typescript-template"]=this["webpackJsonpxstate-react-typescript-template"]||[]).push([[0],{21:function(e,t,n){"use strict";n.r(t);var o=n(10),a=n(20),s=(n(25),n(7),n(18)),c=n(32),i=n(2),r=n(14),l=n(16);const u=["aqua","azure","beige","bisque","black","blue","brown","chocolate","coral","crimson","cyan","fuchsia","ghostwhite","gold","goldenrod","gray","green","indigo","ivory","khaki","lavender","lime","linen","magenta","maroon","moccasin","navy","olive","orange","orchid","peru","pink","plum","purple","red","salmon","sienna","silver","snow","tan","teal","thistle","tomato","turquoise","violet","white","yellow"],p="#JSGF V1.0; grammar colors; public <color> = "+u.join(" | ")+" ;",g=new webkitSpeechGrammarList;g.addFromString(p,1);const d=g,m=Object(c.a)({id:"machine",type:"parallel",states:{dm:{initial:"init",states:{init:{on:{CLICK:"askColour"}},askColour:{entry:Object(i.k)("LISTEN"),on:{ASR_onResult:"repaint"}},repaint:{entry:[Object(i.k)("SPEAK"),"repaint"],on:{CLICK:"askColour"}}}},asr:{initial:"idle",states:{idle:{on:{LISTEN:"recognising"}},recognising:{entry:"recStart",on:{ASR_onResult:{actions:[Object(i.b)({recResult:(e,t)=>t.recResult}),"recLogResult"],target:"nlu"}},exit:"recStop"},nlu:{invoke:{id:"getNLU",src:e=>k(e.recResult),onDone:{target:"idle",actions:[Object(i.b)({nluData:(e,t)=>t.data}),"logIntent"]},onError:{target:"idle",actions:["nluSaveResult"]}}}}},tts:{initial:"idle",states:{idle:{on:{SPEAK:"speaking"}},speaking:{entry:"speak",on:{TTS_onEnd:"idle"}}}}}},{actions:{recLogResult:e=>{console.log("<< ASR: "+e.recResult)},test:()=>{console.log("test")},logIntent:e=>{console.log("<< NLU intent: "+e.nluData.intent.name)}}});function b(e){return Object(o.jsx)("span",{style:{backgroundColor:e.name},children:" "+e.name})}function h(){const e=Object(l.useSpeechSynthesis)({onEnd:()=>{g("TTS_onEnd")}}).speak,t=Object(l.useSpeechRecognition)({onResult:e=>{g({type:"ASR_onResult",recResult:e})}}),n=t.listen,s=(t.listening,t.stop),c=Object(r.b)(m,{actions:{recStart:Object(r.a)((()=>{console.log("Ready to receive a color command."),n({interimResults:!1,continuous:!1,grammars:d})})),recStop:Object(r.a)((()=>{console.log("Recognition stopped."),s()})),repaint:Object(r.a)((e=>{console.log("Repainting..."),document.body.style.background=e.recResult})),speak:Object(r.a)((t=>{console.log("Speaking..."),e({text:"I heard "+t.recResult})}))}}),i=Object(a.a)(c,2),p=i[0],g=i[1],h=p.matches({asr:"recognising"});return Object(o.jsxs)("div",{className:"App",children:[Object(o.jsxs)("p",{children:["Tap / click then say a color to change the background color of the box.Try",u.map(((e,t)=>Object(o.jsx)(b,{name:e}))),"."]}),Object(o.jsx)("button",{type:"button",className:"glow-on-hover",onClick:()=>g("CLICK"),style:h?{animation:"glowing 20s linear"}:{},children:h?"Listening...":"Click to talk"})]})}const k=e=>fetch(new Request("https://cors-anywhere.herokuapp.com/https://rasa-nlu-api-00.herokuapp.com/model/parse",{method:"POST",headers:{Origin:"http://maraev.me"},body:'{"text": "'.concat(e,'"}')})).then((e=>e.json())),j=document.getElementById("root");s.render(Object(o.jsx)(h,{}),j)},25:function(e,t,n){}},[[21,1,2]]]);
//# sourceMappingURL=main.560791f0.chunk.js.map