/* Recapture approved scene compositions from a local dev build. */
const {chromium}=await import(process.env.PW_MODULE||'playwright');
const installFonts=process.env.REVIEW_FONT_HELPER?(await import(process.env.REVIEW_FONT_HELPER)).installFonts:async()=>{};
const base=process.env.REVIEW_BASE||'http://localhost:8907';
import {mkdirSync,writeFileSync} from 'node:fs';
const out='build/menu-restoration';mkdirSync(out,{recursive:true});const errors=[];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
try{
const ctx=await browser.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1});await installFonts(ctx);const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
await p.goto(base+'/games/windrush/site/?shot=quay&t=2',{timeout:120000});await p.waitForFunction(()=>window.__SHOT&&window.__WIND?.S.view,null,{timeout:120000});await p.waitForTimeout(300);await p.screenshot({path:'menu/windrush-kingston-quay.jpg',type:'jpeg',quality:92});
await p.goto(base+'/games/selassie/site/?shot=poster',{timeout:120000});await p.waitForFunction(()=>window.__SEL?.S.view,null,{timeout:120000});await p.waitForTimeout(300);await p.screenshot({path:'menu/selassie-arrival.jpg',type:'jpeg',quality:92});
await p.goto(base+'/games/selassie/site/?shot=plane&view=tail',{timeout:120000});await p.waitForFunction(()=>window.__SEL?.S.view,null,{timeout:120000});await p.waitForTimeout(300);await p.screenshot({path:out+'/selassie-tail.png'});
await p.goto(base+'/games/selassie/site/?shot=plane&view=side',{timeout:120000});await p.waitForFunction(()=>window.__SEL?.S.view,null,{timeout:120000});await p.waitForTimeout(300);await p.screenshot({path:out+'/selassie-lettering.png'});
await p.goto(base+'/games/tivoli/site/',{timeout:120000});await p.waitForFunction(()=>!document.getElementById('start').disabled,null,{timeout:120000});await p.screenshot({path:out+'/tivoli-title.png'});await p.locator('#chbtn').click();await p.screenshot({path:out+'/tivoli-chapters.png'});
const labels=await p.locator('#chapters .chfoot button').allTextContents();if(labels.join('|')!=='Unlock All|Restart|Credits')throw Error('wrong Tivoli footer');if(await p.locator('#chlist .chrow').count()!==8)throw Error('wrong chapter count');
writeFileSync(out+'/capture.json',JSON.stringify({errors,chapterFooter:labels},null,2));if(errors.length)throw Error(errors.join('\n'));console.log('PASS restored scene capture and Tivoli chapter controls');
}finally{await browser.close()}
