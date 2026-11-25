// Renders a clip frame by frame with headless Chromium and pipes it into ffmpeg.
//   node render.js <clip> <out.mp4>            full render (video only)
//   node render.js <clip> --stills dir 1,4.5,9   save checks at those seconds
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'), fs = require('fs');

(async () => {
  const [clip, out, ...rest] = process.argv.slice(2);
  const b = await chromium.launch();
  const portrait = clip.includes('-shorts/');   // YouTube Shorts: vertical 1080x1920
  const pg = await b.newPage({ viewport: portrait ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 } });
  pg.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exit(1); });
  await pg.goto('file://' + path.join(__dirname, 'src/index.html') + '?clip=' + clip + (portrait ? '&portrait=1' : ''));
  await pg.waitForFunction('window.READY', { timeout: 30000 });
  const dur = await pg.evaluate('CLIP.dur');
  const shot = f => pg.evaluate(f => { CLIP.frame(G, f); return document.getElementById('c').toDataURL('image/jpeg', 0.96).slice(23); }, f);
  if (out === '--events') { console.log(JSON.stringify(await pg.evaluate('CLIP.events'))); }
  else if (out === '--stills') {
    const [dir, list] = rest; fs.mkdirSync(dir, { recursive: true });
    for (const t of list.split(',')) fs.writeFileSync(path.join(dir, `t${t}.jpg`), Buffer.from(await shot(Math.round(t * 30)), 'base64'));
  } else {
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round(dur * 30);
    for (let f = 0; f < n; f++) {
      const buf = Buffer.from(await shot(f), 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 150 === 0) console.log(`frame ${f}/${n}`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
