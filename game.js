/* ============================================================
   GAME ENGINE — Grammar on Trial
   Vanilla JS. No build step. Drops straight into GitHub Pages.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Difficulty settings ---------- */
  const DIFFS = {
    intern:     { rep: 5, hints: "free", includeHard: false, label: "Intern" },
    specialist: { rep: 4, hints: "cost", includeHard: false, label: "Specialist" },
    ceo:        { rep: 3, hints: "none", includeHard: true,  label: "CEO" }
  };

  const PRAISE = [
    "Clean work. Next.",
    "That is the standard. Keep moving.",
    "Sharp. The reader thanks you.",
    "Yes. That is how a pro writes."
  ];
  const NUDGE = [
    "Not quite. Read the feedback and keep going.",
    "Close. Look at why before the next one.",
    "That one bit back. Shake it off.",
    "Missed it. The note explains the fix."
  ];

  /* ---------- State ---------- */
  const state = {
    diff: "intern",
    caseIndex: 0,
    challenges: [],
    challengeIndex: 0,
    rep: 5,
    maxRep: 5,
    cleared: [],          // case ids cleared
    badges: [],           // badge labels earned
    hintUsed: false,
    phase: "idle",        // dialogue | challenge | result
    dialogueQueue: [],
    onDialogueDone: null,
    dnd: null             // active drag controller (for teardown)
  };

  /* ---------- Element grabs ---------- */
  const $ = (sel) => document.querySelector(sel);
  const screens = {
    title: $("#screen-title"),
    how: $("#screen-how"),
    map: $("#screen-map"),
    play: $("#screen-play"),
    win: $("#screen-win")
  };
  const el = {
    diffGrid: $(".difficulty__grid"),
    start: $("#btn-start"),
    how: $("#btn-how"),
    caseList: $("#case-list"),
    rankValue: $("#map-rank-value"),
    hudTag: $("#hud-case-tag"),
    hudName: $("#hud-case-name"),
    repHearts: $("#rep-hearts"),
    progressFill: $("#progress-fill"),
    speaker: $("#speaker"),
    avatar: $("#speaker-avatar"),
    challenge: $("#challenge"),
    dialogue: $("#dialogue"),
    dlgName: $("#dialogue-name"),
    dlgText: $("#dialogue-text"),
    dlgNext: $("#dialogue-next"),
    hint: $("#btn-hint"),
    submit: $("#btn-submit"),
    shout: $("#shout"),
    shoutText: $("#shout-text"),
    winStats: $("#win-stats"),
    replay: $("#btn-replay")
  };

  /* ---------- Screen control ---------- */
  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("is-active"));
    screens[name].classList.add("is-active");
    window.scrollTo(0, 0);
  }

  /* ============================================================
     TITLE + MENU WIRING
     ============================================================ */
  el.diffGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".diff-card");
    if (!card) return;
    state.diff = card.dataset.diff;
    el.diffGrid.querySelectorAll(".diff-card").forEach((c) => {
      const on = c === card;
      c.classList.toggle("is-selected", on);
      c.setAttribute("aria-checked", on ? "true" : "false");
    });
  });

  el.how.addEventListener("click", () => showScreen("how"));
  document.querySelectorAll(".js-close-sheet").forEach((b) =>
    b.addEventListener("click", () => showScreen("title"))
  );

  el.start.addEventListener("click", () => {
    state.cleared = [];
    state.badges = [];
    buildMap();
    showScreen("map");
  });

  el.replay.addEventListener("click", () => showScreen("title"));

  /* ============================================================
     CASE MAP
     ============================================================ */
  function currentRank() {
    return state.badges.length ? state.badges[state.badges.length - 1] : "Trainee";
  }

  function buildMap() {
    el.rankValue.textContent = currentRank();
    el.caseList.innerHTML = "";

    CASES.forEach((c, i) => {
      const done = state.cleared.includes(c.id);
      const open = i === 0 || state.cleared.includes(CASES[i - 1].id);
      const li = document.createElement("li");

      const row = document.createElement("button");
      row.className = "case-row";
      if (done) row.classList.add("is-done");
      if (!open && !done) row.classList.add("is-locked");
      row.disabled = !open && !done ? true : false;

      let status, statusClass;
      if (done) { status = "Cleared"; statusClass = "done"; }
      else if (open) { status = "Open"; statusClass = "open"; }
      else { status = "Locked"; statusClass = "locked"; }

      row.innerHTML =
        '<span class="case-row__num">' + c.id + "</span>" +
        '<span class="case-row__body">' +
          '<span class="case-row__title">' + esc(c.title) + "</span>" +
          '<span class="case-row__skill">' + esc(c.skill) + "</span>" +
        "</span>" +
        '<span class="case-row__status case-row__status--' + statusClass + '">' + status + "</span>";

      if (open || done) {
        row.addEventListener("click", () => startCase(i));
      }
      li.appendChild(row);
      el.caseList.appendChild(li);
    });
  }

  /* ============================================================
     CASE FLOW
     ============================================================ */
  function startCase(index) {
    state.caseIndex = index;
    const c = CASES[index];

    // Filter challenges by difficulty (hardOnly only on CEO)
    state.challenges = c.challenges.filter(
      (ch) => !ch.hardOnly || DIFFS[state.diff].includeHard
    );
    state.challengeIndex = 0;
    state.maxRep = DIFFS[state.diff].rep;
    state.rep = state.maxRep;

    el.hudTag.textContent = "Case " + c.id;
    el.hudName.textContent = c.title;
    renderHearts();
    setProgress(0);

    showScreen("play");
    runDialogue(c.intro, () => nextChallenge());
  }

  function nextChallenge() {
    if (state.challengeIndex >= state.challenges.length) {
      return finishCase();
    }
    const ch = state.challenges[state.challengeIndex];
    renderChallenge(ch);
  }

  function finishCase() {
    const c = CASES[state.caseIndex];
    if (!state.cleared.includes(c.id)) state.cleared.push(c.id);
    if (!state.badges.includes(c.badge)) state.badges.push(c.badge);

    setProgress(100);
    clearChallenge();

    runDialogue(c.outro, () => {
      // Last case? Win. Otherwise back to map.
      const isLast = state.caseIndex === CASES.length - 1;
      if (isLast) {
        showWin();
      } else {
        buildMap();
        showScreen("map");
      }
    });
  }

  function failCase() {
    clearChallenge();
    const fail = [
      { speaker: "max", text: "The memo exploded. Literally. There is jelly on the ceiling." },
      { speaker: "buzz", text: "Reputation gone, but not your job. Take a breath and run the case again. You learn the fix by doing the fix." }
    ];
    runDialogue(fail, () => {
      buildMap();
      showScreen("map");
    });
  }

  function showWin() {
    const total = CASES.length;
    el.winStats.textContent =
      "Rank: CEO  ·  Cases cleared: " + total + " of " + total +
      "  ·  Clearance: " + DIFFS[state.diff].label;
    showScreen("win");
  }

  /* ============================================================
     DIALOGUE RUNNER
     ============================================================ */
  function setSpeaker(speakerKey, popAvatar) {
    el.dlgName.textContent = SPEAKERS[speakerKey] || "";
    el.dlgName.className = "dialogue__name dialogue__name--" + speakerKey;
    el.avatar.className = "avatar avatar--" + speakerKey;
    el.avatar.innerHTML = '<span class="avatar__face"></span>';
    if (popAvatar) {
      el.avatar.classList.add("avatar-pop");
      setTimeout(() => el.avatar.classList.remove("avatar-pop"), 400);
    }
  }

  function runDialogue(lines, onDone) {
    state.phase = "dialogue";
    state.dialogueQueue = lines.slice();
    state.onDialogueDone = onDone;
    clearChallenge();
    el.hint.hidden = true;
    el.submit.hidden = true;
    el.dlgNext.hidden = false;
    advanceDialogue();
  }

  function advanceDialogue() {
    if (state.dialogueQueue.length === 0) {
      const cb = state.onDialogueDone;
      state.onDialogueDone = null;
      if (cb) cb();
      return;
    }
    const line = state.dialogueQueue.shift();
    setSpeaker(line.speaker, true);
    typeText(line.text);
  }

  // Lightweight typewriter that can be skipped by clicking again.
  let typeTimer = null;
  let typing = false;
  let fullText = "";
  function typeText(text) {
    fullText = text;
    typing = true;
    el.dlgText.textContent = "";
    el.dlgNext.hidden = true;
    let i = 0;
    clearInterval(typeTimer);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.dlgText.textContent = text;
      typing = false;
      el.dlgNext.hidden = false;
      return;
    }
    typeTimer = setInterval(() => {
      el.dlgText.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(typeTimer);
        typing = false;
        el.dlgNext.hidden = false;
      }
    }, 16);
  }

  function handleDialogueClick() {
    if (state.phase === "dialogue") {
      if (typing) {
        clearInterval(typeTimer);
        el.dlgText.textContent = fullText;
        typing = false;
        el.dlgNext.hidden = false;
      } else {
        advanceDialogue();
      }
    } else if (state.phase === "result") {
      if (typing) {
        clearInterval(typeTimer);
        el.dlgText.textContent = fullText;
        typing = false;
        el.dlgNext.hidden = false;
        return;
      }
      const cb = state.onContinue;
      state.onContinue = null;
      if (cb) cb();
    }
  }

  el.dialogue.addEventListener("click", handleDialogueClick);
  el.dialogue.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleDialogueClick();
    }
  });

  /* Show a feedback line, wait for a click to continue. */
  function awaitContinue(speaker, text, onContinue) {
    state.phase = "result";
    state.onContinue = onContinue;
    setSpeaker(speaker, false);
    typeText(text);
    el.submit.hidden = true;
    el.hint.hidden = true;
  }

  /* ============================================================
     REPUTATION + PROGRESS
     ============================================================ */
  function renderHearts() {
    el.repHearts.innerHTML = "";
    for (let i = 0; i < state.maxRep; i++) {
      const h = document.createElement("span");
      h.className = "heart" + (i >= state.rep ? " is-lost" : "");
      el.repHearts.appendChild(h);
    }
  }

  function loseRep() {
    state.rep = Math.max(0, state.rep - 1);
    renderHearts();
  }

  function setProgress(pct) {
    el.progressFill.style.width = pct + "%";
  }

  /* ============================================================
     SHOUT + SHAKE FEEDBACK
     ============================================================ */
  function shout(text, good) {
    el.shoutText.textContent = text;
    el.shoutText.className = "shout__text" + (good ? " shout__text--good" : "");
    el.shout.classList.add("is-on");
    // re-trigger animation
    el.shoutText.style.animation = "none";
    void el.shoutText.offsetWidth;
    el.shoutText.style.animation = "";
    setTimeout(() => el.shout.classList.remove("is-on"), 850);
  }

  function shakeStage() {
    el.challenge.classList.add("shake");
    setTimeout(() => el.challenge.classList.remove("shake"), 420);
  }

  /* ============================================================
     CHALLENGE RENDERING
     ============================================================ */
  function clearChallenge() {
    if (state.dnd && state.dnd.destroy) state.dnd.destroy();
    state.dnd = null;
    el.challenge.innerHTML = "";
  }

  function renderChallenge(ch) {
    state.phase = "challenge";
    state.hintUsed = false;
    clearChallenge();

    // Dialogue box shows a short coaching nudge while answering.
    setSpeaker("buzz", false);
    el.dlgText.textContent = "Your call. Read it carefully, then lock in your answer.";
    el.dlgNext.hidden = true;

    // Hint button visibility
    const hintMode = DIFFS[state.diff].hints;
    el.hint.hidden = !(ch.hint && hintMode !== "none");
    el.hint.disabled = false;
    el.hint.textContent = hintMode === "cost" ? "Hint (costs 1)" : "Hint";

    if (ch.type === "mc") renderMC(ch);
    else if (ch.type === "sort") renderSort(ch);
    else if (ch.type === "build") renderBuild(ch);
  }

  function showHint(ch) {
    if (state.hintUsed) return;
    state.hintUsed = true;
    if (DIFFS[state.diff].hints === "cost") {
      loseRep();
      if (state.rep <= 0) { afterAnswer(false, ch, true); return; }
    }
    const box = document.createElement("div");
    box.className = "challenge__hint";
    box.textContent = "Hint: " + ch.hint;
    el.challenge.appendChild(box);
    el.hint.disabled = true;
  }
  el.hint.addEventListener("click", () => {
    const ch = state.challenges[state.challengeIndex];
    if (ch) showHint(ch);
  });

  /* ---------- MULTIPLE CHOICE ---------- */
  function renderMC(ch) {
    el.submit.hidden = true;

    const q = document.createElement("div");
    q.className = "challenge__q";
    q.textContent = ch.q;
    el.challenge.appendChild(q);

    const wrap = document.createElement("div");
    wrap.className = "options";

    // Shuffle order on CEO for extra bite
    const opts = ch.options.map((o, idx) => ({ o, idx }));
    if (DIFFS[state.diff].includeHard) shuffle(opts);

    opts.forEach(({ o }) => {
      const b = document.createElement("button");
      b.className = "option";
      b.type = "button";
      b.innerHTML = "<span>" + esc(o.text) + "</span>";
      b.addEventListener("click", () => {
        // lock all
        wrap.querySelectorAll(".option").forEach((x) => (x.disabled = true));
        revealMC(wrap, ch, o);
      });
      wrap.appendChild(b);
    });

    el.challenge.appendChild(wrap);
  }

  function revealMC(wrap, ch, chosen) {
    const buttons = Array.from(wrap.querySelectorAll(".option"));
    buttons.forEach((b) => {
      const label = b.querySelector("span").textContent;
      const opt = ch.options.find((o) => o.text === label);
      if (!opt) return;
      if (opt.correct) b.classList.add("is-correct");
      if (opt === chosen && !opt.correct) b.classList.add("is-wrong");
      // attach feedback under the chosen + the correct one
      if (opt === chosen || opt.correct) {
        const fb = document.createElement("span");
        fb.className = "option__fb";
        fb.textContent = opt.fb;
        b.appendChild(fb);
      }
    });
    afterAnswer(chosen.correct, ch);
  }

  /* ---------- SORTING (drag into buckets) ---------- */
  function renderSort(ch) {
    el.submit.hidden = false;
    el.submit.textContent = "Present";

    const q = document.createElement("div");
    q.className = "challenge__q";
    q.textContent = ch.q;
    el.challenge.appendChild(q);

    const dnd = document.createElement("div");
    dnd.className = "dnd";

    const instr = document.createElement("p");
    instr.className = "dnd__instructions";
    instr.textContent = ch.instructions;
    dnd.appendChild(instr);

    // tray of items (shuffled)
    const tray = document.createElement("div");
    tray.className = "tray";
    tray.dataset.zone = "tray";

    const items = ch.items.slice();
    shuffle(items);
    items.forEach((item) => tray.appendChild(makeChip(item.text, { correctBucket: item.bucket, fb: item.fb })));
    dnd.appendChild(tray);

    // buckets
    const buckets = document.createElement("div");
    buckets.className = "buckets";
    ch.buckets.forEach((bk) => {
      const z = document.createElement("div");
      z.className = "bucket bucket--" + (bk.kind === "good" ? "good" : bk.kind === "bad" ? "bad" : "neutral");
      z.dataset.zone = bk.id;
      z.tabIndex = 0;
      z.innerHTML = '<span class="bucket__label">' + esc(bk.label) + "</span>";
      buckets.appendChild(z);
    });
    dnd.appendChild(buckets);

    el.challenge.appendChild(dnd);

    const zoneEls = [tray, ...buckets.querySelectorAll(".bucket")];
    state.dnd = setupDnD(dnd, zoneEls);

    el.submit.onclick = () => gradeSort(ch, tray, buckets);
  }

  function gradeSort(ch, tray, bucketsWrap) {
    // every item must be inside its correct bucket
    const chips = Array.from(el.challenge.querySelectorAll(".chip"));
    let allRight = true;
    chips.forEach((chip) => {
      const parentZone = chip.parentElement.dataset.zone;
      const correctBucket = chip.dataset.correctBucket;
      const placedRight = parentZone === correctBucket;
      chip.classList.add(placedRight ? "is-graded-right" : "is-graded-wrong");
      if (!placedRight) allRight = false;
    });

    // lock dragging
    if (state.dnd && state.dnd.destroy) state.dnd.destroy();
    el.submit.hidden = true;
    el.hint.hidden = true;

    // build a compact feedback line from the first wrong item, if any
    let fb;
    if (allRight) {
      fb = pick(PRAISE);
    } else {
      const firstWrong = chips.find((c) => c.classList.contains("is-graded-wrong"));
      fb = firstWrong && firstWrong.dataset.fb
        ? firstWrong.dataset.fb
        : "A few landed in the wrong bin. Check the highlights.";
    }
    afterAnswer(allRight, ch, false, fb);
  }

  /* ---------- BUILD (order words in the answer line) ---------- */
  function renderBuild(ch) {
    el.submit.hidden = false;
    el.submit.textContent = "Present";

    const q = document.createElement("div");
    q.className = "challenge__q";
    q.textContent = ch.q;
    el.challenge.appendChild(q);

    const dnd = document.createElement("div");
    dnd.className = "dnd";

    const instr = document.createElement("p");
    instr.className = "dnd__instructions";
    instr.textContent = ch.instructions;
    dnd.appendChild(instr);

    // answer line (target)
    const line = document.createElement("div");
    line.className = "answer-line";
    line.dataset.zone = "answer";
    line.tabIndex = 0;
    line.innerHTML = '<span class="answer-line__label">Your sentence</span>';
    dnd.appendChild(line);

    // tray of word chips
    const tray = document.createElement("div");
    tray.className = "tray";
    tray.dataset.zone = "tray";
    tray.innerHTML = '<span class="answer-line__label">Word bank</span>';
    const chips = ch.chips.slice();
    shuffle(chips);
    chips.forEach((w) => tray.appendChild(makeChip(w, {})));
    dnd.appendChild(tray);

    el.challenge.appendChild(dnd);

    state.dnd = setupDnD(dnd, [line, tray]);

    el.submit.onclick = () => gradeBuild(ch, line);
  }

  function gradeBuild(ch, line) {
    const placed = Array.from(line.querySelectorAll(".chip")).map((c) =>
      c.textContent.trim()
    );
    const correct =
      placed.length === ch.answer.length &&
      placed.every((w, i) => w === ch.answer[i]);

    Array.from(line.querySelectorAll(".chip")).forEach((c, i) => {
      c.classList.add(c.textContent.trim() === ch.answer[i] ? "is-graded-right" : "is-graded-wrong");
    });

    if (state.dnd && state.dnd.destroy) state.dnd.destroy();
    el.submit.hidden = true;
    el.hint.hidden = true;

    let fb = correct
      ? ch.fb
      : "Not in order yet. The clean version is: \u201C" + ch.answer.join(" ") + ".\u201D " + (ch.fb || "");
    afterAnswer(correct, ch, false, fb);
  }

  /* ---------- After any answer ---------- */
  function afterAnswer(correct, ch, hardFail, customFb) {
    if (!correct && !hardFail) {
      loseRep();
      shakeStage();
      shout("OBJECTION!", false);
    } else if (correct) {
      shout("NAILED IT!", true);
    }

    const proceed = () => {
      if (state.rep <= 0) {
        failCase();
        return;
      }
      state.challengeIndex++;
      setProgress((state.challengeIndex / state.challenges.length) * 100);
      nextChallenge();
    };

    if (state.rep <= 0) {
      // out of reputation: let them read one line, then fail
      awaitContinue("buzz", "That was the last of your reputation for this case.", () => failCase());
      return;
    }

    const speaker = correct ? "max" : "buzz";
    const line = customFb ? customFb : (correct ? pick(PRAISE) : pick(NUDGE));
    awaitContinue(speaker, line, proceed);
  }

  /* ============================================================
     CHIP FACTORY
     ============================================================ */
  function makeChip(text, data) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = text;
    if (data.correctBucket) chip.dataset.correctBucket = data.correctBucket;
    if (data.fb) chip.dataset.fb = data.fb;
    return chip;
  }

  /* ============================================================
     DRAG AND DROP (pointer based + tap-to-place fallback)
     Works with mouse and touch. Chips are reparented into zones.
     ============================================================ */
  function setupDnD(root, zones) {
    let activeChip = null;     // chip being dragged
    let ghost = null;          // floating clone
    let startX = 0, startY = 0;
    let dragging = false;
    let pointerId = null;
    let selectedChip = null;   // for tap-to-place
    let suppressClick = false;

    const isChip = (n) => n && n.classList && n.classList.contains("chip");

    function clearOver() {
      zones.forEach((z) => z.classList.remove("is-over"));
    }

    function zoneFromPoint(x, y) {
      const target = document.elementFromPoint(x, y);
      if (!target) return null;
      const z = target.closest("[data-zone]");
      return z && zones.includes(z) ? z : null;
    }

    function onPointerDown(e) {
      const chip = e.target.closest(".chip");
      if (!chip || !root.contains(chip)) return;
      suppressClick = false;
      activeChip = chip;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      dragging = false;
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
      document.addEventListener("pointercancel", onPointerUp);
    }

    function beginDrag() {
      dragging = true;
      const rect = activeChip.getBoundingClientRect();
      ghost = activeChip.cloneNode(true);
      ghost.classList.add("is-ghost");
      ghost.style.width = rect.width + "px";
      ghost.style.left = "0px";
      ghost.style.top = "0px";
      document.body.appendChild(ghost);
      activeChip.classList.add("is-placeholder");
      moveGhost(startX, startY);
    }

    function moveGhost(x, y) {
      if (!ghost) return;
      ghost.style.transform =
        "translate(" + (x - ghost.offsetWidth / 2) + "px," +
        (y - ghost.offsetHeight / 2) + "px) rotate(-3deg) scale(1.05)";
    }

    function onPointerMove(e) {
      if (!activeChip) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!dragging && Math.hypot(dx, dy) > 7) beginDrag();
      if (dragging) {
        e.preventDefault();
        moveGhost(e.clientX, e.clientY);
        clearOver();
        const z = zoneFromPoint(e.clientX, e.clientY);
        if (z) z.classList.add("is-over");
      }
    }

    function onPointerUp(e) {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);

      if (dragging) {
        const z = zoneFromPoint(e.clientX, e.clientY);
        if (z) z.appendChild(activeChip);
        if (ghost) { ghost.remove(); ghost = null; }
        activeChip.classList.remove("is-placeholder");
        clearOver();
        suppressClick = true;
        setTimeout(() => (suppressClick = false), 50);
      }
      dragging = false;
      activeChip = null;
      pointerId = null;
    }

    // Tap-to-place: tap a chip to select, tap a zone to drop it there.
    function onClick(e) {
      if (suppressClick) return;
      const chip = e.target.closest(".chip");
      const zone = e.target.closest("[data-zone]");

      if (chip && root.contains(chip)) {
        if (selectedChip === chip) {
          chip.classList.remove("is-selected");
          selectedChip = null;
        } else {
          if (selectedChip) selectedChip.classList.remove("is-selected");
          selectedChip = chip;
          chip.classList.add("is-selected");
        }
        return;
      }
      if (zone && zones.includes(zone) && selectedChip) {
        zone.appendChild(selectedChip);
        selectedChip.classList.remove("is-selected");
        selectedChip = null;
      }
    }

    // Keyboard: focus a chip, Enter selects; focus a zone, Enter drops.
    function onKey(e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      const chip = e.target.closest(".chip");
      const zone = e.target.closest("[data-zone]");
      if (chip) {
        e.preventDefault();
        if (selectedChip) selectedChip.classList.remove("is-selected");
        selectedChip = selectedChip === chip ? null : chip;
        if (selectedChip) chip.classList.add("is-selected");
        else chip.classList.remove("is-selected");
      } else if (zone && zones.includes(zone) && selectedChip) {
        e.preventDefault();
        zone.appendChild(selectedChip);
        selectedChip.classList.remove("is-selected");
        selectedChip = null;
      }
    }

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey);

    // make chips keyboard focusable
    root.querySelectorAll(".chip").forEach((c) => (c.tabIndex = 0));

    return {
      destroy() {
        root.removeEventListener("pointerdown", onPointerDown);
        root.removeEventListener("click", onClick);
        root.removeEventListener("keydown", onKey);
        if (ghost) { ghost.remove(); ghost = null; }
      }
    };
  }

  /* ============================================================
     UTILITIES
     ============================================================ */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Boot on title screen */
  showScreen("title");
})();
