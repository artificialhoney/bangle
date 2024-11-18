// Artom Clock
// 04-08-2024 

let ScreenWidth  = g.getWidth(),  CenterX = ScreenWidth/2;
let ScreenHeight = g.getHeight(), CenterY = ScreenHeight/2;

let outerRadius = Math.min(CenterX,CenterY) * 0.9 - 25;

let HourHandLength = outerRadius * 0.8;
let HourHandWidth  = 2*3, halfHourHandWidth = HourHandWidth/2;

let MinuteHandLength = outerRadius * 1.5;
let MinuteHandWidth  = 2*2, halfMinuteHandWidth = MinuteHandWidth/2;

let SecondHandLength = outerRadius * 1.5;
let SecondHandWidth  = 2*1, halfSecondHandWidth = SecondHandWidth/2;

let SecondHandLengthAdd = outerRadius * 0.4;
let SecondHandWidthAdd  = 2*1, halfSecondHandWidthAdd = SecondHandWidthAdd/2;

let HourHandPolygon = [
  -halfHourHandWidth,halfHourHandWidth,
  -halfHourHandWidth,halfHourHandWidth-HourHandLength,
   halfHourHandWidth,halfHourHandWidth-HourHandLength,
   halfHourHandWidth,halfHourHandWidth,
];

let MinuteHandPolygon = [
  -halfMinuteHandWidth,halfMinuteHandWidth,
  -halfMinuteHandWidth,halfMinuteHandWidth-MinuteHandLength,
   halfMinuteHandWidth,halfMinuteHandWidth-MinuteHandLength,
   halfMinuteHandWidth,halfMinuteHandWidth,
];

let SecondHandPolygon = [    
  -halfSecondHandWidth,halfSecondHandWidth,
  -halfSecondHandWidth,halfSecondHandWidth-SecondHandLength,
   halfSecondHandWidth,halfSecondHandWidth-SecondHandLength,   
];

let SecondHandBackPolygon = [    
  -halfSecondHandWidth,halfSecondHandWidth,
  -halfSecondHandWidth,halfSecondHandWidth-SecondHandLengthAdd,
   halfSecondHandWidth,halfSecondHandWidth-SecondHandLengthAdd,       
];  

let transformedPolygon = new Array(HourHandPolygon.length);

/////////////////////////////////////////////////////////
function transformPolygon (originalPolygon, OriginX,OriginY, Phi) {    
  let x,y;
  for (let i = 0, l = originalPolygon.length; i < l; i+=2) {
    x = originalPolygon[i];
    y = originalPolygon[i+1];

    transformedPolygon[i]   = OriginX + x*Math.cos(Phi) + y*Math.sin(Phi);
    transformedPolygon[i+1] = OriginY + x*Math.sin(Phi) - y*Math.cos(Phi);
  }
}
////////////////////////////////////////////////////////////
Bangle.setUI('clock');
Bangle.loadWidgets();
Bangle.setHRMPower(true);

var d = new Date(Date.now()); 

g.clear(true); 
g.setFontAlign(0,0);
g.setColor(g.theme.fg);

Bangle.drawWidgets(); 

