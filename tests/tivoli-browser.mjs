// Focused browser checks for Tivoli's chapter footer, journal, notifications and touch controls.
// Run after: node tools/build.mjs tivoli && npm i --no-save playwright@1.63.0
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, normalize, extname } from 'node:path';
import { chromium } from 'playwright';
const root=process.cwd(), types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.glb':'model/gltf-binary','.wasm':'application/wasm'};
const server=createServer((req,res)=>{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=normalize(join(root,p));if(!file.startsWith(root+'/')){res.writeHead(403).end();return}if(existsSync(file)&&statSync(file).isDirectory())file=join(file,'index.html');if(!existsSync(file)){res.writeHead(404).end('Not found');return}res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(readFileSync(file));});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
let fails=0;
const check=(condition,message)=>{console.log((condition?'PASS ':'FAIL ')+message);if(!condition)fails++};
try {
 for(const width of [320,390]){
  const page=await browser.newPage({viewport:{width,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{try{sessionStorage.setItem('pastport-mature-ok','1')}catch{}});   /* Tivoli is Mature 13+ (22 November 2026): this traveller has already said they are 13 or older (engine/mature.js) */
  await page.goto(base+'/games/tivoli/site/index.html',{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForTimeout(2000);
  await page.locator('#chbtn').click();
  const footer=await page.locator('#chapters .chfoot button').evaluateAll(bs=>bs.map(b=>({text:b.textContent.trim(),r:b.getBoundingClientRect().toJSON()})));
  check(footer.map(b=>b.text).join('|')==='Unlock All|Restart|Credits',width+': chapter action labels');
  check(footer.length===3&&footer.every(b=>Math.abs(b.r.y-footer[0].r.y)<3),width+': chapter actions in one row');
  check(footer.every(b=>b.r.x>=0&&b.r.right<=width),width+': chapter actions fit viewport');
  await page.locator('#chcred').click();
  check(await page.locator('#credits').isVisible(),width+': credits panel opens');
  await page.locator('#creditsclose').click();
  check(await page.locator('#chapters').isVisible(),width+': credits returns to chapters');
  await page.locator('#chclose').click();
  await page.locator('#hud').evaluate(el=>{el.hidden=false});
  await page.locator('#jbtn').click();
  check(await page.locator('#journal').isVisible(),width+': journal opens');
  check(await page.locator('#journal .book').isVisible(),width+': book-style journal visible');
  check(await page.locator('#jchap').isVisible(),width+': journal Chapters footer visible');
  await page.locator('#jchap').click();
  check(await page.locator('#chapters').isVisible(),width+': journal Chapters navigation works');
  await page.locator('#chclose').click();
  await page.locator('#jbtn').click();
  await page.locator('#jclose').click();
  check(!(await page.locator('#journal').isVisible()),width+': journal closes');
  check(await page.locator('#stick #nub').count()===1,width+': the shared touch joystick exists');
  await page.screenshot({path:'tivoli-'+width+'.png',fullPage:false});
  check(errors.length===0,width+': no uncaught JavaScript errors'+(errors.length?' ('+errors.join('; ').slice(0,150)+')':''));
  await page.close();
 }
} finally {await browser.close();await new Promise(ok=>server.close(ok))}
if(fails)process.exitCode=1;
