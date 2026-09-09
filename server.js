"use strict";
/**
 * ليلة المافيا — سيرفر الشبكة المحلية (WiFi)
 *
 * كل الحالة السرية (الأدوار، الاختيارات، الأصوات) موجودة هون فقط.
 * كل جوال بيوصله بس اللي مسموح للاعبه يشوفه.
 * ما بيحتاج إنترنت: بس كل الأجهزة على نفس شبكة الواي فاي.
 */
const os = require("os");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PAGE = "<!DOCTYPE html>\n<html lang=\"ar\" dir=\"rtl\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n<title>ليلة المافيا</title>\n<link href=\"https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400;600;700&family=Tajawal:wght@300;400;500;700&display=swap\" rel=\"stylesheet\">\n<style>\n:root{\n  --night-deep:#101728; --lamp:#E8B04B; --lamp-soft:#F0CE8C;\n  --plum:#7A2338; --parchment:#EFE6D6; --parchment-dim:#D9CDB8; --ink:#1A1712;\n  --bg:var(--night-deep); --panel:rgba(255,255,255,.05); --fg:var(--parchment);\n  --fg-dim:#9AA6BF; --accent:var(--lamp); --line:rgba(154,166,191,.22);\n}\n*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}\nhtml,body{margin:0;padding:0;min-height:100%}\nbody{background:var(--bg);color:var(--fg);font-family:\"Tajawal\",system-ui,sans-serif;\n  transition:background .8s ease,color .5s ease;display:flex;justify-content:center;padding:0 18px 44px}\nbody.is-day{--bg:var(--parchment);--fg:var(--ink);--fg-dim:#6B6152;--panel:rgba(26,23,18,.05);--accent:var(--plum);--line:rgba(26,23,18,.14)}\nbody.theme-light,body.theme-light.is-day{--bg:var(--parchment);--fg:var(--ink);--fg-dim:#6B6152;--panel:rgba(26,23,18,.06);--accent:var(--plum);--line:rgba(26,23,18,.16)}\nbody.theme-dark,body.theme-dark.is-day{--bg:#141C30;--fg:#F2EADB;--fg-dim:#AEB9D0;--panel:rgba(255,255,255,.09);--accent:var(--lamp);--line:rgba(174,185,208,.3)}\nbody.theme-light::before{background:radial-gradient(120% 70% at 50% -10%,rgba(122,35,56,.12),transparent 60%)!important;opacity:.4!important}\nbody.theme-dark::before{background:radial-gradient(120% 70% at 50% -10%,rgba(232,176,75,.18),transparent 60%)!important;opacity:1!important}\nbody.theme-light .role-mafia,body.theme-light .role-godfather{color:#B02949}\nbody.theme-light .role-doctor{color:#1F7A54}\nbody.theme-light .role-detective{color:#9A6B12}\nbody.theme-light .role-sniper{color:#2A5D96}\nbody.theme-light .role-jester{color:#7B3FA0}\nbody.theme-light .role-villager{color:#5C5245}\nbody.theme-light .matebig{color:#B02949}\nbody.theme-light .mates-card{background:rgba(176,41,73,.08);border-color:rgba(176,41,73,.4)}\nbody.is-locked{--bg:#0A0E18}\nbody::before{content:\"\";position:fixed;inset:0;pointer-events:none;z-index:0;\n  background:radial-gradient(120% 70% at 50% -10%,rgba(232,176,75,.16),transparent 60%);transition:opacity .8s ease}\nbody.is-day::before{background:radial-gradient(120% 70% at 50% -10%,rgba(122,35,56,.14),transparent 60%);opacity:.35}\n.app{width:100%;max-width:520px;position:relative;z-index:1;padding-top:62px}\nh1,h2,.kufi{font-family:\"Reem Kufi\",serif;font-weight:600}\nh1{font-size:clamp(30px,9vw,42px);margin:0 0 4px;line-height:1.25}\nh2{font-size:clamp(22px,6.5vw,28px);margin:0 0 10px;line-height:1.35}\nh3{font-family:\"Reem Kufi\";font-size:19px;margin:22px 0 8px}\np{line-height:1.75;margin:0 0 14px}\n.sub{color:var(--fg-dim);font-size:15px;margin-bottom:24px}\n.screen{display:none;animation:rise .4s ease both}\n.screen.on{display:block}\n@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}\n@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}\nbutton{font-family:inherit;font-size:16px;cursor:pointer;border:0;border-radius:12px}\nbutton:focus-visible{outline:3px solid var(--accent);outline-offset:3px}\n.btn{display:block;width:100%;padding:16px;margin-top:12px;background:var(--accent);color:#12172A;font-weight:700;font-size:17px}\nbody.is-day .btn{color:#fff}\n.btn.ghost{background:transparent;color:var(--fg);border:1.5px solid var(--fg-dim)}\n.btn.danger{background:var(--plum);color:#fff}\n.btn:disabled{opacity:.32;cursor:not-allowed}\n.row{display:flex;gap:10px}\ninput,select{width:100%;padding:14px;border-radius:12px;font-family:inherit;font-size:16px;background:var(--panel);color:var(--fg);border:1.5px solid var(--line)}\ninput::placeholder{color:var(--fg-dim)}\n.field{margin-bottom:16px}\n.field label{display:block;font-size:14px;color:var(--fg-dim);margin-bottom:7px}\n.players{list-style:none;padding:0;margin:0 0 18px}\n.players li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;background:var(--panel);border-radius:12px;margin-bottom:8px}\n.players li .x{background:none;color:var(--fg-dim);font-size:20px;padding:0 6px;line-height:1}\n.pick{display:block;width:100%;text-align:right;padding:15px 16px;margin-bottom:9px;background:var(--panel);color:var(--fg);border:1.5px solid transparent;font-size:17px}\n.pick[aria-pressed=\"true\"]{border-color:var(--accent);background:rgba(232,176,75,.14)}\nbody.is-day .pick[aria-pressed=\"true\"]{background:rgba(122,35,56,.1)}\n.card{background:var(--panel);border-radius:18px;padding:26px 22px;margin-bottom:18px;border:1px solid var(--line)}\n.center{text-align:center}\n.glyph{font-size:52px;line-height:1}\n.role-name{font-family:\"Reem Kufi\";font-size:38px;margin:14px 0 6px}\n.role-mafia,.role-godfather{color:#E8677F}\n.role-doctor{color:#6FD3A8}.role-detective{color:var(--lamp-soft)}\n.role-villager{color:var(--parchment-dim)}.role-jester{color:#C88BE8}\n.role-sniper{color:#7FB3E8}.role-mayor{color:#E8B04B}\n.big{min-height:58vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:34px 18px}\n.big .glyph{font-size:clamp(70px,25vw,130px)}\n.big .role-name{font-size:clamp(44px,16vw,88px);margin:18px 0 12px;line-height:1.1}\n.big .job{font-size:18px;color:var(--fg-dim);max-width:20em;margin:0}\n.big .mates{margin-top:22px;font-size:19px}\n.matebig{display:block;font-family:\"Reem Kufi\";font-size:clamp(30px,10vw,50px);line-height:1.35;margin-top:8px;color:#E8677F}\n.mates-card{background:rgba(232,103,127,.1);border:1.5px solid rgba(232,103,127,.45);border-radius:16px;padding:16px;margin-bottom:14px;text-align:center}\n.mates-card .lbl{font-size:13px;color:var(--fg-dim);display:block;margin-bottom:2px}\n.picks-card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:14px 16px;margin-bottom:14px}\n.picks-card .row2{display:flex;justify-content:space-between;align-items:center;padding:7px 0;font-size:17px;border-bottom:1px dashed var(--line)}\n.picks-card .row2:last-child{border-bottom:0}\n.picks-card .who2{font-family:\"Reem Kufi\";font-size:19px}\n.picks-card .tgt{font-family:\"Reem Kufi\";font-size:21px;color:#E8677F}\n.players li .ord{display:flex;gap:6px;align-items:center}\n.players li .num{font-family:\"Reem Kufi\";color:var(--fg-dim);font-size:14px;min-width:22px}\n.players li{position:relative;touch-action:pan-y;transition:transform .16s ease,box-shadow .16s,opacity .16s}\n.players li.dragging{z-index:5;box-shadow:0 12px 30px rgba(0,0,0,.35);opacity:.97;transition:none;border:1.5px solid var(--accent)}\n.grip{font-size:22px;color:var(--fg-dim);padding:6px 10px;cursor:grab;touch-action:none;user-select:none;line-height:1}\n.grip:active{cursor:grabbing}\n.pick.locked{opacity:.55}\n.shake{animation:shk .3s}\n@keyframes shk{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n.banner{display:flex;align-items:center;justify-content:center;gap:12px;padding:16px;border-radius:16px;background:var(--panel);border:1px solid var(--line);margin-bottom:16px}\n.banner .g{font-size:38px;line-height:1}\n.banner .n{font-family:\"Reem Kufi\";font-size:clamp(26px,8vw,34px)}\n.hint{font-size:14px;color:var(--fg-dim);text-align:center;margin-top:8px}\n.tag{font-size:13px;color:var(--fg-dim)}\n.dead{opacity:.42;text-decoration:line-through}\n.status{display:flex;justify-content:space-between;font-size:13px;color:var(--fg-dim);margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid var(--line)}\n.alive-list span{display:inline-block;padding:4px 12px;background:var(--panel);border-radius:20px;margin:0 0 7px 6px;font-size:15px}\n.timer{font-family:\"Reem Kufi\";font-size:64px;text-align:center;margin:10px 0 4px;font-variant-numeric:tabular-nums}\n.handoff{text-align:center;padding:44px 16px 22px}\n.handoff .who{font-family:\"Reem Kufi\";font-size:clamp(34px,11vw,52px);margin:16px 0 8px;color:var(--accent)}\n.dots{display:flex;justify-content:center;margin:26px 0 22px}\n.dot{width:26px;height:26px;border-radius:50%;border:2px solid var(--fg-dim);transition:background .2s,border-color .2s}\n.pad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:300px;margin:0 auto}\n.pad button{padding:18px 0;font-size:26px;font-family:\"Reem Kufi\";background:var(--panel);color:var(--fg);border:2px solid var(--line);transition:background .12s,color .12s,transform .12s}\n.pad button[data-c]{border-color:currentColor}\n.pad button.hit{background:currentColor;color:#0A0E18!important;transform:scale(.94)}\n.err{color:#E8677F;text-align:center;min-height:22px;font-size:14px;margin-top:12px}\n.step{font-size:13px;color:var(--fg-dim);text-align:center;margin-bottom:6px}\n.bar{position:fixed;top:10px;z-index:9;display:flex;gap:8px}\n.bar.l{left:12px}.bar.r{right:12px}\n.bar button{width:44px;height:44px;font-size:19px;background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:50%;padding:0;backdrop-filter:blur(6px)}\n.bar button.off{opacity:.4}\n#quitBtn{display:none}\nbody.in-game #quitBtn{display:block}\n.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px}\n.chip{padding:11px 14px;border-radius:14px;background:var(--panel);border:1.5px solid var(--line);color:var(--fg);font-size:15px}\n.chip[aria-pressed=\"true\"]{border-color:var(--accent);background:rgba(232,176,75,.14);font-weight:700}\nbody.is-day .chip[aria-pressed=\"true\"]{background:rgba(122,35,56,.1)}\ndetails{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px 16px;margin-bottom:16px}\nsummary{cursor:pointer;font-family:\"Reem Kufi\";font-size:17px}\n.log{font-size:14px;line-height:1.9;color:var(--fg-dim);margin-top:10px}\n.log b{color:var(--fg)}\n.rules li{line-height:1.9;margin-bottom:6px}\n\n</style>\n<style>\n/* إضافات خاصة بالنسخة الجماعية */\n.roomcode-box{text-align:center;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:20px;margin-bottom:18px}\n.roomcode{font-family:\"Reem Kufi\";font-size:54px;letter-spacing:10px;color:var(--accent);margin:6px 0}\n.you{font-size:12px;background:var(--accent);color:#12172A;padding:2px 8px;border-radius:20px;margin-inline-start:6px}\nbody.is-day .you{color:#fff}\n.pending{font-size:15px;line-height:2;color:var(--fg-dim)}\n.pending span{display:inline-block;padding:3px 10px;background:var(--panel);border-radius:20px;margin:0 0 6px 6px}\n.progress{height:8px;background:var(--panel);border-radius:20px;overflow:hidden;margin:14px 0}\n.progress i{display:block;height:100%;background:var(--accent);width:0;transition:width .3s}\n.toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:var(--plum);color:#fff;padding:12px 20px;border-radius:14px;z-index:20;font-size:15px;display:none}\n.dead-banner{background:rgba(232,103,127,.12);border:1.5px solid rgba(232,103,127,.5);border-radius:14px;padding:12px;text-align:center;margin-bottom:14px;font-size:15px}\n</style>\n</head>\n<body>\n\n<div class=\"bar l\">\n  <button id=\"sndBtn\" aria-label=\"الأصوات\">🔊</button>\n  <button id=\"vcBtn\" aria-label=\"الصوت الناطق\">🗣️</button>\n  <button id=\"themeBtn\" aria-label=\"الإضاءة\">🌗</button>\n</div>\n<div class=\"bar r\"><button id=\"quitBtn\" aria-label=\"خروج\" style=\"display:none\">✕</button></div>\n\n<div class=\"app\">\n\n<section class=\"screen on\" id=\"s-home\">\n  <h1>ليلة المافيا</h1>\n  <p class=\"sub\">كل لاعب من جواله، على نفس شبكة الواي فاي.</p>\n  <div class=\"card\">\n    <div class=\"field\"><label for=\"joinName\">اسمك</label>\n      <input id=\"joinName\" placeholder=\"اكتب اسمك\" autocomplete=\"off\"></div>\n    <div class=\"field\"><label for=\"joinCode\">رمز الغرفة (اتركه فاضي لإنشاء غرفة جديدة)</label>\n      <input id=\"joinCode\" maxlength=\"4\" placeholder=\"مثلاً KX9M\" autocomplete=\"off\"\n        style=\"text-transform:uppercase;text-align:center;font-family:'Reem Kufi';font-size:24px;letter-spacing:6px\"></div>\n    <button class=\"btn\" id=\"joinBtn\">دخول</button>\n    <button class=\"btn ghost\" id=\"createBtn\">أنشئ غرفة جديدة</button>\n  </div>\n  <p class=\"err\" id=\"homeErr\"></p>\n</section>\n\n<section class=\"screen\" id=\"s-lobby\">\n  <div class=\"roomcode-box\">\n    <p class=\"tag\">رمز الغرفة</p>\n    <div class=\"roomcode\" id=\"codeShow\">----</div>\n    <button class=\"btn ghost\" style=\"margin-top:6px;padding:10px;font-size:14px\" id=\"copyBtn\">انسخ الرابط</button>\n  </div>\n  <h3>اللاعبين (<span id=\"pCount\">0</span>)</h3>\n  <ul class=\"players\" id=\"lobbyList\"></ul>\n  <div id=\"hostBox\" style=\"display:none\">\n    <h3>التوزيع</h3>\n    <div class=\"field\"><label for=\"mafiaCount\">عدد المافيا</label><select id=\"mafiaCount\"></select></div>\n    <div class=\"field\"><label>الأدوار الخاصة</label>\n      <div class=\"chips\" id=\"roleChips\">\n        <button class=\"chip\" data-r=\"doctor\">🩺 طبيب</button>\n        <button class=\"chip\" data-r=\"detective\">🔍 محقق</button>\n        <button class=\"chip\" data-r=\"godfather\">🎩 عرّاب</button>\n        <button class=\"chip\" data-r=\"sniper\">🎯 قنّاص</button>\n        <button class=\"chip\" data-r=\"mayor\">⚖️ عمدة</button>\n        <button class=\"chip\" data-r=\"jester\">🃏 مهرّج</button>\n      </div>\n    </div>\n    <h3>خيارات</h3>\n    <div class=\"field\"><label for=\"saveMode\">إعلان إنقاذ الطبيب</label>\n      <select id=\"saveMode\"><option value=\"name\">اذكر الاسم</option><option value=\"anon\">بدون اسم</option><option value=\"none\">بدون إعلان</option></select></div>\n    <div class=\"field\"><label for=\"talkLen\">وقت النقاش</label>\n      <select id=\"talkLen\"><option value=\"120\">دقيقتين</option><option value=\"180\">٣ دقائق</option><option value=\"300\">٥ دقائق</option></select></div>\n    <div class=\"field\"><label for=\"lastWords\">الكلمة الأخيرة</label>\n      <select id=\"lastWords\"><option value=\"1\">مفعّلة</option><option value=\"0\">مغلقة</option></select></div>\n    <button class=\"btn\" id=\"startBtn\">ابدأ اللعبة</button>\n    <p class=\"hint\" id=\"lobbyHint\"></p>\n  </div>\n  <p class=\"hint\" id=\"waitHint\">استنّوا المضيف يبدأ…</p>\n</section>\n\n<section class=\"screen\" id=\"s-role\">\n  <h2>دورك السري</h2>\n  <p class=\"sub\">شوفه لحالك — ما حدا غيرك بيشوف شاشتك.</p>\n  <div class=\"card big\" id=\"roleCard\"></div>\n  <button class=\"btn\" id=\"roleNext\">حفظت دوري — نفّذ مهمتك</button>\n</section>\n\n<section class=\"screen\" id=\"s-night\">\n  <div class=\"status\"><span id=\"nightNo\"></span><span id=\"nightCount\"></span></div>\n  <div id=\"deadBanner\"></div>\n  <div class=\"banner\" id=\"nightBanner\"></div>\n  <div id=\"matesBox\"></div>\n  <div id=\"picksBox\"></div>\n  <p class=\"sub\" id=\"nightPrompt\"></p>\n  <div id=\"nightPicks\"></div>\n  <button class=\"btn\" id=\"nightBtn\" disabled>تأكيد</button>\n  <div id=\"nightDone\" style=\"display:none\">\n    <div class=\"card center\"><div class=\"glyph\">🌙</div>\n      <p style=\"margin-top:12px\">تم الإرسال</p>\n      <div class=\"progress\"><i id=\"nightBar\"></i></div>\n      <p class=\"tag\">مستنيين: <span id=\"nightPending\"></span></p></div>\n  </div>\n</section>\n\n<section class=\"screen\" id=\"s-dawn\">\n  <h2 id=\"dawnTitle\"></h2>\n  <div class=\"card\" id=\"dawnCard\"></div>\n  <p class=\"tag\">الأحياء الآن</p>\n  <div class=\"alive-list\" id=\"dawnAlive\"></div>\n  <details><summary>سجل الأحداث</summary><div class=\"log\" id=\"dawnLog\"></div></details>\n  <button class=\"btn\" id=\"goTalk\" style=\"display:none\">ابدأ النقاش</button>\n  <p class=\"hint\" id=\"dawnWait\">استنّوا المضيف…</p>\n</section>\n\n<section class=\"screen\" id=\"s-talk\">\n  <h2>وقت النقاش</h2>\n  <p class=\"sub\">احكوا مع بعض — الجوالات بتضل بأيديكم.</p>\n  <div class=\"card\"><div class=\"timer\" id=\"clock\">03:00</div><p class=\"hint\" id=\"clockHint\">الوقت شغّال</p></div>\n  <button class=\"btn\" id=\"goVote\" style=\"display:none\">ابدأوا التصويت</button>\n  <p class=\"hint\" id=\"talkWait\">استنّوا المضيف يبدأ التصويت…</p>\n</section>\n\n<section class=\"screen\" id=\"s-vote\">\n  <h2>صوّت بالسر</h2>\n  <div id=\"deadBanner2\"></div>\n  <p class=\"sub\" id=\"voteSub\"></p>\n  <div id=\"votePicks\"></div>\n  <button class=\"btn\" id=\"voteBtn\" disabled>أرسل صوتي</button>\n  <div id=\"voteDone\" style=\"display:none\">\n    <div class=\"card center\"><div class=\"glyph\">🗳️</div>\n      <p style=\"margin-top:12px\">تم التصويت</p>\n      <div class=\"progress\"><i id=\"voteBar\"></i></div>\n      <p class=\"tag\" id=\"voteCount\"></p></div>\n  </div>\n</section>\n\n<section class=\"screen\" id=\"s-verdict\">\n  <h2 id=\"verdictTitle\"></h2>\n  <div class=\"card\" id=\"verdictCard\"></div>\n  <button class=\"btn\" id=\"goNight\" style=\"display:none\">تعال الليل</button>\n  <p class=\"hint\" id=\"verdictWait\">استنّوا المضيف…</p>\n</section>\n\n<section class=\"screen\" id=\"s-end\">\n  <div class=\"center\" style=\"padding:30px 16px 10px\">\n    <div class=\"glyph\" id=\"endGlyph\"></div><h2 id=\"endTitle\"></h2><p class=\"sub\" id=\"endText\"></p>\n  </div>\n  <div class=\"card\" id=\"endRoles\"></div>\n  <details><summary>سجل الأحداث</summary><div class=\"log\" id=\"endLog\"></div></details>\n  <button class=\"btn\" id=\"againBtn\" style=\"display:none\">جولة جديدة</button>\n  <button class=\"btn ghost\" id=\"homeBtn\">رجوع للرئيسية</button>\n</section>\n\n<section class=\"screen\" id=\"s-quit\">\n  <div class=\"card big\"><div class=\"glyph\">⚠️</div>\n    <div class=\"role-name\" style=\"font-size:clamp(30px,10vw,48px)\">تطلع من الغرفة؟</div>\n    <p class=\"job\">رح تفقد مكانك باللعبة الحالية.</p></div>\n  <button class=\"btn danger\" id=\"quitYes\">أيوه، اطلع</button>\n  <button class=\"btn ghost\" id=\"quitNo\">لأ، كمّل</button>\n</section>\n\n</div>\n<div class=\"toast\" id=\"toast\"></div>\n\n<script src=\"/socket.io/socket.io.js\"></script>\n<script>\n\"use strict\";\n/* ===== محرك الصوت: كل الأصوات مولّدة داخل المتصفح ===== */\nvar A={ctx:null,on:true,voice:true,amb:null,ambGain:null};\nfunction ac(){\n  if(!A.ctx){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;A.ctx=new C();}\n  if(A.ctx.state===\"suspended\")A.ctx.resume();\n  return A.ctx;\n}\nfunction beep(o){\n  if(!A.on)return;var c=ac();if(!c)return;\n  var t=c.currentTime+(o.at||0),osc=c.createOscillator(),g=c.createGain();\n  osc.type=o.type||\"sine\";osc.frequency.setValueAtTime(o.f,t);\n  if(o.to)osc.frequency.exponentialRampToValueAtTime(o.to,t+(o.dur||.2));\n  g.gain.setValueAtTime(.0001,t);\n  g.gain.exponentialRampToValueAtTime(o.v||.18,t+.015);\n  g.gain.exponentialRampToValueAtTime(.0001,t+(o.dur||.2));\n  osc.connect(g);g.connect(c.destination);osc.start(t);osc.stop(t+(o.dur||.2)+.05);\n}\nfunction noiseBuf(c,sec){var len=Math.floor(c.sampleRate*sec),b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);\n  for(var i=0;i<len;i++)d[i]=Math.random()*2-1;return b;}\nfunction noise(o){\n  if(!A.on)return;var c=ac();if(!c)return;\n  var t=c.currentTime+(o.at||0),dur=o.dur||.2,s=c.createBufferSource();\n  s.buffer=noiseBuf(c,dur+.05);\n  var f=c.createBiquadFilter();f.type=o.type||\"bandpass\";\n  f.frequency.setValueAtTime(o.f,t);\n  if(o.to)f.frequency.exponentialRampToValueAtTime(o.to,t+dur);\n  f.Q.value=o.q||1;\n  var g=c.createGain();g.gain.setValueAtTime(.0001,t);\n  g.gain.exponentialRampToValueAtTime(o.v||.2,t+.008);\n  g.gain.exponentialRampToValueAtTime(.0001,t+dur);\n  s.connect(f);f.connect(g);g.connect(c.destination);s.start(t);s.stop(t+dur+.05);\n}\nfunction stab(){\n  if(!A.on)return;\n  beep({f:2600,type:\"triangle\",v:.09,dur:.13,to:1100});\n  noise({f:3800,to:700,dur:.22,v:.26,q:.8,at:.1});\n  noise({f:500,to:160,dur:.3,v:.3,q:.6,type:\"lowpass\",at:.14});\n  beep({f:120,type:\"sine\",v:.28,dur:.55,to:48,at:.15});\n  beep({f:90,type:\"sine\",v:.16,dur:1.1,to:40,at:.5});\n}\nfunction gunshot(){\n  if(!A.on)return;\n  noise({f:1800,to:200,dur:.28,v:.32,q:.5,type:\"lowpass\"});\n  beep({f:180,type:\"square\",v:.2,dur:.18,to:60});\n  noise({f:900,to:300,dur:.9,v:.07,q:.4,type:\"lowpass\",at:.2});\n}\nfunction chord(l,type,v,dur){l.forEach(function(x,i){beep({f:x,type:type||\"triangle\",v:v||.13,dur:dur||.5,at:i*.11});});}\nfunction sfx(n){\n  if(!A.on)return;\n  switch(n){\n    case \"key\":    beep({f:660,type:\"square\",v:.07,dur:.06});break;\n    case \"tap\":    beep({f:440,type:\"triangle\",v:.1,dur:.12,to:560});break;\n    case \"err\":    beep({f:220,type:\"sawtooth\",v:.12,dur:.22,to:110});break;\n    case \"reveal\": beep({f:392,type:\"triangle\",v:.12,dur:.35,to:523});break;\n    case \"night\":  beep({f:130,type:\"sine\",v:.16,dur:1.1,to:80});break;\n    case \"dawn\":   chord([523,659,784],\"triangle\",.11,.7);break;\n    case \"death\":  stab();break;\n    case \"shot\":   gunshot();break;\n    case \"save\":   chord([659,880,1046],\"sine\",.12,.5);break;\n    case \"eject\":  beep({f:150,type:\"square\",v:.16,dur:.5,to:70});break;\n    case \"tick\":   beep({f:880,type:\"square\",v:.05,dur:.05});break;\n    case \"timeup\": chord([440,440,440],\"square\",.12,.2);break;\n    case \"winCity\":chord([523,659,784,1046],\"triangle\",.13,.75);break;\n    case \"winMafia\":chord([392,349,294,196],\"sawtooth\",.11,.8);break;\n    case \"winJester\":chord([622,740,554,880],\"square\",.1,.4);break;\n  }\n}\nfunction ambientOn(){\n  if(!A.on||A.amb)return;var c=ac();if(!c)return;\n  var g=c.createGain();g.gain.value=.0001;\n  var f=c.createBiquadFilter();f.type=\"lowpass\";f.frequency.value=320;\n  var a=c.createOscillator(),b=c.createOscillator();\n  a.type=\"sine\";a.frequency.value=55;b.type=\"sine\";b.frequency.value=82.5;\n  var lfo=c.createOscillator(),lg=c.createGain();\n  lfo.frequency.value=.12;lg.gain.value=.022;lfo.connect(lg);lg.connect(g.gain);\n  a.connect(f);b.connect(f);f.connect(g);g.connect(c.destination);\n  a.start();b.start();lfo.start();\n  g.gain.exponentialRampToValueAtTime(.045,c.currentTime+2);\n  A.amb={a:a,b:b,lfo:lfo};A.ambGain=g;\n}\nfunction ambientOff(){\n  if(!A.amb)return;var c=A.ctx,t=c.currentTime;\n  try{A.ambGain.gain.cancelScheduledValues(t);A.ambGain.gain.setValueAtTime(A.ambGain.gain.value||.04,t);\n    A.ambGain.gain.exponentialRampToValueAtTime(.0001,t+1.2);\n    A.amb.a.stop(t+1.4);A.amb.b.stop(t+1.4);A.amb.lfo.stop(t+1.4);}catch(e){}\n  A.amb=null;A.ambGain=null;\n}\nfunction speak(txt){\n  if(!A.voice||!window.speechSynthesis)return;\n  try{var u=new SpeechSynthesisUtterance(txt);u.lang=\"ar-SA\";u.rate=.95;\n    var v=speechSynthesis.getVoices().filter(function(x){return /^ar/i.test(x.lang);});\n    if(v.length)u.voice=v[0];\n    speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}\n}\ndocument.addEventListener(\"click\",function once(){ac();document.removeEventListener(\"click\",once);});\n\n</script>\n<script>\n\"use strict\";\n\nconst socket = io();\nconst $ = id => document.getElementById(id);\nconst show = id => { document.querySelectorAll(\".screen\").forEach(s => s.classList.remove(\"on\")); $(id).classList.add(\"on\"); window.scrollTo({ top: 0 }); };\n\nlet me = { code: null, id: null, token: null, isHost: false };\nlet room = null, myTurn = null, choice = null, clockId = null, theme = \"auto\";\n\n// ---------- أدوات واجهة ----------\nfunction toast(msg) {\n  const t = $(\"toast\"); t.textContent = msg; t.style.display = \"block\";\n  clearTimeout(t._id); t._id = setTimeout(() => { t.style.display = \"none\"; }, 2600);\n}\nfunction applyTheme() {\n  document.body.classList.remove(\"theme-light\", \"theme-dark\");\n  if (theme === \"light\") document.body.classList.add(\"theme-light\");\n  if (theme === \"dark\") document.body.classList.add(\"theme-dark\");\n  $(\"themeBtn\").textContent = { auto: \"🌗\", light: \"☀️\", dark: \"🌙\" }[theme];\n  localStorage.setItem(\"mafia_theme\", theme);\n}\n$(\"themeBtn\").onclick = () => {\n  const order = [\"auto\", \"light\", \"dark\"];\n  theme = order[(order.indexOf(theme) + 1) % 3];\n  applyTheme();\n};\n$(\"sndBtn\").onclick = function () { A.on = !A.on; this.classList.toggle(\"off\", !A.on); this.textContent = A.on ? \"🔊\" : \"🔇\"; };\n$(\"vcBtn\").onclick = function () { A.voice = !A.voice; this.classList.toggle(\"off\", !A.voice); if (!A.voice && window.speechSynthesis) speechSynthesis.cancel(); };\ntheme = localStorage.getItem(\"mafia_theme\") || \"auto\"; applyTheme();\n\n// ---------- الجلسة ----------\nfunction saveMe() { localStorage.setItem(\"mafia_me\", JSON.stringify(me)); }\nfunction loadMe() { try { return JSON.parse(localStorage.getItem(\"mafia_me\") || \"null\"); } catch (e) { return null; } }\nfunction clearMe() { localStorage.removeItem(\"mafia_me\"); }\n\nfunction join(code, name, token) {\n  socket.emit(\"join_room\", { code, name, token }, res => {\n    if (!res.ok) { $(\"homeErr\").textContent = res.error; clearMe(); return; }\n    me = { code: res.code, id: res.playerId, token: res.token, isHost: res.isHost };\n    saveMe();\n    $(\"quitBtn\").style.display = \"block\";\n    sfx(\"join\");\n  });\n}\n$(\"joinBtn\").onclick = () => {\n  const name = $(\"joinName\").value.trim(), code = $(\"joinCode\").value.trim().toUpperCase();\n  if (!name) return ($(\"homeErr\").textContent = \"اكتب اسمك\");\n  if (!code) return ($(\"homeErr\").textContent = \"اكتب رمز الغرفة أو اضغط إنشاء غرفة\");\n  join(code, name, null);\n};\n$(\"createBtn\").onclick = () => {\n  const name = $(\"joinName\").value.trim();\n  if (!name) return ($(\"homeErr\").textContent = \"اكتب اسمك الأول\");\n  join(\"\", name, null);\n};\n$(\"copyBtn\").onclick = () => {\n  const url = `${location.origin}/?c=${me.code}`;\n  navigator.clipboard?.writeText(url).catch(() => {});\n  $(\"copyBtn\").textContent = \"انتسخ ✔\";\n  setTimeout(() => { $(\"copyBtn\").textContent = \"انسخ الرابط\"; }, 1500);\n};\n(function () {\n  const c = new URLSearchParams(location.search).get(\"c\");\n  if (c) $(\"joinCode\").value = c.toUpperCase();\n  const s = loadMe();\n  if (s && s.token) socket.emit(\"join_room\", { code: s.code, token: s.token, name: \"_\" }, res => {\n    if (res.ok) { me = { code: res.code, id: res.playerId, token: res.token, isHost: res.isHost }; saveMe(); $(\"quitBtn\").style.display = \"block\"; }\n    else clearMe();\n  });\n})();\n\n// ---------- الخروج ----------\nlet backTo = \"s-home\";\n$(\"quitBtn\").onclick = () => { backTo = document.querySelector(\".screen.on\").id; show(\"s-quit\"); };\n$(\"quitNo\").onclick = () => show(backTo);\n$(\"quitYes\").onclick = () => { socket.emit(\"leave\"); clearMe(); location.reload(); };\n$(\"homeBtn\").onclick = () => { socket.emit(\"leave\"); clearMe(); location.reload(); };\n\n// ---------- اللوبي ----------\nsocket.on(\"toast\", m => toast(m));\nsocket.on(\"room_update\", r => {\n  room = r;\n  me.isHost = r.hostId === me.id;\n  $(\"codeShow\").textContent = r.code;\n  $(\"pCount\").textContent = r.players.length;\n  $(\"lobbyList\").innerHTML = r.players.map((p, i) =>\n    `<li${p.connected ? \"\" : ' style=\"opacity:.5\"'}>\n       <span><span class=\"num\">${i + 1}.</span> ${p.name}${p.id === r.hostId ? \" 👑\" : \"\"}${p.id === me.id ? '<span class=\"you\">أنت</span>' : \"\"}</span>\n       ${me.isHost && r.phase === \"lobby\" && p.id !== r.hostId ? `<button class=\"x\" data-k=\"${p.id}\">✕</button>` : \"\"}\n     </li>`).join(\"\");\n\n  if (r.phase === \"lobby\") {\n    $(\"hostBox\").style.display = me.isHost ? \"block\" : \"none\";\n    $(\"waitHint\").style.display = me.isHost ? \"none\" : \"block\";\n    if (me.isHost) {\n      const maxM = Math.max(1, Math.floor(r.players.length / 3) || 1);\n      const sel = $(\"mafiaCount\");\n      if (sel.dataset.n !== String(maxM)) {\n        sel.innerHTML = \"\"; for (let i = 1; i <= maxM; i++) sel.insertAdjacentHTML(\"beforeend\", `<option value=\"${i}\">${i}</option>`);\n        sel.dataset.n = String(maxM);\n      }\n      sel.value = Math.min(r.settings.mafiaCount, maxM);\n      Object.keys(r.settings.roles).forEach(k => {\n        const c = document.querySelector(`.chip[data-r=\"${k}\"]`);\n        if (c) c.setAttribute(\"aria-pressed\", r.settings.roles[k] ? \"true\" : \"false\");\n      });\n      $(\"saveMode\").value = r.settings.saveMode;\n      $(\"talkLen\").value = String(r.settings.talkLen);\n      $(\"lastWords\").value = r.settings.lastWords ? \"1\" : \"0\";\n      const need = r.settings.mafiaCount + [\"doctor\", \"detective\", \"sniper\", \"mayor\", \"jester\"].filter(x => r.settings.roles[x]).length;\n      $(\"lobbyHint\").textContent = r.players.length < 4 ? \"تحتاج ٤ لاعبين على الأقل\"\n        : need > r.players.length ? `الأدوار (${need}) أكثر من اللاعبين (${r.players.length})`\n        : `${r.players.length} لاعبين · ${r.settings.mafiaCount} مافيا · ${r.players.length - need} مواطن عادي`;\n    }\n    show(\"s-lobby\");\n  }\n});\n$(\"lobbyList\").onclick = e => { const b = e.target.closest(\"[data-k]\"); if (b) socket.emit(\"kick\", { playerId: b.dataset.k }); };\n$(\"roleChips\").onclick = e => {\n  const b = e.target.closest(\".chip\"); if (!b) return;\n  const roles = {}; roles[b.dataset.r] = b.getAttribute(\"aria-pressed\") !== \"true\";\n  socket.emit(\"update_settings\", { roles }); sfx(\"key\");\n};\n$(\"mafiaCount\").onchange = () => socket.emit(\"update_settings\", { mafiaCount: $(\"mafiaCount\").value });\n$(\"saveMode\").onchange = () => socket.emit(\"update_settings\", { saveMode: $(\"saveMode\").value });\n$(\"talkLen\").onchange = () => socket.emit(\"update_settings\", { talkLen: +$(\"talkLen\").value });\n$(\"lastWords\").onchange = () => socket.emit(\"update_settings\", { lastWords: $(\"lastWords\").value === \"1\" });\n$(\"startBtn\").onclick = () => socket.emit(\"start_game\");\n$(\"againBtn\").onclick = () => socket.emit(\"play_again\");\n\n// ---------- الليل ----------\nfunction amDead() {\n  const meP = room && room.players.find(x => x.id === me.id);\n  return meP ? !meP.alive : false;\n}\nfunction spectate(title, text) {\n  $(\"nightNo\").textContent = title;\n  $(\"nightBanner\").innerHTML = `<span class=\"g\">👻</span><span class=\"n\">مشاهد</span>`;\n  $(\"matesBox\").innerHTML = \"\"; $(\"picksBox\").innerHTML = \"\";\n  $(\"deadBanner\").innerHTML = `<div class=\"dead-banner\">أنت خارج اللعبة — بتقدر تتفرج بس ما بتقدر تشارك ولا تحكي.</div>`;\n  $(\"nightPrompt\").textContent = text;\n  $(\"nightPicks\").innerHTML = \"\"; $(\"nightPicks\").style.display = \"none\";\n  $(\"nightBtn\").style.display = \"none\";\n  $(\"nightDone\").style.display = \"block\";\n  show(\"s-night\");\n}\nsocket.on(\"night_start\", ({ night }) => {\n  document.body.classList.remove(\"is-day\");\n  sfx(\"night\"); ambientOn();\n  $(\"nightDone\").style.display = \"none\";\n  if (amDead()) setTimeout(() => { if (amDead()) spectate(`الليلة ${night}`, \"الأحياء عم ينفّذوا مهامهم…\"); }, 250);\n});\nsocket.on(\"your_turn\", turn => {\n  myTurn = turn; choice = null;\n  const alive = !!turn.role;\n  // بطاقة الدور تظهر بالليلة الأولى فقط، وبعدها بيروح مباشرة للمهمة\n  if (turn.isFirst) {\n    $(\"roleCard\").innerHTML = `<div class=\"glyph\">${turn.glyph}</div>\n      <div class=\"role-name ${turn.cls}\">${turn.roleAr}</div>\n      <p class=\"job\">${turn.line}</p>\n      ${turn.mates.length ? `<div class=\"mates\"><span class=\"tag\">شركاؤك بالمافيا</span><b class=\"matebig\">${turn.mates.map(m => m.name + (m.godfather ? \" 🎩\" : \"\")).join(\"<br>\")}</b></div>` : \"\"}`;\n    sfx(\"reveal\");\n    show(\"s-role\");\n  } else {\n    renderNight();\n  }\n});\n$(\"roleNext\").onclick = () => renderNight();\n\nfunction renderNight() {\n  const t = myTurn;\n  $(\"nightNo\").textContent = `الليلة ${t.night}`;\n  $(\"nightBanner\").innerHTML = `<span class=\"g\">${t.glyph}</span><span class=\"n ${t.cls}\">${t.roleAr}</span>`;\n  $(\"matesBox\").innerHTML = t.mates.length\n    ? `<div class=\"mates-card\"><span class=\"lbl\">شركاؤك بالمافيا</span><b class=\"matebig\">${t.mates.map(m => m.name + (m.alive ? \"\" : \" (ميت)\")).join(\"<br>\")}</b></div>` : \"\";\n  $(\"picksBox\").innerHTML = t.kind === \"mafia\"\n    ? `<div class=\"picks-card\"><p class=\"tag center\" id=\"picksInner\">لسا ما اختار حدا من شركائك.</p></div>` : \"\";\n  $(\"nightPrompt\").innerHTML = t.prompt;\n  $(\"deadBanner\").innerHTML = \"\";\n  $(\"nightDone\").style.display = \"none\";\n  $(\"nightPicks\").style.display = \"block\";\n  $(\"nightBtn\").style.display = \"block\";\n  $(\"nightBtn\").disabled = true;\n  $(\"nightBtn\").textContent = \"تأكيد\";\n\n  let html = t.targets.map(n => `<button class=\"pick${t.onlyName && n !== t.onlyName ? \" locked\" : \"\"}\" data-n=\"${n}\">${n}</button>`).join(\"\");\n  if (t.canSkip) html += `<button class=\"pick\" data-n=\"__skip\">ما بدي أطلق الليلة</button>`;\n  const host = $(\"nightPicks\"); host.innerHTML = html;\n  host.onclick = e => {\n    const b = e.target.closest(\".pick\"); if (!b) return;\n    if (t.onlyName && b.dataset.n !== t.onlyName && b.dataset.n !== \"__skip\") {\n      b.classList.add(\"shake\"); setTimeout(() => b.classList.remove(\"shake\"), 320); sfx(\"err\"); return;\n    }\n    host.querySelectorAll(\".pick\").forEach(x => x.setAttribute(\"aria-pressed\", \"false\"));\n    b.setAttribute(\"aria-pressed\", \"true\"); choice = b.dataset.n; sfx(\"key\");\n    $(\"nightBtn\").disabled = false;\n  };\n  show(\"s-night\");\n}\n$(\"nightBtn\").onclick = () => {\n  if (!choice) return;\n  socket.emit(\"night_action\", { target: choice === \"__skip\" ? null : choice, skip: choice === \"__skip\" });\n  $(\"nightPicks\").style.display = \"none\";\n  $(\"nightBtn\").style.display = \"none\";\n  $(\"nightDone\").style.display = \"block\";\n};\nsocket.on(\"already_submitted\", () => {\n  $(\"nightPicks\").style.display = \"none\"; $(\"nightBtn\").style.display = \"none\";\n  $(\"nightDone\").style.display = \"block\";\n  $(\"votePicks\").style.display = \"none\"; $(\"voteBtn\").style.display = \"none\"; $(\"voteDone\").style.display = \"block\";\n});\nsocket.on(\"mafia_picks\", ({ picks }) => {\n  const others = picks.filter(p => {\n    const meP = room && room.players.find(x => x.id === me.id);\n    return !meP || p.by !== meP.name;\n  });\n  const box = $(\"picksInner\");\n  if (!box) return;\n  box.outerHTML = others.length\n    ? `<div id=\"picksInner\">${others.map(p => `<div class=\"row2\"><span class=\"who2\">${p.by}</span><span class=\"tgt\">${p.target}</span></div>`).join(\"\")}\n       <p class=\"hint\">لو اخترت نفس الاسم بيموت أكيد. لو اختلفتوا، الضحية بتنسحب عشوائياً.</p></div>`\n    : `<p class=\"tag center\" id=\"picksInner\">لسا ما اختار حدا من شركائك.</p>`;\n});\nsocket.on(\"night_progress\", ({ done, total, pending }) => {\n  $(\"nightCount\").textContent = `${done} / ${total}`;\n  $(\"nightBar\").style.width = (total ? (done / total * 100) : 0) + \"%\";\n  $(\"nightPending\").textContent = pending.join(\"، \") || \"—\";\n});\nsocket.on(\"detective_result\", ({ name, mafia }) => {\n  $(\"nightDone\").insertAdjacentHTML(\"afterbegin\",\n    `<div class=\"card big\"><div class=\"glyph\">${mafia ? \"🔪\" : \"👤\"}</div>\n      <div class=\"role-name ${mafia ? \"role-mafia\" : \"role-doctor\"}\">${mafia ? \"مافيا\" : \"بريء\"}</div>\n      <p class=\"job\">${name}</p></div>`);\n});\n\n// ---------- الصباح ----------\nsocket.on(\"dawn_result\", ({ night, events, alive, log }) => {\n  ambientOff(); document.body.classList.add(\"is-day\"); clearInterval(clockId);\n  $(\"dawnTitle\").textContent = `صباح اليوم ${night}`;\n  $(\"dawnCard\").innerHTML = events.map(ev => {\n    const hr = `<hr style=\"border:0;border-top:1px solid var(--line);margin:18px 0\">`;\n    switch (ev.type) {\n      case \"saved\": sfx(\"save\"); return `<div class=\"glyph center\">🩺</div><p class=\"center\" style=\"margin-top:14px\">المافيا هجمت على <b>${ev.name}</b>… بس <b class=\"role-doctor\">الطبيب أنقذه</b>.</p>`;\n      case \"saved_anon\": sfx(\"save\"); return `<div class=\"glyph center\">🩺</div><p class=\"center\" style=\"margin-top:14px\">في حدا انهجم عليه… <b class=\"role-doctor\">والطبيب أنقذه</b>.<br><span class=\"tag\">بدون ذكر اسم.</span></p>`;\n      case \"quiet\": sfx(\"dawn\"); return `<p class=\"center\">ليلة هادية. ما صار شي.</p>`;\n      case \"killed\": sfx(\"death\"); return `<div class=\"glyph center\">🕯️</div><p class=\"center\" style=\"margin-top:14px\"><b>${ev.name}</b> ما صحي الصبح.<br><span class=\"tag\">كان دوره: ${ev.roleAr}</span></p>`;\n      case \"sniper_miss\": return `${hr}<p class=\"center\">انسمعت طلقة… بس الهدف نجا منها.</p>`;\n      case \"sniper_hit\": setTimeout(() => sfx(\"shot\"), 600); return `${hr}<div class=\"glyph center\">🎯</div><p class=\"center\" style=\"margin-top:10px\">القنّاص أصاب هدفه! <b>${ev.name}</b> انقتل.<br><span class=\"tag\">كان دوره: ${ev.roleAr}</span></p>`;\n      case \"sniper_selfkill\": setTimeout(() => sfx(\"shot\"), 600); return `${hr}<div class=\"glyph center\">🎯</div><p class=\"center\" style=\"margin-top:10px\">القنّاص أطلق النار على <b>بريء</b>… ودفع الثمن بحياته.<br><b>${ev.name}</b> مات.<br><span class=\"tag\">الهدف ما صابه إشي</span></p>`;\n      default: return \"\";\n    }\n  }).join(\"\");\n  $(\"dawnAlive\").innerHTML = alive.map(n => `<span>${n}</span>`).join(\"\");\n  $(\"dawnLog\").innerHTML = log.map(x => `<div>${x}</div>`).join(\"\");\n  $(\"goTalk\").style.display = me.isHost ? \"block\" : \"none\";\n  $(\"dawnWait\").style.display = me.isHost ? \"none\" : \"block\";\n  show(\"s-dawn\");\n});\n$(\"goTalk\").onclick = () => socket.emit(\"go_talk\");\n$(\"goVote\").onclick = () => socket.emit(\"go_vote\");\n$(\"goNight\").onclick = () => socket.emit(\"go_night\");\n\n// ---------- النقاش ----------\nsocket.on(\"talk_start\", ({ endsAt }) => {\n  document.body.classList.add(\"is-day\");\n  $(\"goVote\").style.display = me.isHost ? \"block\" : \"none\";\n  $(\"talkWait\").style.display = me.isHost ? \"none\" : \"block\";\n  clearInterval(clockId);\n  const tick = () => {\n    const left = Math.max(0, Math.round((endsAt - Date.now()) / 1000));\n    $(\"clock\").textContent = `${String(Math.floor(left / 60)).padStart(2, \"0\")}:${String(left % 60).padStart(2, \"0\")}`;\n    if (left <= 10 && left > 0) sfx(\"tick\");\n    if (left <= 0) { clearInterval(clockId); $(\"clockHint\").textContent = \"خلص الوقت\"; }\n  };\n  tick(); clockId = setInterval(tick, 1000);\n  show(\"s-talk\");\n});\nsocket.on(\"talk_timeup\", () => sfx(\"timeup\"));\n\n// ---------- التصويت ----------\nsocket.on(\"vote_start\", () => {\n  $(\"voteDone\").style.display = \"none\";\n  if (amDead()) {\n    $(\"deadBanner2\").innerHTML = `<div class=\"dead-banner\">أنت خارج اللعبة — ما بتصوّت.</div>`;\n    $(\"voteSub\").textContent = \"الأحياء عم يصوّتوا…\";\n    $(\"votePicks\").innerHTML = \"\"; $(\"votePicks\").style.display = \"none\";\n    $(\"voteBtn\").style.display = \"none\"; $(\"voteDone\").style.display = \"block\";\n    show(\"s-vote\");\n  } else $(\"deadBanner2\").innerHTML = \"\";\n});\nsocket.on(\"vote_prompt\", ({ targets, weight }) => {\n  choice = null;\n  $(\"voteSub\").textContent = weight > 1 ? \"أنت العمدة — صوتك بيتحسب بصوتين.\" : \"مين بتشك فيه؟ ما حدا رح يشوف صوتك.\";\n  const host = $(\"votePicks\");\n  host.style.display = \"block\"; $(\"voteBtn\").style.display = \"block\"; $(\"voteBtn\").disabled = true;\n  $(\"voteDone\").style.display = \"none\";\n  host.innerHTML = targets.map(n => `<button class=\"pick\" data-n=\"${n}\">${n}</button>`).join(\"\") +\n    `<button class=\"pick\" data-n=\"__skip\">امتناع</button>`;\n  host.onclick = e => {\n    const b = e.target.closest(\".pick\"); if (!b) return;\n    host.querySelectorAll(\".pick\").forEach(x => x.setAttribute(\"aria-pressed\", \"false\"));\n    b.setAttribute(\"aria-pressed\", \"true\"); choice = b.dataset.n; sfx(\"key\");\n    $(\"voteBtn\").disabled = false;\n  };\n  show(\"s-vote\");\n});\n$(\"voteBtn\").onclick = () => {\n  if (!choice) return;\n  socket.emit(\"day_vote\", { target: choice === \"__skip\" ? null : choice, skip: choice === \"__skip\" });\n  $(\"votePicks\").style.display = \"none\"; $(\"voteBtn\").style.display = \"none\"; $(\"voteDone\").style.display = \"block\";\n};\nsocket.on(\"vote_progress\", ({ done, total }) => {\n  $(\"voteBar\").style.width = (total ? done / total * 100 : 0) + \"%\";\n  $(\"voteCount\").textContent = `${done} / ${total} صوّتوا`;\n});\n\n// ---------- النتيجة ----------\nsocket.on(\"verdict\", ({ ejected, none, board, log }) => {\n  clearInterval(clockId);\n  const boardHtml = board.length ? board.map(b => `<div style=\"padding:5px 0\">${b.name} — <b>${b.votes}</b></div>`).join(\"\") : `<p class=\"center tag\">كلهم امتنعوا.</p>`;\n  if (none) {\n    sfx(\"dawn\");\n    $(\"verdictTitle\").textContent = none === \"none\" ? \"ما صوّت حدا\" : \"تعادل\";\n    $(\"verdictCard\").innerHTML = boardHtml + `<p class=\"hint\">ما انطرد حدا اليوم.</p>`;\n  } else {\n    sfx(\"eject\");\n    $(\"verdictTitle\").textContent = `انطرد ${ejected.name}`;\n    $(\"verdictCard\").innerHTML = `<div class=\"glyph center\">${ejected.glyph}</div>\n      <p class=\"center\" style=\"margin-top:14px\">كان <b class=\"${ejected.cls}\">${ejected.roleAr}</b>.<br>\n      <span class=\"tag\">${ejected.wasMafia ? \"صابت معكم.\" : ejected.jester ? \"وقعتوا بالفخ!\" : \"غلط — راح بريء.\"}</span></p>\n      <div style=\"margin-top:18px;border-top:1px solid var(--line);padding-top:14px\"><p class=\"tag\" style=\"margin-bottom:8px\">نتيجة الصناديق</p>${boardHtml}</div>`;\n  }\n  $(\"goNight\").style.display = me.isHost ? \"block\" : \"none\";\n  $(\"verdictWait\").style.display = me.isHost ? \"none\" : \"block\";\n  show(\"s-verdict\");\n});\n\n// ---------- النهاية ----------\nsocket.on(\"game_end\", ({ who, name, roles, log }) => {\n  clearInterval(clockId); ambientOff();\n  document.body.classList.toggle(\"is-day\", who !== \"mafia\");\n  const map = {\n    mafia: [\"🔪\", \"المافيا فازت\", \"صاروا يعادلوا الباقين بالعدد.\", \"winMafia\"],\n    citizens: [\"🌤️\", \"القرية فازت\", \"انكشفت كل المافيا.\", \"winCity\"],\n    jester: [\"🃏\", `${name} فاز لحاله!`, \"المهرّج خلاكم تطردوه.\", \"winJester\"]\n  }[who];\n  $(\"endGlyph\").textContent = map[0]; $(\"endTitle\").textContent = map[1]; $(\"endText\").textContent = map[2];\n  sfx(map[3]); speak(map[1]);\n  $(\"endRoles\").innerHTML = `<p class=\"tag\" style=\"margin-bottom:10px\">كل الأدوار</p>` +\n    roles.map(p => `<div class=\"${p.alive ? \"\" : \"dead\"}\" style=\"padding:6px 0\">${p.name} — <b class=\"${p.cls}\">${p.glyph} ${p.roleAr}</b></div>`).join(\"\");\n  $(\"endLog\").innerHTML = log.map(x => `<div>${x}</div>`).join(\"\");\n  $(\"againBtn\").style.display = me.isHost ? \"block\" : \"none\";\n  show(\"s-end\");\n});\n\n</script>\n</body>\n</html>\n";
app.get("/", (req, res) => { res.type("html").send(PAGE); });

