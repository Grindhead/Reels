const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');
function load(file, dependencies) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const code = ts.transpileModule(source, {compilerOptions: {module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2020, esModuleInterop:true}}).outputText;
  const exports = {};
  vm.runInNewContext(code, {exports, require: name => { if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`); return dependencies[name]; }, console});
  return exports;
}
const constants = load('src/scripts/Utils/Constants.ts', {});
class Container { constructor(){this.children=[];} addChild(child){this.children.push(child);} }
class Sprite { constructor(texture){this.texture=texture;this.height=constants.SYMBOL_HEIGHT;this.width=constants.SYMBOL_WIDTH;this.anchor={set(){}};} }
function reel() {
  const {default:Reel}=load('src/scripts/Reel/index.ts', {
    'pixi.js':{Container,Sprite}, '../Utils/Constants':constants,
    '../Utils/Utils':{getImageData:()=>({id:'replacement'}),getRandomSymbol:()=> 'A',getRandomStopSound:()=> 'stop'},
    'gsap':{gsap:{},Power1:{}}, 'lodash':{orderBy:arr=>arr,random:()=>0}, '../Engine':{Engine:{}}, '@billjs/event-emitter':{globalEvent:{}}
  });
  const result=new Reel();result.symbolList=[{y:0,height:constants.SYMBOL_HEIGHT}];result.isSpinning=true;result.yVel=60;return result;
}
describe('Reel behavior',()=>{
 it('travels the same distance at 30, 60 and 120Hz',()=>{
   for(const hz of [30,60,120]){const r=reel();for(let i=0;i<hz;i++)r.update(1/hz);assert.ok(Math.abs(r.symbolList[0].y-60)<1e-7);}
 });
 it('bounds suspended frames and rejects invalid elapsed time',()=>{
   const r=reel();r.update(100);assert.equal(r.symbolList[0].y,6);r.update(-1);r.update(NaN);assert.equal(r.symbolList[0].y,6);
 });
 it('uses boolean flags and wraps/replaces the offscreen symbol in normal mode',()=>{
   assert.equal(typeof constants.FEATURES.CASCADING_REELS,'boolean');assert.equal(typeof constants.FEATURES.SHOW_STATS,'boolean');
   const previous=constants.FEATURES.CASCADING_REELS;try{
     constants.FEATURES.CASCADING_REELS=false;const r=reel();const y=constants.NUM_SYMBOLS_TO_SHOW*constants.SYMBOL_HEIGHT+constants.SYMBOL_HEIGHT;
     r.symbolList[0].y=y;r.update(0);assert.equal(r.symbolList[0].y,0);assert.equal(r.symbolList[0].texture.id,'replacement');
     constants.FEATURES.CASCADING_REELS=true;r.isSpinning=false;r.symbolList[0].y=y;r.update(0);assert.equal(r.symbolList[0].y,-constants.SYMBOL_HEIGHT*2);
   }finally{constants.FEATURES.CASCADING_REELS=previous;}
 });
 it('reactivates controls only after every reel completes',()=>{
   let activations=0,removed=0;const {Engine}=load('src/scripts/Engine/index.ts',{
    'pixi.js':{},'howler':{},'../../sounds/audiosprite.json':{},'../UI':{UI:{}},'../Reel':function(){},'../Utils/Constants':constants,'../Reel/ReelMask':{},'@billjs/event-emitter':{globalEvent:{offAll(){removed++;},on(){}}}
   });
   Engine.ui={activate(){activations++;}};
   for(let i=1;i<constants.NUM_REELS;i++){Engine.spinComplete();assert.equal(activations,0);}
   Engine.spinComplete();assert.equal(activations,1);assert.equal(removed,1);
 });
});
