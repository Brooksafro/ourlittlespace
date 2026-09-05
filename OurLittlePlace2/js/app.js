(() => {
  "use strict";

  const PASSWORD = "1404";
  const app = document.getElementById("app");

  const state = {
    scene: "start",
    dialogue: 0,
    typed: false,
    password: "",
    giftsSeen: false,
    memory: 0,
    letterPage: 0,
    musicPlaying: false,
    muted: false
  };

  const dialogue = [
    "Здравей, любов моя. ♥",
    "Ако си стигнала дотук, значи си намерила моето малко тайно място.",
    "Направих го само за теб — с всички онези малки моменти, които правят нас... нас.",
    "Има няколко неща, които искам да ти покажа.",
    "Но първо трябва да ми докажеш, че си ти. ♥"
  ];

  const memories = [
    {label:"Спомен #1", text:"Тук ще сложим ваша снимка и кратък спомен."},
    {label:"Спомен #2", text:"Тук ще сложим още един ваш момент."},
    {label:"Спомен #3", text:"Тук ще сложим любимата ви снимка."}
  ];

  const letterPages = [
`Любов моя,

Искам да знаеш колко много значиш за мен.

Благодаря ти за малките моменти, за разговорите, за смеха, за прегръдките и за всички онези дни, които стават по-хубави само защото си до мен.

Ти правиш обикновените дни специални.`,
`Не знам какво ще ни донесе бъдещето,
но знам едно:

Искам да го изживея с теб.

Искам още спомени, още приключения,
още смях и още моменти, които един ден ще си припомняме с усмивка.

Обичам те. Завинаги. ♥`
  ];

  function shell(content) {
    app.innerHTML = `
      <div class="game">
        <div class="stars"></div>
        <div class="sun"></div>
        <div class="cloud one"></div>
        <div class="cloud two"></div>
        <div class="cloud three"></div>
        <div class="scanlines"></div>
        <header class="hud">
          <div class="hud-hearts" aria-label="Живот">
            <span>♥</span><span>♥</span><span>♥</span>
          </div>
          <div class="hud-label">♥ САМО ЗА ТЕБ ♥</div>
          <button class="mute" id="mute" type="button" aria-label="Звук">♫</button>
        </header>
        <main class="scene">${content}</main>
      </div>`;
    document.getElementById("mute").addEventListener("click", toggleMute);
  }

  function boy(extra = "", pose = "boy-idle.png") {
    return `
      <div class="sprite-img ${extra}" aria-label="Момчето">
        <img src="assets/characters/${pose}" alt="Пиксел персонажът на момчето">
        <div class="tag">АЗ</div>
      </div>`;
  }

  function girl(extra = "") {
    return `
      <div class="sprite-img girl-placeholder ${extra}" aria-label="Момичето">
        <img src="assets/characters/couple.png" alt="Пиксел сцената на двойката">
        <div class="tag">ТИ</div>
      </div>`;
  }

  function start() {
    shell(`
      <section class="panel fade">
        <div class="scene-hearts" aria-hidden="true">
          <span class="float-heart">♥</span><span class="float-heart">♥</span>
          <span class="float-heart">♥</span><span class="float-heart">♥</span>
        </div>
        <h1 class="pixel-title">НАШАТА<br>ИСТОРИЯ</h1>
        <p class="kicker">малките моменти · голямата любов</p>
        <div class="couple supplied-couple">${boy("", "boy-idle.png")}<img class="couple-art" src="assets/characters/couple.png" alt="Пиксел сцена на двойката"></div>
        <button class="button" id="start" type="button">ЗАПОЧНИ ♥</button>
      </section>
    `);
    document.getElementById("start").addEventListener("click", () => {
      state.dialogue = 0;
      dialogueScene();
    });
  }

  function dialogueScene() {
    const text = dialogue[state.dialogue];
    const last = state.dialogue === dialogue.length - 1;

    shell(`
      <section class="panel fade">
        <div class="dialogue">
          <div class="dialogue-character">${boy("speaking", state.dialogue === 0 ? "boy-idle.png" : state.dialogue === 1 ? "boy-smile.png" : "boy-wink.png")}</div>
          <div class="bubble">
            <div class="dialogue-text" id="typed"></div>
            <div class="dialogue-bottom">
              <button class="button" id="next" type="button">${last ? "ОТКЛЮЧИ ТАЙНАТА →" : "СЛЕДВАЩО →"}</button>
            </div>
          </div>
        </div>
      </section>
    `);

    typeText(document.getElementById("typed"), text);

    document.getElementById("next").addEventListener("click", () => {
      if (state.dialogue < dialogue.length - 1) {
        state.dialogue++;
        dialogueScene();
      } else {
        passwordScene();
      }
    });
  }

  function typeText(node, text) {
    let i = 0;
    node.textContent = "";
    const tick = () => {
      if (i >= text.length) return;
      node.textContent += text[i++];
      setTimeout(tick, 22);
    };
    tick();
  }

  function passwordScene(message = "") {
    state.password = "";
    const keys = ["1","2","3","4","5","6","7","8","9","←","0","♥"];

    shell(`
      <section class="panel fade">
        <div class="window">
          <div class="window-bar">
            <div class="window-title">♥ ТАЙНА</div>
            <div class="window-buttons"><span>—</span><span>×</span></div>
          </div>
          <div class="window-body">
            <h2 class="secret-title">♥ ПОЗНАЙ ПАРОЛАТА ♥</h2>
            <p class="secret-sub">Има една малка тайна,<br>която трябва да отключиш...</p>
            <div class="slots" id="slots">${slotsHTML()}</div>
            <div class="keypad">
              ${keys.map(k => `<button class="key" type="button" data-key="${k}">${k}</button>`).join("")}
            </div>
            <div class="secret-message" id="secretMessage">${message}</div>
          </div>
        </div>
      </section>
    `);

    document.querySelectorAll(".key").forEach(btn => {
      btn.addEventListener("click", () => pressKey(btn.dataset.key));
    });
  }

  function slotsHTML() {
    return [0,1,2,3].map(i => `<div class="slot ${state.password[i] ? "filled" : ""}">${state.password[i] ? "♥" : "♡"}</div>`).join("");
  }

  function pressKey(key) {
    if (key === "←") {
      state.password = state.password.slice(0,-1);
    } else if (key === "♥") {
      if (state.password.length === 4) checkPassword();
      return;
    } else if (/^\d$/.test(key) && state.password.length < 4) {
      state.password += key;
      if (state.password.length === 4) {
        setTimeout(checkPassword, 260);
      }
    }
    const slots = document.getElementById("slots");
    if (slots) slots.innerHTML = slotsHTML();
  }

  function checkPassword() {
    if (state.password === PASSWORD) {
      secretUnlocked();
    } else {
      const message = document.getElementById("secretMessage");
      if (message) message.textContent = "Ммм... не е това. Опитай пак, любов. ♥";
      state.password = "";
      setTimeout(() => {
        const slots = document.getElementById("slots");
        if (slots) slots.innerHTML = slotsHTML();
      }, 500);
    }
  }

  function secretUnlocked() {
    shell(`
      <section class="panel fade">
        <div class="window">
          <div class="window-bar">
            <div class="window-title">♥ ТАЙНА</div>
            <div class="window-buttons"><span>✓</span><span>×</span></div>
          </div>
          <div class="window-body" style="text-align:center">
            <div class="lock"></div>
            <h2 class="secret-title">ПРАВИЛНО! ♥</h2>
            <p class="secret-sub">Тайната е отключена...<br>сега започва истинската част.</p>
            <button class="button" id="gifts" type="button">ПРОДЪЛЖИ →</button>
          </div>
        </div>
      </section>
    `);
    document.getElementById("gifts").addEventListener("click", giftsScene);
  }

  function giftsScene() {
    shell(`
      <section class="panel fade">
        <h2 class="pixel-title" style="font-size:clamp(20px,4.5vw,46px)">ИЗБЕРИ<br>СВОЯ ПОДАРЪК</h2>
        <p class="kicker">Във всеки подарък има нещо специално...<br>но какво е — ще разбереш чак след избора. ♥</p>
        <div class="gifts">
          ${[1,2,3].map(n => `
            <button class="gift" type="button" data-gift="${n}" aria-label="Подарък ${n}">
              <div class="gift-box"><div class="gift-bow"></div><div class="gift-q">?</div></div>
              <div class="gift-label">ПОДАРЪК ${n}</div>
            </button>`).join("")}
        </div>
      </section>
    `);

    document.querySelectorAll(".gift").forEach(btn => {
      btn.addEventListener("click", () => revealGift(Number(btn.dataset.gift)));
    });
  }

  function revealGift(n) {
    const data = {
      1: {icon:"♥", title:"Писмо за теб", text:"Избралa си нещо от сърцето ми. Вътре те чака писмо.", next:"КЪМ ПИСМОТО →", action:letterIntro},
      2: {icon:"📸", title:"Нашите спомени", text:"Този подарък крие моменти, които искам да запазим завинаги.", next:"КЪМ СПОМЕНИТЕ →", action:memoriesScene},
      3: {icon:"♫", title:"Нашата песен", text:"Този подарък е музикален. Има една песен, която е само за нас.", next:"КЪМ МУЗИКАТА →", action:musicScene}
    }[n];

    shell(`
      <section class="panel fade reveal">
        <div class="reveal-card">
          <div class="reveal-icon">${data.icon}</div>
          <h2 class="reveal-title">${data.title}</h2>
          <p class="reveal-text">${data.text}</p>
          <button class="button" id="revealNext" type="button">${data.next}</button>
        </div>
      </section>
    `);
    document.getElementById("revealNext").addEventListener("click", data.action);
  }

  function memoriesScene() {
    const m = memories[state.memory];
    shell(`
      <section class="panel fade memories">
        <h2 class="section-title">♥ СПОМЕНИ ♥</h2>
        <p class="kicker">Най-хубавите ни моменти...</p>
        <div class="photo-stage">
          <div class="photo-frame">
            <div class="photo-placeholder">
              СЛОЖИ ТУК<br>СНИМКА ${state.memory + 1}
            </div>
            <div class="photo-caption">${m.label}<br>${m.text}</div>
          </div>
          <div class="photo-nav">
            <button class="arrow" id="prevMemory" type="button" aria-label="Предишна">←</button>
            <button class="arrow" id="nextMemory" type="button" aria-label="Следваща">→</button>
          </div>
        </div>
        <div class="thumbs">
          ${memories.map((_,i)=>`<button class="thumb ${i===state.memory?"active":""}" data-memory="${i}" type="button">♥ ${i+1}</button>`).join("")}
        </div>
        <div style="margin-top:18px">
          <button class="button secondary" id="letterFromMem" type="button">КЪМ ПИСМОТО ♥</button>
        </div>
      </section>
    `);
    document.getElementById("prevMemory").addEventListener("click",()=>{state.memory=(state.memory+memories.length-1)%memories.length;memoriesScene()});
    document.getElementById("nextMemory").addEventListener("click",()=>{state.memory=(state.memory+1)%memories.length;memoriesScene()});
    document.querySelectorAll(".thumb").forEach(b=>b.addEventListener("click",()=>{state.memory=Number(b.dataset.memory);memoriesScene()}));
    document.getElementById("letterFromMem").addEventListener("click",letterIntro);
  }

  function letterIntro() {
    shell(`
      <section class="panel fade">
        <h2 class="section-title">♥ ПИСМО ЗА ТЕБ ♥</h2>
        <div class="envelope" id="envelope" role="button" tabindex="0" aria-label="Отвори писмото">
          <div class="flap"></div>
          <div class="heart-seal">♥</div>
        </div>
        <p class="kicker" style="margin-top:18px">Натисни плика, любов. ♥</p>
      </section>
    `);
    const env = document.getElementById("envelope");
    const open = () => {
      env.classList.add("open");
      setTimeout(letterScene, 700);
    };
    env.addEventListener("click",open);
    env.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}});
  }

  function letterScene() {
    shell(`
      <section class="panel fade">
        <h2 class="section-title">♥ ПИСМО ♥</h2>
        <div class="letter">
          ${letterPages.map((p,i)=>`<div class="letter-page ${i===state.letterPage?"active":""}" data-page="${i}"><div class="letter-content" id="letterContent"></div></div>`).join("")}
          <div class="letter-nav">
            <button class="button secondary" id="letterPrev" type="button">←</button>
            <span class="page-number">${state.letterPage+1} / ${letterPages.length}</span>
            <button class="button" id="letterNext" type="button">${state.letterPage === letterPages.length-1 ? "КЪМ МУЗИКАТА →" : "→"}</button>
          </div>
        </div>
      </section>
    `);
    typeText(document.getElementById("letterContent"), letterPages[state.letterPage]);
    document.getElementById("letterPrev").addEventListener("click",()=>{
      if(state.letterPage>0){state.letterPage--;letterScene()}
    });
    document.getElementById("letterNext").addEventListener("click",()=>{
      if(state.letterPage<letterPages.length-1){state.letterPage++;letterScene()}
      else musicScene();
    });
  }

  function musicScene() {
    shell(`
      <section class="panel fade music">
        <h2 class="section-title">♫ НАШАТА ПЕСЕН ♫</h2>
        <div class="player">
          <div class="player-bar"><span>♪ Now Playing</span><span>— □ ×</span></div>
          <div class="album" aria-label="Музикален прозорец"></div>
          <div class="song-name">Нашата песен ♥<br><small>само за нас</small></div>
          <div class="progress"><span id="progress"></span></div>
          <div class="controls">
            <button class="control" type="button" id="back">◀◀</button>
            <button class="control" type="button" id="play">▶</button>
            <button class="control" type="button" id="forward">▶▶</button>
          </div>
          <p class="song-note" id="musicNote">Сложи твоя MP3 файл в <b>assets/music/our-song.mp3</b>.<br>Този бутон ще го пуска след добавянето.</p>
          <button class="button" id="final" type="button">КЪМ КРАЯ ♥</button>
        </div>
      </section>
    `);

    let timer = null;
    const progress = document.getElementById("progress");
    const play = document.getElementById("play");
    const note = document.getElementById("musicNote");

    play.addEventListener("click", () => {
      state.musicPlaying = !state.musicPlaying;
      play.textContent = state.musicPlaying ? "Ⅱ" : "▶";
      note.textContent = state.musicPlaying
        ? "Визуализацията е готова. Добави твоята песен в assets/music/our-song.mp3. ♥"
        : "Песента е на пауза.";
      if(state.musicPlaying){
        let w = 28;
        timer = setInterval(()=>{w=(w+.5)%101;progress.style.width=w+"%"},100);
      } else {
        clearInterval(timer);
      }
    });
    document.getElementById("back").addEventListener("click",()=>{progress.style.width="0%"});
    document.getElementById("forward").addEventListener("click",()=>{progress.style.width="100%"});
    document.getElementById("final").addEventListener("click",finalScene);
  }

  function finalScene() {
    shell(`
      <section class="panel fade">
        <div class="scene-hearts" aria-hidden="true">
          <span class="float-heart">♥</span><span class="float-heart">♥</span>
          <span class="float-heart">♥</span><span class="float-heart">♥</span>
        </div>
        <h1 class="final-title">ОБИЧАМ ТЕ<br>НАЙ-МНОГО<br>НА СВЕТА ♥</h1>
        <div class="final-couple"><img class="final-couple-art" src="assets/characters/couple.png" alt="Пиксел сцена на двойката"></div>
        <p class="final-note">Ти си моят човек.<br>Днес, утре и всеки ден след това.<br>Благодаря ти, че си до мен. ♥</p>
        <div class="cat" aria-hidden="true">🐈</div>
        <div style="margin-top:22px">
          <button class="button" id="again" type="button">ОЩЕ ВЕДНЪЖ ♥</button>
        </div>
      </section>
    `);
    document.getElementById("again").addEventListener("click",()=>{
      state.dialogue=0;state.password="";state.memory=0;state.letterPage=0;start();
    });
  }

  function toggleMute() {
    state.muted = !state.muted;
    const b = document.getElementById("mute");
    b.textContent = state.muted ? "×" : "♫";
    b.setAttribute("aria-label", state.muted ? "Звукът е изключен" : "Звукът е включен");
  }

  start();
})(); 