const PORT = process.env.PORT || 3000;

// ===================== الأدوار =====================
const ROLES = {
  mafia:     { team: "mafia", ar: "مافيا",    glyph: "🔪", cls: "role-mafia",
    line: "تعرف شركاءك بالمافيا. كل ليلة بتختاروا مين تصفّوه." },
  godfather: { team: "mafia", ar: "العرّاب",  glyph: "🎩", cls: "role-godfather",
    line: "أنت زعيم المافيا. لما المحقق يفحصك بيطلع لك «بريء»." },
  doctor:    { team: "town",  ar: "طبيب",     glyph: "🩺", cls: "role-doctor",
    line: "كل ليلة بتنقذ شخص من الموت. مش نفس الشخص مرتين ورا بعض." },
  detective: { team: "town",  ar: "محقق",     glyph: "🔍", cls: "role-detective",
    line: "كل ليلة بتفحص شخص وبتعرف إذا كان مافيا أو بريء." },
  sniper:    { team: "town",  ar: "القنّاص",  glyph: "🎯", cls: "role-sniper",
    line: "معك رصاصة وحدة بكل اللعبة. إذا أصبت مافيا بيموت، وإذا أصبت بريء بتموت أنت مكانه." },
  mayor:     { team: "town",  ar: "العمدة",   glyph: "⚖️", cls: "role-mayor",
    line: "صوتك بالتصويت بيتحسب بصوتين. اخفِ هويتك أطول فترة ممكنة." },
  jester:    { team: "solo",  ar: "المهرّج",  glyph: "🃏", cls: "role-jester",
    line: "أنت لحالك. بتفوز إذا خلّيت الناس تصوّت عليك وتطردك." },
  villager:  { team: "town",  ar: "مواطن",    glyph: "👤", cls: "role-villager",
    line: "ما عندك قدرة خاصة. سلاحك عقلك وصوتك بالتصويت." }
};
const SPECIALS = ["doctor", "detective", "sniper", "mayor", "jester"];

