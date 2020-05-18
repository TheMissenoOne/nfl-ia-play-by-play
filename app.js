'use strict';
const fs = require('fs');
const brain = require("brainjs");
var express = require('express');
var cors = require('cors')
var app = express();

var net = new brain.NeuralNetwork();

let def = fs.readFileSync('def.json');
def = JSON.parse(def);
var defNorm = normalizeStats(def);
let atk = fs.readFileSync('atk.json');
atk = JSON.parse(atk);
var offNorm = normalizeStats(atk);


let rawdata = fs.readFileSync('2019.json');
trainBySeason(JSON.parse(rawdata));
rawdata = fs.readFileSync('2018.json');
trainBySeason(JSON.parse(rawdata));
rawdata = fs.readFileSync('2017.json');
trainBySeason(JSON.parse(rawdata));
rawdata = fs.readFileSync('2016.json');
trainBySeason(JSON.parse(rawdata));
rawdata = fs.readFileSync('2015.json');
trainBySeason(JSON.parse(rawdata));
// rawdata = fs.readFileSync('2014.json');
// trainBySeason(JSON.parse(rawdata));

app.use(cors());
app.get('/out', function (req, res) {
  var content = JSON.parse(req.query.in);
  var out = net.run(content);
  console.log(JSON.stringify(out));
  res.send(out);
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

var out = net.run([2,1,12,5,1,-0.14,-0.163,0.215,0.20600000000000002]);
console.log(JSON.stringify(out));

function trainBySeason(season) {
  for (let i = 0; i < season.length;i++) {
      var element = season[i];
      if((element.PlayType == 'PASS' || element.PlayType == 'RUSH')&& element.IsNoPlay == 0 && element.OffenseTeam != "" && element.DefenseTeam!= ""){
          var playD= Object.values(element);
          var playC= [];
          for (let i = 1; i < playD.length; i++) {
              var e = playD[i];
              if(typeof e != "string" && i<12 && i!=10 && i!=7 && i!=9){
                  playC[playC.length]= e
              }
          }
          var o = 0;
          if(element.ToGo<=element.Yards){
              o=1;
          }
          var s=element.Yards/element.ToGo;

          var defY=defNorm[2019-element.SeasonYear];
          var defense = defY[findTeam(element.DefenseTeam,def,element.SeasonYear)];
          console.log("Ano: "+element.SeasonYear);
          var defIn;

          console.log(element.DefenseTeam);
          console.log(element.Description);
          if(element.PlayType == 'PASS' ){
            defIn= [defense[4],defense[9]];
          }else{
            defIn= [defense[6],defense[10]];
          }
          var offY = offNorm[2019-element.SeasonYear];
          var offense = offY[findTeam(element.OffenseTeam,atk,element.SeasonYear)];
          var offIn;
          console.log(element.Description);
          if(element.PlayType == 'PASS' ){
            offIn= [offense[4],offense[9]];
          }else{
            offIn= [offense[6],offense[10]];
          }

          // var inout= [{input: [{condition: playC},{defense: defIn},{offense: offIn }], output: {yards:element.Yards-element.ToGo,conv:o}}];
          var inValues = playC;
          inValues = inValues =inValues.concat(defIn);
          inValues = inValues.concat(offIn)
          var inout= [{input: inValues, output: {sucesso:s,conv:o}}];
          console.log(JSON.stringify(inout));
          net.train(inout);
          console.log(element.Description + " \nConvertion: "+o+" \n"+JSON.stringify(playC));
        }
  }
}

function normalizeStats(obj) {
var normalizedLeague = [];
var normalizedTeam= [];
var normalizedFull= [];
for (let l = 0; l < obj.length; l++) {
  var year = obj[l];
  for (let j = 0; j < year.length; j++) {
    var objArr = Object.values(year[j]);
    for (let k = 2; k < objArr.length; k++) {
      var stat = objArr[k];
      if(typeof stat == "string" ){
        stat = parseFloat(stat)/100;
      }
      normalizedTeam[normalizedTeam.length]=stat;

    }
    normalizedLeague[normalizedLeague.length]=normalizedTeam;
  }
  normalizedFull[normalizedFull.length]=normalizedLeague
}
  // console.log(JSON.stringify(normalizedLeague));
  return normalizedFull;
}

function findTeam(nome,lado,year) {
console.log(2019-parseFloat(year));
  var lado = lado[2019-year];
  for (let i = 0; i < lado.length; i++) {
    const element = lado[i];
    if(nome==lado[i].TEAM){
      console.log(lado[i].TEAM)
      return i;
    }
  }
  console.log("ERRO Nome: "+nome)
  return null;
}
