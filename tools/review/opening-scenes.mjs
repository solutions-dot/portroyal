/* Public-build artwork, reduced-motion and opening-screen review. */
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PW_MODULE||'playwright');
const fonts=process.env.REVIEW_FONT_HELPER?(await import(process.env.REVIEW_FONT_HELPER)).installFonts:async()=>{};
const base=process.env.REVIEW_BASE||'http://localhost:8907/dist',out='build/opening-scenes';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});const results=[];
try{for(const width of [1280,390,667]){
 const ctx=await browser.newContext({viewport:{width,height:width===667?375:800},deviceScaleFactor:.8});await fonts(ctx);const p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});
 await p.goto(base+'/menu/?intro=0');assert.equal(await p.locator('a.game').count(),10);assert.equal(await p.locator('a.game .tag').count(),0);assert.equal(await p.locator('.game.melissa h2').textContent(),'Hurricane Melissa');
 const wind=p.locator('.game.windrush'),sel=p.locator('.game.selassie');
 assert.match(await wind.evaluate(e=>getComputedStyle(e,'::before').backgroundImage),/windrush-kingston-quay.jpg/);
 assert.match(await sel.evaluate(e=>getComputedStyle(e).backgroundImage),/selassie-arrival.jpg/);
 assert.equal(await wind.evaluate(e=>getComputedStyle(e,'::before').animationName),'windrush-quay-drift');await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await wind.evaluate(e=>getComputedStyle(e,'::before').animationName),'none');
 await wind.scrollIntoViewIfNeeded();await p.screenshot({path:out+'/windrush-card-'+width+'.png'});
 for(const game of ['windrush','tivoli']){
  await p.emulateMedia({reducedMotion:'no-preference'});await p.goto(base+'/games/'+game+'/site/',{timeout:120000});await p.waitForFunction(()=>!document.getElementById('start').disabled,null,{timeout:120000});
  assert.equal(await p.locator('#title .track').isVisible(),false);const bounds=await p.locator('#allgames').boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width);
  if(game==='tivoli'){assert.match(await p.locator('#title').textContent(),/Back-o-Wall/);assert.equal(await p.locator('#title').evaluate(e=>getComputedStyle(e,'::before').animationName),'tivoli-title-drift');await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('#title').evaluate(e=>getComputedStyle(e,'::before').animationName),'none')}
  await p.screenshot({path:out+'/'+game+'-title-'+width+'.png'});
 }
 assert.deepEqual(errors,[]);results.push({width,ok:true,errors});console.log('PASS opening scenes '+width);await ctx.close();
}}finally{await browser.close()}
writeFileSync(out+'/results.json',JSON.stringify(results,null,2)+'\n');
