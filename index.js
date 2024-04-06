const fs = require("fs");
const dayjs = require('dayjs');
dayjs().format();

const express = require('express');
const app = express();

require('dotenv').config();
const session = require('express-session');
app.use(session({
  secret: process.env.SECRET_ID_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const MAX = 1711918541299;
const MIN = 1711130572022;
var data1;
fs.readFile("./data.json", "utf8", (error, d) => {
  if (error) {
    console.log(error);
    return;
  }
  data1 = JSON.parse(d);
});
var data2;
fs.readFile("./data2.json", "utf8", (error, d) => {
  if (error) {
    console.log(error);
    return;
  }
  data2 = JSON.parse(d);
});

const getPixel1 = (time) => {
  let result = [];
  data1.forEach((pixel) => {
    let color = [255, 255, 255]
    if (pixel.history.length > 0) {
      let n = pixel.history.length-1;
      while (n >=0 && pixel.history[n].time <= time) {
        color = pixel.history[n].action.color;
        n--;
      }
    }
    result.push({ x: pixel.x, y: pixel.y, color: color })
  })
  return result;
}
const getPixel2 = (time) => {
  let result = [];
  data2.forEach((pixel) => {
    if (pixel.time <= time){
      result.push({ x: pixel.x, y: pixel.y, color: pixel.color })
    }
    else {
      return;
    }
  })
  return result;
}

var nbrVisiteursTot = 0;
var nbrVisiteursUniques = 0;
var nbrRequetes = 0;

app.get('/', (req, res)=>{
  nbrVisiteursTot++;
  if (!req.session) {
    nbrVisiteursUniques++;
  }
  res.redirect('/v2')
})

app.get('/v1', (req, res)=>{
  res.sendFile(__dirname+'/public/v1/index.html')
})
app.get('/v2', (req, res)=>{
  res.sendFile(__dirname+'/public/v2/index.html')
})
app.use(express.static(__dirname+'/public'))


app.get('/api/v1/getPixels', (req, res)=>{
  nbrRequetes++;
  if (!req.session.lastRequest || (req.session.lastRequest && new Date()-new Date(req.session.lastRequest) > 3000) ){
    req.session.lastRequest = new Date();
    if (req.query.time) {
      let time = parseInt(req.query.time)
      if (time >= MIN && time <= MAX) {
        let result = getPixel1(time);
        return res.status(200).json(result);  
      }
      else {
        return res.status(400).json({error:true, text:"Le temps spécifié est hors des limites"})
      }
    }
    else {
      return res.status(400).json({error:true, text:"Pas de temps spécifié"})
    }  
  }
  else {
    return res.status(400).json({error:"Cooldown..."})
  }
})
app.get('/api/v2/getPixels', (req, res)=>{
  nbrRequetes++;
  if (!req.session.lastRequest || (req.session.lastRequest && new Date()-new Date(req.session.lastRequest) > 3000) ){
    req.session.lastRequest = new Date();
    if (req.query.time) {
      let time = parseInt(req.query.time)
      if (time >= MIN && time <= MAX) {
        let result = getPixel2(time);
        return res.status(200).json(result);  
      }
      else {
        return res.status(400).json({error:true, text:"Le temps spécifié est hors des limites"})
      }
    }
    else {
      return res.status(400).json({error:true, text:"Pas de temps spécifié"})
    }  
  }
  else {
    return res.status(400).json({error:"Cooldown..."})
  }
})


setInterval(()=>{
  fs.readFile("./infos.json", "utf8", (error, d) => {
    if (error) {
      console.log("Erreur lors de l'extraction de l'actualisation des infos : ",error);
      return;
    }
    let infos = JSON.parse(d);
    infos.nbrVisiteursTot += nbrVisiteursTot;
    infos.nbrVisiteursUniques += nbrVisiteursUniques;
    infos.nbrRequetes += nbrRequetes;
    
    nbrVisiteursTot = 0;
    nbrVisiteursUniques = 0;
    nbrRequetes = 0;
    fs.writeFile("./infos.json", JSON.stringify(infos), (error) => {
      if (error) {
        console.error("Erreur lors de l'écriture de l'actualisation des infos : ", error);
        return;
      }
    });
  });
}, 60000)

const PORT = 3001;
app.listen(PORT, ()=>{
  console.log(`Serve started on port ${PORT}`)
})