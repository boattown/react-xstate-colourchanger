(this["webpackJsonpxstate-react-typescript-template"]=this["webpackJsonpxstate-react-typescript-template"]||[]).push([[0],{29:function(t,e,a){},40:function(t,e,a){"use strict";a.r(e),a.d(e,"nluRequest",(function(){return N}));var n=a(26),o=a(10),r=(a(29),a(7),a(23)),s=a(20),c=a(2),i=a(43),p=a(44),d=a(11);const l=d.a.send,m=d.a.cancel;function y(t){return l((e=>({type:"SPEAK",value:t})))}const u={John:{person:"John Appleseed"},Regina:{person:"Regina Phalange"},Rachel:{person:"Rachel Green"},Beyonce:{person:"Beyonce Knowles"},Drake:{person:"Doctor Drake Ramoray"},Monday:{day:"Monday"},"on Monday":{day:"Monday"},Tuesday:{day:"Tuesday"},"on Tuesday":{day:"Tuesday"},Wednesday:{day:"Wednesday"},"on Wednesday":{day:"Wednesday"},Thursday:{day:"Thursday"},"on Thursday":{day:"Thursday"},Friday:{day:"Friday"},"on Friday":{day:"Friday"},Saturday:{day:"Saturday"},"on Saturday":{day:"Saturday"},Sunday:{day:"Sunday"},"on Sunday":{day:"Sunday"},8:{time:"8:00"},"at 8":{time:"8:00"},9:{time:"9:00"},"at 9":{time:"9:00"},10:{time:"10:00"},"at 10":{time:"10:00"},11:{time:"11:00"},"at 11":{time:"11:00"},12:{time:"12:00"},"at 12":{time:"12:00"},1:{time:"13:00"},"at 1":{time:"13:00"},2:{time:"14:00"},"at 2":{time:"14:00"},3:{time:"15:00"},"at 3":{time:"15:00"},4:{time:"16:00"},"at 4":{time:"16:00"},5:{time:"17:00"},"at 5":{time:"17:00"},6:{time:"18:00"},"at 6":{time:"18:00"}},h={yes:{yes:!0},"of course":{yes:!0},sure:{yes:!0},yeah:{yes:!0},no:{no:!1},"no way":{no:!1},nope:{no:!1}};const E={initial:"init",states:{init:{on:{CLICK:"createAppointment"}},createAppointment:{initial:"who",on:{RECOGNISED:{target:"help",cond:t=>"help"===t.recResult},MAXSPEECH:[{target:"maxspeech2",cond:t=>1===t.counter},{target:"maxspeech3",cond:t=>2===t.counter},{target:"maxspeech1"}]},states:{hist:{type:"history"},who:{initial:"prompt",on:{RECOGNISED:[{target:"#root.dm.help",cond:t=>"help"===t.recResult},{cond:t=>"person"in(u[t.recResult]||{}),actions:[Object(c.b)((t=>({person:u[t.recResult].person}))),m("maxsp")],target:"day"},{target:".nomatch"}]},states:{prompt:Object(o.a)({},(g="Let's create an appointment! Who are you meeting with?",{initial:"prompt",states:{prompt:{entry:y(g),on:{ENDSPEECH:"ask"}},ask:{entry:[l("LISTEN"),l("MAXSPEECH",{delay:4e3,id:"maxsp"})]}}})),nomatch:{entry:y("Sorry I don't know them."),on:{ENDSPEECH:[{target:"prompt",actions:m("maxsp")}]}}}},day:{initial:"prompt",on:{RECOGNISED:[{target:"#root.dm.help",cond:t=>"help"===t.recResult},{cond:t=>"day"in(u[t.recResult]||{}),actions:[Object(c.b)((t=>({day:u[t.recResult].day}))),m("maxsp")],target:"allday"},{target:".nomatch"}]},states:{prompt:{entry:l((t=>({type:"SPEAK",value:"OK. ".concat(t.person,". On which day is your meeting?")}))),on:{ENDSPEECH:"ask"}},ask:{entry:[l("LISTEN"),l("MAXSPEECH",{delay:4e3,id:"maxsp"})]},nomatch:{entry:y("Sorry I didn't catch that. On which day is your meeting?"),on:{ENDSPEECH:[{target:"ask",actions:m("maxsp")}]}}}},allday:{initial:"prompt",on:{RECOGNISED:[{target:"#root.dm.help",cond:t=>"help"===t.recResult},{cond:t=>"yes"in(h[t.recResult]||{}),actions:m("maxsp"),target:"schedule_meeting_allday"},{cond:t=>"no"in(h[t.recResult]||{}),actions:m("maxsp"),target:"time"},{target:".nomatch"}]},states:{prompt:{entry:l((t=>({type:"SPEAK",value:"OK. ".concat(t.day,". Will it take all day?")}))),on:{ENDSPEECH:"ask"}},ask:{entry:[l("LISTEN"),l("MAXSPEECH",{delay:4e3,id:"maxsp"})]},nomatch:{entry:y("Sorry I didn't catch that. Will it take all day?"),on:{ENDSPEECH:[{target:"ask",actions:m("maxsp")}]}}}},time:{initial:"prompt",on:{RECOGNISED:[{target:"#root.dm.help",cond:t=>"help"===t.recResult},{cond:t=>"time"in(u[t.recResult]||{}),actions:[Object(c.b)((t=>({time:u[t.recResult].time}))),m("maxsp")],target:"schedule_meeting"},{target:".nomatch"}]},states:{prompt:{entry:l((t=>({type:"SPEAK",value:"OK. What time is your meeting?"}))),on:{ENDSPEECH:"ask"}},ask:{entry:[l("LISTEN"),l("MAXSPEECH",{delay:4e3,id:"maxsp"})]},nomatch:{entry:y("Sorry I didn't catch that. What time is your meeting?"),on:{ENDSPEECH:[{target:"ask",actions:m("maxsp")}]}}}},schedule_meeting_allday:{initial:"prompt",on:{RECOGNISED:[{target:"#root.dm.help",cond:t=>"help"===t.recResult},{cond:t=>"yes"in(h[t.recResult]||{}),actions:m("maxsp"),target:"end"},{cond:t=>"no"in(h[t.recResult]||{}),actions:m("maxsp"),target:"who"},{target:".nomatch"}]},states:{prompt:{entry:l((t=>({type:"SPEAK",value:"Do you want me to create an appointment with ".concat(t.person," on ").concat(t.day,"?")}))),on:{ENDSPEECH:"ask"}},ask:{entry:[l("LISTEN"),l("MAXSPEECH",{delay:4e3,id:"maxsp"})]},nomatch:{entry:y("Sorry I didn't catch that"),on:{ENDSPEECH:[{target:"ask",actions:m("maxsp")}]}}}},schedule_meeting:{initial:"prompt",on:{RECOGNISED:[{target:"#root.dm.help",cond:t=>"help"===t.recResult},{cond:t=>"yes"in(h[t.recResult]||{}),actions:m("maxsp"),target:"end"},{cond:t=>"no"in(h[t.recResult]||{}),actions:m("maxsp"),target:"who"},{target:".nomatch"}]},states:{prompt:{entry:l((t=>({type:"SPEAK",value:"Do you want me to create an appointment with ".concat(t.person," on ").concat(t.day," at ").concat(t.time,"?")}))),on:{ENDSPEECH:"ask"}},ask:{entry:[l("LISTEN"),l("MAXSPEECH",{delay:4e3,id:"maxsp"})]},nomatch:{entry:y("Sorry I didn't catch that"),on:{ENDSPEECH:[{target:"ask",actions:m("maxsp")}]}}}},end:{initial:"prompt",states:{prompt:{entry:y("Your appointment has been created."),on:{ENDSPEECH:"#root.dm"}}}}}},maxspeech1:{entry:y("I couldn't hear you."),on:{ENDSPEECH:[{target:"#root.dm.createAppointment.hist",cond:t=>1===t.counter},{target:"#root.dm.createAppointment.hist",cond:t=>2===t.counter},{target:"#root.dm.createAppointment.hist",cond:t=>3===t.counter}]}},maxspeech2:{entry:y("Are you there?"),on:{ENDSPEECH:[{target:"#root.dm.createAppointment.hist",cond:t=>1===t.counter},{target:"#root.dm.createAppointment.hist",cond:t=>2===t.counter},{target:"#root.dm.createAppointment.hist",cond:t=>3===t.counter}]}},maxspeech3:{entry:y("You're not even listening, I give up."),on:{ENDSPEECH:[{target:"#root.dm.createAppointment.hist",cond:t=>1===t.counter},{target:"#root.dm.createAppointment.hist",cond:t=>2===t.counter},{target:"#root.dm",cond:t=>3===t.counter}]}},help:{initial:"prompt",states:{prompt:{entry:y("Help message."),on:{ENDSPEECH:"#root.dm.createAppointment.hist"}}}}}};var g,S=a(22),b=a(13);Object(p.a)({url:"https://statecharts.io/inspect",iframe:!1});const R=Object(s.a)({id:"root",type:"parallel",states:{dm:Object(o.a)({},E),asrtts:{initial:"idle",states:{idle:{on:{LISTEN:"recognising",SPEAK:{target:"speaking",actions:Object(c.b)(((t,e)=>({ttsAgenda:e.value})))}}},recognising:{initial:"progress",entry:"recStart",exit:"recStop",on:{ASRRESULT:{actions:["recLogResult",Object(c.b)(((t,e)=>({recResult:e.value})))],target:".match"},RECOGNISED:"idle",MAXSPEECH:{actions:Object(c.b)((t=>t.counter?{counter:t.counter+1}:{counter:1})),target:"idle"}},states:{progress:{},match:{entry:Object(c.q)("RECOGNISED")}}},speaking:{entry:"ttsStart",on:{ENDSPEECH:"idle"}}}}}},{actions:{recLogResult:t=>{console.log("<< ASR: "+t.recResult)},test:()=>{console.log("test")},logIntent:t=>{console.log("<< NLU intent: "+t.nluData.intent.name)}}}),O=t=>{switch(!0){case t.state.matches({asrtts:"recognising"}):return Object(b.jsx)("button",Object(o.a)(Object(o.a)({type:"button",className:"glow-on-hover",style:{animation:"glowing 20s linear"}},t),{},{children:"Listening..."}));case t.state.matches({asrtts:"speaking"}):return Object(b.jsx)("button",Object(o.a)(Object(o.a)({type:"button",className:"glow-on-hover",style:{animation:"bordering 1s infinite"}},t),{},{children:"Speaking..."}));default:return Object(b.jsx)("button",Object(o.a)(Object(o.a)({type:"button",className:"glow-on-hover"},t),{},{children:"Click to start"}))}};function C(){const t=Object(S.useSpeechSynthesis)({onEnd:()=>{l("ENDSPEECH")}}),e=t.speak,a=t.cancel,o=(t.speaking,Object(S.useSpeechRecognition)({onResult:t=>{l({type:"ASRRESULT",value:t})}})),r=o.listen,s=(o.listening,o.stop),c=Object(i.b)(R,{devTools:!0,actions:{recStart:Object(i.a)((()=>{console.log("Ready to receive a color command."),r({interimResults:!1,continuous:!0})})),recStop:Object(i.a)((()=>{console.log("Recognition stopped."),s()})),changeColour:Object(i.a)((t=>{console.log("Repainting..."),document.body.style.background=t.recResult})),ttsStart:Object(i.a)(((t,a)=>{console.log("Speaking..."),e({text:t.ttsAgenda})})),ttsCancel:Object(i.a)(((t,e)=>{console.log("TTS STOP..."),a()}))}}),p=Object(n.a)(c,3),d=p[0],l=p[1];p[2];return Object(b.jsx)("div",{className:"App",children:Object(b.jsx)(O,{state:d,onClick:()=>l("CLICK")})})}const N=t=>fetch(new Request("https://cors-anywhere.herokuapp.com/https://lab-ii.herokuapp.com/model/parse",{method:"POST",headers:{Origin:"http://localhost:3000/react-xstate-colourchanger"},body:'{"text": "'.concat(t,'"}')})).then((t=>t.json())),j=document.getElementById("root");r.render(Object(b.jsx)(C,{}),j)}},[[40,1,2]]]);
//# sourceMappingURL=main.e2f496a8.chunk.js.map