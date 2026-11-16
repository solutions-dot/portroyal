/* Check the actual chapter book through both entry points. Run against a public dist build. */
import {mkdirSync,writeFileSync,readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PW_MODULE||'playwright');
const fonts=process.env.REVIEW_FONT_HELPER?(await import(process.env.REVIEW_FONT_HELPER)).installFonts:async()=>{};
const base=process.env.REVIEW_BASE||'http://localhost:8907/dist';
const out=process.env.REVIEW_OUT||'build/chapter-books';mkdirSync(out,{recursive:true});
const games=process.argv.slice(2);if(!games.length)games.push('bog-walk','eventide','garvey','kendal','melissa','nanny','port-royal','selassie','tivoli','windrush');
const browser=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
const reports=process.env.REVIEW_RESUME && existsSync(out+'/results.json')?JSON.parse(readFileSync(out+'/results.json','utf8')):[];
async function book(page,width){
 await page.locator('#chapters').waitFor({state:'visible'});
 const result=await page.locator('#chapters').evaluate(e=>{const book=e.querySelector('.book'),rows=[...e.querySelectorAll('.chbtn')],buttons=[...e.querySelectorAll('.chfoot button')];return{paper:getComputedStyle(book).backgroundColor,ink:getComputedStyle(book).color,bounds:book.getBoundingClientRect().toJSON(),footer:buttons.map(b=>({id:b.id,text:b.textContent.trim(),rect:b.getBoundingClientRect().toJSON()})),rows:rows.length,overlaps:rows.flatMap(b=>{const spans=[...b.querySelectorAll('.yr,.nm,.st')].map(s=>s.getBoundingClientRect());return spans.flatMap((a,i)=>spans.slice(i+1).filter(c=>Math.min(a.right,c.right)-Math.max(a.left,c.left)>1&&Math.min(a.bottom,c.bottom)-Math.max(a.top,c.top)>1))})}});
 assert.equal(result.paper,'rgb(242, 233, 213)');assert.equal(result.ink,'rgb(37, 34, 27)');assert.ok(result.rows>0);assert.equal(result.overlaps.length,0,'chapter text overlaps');
 assert.deepEqual(result.footer.map(b=>b.text),['Unlock All','Restart','Credits']);
 for(const b of result.footer){assert.ok(b.rect.x>=0&&b.rect.right<=width&&b.rect.height>=44);assert.ok(Math.abs(b.rect.y-result.footer[0].rect.y)<2)}
 assert.ok(result.bounds.x>=0&&result.bounds.right<=width);
 assert.ok(Math.abs(result.bounds.x+result.bounds.width/2-width/2)<2,'chapter book is not centered');
 return result;
}
try{for(const width of (process.env.REVIEW_WIDTHS||"1280,390,320").split(",").map(Number))for(const game of games){
 if(reports.some(r=>r.game===game&&r.width===width&&r.ok))continue;
 const ctx=await browser.newContext({viewport:{width,height:800},deviceScaleFactor:.6,hasTouch:width<600,isMobile:width<600});await fonts(ctx);const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});const report={game,width,errors};
 try{
 await page.goto(base+'/games/'+game+'/site/',{timeout:120000});await page.waitForFunction(()=>!document.getElementById('start').disabled,null,{timeout:120000});
 await page.getByRole('button',{name:'Chapters',exact:true}).first().click();report.title=await book(page,width);
 await page.locator('#chteacher').click();await book(page,width);
 const saved=await page.evaluate(()=>JSON.stringify({...localStorage}));let asked=false;page.once('dialog',async d=>{asked=true;await d.dismiss()});await page.locator('#chreset').click();assert.ok(asked,'Restart must ask before erasing');assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),saved,'cancelled restart changed save');await book(page,width);
 await page.screenshot({path:out+'/'+game+'-'+width+'-title-chapters.png'});
 await page.locator('#chcred').click();await page.locator('#credits').waitFor({state:'visible'});await page.locator('#credits #crclose,#credits #creditsclose').first().click();
 if(await page.locator('#chapters').isVisible())await page.locator('#chclose').click();
 await page.locator('#start').click();for(let i=0;i<8;i++){const b=page.locator('#cbtns button:visible');if(await b.count())await b.first().click();else await page.waitForTimeout(150)}
 await page.locator('#jbtn:visible,#jhud:visible').first().click({timeout:30000});await page.locator('#journal').waitFor({state:'visible'});await page.locator('#jchap').click();report.ingame=await book(page,width);assert.equal(report.ingame.rows,report.title.rows);await page.screenshot({path:out+'/'+game+'-'+width+'-ingame-chapters.png'});assert.deepEqual(errors,[]);report.ok=true;
 }catch(e){report.ok=false;report.failure=e.message;await page.screenshot({path:out+'/'+game+'-'+width+'-failure.png'}).catch(()=>{})}
 const prior=reports.findIndex(r=>r.game===game&&r.width===width);if(prior>=0)reports[prior]=report;else reports.push(report);writeFileSync(out+'/results.json',JSON.stringify(reports,null,2));console.log((report.ok?'PASS ':'FAIL ')+game+' '+width+(report.failure?' '+report.failure.split('\n')[0]:''));await ctx.close();
}}finally{await browser.close()}
if(reports.some(r=>!r.ok))process.exitCode=1;
