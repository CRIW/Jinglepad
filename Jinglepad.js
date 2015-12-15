var jingles = [];
var activeJingle = -1;

var audioContext = {};
var audioNodes = [];

function init(){
   setStatus('discovering jingles');
   setProgress(0);
   var fs = require('fs');
   jingles = fs.readdirSync(__dirname + '/Jingles');
   jingles = jingles.filter(function(o,i){
      return o.endsWith('.mp3') && i < 8;
   });
   for(var jingle in jingles){
         setTitle(getNameFromFilename(jingles[jingle]), jingle);
   }

   setStatus('loading jingles');
   setProgress(0.3);
   //Create an audio node for each jingle
   jingles.forEach(function(o,i){
      var an = document.createElement('audio');
      an.setAttribute('src', './Jingles/' + o);
      an.setAttribute('preload', 'auto');
      an.onended = function(){deactivate(i); console.log("deactivated " + i);};
      an.ontimeupdate = function(){updateTime(i);};
      document.body.appendChild(an);
      audioNodes[i] = an;
   });

   setStatus('setting up audio context');
   setProgress(0.6);
   //Set up webaudio
   audioContext = new AudioContext();
   //Basic set up: all nodes just go straight to destination
   for(var jingle in jingles){
      var mes = audioContext.createMediaElementSource(audioNodes[jingle]);
      mes.connect(audioContext.destination);
   }

   setStatus(''); //done
   setProgress(0);
}

function setStatus(status){
   document.getElementById('status').textContent = status;
}

function setProgress(progress){
   document.getElementById('progress').style.width = (progress * 100) + "%";
}

function updateTime(jingle){
   setProgress(audioNodes[jingle].currentTime / audioNodes[jingle].duration);
}

function getNameFromFilename(filename){
   return filename.substring(0,filename.length - 4);
}

function setTitle(title, number){
   document.getElementById('buttons').children[number].textContent = title;
}

function deactivate(jingle){
   document.getElementById('buttons').children[jingle].className = "";
   audioNodes[jingle].pause();
   audioNodes[jingle].currentTime = 0;
}

function activate(number){
   if(activeJingle > 0){
      deactivate(activeJingle);
   }
   document.getElementById('buttons').children[number].className = "playing";
   audioNodes[number].play();
}