////////////////////////////////////////////////////////////
function drawClockFace () { 

g.setFontAlign(0,0);  

let day = d.getDate(); 

let tick0 = Graphics.createArrayBuffer(20,10,1,{msb:true});
tick0.fillRect(0,0,tick0.getWidth()-1, tick0.getHeight()-1);
let tick5 = Graphics.createArrayBuffer(15,6,1,{msb:true});
tick5.fillRect(0,0,tick5.getWidth()-1, tick5.getHeight()-1);
let tick1 = Graphics.createArrayBuffer(8,3,1,{msb:true});
tick1.fillRect(0,0,tick1.getWidth()-1, tick1.getHeight()-1); 

function big_wheel_x(angle){
return CenterX + (outerRadius + 32) * Math.cos(angle*Math.PI/180);
}
function big_wheel_y(angle){
  return CenterY + (outerRadius + 32) * Math.sin(angle*Math.PI/180);
}
function rotate_around_x(center_x, angle, tick){
  return center_x  + Math.cos(angle * Math.PI/180) * tick.getWidth()/2;
}
function rotate_around_y(center_y, angle, tick){
  return center_y + Math.sin(angle*Math.PI/180) * tick.getWidth()/2;
}   
g.setColor(g.theme.fg);
g.fillCircle(CenterX, CenterY, 6);
g.setColor(g.theme.bg);
g.fillCircle(CenterX, CenterY, 4);  
g.setColor(g.theme.fg);  
let ticks = [0, 90, 180, 270];  
ticks.forEach((item)=>{
  let agl = item+180;
  g.drawImage(tick0.asImage(), rotate_around_x(big_wheel_x(item), agl, tick0), rotate_around_y(big_wheel_y(item), agl, tick0), {rotate:agl*Math.PI/180});
});

ticks = [30, 60, 120, 150, 210, 240, 300, 330];
ticks.forEach((item)=>{
  let agl = item+180;
  g.drawImage(tick5.asImage(), rotate_around_x(big_wheel_x(item), agl, tick5), rotate_around_y(big_wheel_y(item), agl, tick5), {rotate:agl*Math.PI/180});
});   
for (var i=0; i<60; i++){
  let agl = i*6+180;
  g.drawImage(tick1.asImage(), rotate_around_x(big_wheel_x(i*6), agl, tick1),                 rotate_around_y(big_wheel_y(i*6), agl, tick1),            {rotate:agl*Math.PI/180});
}

let l = 18;
let x0 = CenterX;
let y0 = CenterY - outerRadius;
let poly = [x0-l/2,y0+l/2,x0+l/2,y0+l/2,x0,y0-l/2]; 



for (let i = 0; i < 12; i++) {     
  let Phi = i * 2*Math.PI/12;
  let x = CenterX + outerRadius * Math.sin(Phi);
  let y = CenterY - outerRadius * Math.cos(Phi);

  if (i == 0) { 
    
    // draw triangle
    g.fillPoly(poly,true);       
         
  } else if (i == 3)
  {   
    // draw date number
   g.setFont('Vector', 16);
   g.drawRect(x-l,y-l/2,x+l/2,y+l/2);
   g.drawString('' + day,x-l/7,y+1,true); 
    
  }    else
  {  
    // draw hour number
   g.setFont('Vector', 20);
   g.drawString('' + i, x,y); 
  }     
}

}
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
function drawClockHands () {  

  let now = new Date();
  let Hours   = now.getHours() % 12;
  let Minutes = now.getMinutes();
  let Seconds = now.getSeconds();

  let HoursAngle   = (Hours+(Minutes/60))/12 * 2*Math.PI - Math.PI;
  let MinutesAngle = (Minutes/60)            * 2*Math.PI - Math.PI;
  let SecondsAngle = (Seconds/60)            * 2*Math.PI - Math.PI;
  let SecondsBackAngle = (Seconds/60) * 2*Math.PI;

  transformPolygon(HourHandPolygon, CenterX,CenterY, HoursAngle);
  g.fillPoly(transformedPolygon);

  transformPolygon(MinuteHandPolygon, CenterX,CenterY, MinutesAngle); 
  g.fillPoly(transformedPolygon);

  //transformPolygon(SecondHandPolygon, CenterX,CenterY, SecondsAngle); 
  //g.fillPoly(transformedPolygon); 
  
  //transformPolygon(SecondHandBackPolygon, CenterX,CenterY, SecondsBackAngle); 
  //g.fillPoly(transformedPolygon);     
}
////////////////////////////////////////////////////////////

let Timer;

function refreshDisplay () {  
 
  g.clear(true); 
  g.setFontAlign(0,0); 
  
  Bangle.drawWidgets(); 
  
  drawClockFace();     
  drawClockHands();
    
  // update every minute
  let Pause = 60000 - (Date.now() % 60000);  

  Timer = setTimeout(refreshDisplay,Pause);

}


refreshDisplay ();