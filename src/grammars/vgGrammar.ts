export const vgGrammar = `
<grammar root="home">

<rule id="home">

<item repeat="0-1">with</item>

<item repeat="0-1"><ruleref uri="#person"/>
<tag>out.person=rules.person;</tag></item>

<item repeat="0-1">on</item>

<item repeat="0-1"><ruleref uri="#day"/>
<tag>out.day=rules.day;</tag></item>

<item repeat="0-1">at</item>

<item repeat="0-1"><ruleref uri="#time"/>
<tag>out.time=rules.time;</tag></item>

<item repeat="0-1">o'clock</item>

 <rule id="person"> 
<one-of> 
<item> Monica <tag> out = 'Monica Geller'; 
</tag></item> 
<item> Rachel <tag> out = 'Rachel Green'; 
</tag></item>
<item> Joey <tag> out = 'Joey Tribbiani'; 
</tag></item> 
<item> Phoebe <tag> out = 'Phoebe Buffay'; 
</tag></item> 
<item> Ross <tag> out = 'Ross Geller'; 
</tag></item> 
<item> Chandler <tag> out = 'Chandler Bing'; 
</tag></item> 
 </one-of> 
 </rule>

 <rule id="day"> 
<one-of> 
<item> Monday </item> 
<item> Tuesday </item>
<item> Wednesday </item> 
<item> Thursday </item> 
<item> Friday </item> 
<item> Saturday </item> 
<item> Sunday </item> 
 </one-of> 
 </rule>

 <rule id="time"> 
<one-of> 
<item> 10 <tag> out = '10:00'; 
</tag></item> 
<item> 11 <tag> out = '11:00'; 
</tag></item>
<item> 12 <tag> out = '12:00'; 
</tag></item> 
<item> 1 <tag> out = '13:00'; 
</tag></item> 
<item> 2 <tag> out = '14:00'; 
</tag></item> 
<item> 3 <tag> out = '15:00'; 
</tag></item> 
<item> 4 <tag> out = '16:00'; 
</tag></item>
<item> all day </item> 
 </one-of> 
 </rule>

 </grammar>
`