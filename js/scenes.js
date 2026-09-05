(() => {
  "use strict";

  const PASSWORD = "1404";
  const app = document.getElementById("app");
  const music = document.getElementById("music");

  const state = {
    dialogue: 0,
    password: "",
    memory: 0,
    giftChosen: false,
    musicPlaying: false
  };

  const dialogue = [
    "Здравей, любов моя. ♥",
    "Ако си стигнала дотук, значи си намерила моето малко тайно място.",
    "Направих го само за теб — с всички онези малки моменти, които правят нас... нас.",
    "Има няколко неща, които искам да ти покажа.",
    "Но първо трябва да ми докажеш, че си ти. ♥"
  ];

  const memories = Array.from({ length: 17 }, (_, i) => ({
    image: `assets/memories/photo${i + 1}.jpg`,
    label: `Спомен #${i + 1}`,
    text: i === 16
      ? "От тук започна нашето приключение... Пръвата ни официална среща"
      : "Още един красив момент от нашата история. ♥"
  }));

  function shell(content) {
    app.innerHTML = `
      <div class="game">
        <div class="sky"></div>
        <div class="sun"></div>
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="stars">✦　·　✦　　 ·　✦　　·　✦</div>
        <div class="scanlines"></div>

        <header class="hud">
          <div class="hud-hearts">♥ ♥ ♥</div>
          <div class="hud-label">♥ САМО ЗА ТЕБ ♥</div>
          <button class="sound-btn" id="soundBtn" type="button">♫</button>
        </header>

        <main class="scene">${content}</main>
      </div>
    `;

    document.getElementById("soundBtn").addEventListener("click", toggleMusic);
  }

  function boy(pose = "boy-idle.png") {
    return `
      <div class="boy-wrap">
        <img src="assets/characters/${pose}" alt="Момчето" class="boy-img">
        <div class="name-tag">АЗ</div>
      </div>
    `;
  }

  function start() {
    state.dialogue = 0;
    shell(`
      <section class="panel opening">
        <div class="hearts">♥　♥　♥</div>
        <h1 class="title">НАШАТА<br>ИСТОРИЯ</h1>
        <p class="subtitle">малките моменти · голямата любов</p>
        <div class="couple-start">
          ${boy()}
          <img src="assets/characters/couple.png" class="couple-art" alt="Двамата">
        </div>
        <button class="button" id="startBtn">ЗАПОЧНИ ♥</button>
      </section>
    `);
    document.getElementById("startBtn").addEventListener("click", dialogueScene);
  }

  function dialogueScene() {
    const last = state.dialogue === dialogue.length - 1;
    const pose = state.dialogue === 0 ? "boy-idle.png"
      : state.dialogue === 1 ? "boy-smile.png"
      : "boy-wink.png";

    shell(`
      <section class="panel">
        <div class="dialogue-layout">
          <div class="character-side">${boy(pose)}</div>
          <div class="bubble">
            <div class="bubble-name">АЗ ♥</div>
            <p id="typed" class="dialogue-text"></p>
            <button class="button" id="nextBtn">${last ? "ОТКЛЮЧИ ТАЙНАТА →" : "СЛЕДВАЩО →"}</button>
          </div>
        </div>
      </section>
    `);

    typeText(document.getElementById("typed"), dialogue[state.dialogue]);

    document.getElementById("nextBtn").addEventListener("click", () => {
      if (state.dialogue < dialogue.length - 1) {
        state.dialogue++;
        dialogueScene();
      } else {
        passwordScene();
      }
    });
  }

  function typeText(node, text) {
    node.textContent = "";
    let i = 0;
    const tick = () => {
      if (i >= text.length) return;
      node.textContent += text[i++];
      setTimeout(tick, 18);
    };
    tick();
  }

  function passwordScene(message = "") {
    state.password = "";
    const keys = ["1","2","3","4","5","6","7","8","9","←","0","♥"];

    shell(`
      <section class="panel">
        <div class="window">
          <div class="window-bar">
            <span>♥ ТАЙНА</span>
            <span>— □ ×</span>
          </div>
          <div class="window-body">
            <div class="lock-icon">🔐</div>
            <h2 class="section-title">ПОЗНАЙ ПАРОЛАТА</h2>
            <p class="subtitle">Има една малка тайна,<br>която трябва да отключиш...</p>
            <div class="slots" id="slots">${slotsHTML()}</div>
            <div class="keypad">
              ${keys.map(k => `<button class="key" data-key="${k}">${k}</button>`).join("")}
            </div>
            <p class="message" id="passwordMessage">${message}</p>
          </div>
        </div>
      </section>
    `);

    document.querySelectorAll(".key").forEach(btn => {
      btn.addEventListener("click", () => pressKey(btn.dataset.key));
    });
  }

  function slotsHTML() {
    return [0,1,2,3].map(i =>
      `<div class="slot">${state.password[i] ? "♥" : "♡"}</div>`
    ).join("");
  }

  function pressKey(key) {
    if (key === "←") {
      state.password = state.password.slice(0, -1);
    } else if (key === "♥") {
      if (state.password.length === 4) checkPassword();
      return;
    } else if (/^\d$/.test(key) && state.password.length < 4) {
      state.password += key;
      if (state.password.length === 4) setTimeout(checkPassword, 220);
    }
    const slots = document.getElementById("slots");
    if (slots) slots.innerHTML = slotsHTML();
  }

  function checkPassword() {
    if (state.password === PASSWORD) {
      unlockedScene();
    } else {
      passwordScene("Ммм... не е това. Опитай пак, любов. ♥");
    }
  }

  function unlockedScene() {
    shell(`
      <section class="panel">
        <div class="window">
          <div class="window-bar"><span>♥ ТАЙНА</span><span>✓ ×</span></div>
          <div class="window-body center">
            <div class="big-heart">♥</div>
            <h2 class="section-title">ПРАВИЛНО! ♥</h2>
            <p class="subtitle">Тайната е отключена...<br>сега започва истинската част.</p>
            <button class="button" id="giftsBtn">ПРОДЪЛЖИ →</button>
          </div>
        </div>
      </section>
    `);
    document.getElementById("giftsBtn").addEventListener("click", giftsScene);
  }

  function giftsScene() {
    shell(`
      <section class="panel">
        <h2 class="title small">ИЗБЕРИ<br>СВОЯ ПОДАРЪК</h2>
        <p class="subtitle">Не можеш да знаеш какво има вътре.<br>Избери само по усещане. ♥</p>
        <div class="gifts">
          ${[1,2,3].map(n => `
            <button class="gift" data-gift="${n}">
              <div class="gift-box">
                <div class="gift-bow">♥</div>
                <div class="gift-question">?</div>
              </div>
              <span>ПОДАРЪК ${n}</span>
            </button>
          `).join("")}
        </div>
      </section>
    `);

    document.querySelectorAll(".gift").forEach(btn => {
      btn.addEventListener("click", () => revealGift(Number(btn.dataset.gift)));
    });
  }

  function revealGift(n) {
    const messages = {
      1: "Избра нещо специално от сърцето ми. ♥",
      2: "Избра една малка част от нашата история. ♥",
      3: "Избра изненада, която пазех само за теб. ♥"
    };

    shell(`
      <section class="panel">
        <div class="reveal-card">
          <div class="big-heart">♥</div>
          <h2 class="section-title">ТВОЯТ ПОДАРЪК</h2>
          <p class="reveal-text">${messages[n]}</p>
          <button class="button" id="memoriesBtn">КЪМ НАШИТЕ СПОМЕНИ →</button>
        </div>
      </section>
    `);

    document.getElementById("memoriesBtn").addEventListener("click", () => {
      state.memory = 0;
      memoriesScene();
    });
  }

  function memoriesScene() {
    const m = memories[state.memory];
    const isLast = state.memory === memories.length - 1;

    shell(`
      <section class="panel memories-panel">
        <div class="memory-top">
          <div>
            <h2 class="section-title">♥ СПОМЕНИ ♥</h2>
            <p class="subtitle">Най-хубавите ни моменти...</p>
          </div>
          <div class="memory-count">${state.memory + 1} / 17</div>
        </div>

        <div class="progress-track">
          <div class="progress-fill" style="width:${((state.memory + 1) / 17) * 100}%"></div>
        </div>

        <div class="photo-frame">
          <img src="${m.image}" alt="${m.label}" class="memory-photo">
        </div>

        <div class="caption">
          <strong>${m.label}</strong>
          <p>${m.text}</p>
        </div>

        <div class="memory-nav">
          <button class="arrow" id="prevMemory" ${state.memory === 0 ? "disabled" : ""}>←</button>
          <span>${state.memory + 1} / 17</span>
          <button class="arrow" id="nextMemory">${isLast ? "♥" : "→"}</button>
        </div>

        <div class="memory-dots">
          ${memories.map((_, i) =>
            `<button class="dot ${i === state.memory ? "active" : ""}" data-index="${i}">${i + 1}</button>`
          ).join("")}
        </div>
      </section>
    `);

    const prev = document.getElementById("prevMemory");
    if (prev) prev.addEventListener("click", () => {
      if (state.memory > 0) {
        state.memory--;
        memoriesScene();
      }
    });

    document.getElementById("nextMemory").addEventListener("click", () => {
      if (state.memory < 16) {
        state.memory++;
        memoriesScene();
      } else {
        finalMemoryScene();
      }
    });

    document.querySelectorAll(".dot").forEach(btn => {
      btn.addEventListener("click", () => {
        state.memory = Number(btn.dataset.index);
        memoriesScene();
      });
    });
  }

  function finalMemoryScene() {
    shell(`
      <section class="panel final-memory">
        <div class="final-photo-frame">
          <img src="assets/memories/photo17.jpg" alt="Спомен #17" class="final-photo">
        </div>

        <div class="final-memory-message">
          <div class="gold-heart">♥</div>
          <p>От тук започна нашето приключение...</p>
          <p class="special">Пръвата ни официална среща</p>
          <div class="gold-heart">♥</div>
        </div>

        <button class="button" id="letterBtn">КЪМ ПИСМОТО ♥</button>
      </section>
    `);

    document.getElementById("letterBtn").addEventListener("click", letterScene);
  }

  function letterScene() {
    shell(`
      <section class="panel">
        <div class="letter-paper">
          <div class="envelope-heart">♥</div>
          <h2 class="section-title">ПИСМО ЗА ТЕБ</h2>
          <div class="letter-text">
            <p>Любов моя,</p>
            <p>Понякога ми е трудно да намеря правилните думи, с които да ти кажа колко много значиш за мен.</p>
            <p>Затова ти направих това малко приключение — нашите моменти, нашите усмивки и началото на всичко.</p>
            <p>Благодаря ти за всички прегръдки, разговори, смях и малки моменти, които правят дните ми по-хубави.</p>
            <p>Искам да събираме още много спомени заедно.</p>
            <p class="ending">Обичам те. ♥</p>
            <p class="signature">Завинаги твой</p>
          </div>
        </div>
        <button class="button" id="musicBtn">КЪМ НАШАТА ПЕСЕН ♫</button>
      </section>
    `);

    document.getElementById("musicBtn").addEventListener("click", musicScene);
  }

  function musicScene() {
    shell(`
      <section class="panel">
        <h2 class="section-title">♫ НАШАТА ПЕСЕН ♫</h2>
        <div class="music-card">
          <div class="record">♪</div>
          <h3>Нашата песен ♥</h3>
          <p>само за нас</p>
          <button class="button" id="playMusic">▶ ПУСНИ</button>
          <p class="music-note">Ако си добавила <b>assets/music/our-song.mp3</b>, музиката ще започне.</p>
        </div>
        <button class="button" id="finalBtn">КЪМ КРАЯ ♥</button>
      </section>
    `);

    document.getElementById("playMusic").addEventListener("click", async () => {
      try {
        await music.play();
        state.musicPlaying = true;
        document.getElementById("playMusic").textContent = "Ⅱ ПАУЗА";
        document.getElementById("playMusic").onclick = () => {
          if (music.paused) {
            music.play();
            document.getElementById("playMusic").textContent = "Ⅱ ПАУЗА";
          } else {
            music.pause();
            document.getElementById("playMusic").textContent = "▶ ПУСНИ";
          }
        };
      } catch {
        document.querySelector(".music-note").textContent =
          "Добави твоя MP3 файл в assets/music/our-song.mp3 и натисни отново. ♥";
      }
    });

    document.getElementById("finalBtn").addEventListener("click", finalScene);
  }

  function finalScene() {
    shell(`
      <section class="panel final-screen">
        <div class="hearts">♥　♥　♥</div>
        <h1 class="title">ОБИЧАМ ТЕ<br>НАЙ-МНОГО<br>НА СВЕТА ♥</h1>
        <img src="assets/characters/couple.png" class="final-couple" alt="Двамата">
        <p class="final-note">Ти си моят човек.<br>Днес, утре и всеки ден след това.<br>Благодаря ти, че си до мен. ♥</p>
        <button class="button" id="againBtn">ОЩЕ ВЕДНЪЖ ♥</button>
      </section>
    `);

    document.getElementById("againBtn").addEventListener("click", () => {
      state.dialogue = 0;
      state.password = "";
      state.memory = 0;
      start();
    });
  }

  async function toggleMusic() {
    const btn = document.getElementById("soundBtn");
    if (!music) return;

    try {
      if (music.paused) {
        await music.play();
        state.musicPlaying = true;
        btn.textContent = "Ⅱ";
      } else {
        music.pause();
        state.musicPlaying = false;
        btn.textContent = "♫";
      }
    } catch {
      btn.textContent = "×";
    }
  }

  start();
})();