// ===================== أدوات =====================
const rooms = new Map();
function genCode() {
  const L = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = ""; for (let i = 0; i < 4; i++) s += L[Math.floor(Math.random() * L.length)];
  return s;
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function isMafia(p) { return ROLES[p.role] && ROLES[p.role].team === "mafia"; }
const aliveOf = r => r.players.filter(p => p.alive);
const aliveMafia = r => aliveOf(r).filter(isMafia);

function newRoom(code) {
  return {
    code, hostId: null, players: [], phase: "lobby", night: 0, log: [],
    settings: {
      mafiaCount: 1,
      roles: { doctor: true, detective: true, godfather: false, sniper: false, mayor: false, jester: false },
      talkLen: 180, saveMode: "anon", lastWords: true
    },
    ns: { picks: {}, doctorSave: null, sniperShot: null, lastSave: null, sniperUsed: false, ready: new Set() },
    dayVotes: {}, voteReady: new Set(), talkTimer: null, talkEndsAt: 0
  };
}
function pub(room) {
  return {
    code: room.code, phase: room.phase, night: room.night, settings: room.settings,
    hostId: room.hostId,
    players: room.players.map(p => ({ id: p.id, name: p.name, alive: p.alive, connected: p.connected }))
  };
}
function toPlayer(room, id, ev, data) {
  const p = room.players.find(x => x.id === id);
  if (p && p.socketId) io.to(p.socketId).emit(ev, data);
}
function note(room, t) { room.log.push(t); }
function needSlots(s) { return s.mafiaCount + SPECIALS.filter(r => s.roles[r]).length; }

// ===================== بدء اللعبة =====================
function dealRoles(room) {
  const s = room.settings, n = room.players.length, deck = [];
  for (let i = 0; i < s.mafiaCount; i++) deck.push(i === 0 && s.roles.godfather ? "godfather" : "mafia");
  SPECIALS.forEach(r => { if (s.roles[r]) deck.push(r); });
  while (deck.length < n) deck.push("villager");
  shuffle(deck);
  room.players.forEach((p, i) => { p.role = deck[i]; p.alive = true; });
  room.log = [];
  room.night = 0;
  room.ns.lastSave = null;
  room.ns.sniperUsed = false;
}

function startNight(room) {
  room.night++;
  room.phase = "night";
  room.ns.picks = {}; room.ns.doctorSave = null; room.ns.sniperShot = null; room.ns.ready = new Set();
  const isFirst = room.night === 1;
  io.to(room.code).emit("night_start", { night: room.night, isFirst });

  aliveOf(room).forEach(p => {
    toPlayer(room, p.id, "your_turn", buildTurn(room, p, isFirst));
  });
  emitProgress(room);
  broadcast(room);
}

function buildTurn(room, p, isFirst) {
  const meta = ROLES[p.role];
  const base = {
    night: room.night, isFirst,
    role: p.role, roleAr: meta.ar, glyph: meta.glyph, cls: meta.cls, line: meta.line,
    mates: isMafia(p) ? room.players.filter(x => x.id !== p.id && isMafia(x)).map(x => ({ name: x.name, alive: x.alive, godfather: x.role === "godfather" })) : []
  };
  const others = aliveOf(room).filter(x => x.id !== p.id).map(x => x.name);

  if (isMafia(p)) {
    return Object.assign(base, {
      kind: "mafia",
      prompt: "اختر مين تصفّيه الليلة.",
      targets: aliveOf(room).filter(x => !isMafia(x)).map(x => x.name)
    });
  }
  if (p.role === "doctor") {
    const banned = room.ns.lastSave && room.players.some(x => x.name === room.ns.lastSave && x.alive) ? room.ns.lastSave : null;
    return Object.assign(base, {
      kind: "doctor", banned,
      prompt: "مين بدك تنقذ الليلة؟" + (banned ? ` (ممنوع ${banned} — أنقذته الليلة الماضية)` : ""),
      targets: aliveOf(room).map(x => x.name).filter(n => n !== banned)
    });
  }
  if (p.role === "detective") {
    return Object.assign(base, { kind: "detective", prompt: "مين بدك تفحص؟", targets: others });
  }
  if (p.role === "sniper") {
    if (room.ns.sniperUsed) {
      return Object.assign(base, { kind: "idle", prompt: "رصاصتك خلصت. اختر اسمك وأكّد.", targets: aliveOf(room).map(x => x.name), onlyName: p.name });
    }
    return Object.assign(base, {
      kind: "sniper", canSkip: true,
      prompt: "معك رصاصة وحدة بكل اللعبة. إذا أصبت بريء بتموت أنت والبريء بيضل عايش.",
      targets: others
    });
  }
  // مواطن/عمدة/مهرّج: تمويه — يختار اسمه هو
  return Object.assign(base, {
    kind: "idle",
    prompt: "ما عندك قدرة الليلة. اختر اسمك أنت وأكّد.",
    targets: aliveOf(room).map(x => x.name), onlyName: p.name
  });
}

function submitNight(room, p, target, skip) {
  const ns = room.ns;
  if (isMafia(p)) {
    if (target) ns.picks[p.name] = target;
    // شركاء المافيا يشوفوا اختيارات بعض مباشرة
    const list = Object.keys(ns.picks).map(by => ({ by, target: ns.picks[by] }));
    aliveMafia(room).forEach(m => toPlayer(room, m.id, "mafia_picks", { picks: list }));
  } else if (p.role === "doctor") {
    ns.doctorSave = skip ? null : target;
  } else if (p.role === "detective") {
    if (target) {
      const t = room.players.find(x => x.name === target);
      const looksMafia = t.role === "mafia"; // العرّاب بيطلع بريء
      toPlayer(room, p.id, "detective_result", { name: t.name, mafia: looksMafia });
    }
  } else if (p.role === "sniper" && !ns.sniperUsed) {
    if (!skip && target) { ns.sniperShot = target; ns.sniperUsed = true; }
  }
  ns.ready.add(p.id);
  emitProgress(room);
  if (aliveOf(room).every(x => ns.ready.has(x.id))) resolveNight(room);
}

// ملاحظة أمان: كل اللاعبين الأحياء بيأكدوا كل ليلة (حتى المواطن)،
// فقائمة "المستنيين" ما بتفضح مين عنده دور خاص.
function emitProgress(room) {
  const total = aliveOf(room).length;
  const pending = aliveOf(room).filter(p => !room.ns.ready.has(p.id)).map(p => p.name);
  io.to(room.code).emit("night_progress", { done: total - pending.length, total, pending });
}

function topOf(obj) {
  const vals = {};
  Object.values(obj).forEach(t => { vals[t] = (vals[t] || 0) + 1; });
  const keys = Object.keys(vals);
  if (!keys.length) return null;
  const mx = Math.max(...keys.map(k => vals[k]));
  const top = keys.filter(k => vals[k] === mx);
  return { name: top[Math.floor(Math.random() * top.length)], split: keys.length > 1 };
}

function resolveNight(room) {
  const ns = room.ns;
  room.phase = "dawn";
  ns.lastSave = ns.doctorSave;
  const events = [];
  const pick = topOf(ns.picks);
  const target = pick ? pick.name : null;

  if (target && target === ns.doctorSave) {
    if (room.settings.saveMode === "name") events.push({ type: "saved", name: target });
    else if (room.settings.saveMode === "anon") events.push({ type: "saved_anon" });
    else events.push({ type: "quiet" });
    note(room, `الليلة ${room.night}: هجوم على ${target} والطبيب أنقذه.`);
  } else if (target) {
    const v = room.players.find(x => x.name === target);
    v.alive = false;
    events.push({ type: "killed", name: v.name, roleAr: ROLES[v.role].ar });
    note(room, `الليلة ${room.night}: المافيا قتلت ${v.name} (${ROLES[v.role].ar}).`);
    if (pick.split) note(room, `الليلة ${room.night}: المافيا اختلفوا، والضحية انسحبت عشوائياً.`);
  } else {
    events.push({ type: "quiet" });
    note(room, `الليلة ${room.night}: ما مات حدا.`);
  }

  if (ns.sniperShot) {
    const t = room.players.find(x => x.name === ns.sniperShot);
    const shooter = room.players.find(x => x.role === "sniper");
    if (isMafia(t)) {
      if (ns.sniperShot === ns.doctorSave && t.alive) {
        events.push({ type: "sniper_miss" });
        note(room, `الليلة ${room.night}: القنّاص أطلق على ${t.name} ونجا.`);
      } else if (t.alive) {
        t.alive = false;
        events.push({ type: "sniper_hit", name: t.name, roleAr: ROLES[t.role].ar });
        note(room, `الليلة ${room.night}: القنّاص قتل ${t.name} (${ROLES[t.role].ar}).`);
      }
    } else if (shooter && shooter.alive) {
      shooter.alive = false;
      events.push({ type: "sniper_selfkill", name: shooter.name });
      note(room, `الليلة ${room.night}: القنّاص ${shooter.name} أصاب بريء فمات هو، والهدف نجا.`);
    }
  }

  io.to(room.code).emit("dawn_result", {
    night: room.night, events,
    alive: aliveOf(room).map(p => p.name), log: room.log
  });
  broadcast(room);
  checkEnd(room);
}

function startTalk(room) {
  room.phase = "talk";
  room.talkEndsAt = Date.now() + room.settings.talkLen * 1000;
  clearInterval(room.talkTimer);
  io.to(room.code).emit("talk_start", { endsAt: room.talkEndsAt });
  room.talkTimer = setInterval(() => {
    if (Date.now() >= room.talkEndsAt) { clearInterval(room.talkTimer); io.to(room.code).emit("talk_timeup", {}); }
  }, 1000);
  broadcast(room);
}

function startVote(room) {
  clearInterval(room.talkTimer);
  room.phase = "vote";
  room.dayVotes = {}; room.voteReady = new Set();
  aliveOf(room).forEach(p => { room.dayVotes[p.name] = 0; });
  io.to(room.code).emit("vote_start", {});
  aliveOf(room).forEach(p => toPlayer(room, p.id, "vote_prompt", {
    targets: aliveOf(room).filter(x => x.id !== p.id).map(x => x.name),
    weight: p.role === "mayor" ? 2 : 1
  }));
  broadcast(room);
}

function submitVote(room, p, target, skip) {
  if (room.voteReady.has(p.id)) return;
  if (!skip && target && room.dayVotes[target] !== undefined) room.dayVotes[target] += (p.role === "mayor" ? 2 : 1);
  room.voteReady.add(p.id);
  const total = aliveOf(room).length;
  io.to(room.code).emit("vote_progress", { done: room.voteReady.size, total });
  if (room.voteReady.size >= total) resolveVote(room);
}

function resolveVote(room) {
  room.phase = "verdict";
  const names = Object.keys(room.dayVotes);
  const mx = Math.max(0, ...names.map(n => room.dayVotes[n]));
  const top = names.filter(n => room.dayVotes[n] === mx && mx > 0);
  const board = names.filter(n => room.dayVotes[n] > 0)
    .sort((a, b) => room.dayVotes[b] - room.dayVotes[a])
    .map(n => ({ name: n, votes: room.dayVotes[n] }));

  if (top.length !== 1) {
    note(room, `اليوم ${room.night}: ${mx === 0 ? "ما صوّت حدا" : "تعادل"} — ما انطرد حدا.`);
    io.to(room.code).emit("verdict", { none: mx === 0 ? "none" : "tie", board, log: room.log });
    broadcast(room);
    return;
  }
  const v = room.players.find(p => p.name === top[0]);
  v.alive = false;
  note(room, `اليوم ${room.night}: انطرد ${v.name} (${ROLES[v.role].ar}).`);
  io.to(room.code).emit("verdict", {
    ejected: { name: v.name, roleAr: ROLES[v.role].ar, cls: ROLES[v.role].cls, glyph: ROLES[v.role].glyph, wasMafia: isMafia(v), jester: v.role === "jester" },
    board, lastWords: room.settings.lastWords, log: room.log
  });
  broadcast(room);
  if (v.role === "jester") return finish(room, "jester", v.name);
  checkEnd(room);
}

function checkEnd(room) {
  const m = aliveMafia(room).length;
  const others = aliveOf(room).length - m;
  if (m === 0) { finish(room, "citizens"); return true; }
  if (m >= others) { finish(room, "mafia"); return true; }
  return false;
}
function finish(room, who, name) {
  clearInterval(room.talkTimer);
  room.phase = "end";
  io.to(room.code).emit("game_end", {
    who, name, log: room.log,
    roles: room.players.map(p => ({ name: p.name, roleAr: ROLES[p.role].ar, glyph: ROLES[p.role].glyph, cls: ROLES[p.role].cls, alive: p.alive }))
  });
  broadcast(room);
}
function broadcast(room) { io.to(room.code).emit("room_update", pub(room)); }

// ===================== الاتصالات =====================
io.on("connection", socket => {
  socket.on("join_room", ({ code, name, token }, cb) => {
    code = (code || "").toUpperCase().trim();
    name = (name || "").trim().slice(0, 18);
    let room = rooms.get(code);

    // إنشاء غرفة جديدة إذا ما في رمز
    if (!code) {
      let c; do { c = genCode(); } while (rooms.has(c));
      room = newRoom(c); rooms.set(c, room);
    }
    if (!room) return cb({ ok: false, error: "الغرفة غير موجودة" });

    let player = token && room.players.find(p => p.token === token);
    if (!player) {
      if (!name) return cb({ ok: false, error: "اكتب اسمك" });
      if (room.phase !== "lobby") return cb({ ok: false, error: "اللعبة بدأت — ما في انضمام جديد" });
      if (room.players.some(p => p.name === name)) return cb({ ok: false, error: "الاسم مستخدم، غيّره" });
      if (room.players.length >= 20) return cb({ ok: false, error: "الغرفة ممتلئة" });
      player = {
        id: "p" + Math.random().toString(36).slice(2, 10),
        token: "t" + Math.random().toString(36).slice(2, 14),
        name, role: null, alive: true, connected: true, socketId: socket.id
      };
      room.players.push(player);
      if (!room.hostId) room.hostId = player.id;
    } else {
      player.socketId = socket.id; player.connected = true;
    }
    socket.join(room.code);
    socket.data.room = room.code;
    socket.data.pid = player.id;
    cb({ ok: true, code: room.code, playerId: player.id, token: player.token, isHost: room.hostId === player.id });

    // إعادة إرسال حالة اللاعب لو رجع وسط اللعبة
    if (room.phase === "night" && player.alive && player.role) {
      toPlayer(room, player.id, "your_turn", buildTurn(room, player, room.night === 1));
      if (room.ns.ready.has(player.id)) toPlayer(room, player.id, "already_submitted", {});
    }
    if (room.phase === "vote" && player.alive) {
      toPlayer(room, player.id, "vote_prompt", {
        targets: aliveOf(room).filter(x => x.id !== player.id).map(x => x.name),
        weight: player.role === "mayor" ? 2 : 1
      });
      if (room.voteReady.has(player.id)) toPlayer(room, player.id, "already_submitted", {});
    }
    if (room.phase === "talk") toPlayer(room, player.id, "talk_start", { endsAt: room.talkEndsAt });
    broadcast(room);
  });

  const withRoom = fn => (...args) => {
    const room = rooms.get(socket.data.room);
    if (!room) return;
    const p = room.players.find(x => x.id === socket.data.pid);
    if (!p) return;
    fn(room, p, ...args);
  };
  const hostOnly = fn => withRoom((room, p, ...rest) => { if (room.hostId === p.id) fn(room, p, ...rest); });

  socket.on("update_settings", hostOnly((room, p, s) => {
    if (room.phase !== "lobby") return;
    if (s.mafiaCount) room.settings.mafiaCount = Math.max(1, Math.min(10, +s.mafiaCount));
    if (s.roles) Object.assign(room.settings.roles, s.roles);
    if (s.talkLen) room.settings.talkLen = +s.talkLen;
    if (s.saveMode) room.settings.saveMode = s.saveMode;
    if (typeof s.lastWords === "boolean") room.settings.lastWords = s.lastWords;
    broadcast(room);
  }));

  socket.on("reorder", hostOnly((room, p, { order }) => {
    if (room.phase !== "lobby" || !Array.isArray(order)) return;
    const map = new Map(room.players.map(x => [x.id, x]));
    const next = order.map(id => map.get(id)).filter(Boolean);
    room.players.forEach(x => { if (!next.includes(x)) next.push(x); });
    room.players = next;
    broadcast(room);
  }));

  socket.on("kick", hostOnly((room, p, { playerId }) => {
    if (room.phase !== "lobby" || playerId === room.hostId) return;
    room.players = room.players.filter(x => x.id !== playerId);
    broadcast(room);
  }));

  socket.on("start_game", hostOnly((room, p, _d, cb) => {
    if (room.players.length < 4) return io.to(socket.id).emit("toast", "تحتاج ٤ لاعبين على الأقل");
    if (needSlots(room.settings) > room.players.length) return io.to(socket.id).emit("toast", "الأدوار أكثر من عدد اللاعبين");
    dealRoles(room);
    startNight(room);
  }));

  socket.on("night_action", withRoom((room, p, { target, skip }) => {
    if (room.phase !== "night" || !p.alive) return;
    if (room.ns.ready.has(p.id)) return;
    submitNight(room, p, target, skip);
  }));

  socket.on("go_talk",  hostOnly(room => { if (room.phase === "dawn") startTalk(room); }));
  socket.on("go_vote",  hostOnly(room => { if (room.phase === "talk" || room.phase === "dawn") startVote(room); }));
  socket.on("go_night", hostOnly(room => { if (room.phase === "verdict") startNight(room); }));
  socket.on("play_again", hostOnly(room => {
    if (room.phase !== "end") return;
    room.phase = "lobby"; room.night = 0; room.log = [];
    room.players.forEach(p => { p.role = null; p.alive = true; });
    broadcast(room);
  }));
  socket.on("day_vote", withRoom((room, p, { target, skip }) => {
    if (room.phase !== "vote" || !p.alive) return;
    submitVote(room, p, target, skip);
  }));

  socket.on("leave", () => cleanup());
  socket.on("disconnect", () => cleanup());

  function cleanup() {
    const room = rooms.get(socket.data.room);
    if (!room) return;
    const p = room.players.find(x => x.socketId === socket.id);
    if (!p) return;
    p.connected = false;
    if (room.phase === "lobby") {
      room.players = room.players.filter(x => x.id !== p.id);
      if (room.hostId === p.id) room.hostId = room.players[0] ? room.players[0].id : null;
    }
    broadcast(room);
    if (!room.players.length) setTimeout(() => { if (rooms.get(room.code) === room && !room.players.length) rooms.delete(room.code); }, 120000);
  }
});

// ===================== التشغيل =====================
function localIPs() {
  const out = [];
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) out.push(net.address);
    }
  }
  return out;
}
server.listen(PORT, "0.0.0.0", () => {
  const ips = localIPs();
  console.log("\n=================================================");
  console.log("  ليلة المافيا — شغّالة على الشبكة المحلية");
  console.log("=================================================");
  console.log("  افتح من جوالك (نفس شبكة الواي فاي):\n");
  if (ips.length) ips.forEach(ip => console.log(`     http://${ip}:${PORT}`));
  else console.log(`     http://localhost:${PORT}  (ما لقيت عنوان شبكة)`);
  console.log("\n  على هالجهاز: http://localhost:" + PORT);
  console.log("=================================================\n");
});
