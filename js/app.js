/* ============================================================================
   INTO ACTION GROUP — app.js
   Router + renderer + PWA glue.  You normally never need to edit this file;
   all content lives in content.js.
   ============================================================================ */
(function () {
  "use strict";

  var IAG = window.IAG;
  if (!IAG) { console.error("content.js failed to load"); return; }

  /* ---- Line-style SVG icons (no image files) ----------------------------- */
  var ICON = {
    back:       '<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>',
    chevron:    '<path d="M9 6l6 6-6 6"/>',
    share:      '<path d="M12 15V4"/><path d="M8 8l4-4 4 4"/><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/>',
    grid:       '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
    pin:        '<path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z"/><circle cx="12" cy="11" r="2.3"/>',
    sun:        '<circle cx="12" cy="13" r="3.6"/><path d="M12 4.5v2M5.2 13H3.4M20.6 13h-1.8M6.8 7.8 5.6 6.6M18.4 7.8l1.2-1.2"/><path d="M3 18h18"/>',
    flame:      '<path d="M12 3s5 4.3 5 8.6A5 5 0 0 1 7 12c0-1.7.8-3.1 1.8-4.3C9 9 9.7 9.7 11 10c.5-2.6-.4-5.2 1-7z"/>',
    heart:      '<path d="M12 20s-6.6-4.2-9-8.3C1.3 8.4 2.9 5 6.2 5c2 0 3.1 1.3 3.8 2.3C10.7 6.3 11.8 5 13.8 5 17.1 5 18.7 8.4 21 11.7 18.6 15.8 12 20 12 20z"/>',
    doc:        '<path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 16h6"/>',
    book:       '<path d="M5 4h11a2 2 0 0 1 2 2v15H7a2 2 0 0 1-2-2V4z"/><path d="M5 19a2 2 0 0 1 2-2h11"/>',
    bookOpen:   '<path d="M12 6c-2-1.2-4.6-1.2-7-.9v12c2.4-.3 5-.3 7 .9 2-1.2 4.6-1.2 7-.9V5.1c-2.4-.3-5-.3-7 .9z"/><path d="M12 6v12"/>',
    users:      '<circle cx="9" cy="9" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 6.5a3 3 0 0 1 0 5.8M20.5 20a5.5 5.5 0 0 0-3.5-5.1"/>',
    list:       '<path d="M8.5 6.5h12M8.5 12h12M8.5 17.5h12"/><path d="M4 6.5h.01M4 12h.01M4 17.5h.01"/>',
    headphones: '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="7" rx="1.6"/><rect x="17" y="13" width="4" height="7" rx="1.6"/>',
    play:       '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>',
    chat:       '<path d="M20 12a7 7 0 0 1-7 7H8l-4 3v-5.2A7 7 0 0 1 8 5h5a7 7 0 0 1 7 7z"/>',
    megaphone:  '<path d="M3 11v2a1 1 0 0 0 1 1h2.5L15 18V6L6.5 10H4a1 1 0 0 0-1 1z"/><path d="M18 9.5a3.5 3.5 0 0 1 0 5"/>',
    shield:     '<path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z"/>',
    mic:        '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3M8.5 21h7"/>',
    star:       '<path d="M12 3.5l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 17.2 6.7 20l1.1-6L3.4 9.8l6-.8z"/>',
    video:      '<rect x="3" y="6" width="12.5" height="12" rx="2.2"/><path d="M15.5 10l5.5-3v10l-5.5-3z"/>',
    copy:       '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4.5 16V6a2 2 0 0 1 2-2H16"/>',
    external:   '<path d="M14 5h5v5"/><path d="M19 5l-8 8"/><path d="M19 13.5V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4.5"/>',
    check:      '<path d="M5 12.5l4.5 4.5L19 7"/>',
  };

  function svg(name, cls) {
    var inner = ICON[name] || "";
    return '<svg class="ic' + (cls ? " " + cls : "") +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + "</svg>";
  }

  /* ---- Helpers ----------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function el(id) { return document.getElementById(id); }
  function sectionById(id) {
    for (var i = 0; i < IAG.sections.length; i++) if (IAG.sections[i].id === id) return IAG.sections[i];
    return null;
  }
  function paras(body) {
    if (!body) return "";
    var arr = Array.isArray(body) ? body : [body];
    return arr.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  }
  function todayLong() {
    try {
      return new Date().toLocaleDateString(undefined,
        { weekday: "short", month: "short", day: "numeric" });
    } catch (e) { return ""; }
  }
  function todayFull() {
    try {
      return new Date().toLocaleDateString(undefined,
        { weekday: "long", month: "long", day: "numeric" });
    } catch (e) { return ""; }
  }

  // Reads minutes-since-midnight + day-of-week in the group's timezone.
  function nowInTz(tz) {
    var parts = {};
    new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", hour: "numeric", minute: "numeric", hour12: false })
      .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var dow = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[parts.weekday];
    var hh = parseInt(parts.hour, 10); if (hh === 24) hh = 0;
    return { dow: dow, min: hh * 60 + parseInt(parts.min || parts.minute, 10) };
  }

  function currentMeeting(times, t, win) {
    for (var i = 0; i < times.length; i++) {
      var m = times[i], start = m.h * 60 + m.m;
      if (m.days.indexOf(t.dow) !== -1 && t.min >= start && t.min < start + win) return m;
    }
    return null;
  }

  function nextSameDayMeeting(times, t) {
    var best = null;
    for (var i = 0; i < times.length; i++) {
      var m = times[i], start = m.h * 60 + m.m;
      if (m.days.indexOf(t.dow) === -1 || start <= t.min) continue;
      if (!best || start < best.start) best = { meeting: m, start: start, startsIn: start - t.min };
    }
    return best;
  }

  function nextMeeting(times, t) {
    var best = null;
    for (var off = 0; off <= 7; off++) {
      var d = (t.dow + off) % 7;
      for (var i = 0; i < times.length; i++) {
        var m = times[i], start = m.h * 60 + m.m;
        if (m.days.indexOf(d) === -1) continue;
        if (off === 0 && start <= t.min) continue;
        var startsIn = off * 1440 + start - t.min;
        if (!best || startsIn < best.startsIn) best = { meeting: m, dayOffset: off, startsIn: startsIn };
      }
    }
    return best;
  }

  // The sun's "progress" 0..1 for the current moment:
  //   0 = pre-dawn (background sculpture visible, sun below the horizon)
  //   1 = fully risen / ablaze at meeting time (background dissolved)
  // It rises in the hours before the meeting, holds through the day, sets at dusk.
  function dayProgress() {
    var cfg = (IAG.home && IAG.home.meeting) || {};
    var times = cfg.times || [];
    var rise = cfg.riseMins || 150;
    var duskStart = 20 * 60, nightStart = 22 * 60;   // 8pm → 10pm: sun sets, sculpture returns
    try {
      var t = nowInTz(cfg.ianaTz || "America/Chicago");
      var active = currentMeeting(times, t, cfg.windowMins || 75);
      if (active) return 1;

      var sameDay = nextSameDayMeeting(times, t);
      if (sameDay) {
        if (sameDay.startsIn >= rise) return 0;
        return 1 - (sameDay.startsIn / rise);
      }

      if (t.min <  duskStart)   return 1;
      if (t.min <  nightStart)  return 1 - (t.min - duskStart) / (nightStart - duskStart);
      return 0;
    } catch (e) { return 1; }
  }

  // Drive the dawn: animate the sun up from pre-dawn to the live time on open.
  function startDawn() {
    var dawn = document.querySelector(".dawn");
    if (!dawn) return;
    // "always": every open rises fully to ablaze (sculpture dissolves away).
    // "live": the sun tracks the real clock.
    var target = ((IAG.home && IAG.home.sunrise) === "live") ? dayProgress() : 1;

    function apply(p) {
      dawn.style.setProperty("--p", p.toFixed(3));
      dawn.style.setProperty("--sun-y", (130 * (1 - p)).toFixed(1) + "px");
      dawn.style.setProperty("--sun-scale", (0.78 + 0.27 * p).toFixed(3));
      dawn.style.setProperty("--sun-op", (0.25 + 0.75 * Math.pow(p, 0.7)).toFixed(3));  // brighten early
      dawn.style.setProperty("--glow-op", Math.pow(p, 0.75).toFixed(3));
      dawn.style.setProperty("--bg-op", (Math.max(0, 1 - p) * 0.95).toFixed(3));        // sculpture lingers, gone at p=1
    }

    var reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    if (reduce || !window.requestAnimationFrame) { apply(target); return; }

    var dur = 4800, t0 = null;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;  // easeInOutCubic
      apply(target * e);
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Returns the live/next meeting state from IAG.home.meeting, computed in the
  // group's timezone so "Live" is accurate wherever the member happens to be.
  function meetingStatus() {
    var cfg = (IAG.home && IAG.home.meeting) || {};
    var times = cfg.times || [];
    if (!times.length) return null;
    var tz = cfg.ianaTz || "America/Chicago";
    var win = cfg.windowMins || 75;
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    try {
      var parts = {};
      new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", hour: "numeric", minute: "numeric", hour12: false })
        .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
      var dow = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[parts.weekday];
      var hh = parseInt(parts.hour, 10); if (hh === 24) hh = 0;
      var nowMin = hh * 60 + parseInt(parts.minute, 10);

      var now = { dow: dow, min: nowMin };
      var active = currentMeeting(times, now, win);
      if (active) return { live: true, label: active.label, short: active.short, name: active.name || "", zoomOnly: !!active.zoomOnly };

      var best = nextMeeting(times, now);
      if (best) {
        var d = (dow + best.dayOffset) % 7;
        var when = best.dayOffset === 0 ? "Today" : best.dayOffset === 1 ? "Tomorrow" : dayNames[d];
        return { live: false, label: best.meeting.label, short: best.meeting.short, name: best.meeting.name || "", when: when, zoomOnly: !!best.meeting.zoomOnly };
      }
    } catch (err) {
      var f = times[0];
      return { live: false, label: f.label, short: f.short, name: f.name || "", when: "", zoomOnly: !!f.zoomOnly };
    }
    return null;
  }

  /* ---- Block renderers --------------------------------------------------- */
  function renderLink(b) {
    var v = b.variant === "secondary" ? "btn--secondary" : "btn--primary";
    var ext = b.external ? svg("external", "btn-ic") : svg("chevron", "btn-ic");
    return '<a class="btn ' + v + '" href="' + esc(b.href) + '"' +
      (b.external ? ' target="_blank" rel="noopener"' : "") + '>' +
      "<span>" + esc(b.label) + "</span>" + ext + "</a>";
  }

  function renderCard(b) {
    return '<div class="card">' +
      (b.title ? '<h2 class="card__title">' + esc(b.title) + "</h2>" : "") +
      '<div class="card__body">' + paras(b.body) + "</div></div>";
  }

  function renderArticleBlock(b, index) {
    if (b.type === "card") {
      return '<section class="article__block">' +
        (b.title ? '<h2 class="article__title' + (index ? "" : " article__title--lead") + '">' + esc(b.title) + "</h2>" : "") +
        '<div class="article__body">' + paras(b.body) + "</div></section>";
    }
    if (b.type === "prayer") {
      var inner;
      if (b.href) {
        inner = (b.note ? '<p class="article-prayer__note">' + esc(b.note) + "</p>" : "") +
          '<a class="prayer__link btn btn--secondary" href="' + esc(b.href) +
          '" target="_blank" rel="noopener"><span>Read in the Big Book</span>' + svg("external", "btn-ic") + "</a>";
      } else if (b.body) {
        inner = '<div class="article-prayer__body">' + esc(b.body).replace(/\n/g, "<br>") + "</div>";
      } else {
        inner = '<div class="prayer__empty">Add this prayer in content.js</div>';
      }
      return '<aside class="article-prayer"><h3 class="article-prayer__title">' + esc(b.title) + "</h3>" + inner + "</aside>";
    }
    if (b.type === "note") {
      return '<div class="article__note">' + esc(b.body) + "</div>";
    }
    var fn = RENDERERS[b.type];
    return fn ? fn(b) : "";
  }

  function renderArticle(blocks) {
    return '<article class="article">' + (blocks || []).map(renderArticleBlock).join("") + "</article>";
  }

  function renderNote(b) {
    var cls = b.variant === "gold" ? "note note--gold" : (b.variant === "warn" ? "note note--warn" : "note");
    return '<div class="' + cls + '">' + esc(b.body) + "</div>";
  }

  function renderAddress(b) {
    var maps = "https://maps.google.com/?q=" + encodeURIComponent(b.mapsQuery || (b.name + " " + (b.lines || []).join(" ")));
    return '<a class="card card--row addr" href="' + esc(maps) + '" target="_blank" rel="noopener">' +
      '<span class="addr__ic">' + svg("pin") + "</span>" +
      '<span class="addr__text"><strong>' + esc(b.name) + "</strong>" +
      (b.lines || []).map(function (l) { return "<span>" + esc(l) + "</span>"; }).join("") +
      '<span class="addr__cta">Open in Maps</span></span>' +
      svg("chevron", "row__chev") + "</a>";
  }

  function renderSchedule(b) {
    var rows = (b.rows || []).map(function (r) {
      return '<div class="sched__row">' +
        '<span class="sched__label">' + esc(r.label) + "</span>" +
        '<span class="sched__value">' +
          (r.tag ? '<span class="pill' + (r.warn ? " pill--warn" : "") + '">' + esc(r.tag) + "</span>" : "") +
          esc(r.value) + "</span></div>";
    }).join("");
    return '<div class="card sched">' + rows +
      (b.note ? '<div class="sched__note">' + esc(b.note) + "</div>" : "") + "</div>";
  }

  function meetingEmblem(kind) {
    if (kind === "morning") {
      return '<svg class="meeting-emblem meeting-emblem--morning" viewBox="0 0 96 96" fill="none" aria-hidden="true">' +
        '<circle class="meeting-emblem__halo" cx="48" cy="49" r="31"/>' +
        '<g class="meeting-emblem__rays">' +
          '<path d="M48 13v9"/><path d="M33 18l5 8"/><path d="M63 18l-5 8"/><path d="M22 31l8 5"/><path d="M74 31l-8 5"/>' +
        "</g>" +
        '<path class="meeting-emblem__line" d="M28 58h40"/>' +
        '<path class="meeting-emblem__line" d="M32 58c2-14 12-23 16-23s14 9 16 23"/>' +
        '<path class="meeting-emblem__accent" d="M25 66h46"/>' +
        '<path class="meeting-emblem__accent" d="M34 73h28"/>' +
        "</svg>";
    }
    if (kind === "book") {
      return '<svg class="meeting-emblem meeting-emblem--book" viewBox="0 0 96 96" fill="none" aria-hidden="true">' +
        '<circle class="meeting-emblem__halo" cx="48" cy="49" r="31"/>' +
        '<g class="meeting-emblem__rays">' +
          '<path d="M48 10v10"/><path d="M61 13l-4 9"/><path d="M72 21l-7 7"/><path d="M79 33l-9 4"/>' +
          '<path d="M82 47H72"/><path d="M17 47H14"/><path d="M20 33l7 4"/><path d="M24 21l7 7"/>' +
          '<path d="M35 13l4 9"/><path d="M64 62l8 6"/><path d="M32 62l-8 6"/><path d="M48 70v10"/>' +
        "</g>" +
        '<path class="meeting-emblem__line" d="M47.5 37c-7-4-15-5-24-3v27c9-2 17-1 24 4V37z"/>' +
        '<path class="meeting-emblem__line" d="M48.5 37c7-4 15-5 24-3v27c-9-2-17-1-24 4V37z"/>' +
        '<path class="meeting-emblem__accent" d="M48 38v28"/>' +
        '<path class="meeting-emblem__accent" d="M30 44c4-.6 8-.2 12 1.4"/><path class="meeting-emblem__accent" d="M66 44c-4-.6-8-.2-12 1.4"/>' +
        "</svg>";
    }
    if (kind === "men") {
      return '<svg class="meeting-emblem meeting-emblem--men" viewBox="0 0 96 96" fill="none" aria-hidden="true">' +
        '<circle class="meeting-emblem__halo" cx="48" cy="49" r="31"/>' +
        '<g class="meeting-emblem__rays">' +
          '<path d="M48 13v8"/><path d="M66 21l-6 6"/><path d="M76 47h-8"/><path d="M30 21l6 6"/><path d="M20 47h8"/>' +
        "</g>" +
        '<circle class="meeting-emblem__line" cx="34" cy="42" r="7"/>' +
        '<circle class="meeting-emblem__line" cx="62" cy="42" r="7"/>' +
        '<path class="meeting-emblem__line" d="M25 66c2-11 8-17 17-17"/>' +
        '<path class="meeting-emblem__line" d="M71 66c-2-11-8-17-17-17"/>' +
        '<path class="meeting-emblem__accent" d="M36 64h24"/>' +
        '<path class="meeting-emblem__accent" d="M48 58v16"/>' +
        "</svg>";
    }
    if (kind === "zoom") {
      return '<svg class="meeting-emblem meeting-emblem--zoom" viewBox="0 0 96 96" fill="none" aria-hidden="true">' +
        '<circle class="meeting-emblem__halo" cx="48" cy="49" r="31"/>' +
        '<g class="meeting-emblem__rays">' +
          '<path d="M48 14v8"/><path d="M67 24l-6 6"/><path d="M29 24l6 6"/><path d="M48 76v-8"/>' +
        "</g>" +
        '<path class="meeting-emblem__line" d="M25 34h37c3 0 5 2 5 5v22c0 3-2 5-5 5H25c-3 0-5-2-5-5V39c0-3 2-5 5-5z"/>' +
        '<path class="meeting-emblem__accent" d="M67 44l11-7v26l-11-7V44z"/>' +
        '<path class="meeting-emblem__accent" d="M34 46h17"/>' +
        '<path class="meeting-emblem__accent" d="M34 55h11"/>' +
        "</svg>";
    }
    if (kind === "ladies") {
      return '<svg class="meeting-emblem meeting-emblem--ladies" viewBox="0 0 96 96" fill="none" aria-hidden="true">' +
        '<circle class="meeting-emblem__halo" cx="48" cy="49" r="31"/>' +
        '<g class="meeting-emblem__rays">' +
          '<path d="M48 14v8"/><path d="M67 22l-6 6"/><path d="M75 42h-8"/><path d="M67 67l-6-6"/>' +
          '<path d="M48 75v-8"/><path d="M29 67l6-6"/><path d="M21 42h8"/><path d="M29 22l6 6"/>' +
        "</g>" +
        '<circle class="meeting-emblem__line" cx="48" cy="49" r="15"/>' +
        '<path class="meeting-emblem__accent" d="M45 47h8v8c0 3-2 5-5 5s-5-2-5-5v-8h2"/>' +
        '<path class="meeting-emblem__accent" d="M53 50h3c2 0 3 1 3 3s-1 3-3 3h-3"/>' +
        '<path class="meeting-emblem__line" d="M45 42h6"/>' +
        '<g class="meeting-emblem__chairs">' +
          '<path d="M44 19h8v9h-8z"/><path d="M67 34l6 6-6 6-6-6z"/><path d="M67 64h8v9h-8z"/>' +
          '<path d="M21 64h8v9h-8z"/><path d="M23 34l6-6 6 6-6 6z"/>' +
        "</g>" +
        "</svg>";
    }
    return meetingEmblem("morning");
  }

  function renderMeetingMarks(b) {
    var items = (b.items || []).map(function (it) {
      return '<div class="meeting-mark">' +
        '<div class="meeting-mark__art">' + meetingEmblem(it.emblem) + "</div>" +
        '<div class="meeting-mark__copy">' +
          '<h3 class="meeting-mark__title">' + esc(it.title) + "</h3>" +
          '<p class="meeting-mark__time">' + esc(it.time) + "</p>" +
          (it.note ? '<p class="meeting-mark__note">' + esc(it.note) + "</p>" : "") +
        "</div>" +
      "</div>";
    }).join("");
    return (b.title ? '<h2 class="group-title">' + esc(b.title) + "</h2>" : "") +
      '<div class="meeting-marks">' + items + "</div>";
  }

  function renderLinks(b) {
    var items = (b.items || []).map(function (it) {
      var hasAction = it.href || it.copy;
      var attrs, tag, trailing;
      if (it.href) {
        tag = "a"; attrs = ' href="' + esc(it.href) + '"' + (it.external ? ' target="_blank" rel="noopener"' : "");
        trailing = it.external ? svg("external", "row__chev") : svg("chevron", "row__chev");
      } else if (it.copy) {
        tag = "button"; attrs = ' type="button" data-copy="' + esc(it.copy) + '"';
        trailing = svg("copy", "row__chev");
      } else {
        tag = "div"; attrs = ""; trailing = "";
      }
      return "<" + tag + ' class="row' + (hasAction ? "" : " row--static") + '"' + attrs + ">" +
        '<span class="row__text"><span class="row__label">' + esc(it.label) + "</span>" +
        (it.sublabel ? '<span class="row__sub">' + esc(it.sublabel) + "</span>" : "") + "</span>" +
        trailing + "</" + tag + ">";
    }).join("");
    return (b.title ? '<h2 class="group-title">' + esc(b.title) + "</h2>" : "") +
      '<div class="card card--list">' + items + "</div>";
  }

  function renderPrayer(b) {
    var inner;
    if (b.href) {
      inner = (b.note ? '<div class="prayer__note">' + esc(b.note) + "</div>" : "") +
        '<a class="prayer__link btn btn--secondary" href="' + esc(b.href) +
        '" target="_blank" rel="noopener"><span>Read in the Big Book</span>' + svg("external", "btn-ic") + "</a>";
    } else if (b.body) {
      inner = '<div class="prayer__body">' + esc(b.body).replace(/\n/g, "<br>") + "</div>";
    } else {
      inner = '<div class="prayer__empty">Add this prayer in content.js</div>';
    }
    return '<div class="card prayer"><h2 class="card__title">' + esc(b.title) + "</h2>" + inner + "</div>";
  }

  // Interactive PDF via the bundled PDF.js viewer (renders reliably on mobile,
  // where a native <iframe src=.pdf> does not). Pass { type:"pdf", title, href }.
  function renderPdf(b) {
    var href = b.href || "";
    var title = b.title || "Document";
    var abs = href;
    try { abs = new URL(href, location.href).href; } catch (e) {}
    var viewerSrc = "vendor/pdfjs/web/viewer.html?file=" + encodeURIComponent(abs);
    return '<div class="card pdf-card">' +
      '<div class="pdf-card__head">' +
        '<h2 class="card__title">' + esc(title) + "</h2>" +
        '<a class="pdf-open" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer" ' +
          'aria-label="Open the PDF in a new tab">' + svg("external", "pdf-open__ic") + "<span>Open</span></a>" +
      "</div>" +
      (b.body ? '<p class="pdf-card__note">' + esc(b.body) + "</p>" : "") +
      '<div class="pdf-viewer">' +
        '<iframe src="' + esc(viewerSrc) + '" title="' + esc(title) + '" loading="lazy"></iframe>' +
      "</div>" +
    "</div>";
  }

  function renderYoutube(b) {
    var id = String(b.videoId || "").replace(/[^A-Za-z0-9_-]/g, "");
    var start = Math.max(0, parseInt(b.start || 0, 10) || 0);
    var href = b.href || (id ? "https://www.youtube.com/watch?v=" + id + (start ? "&t=" + start + "s" : "") : "");
    var embed = id ? "https://www.youtube-nocookie.com/embed/" + id +
      "?start=" + start + "&rel=0&modestbranding=1&playsinline=1" : "";
    return '<div class="card video-card">' +
      '<div class="video-card__media">' +
        '<button class="video-card__load" type="button" data-video-src="' + esc(embed) + '" aria-label="Play video in this section">' +
          '<span class="video-card__halo">' + svg("play", "video-card__play") + "</span>" +
          '<span class="video-card__load-text">Play video</span>' +
        "</button>" +
      "</div>" +
      '<div class="video-card__copy">' +
        '<h2 class="card__title">' + esc(b.title || "Video") + "</h2>" +
        (b.body ? '<p class="video-card__body">' + esc(b.body) + "</p>" : "") +
        (href ? '<a class="video-card__link" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' +
          "<span>Open on YouTube</span>" + svg("external", "video-card__link-ic") + "</a>" : "") +
      "</div>" +
    "</div>";
  }

  // A list of PDFs (e.g. a book by chapter). Each row opens the PDF.js viewer.
  function renderPdfList(b) {
    var items = (b.items || []).map(function (it) {
      var abs = it.href || "";
      try { abs = new URL(it.href, location.href).href; } catch (e) {}
      var viewer = "vendor/pdfjs/web/viewer.html?file=" + encodeURIComponent(abs);
      return '<a class="row" href="' + esc(viewer) + '" target="_blank" rel="noopener">' +
        '<span class="row__ic">' + svg("doc") + "</span>" +
        '<span class="row__text"><span class="row__label">' + esc(it.label) + "</span></span>" +
        svg("external", "row__chev") + "</a>";
    }).join("");
    return (b.title ? '<h2 class="group-title">' + esc(b.title) + "</h2>" : "") +
      '<div class="card card--list">' + items + "</div>";
  }

  // A single image document (e.g. a photographed list). Tap opens it full size.
  function renderImage(b) {
    var src = b.src || b.href || "";
    var full = b.href || b.src || "";
    var img = '<img class="doc-image" src="' + esc(src) + '" alt="' + esc(b.alt || b.title || "Image") + '" loading="lazy">';
    var inner = full ? '<a href="' + esc(full) + '" target="_blank" rel="noopener" aria-label="Open full size">' + img + "</a>" : img;
    return '<div class="card doc-image-card">' +
      (b.title ? '<h2 class="card__title">' + esc(b.title) + "</h2>" : "") + inner + "</div>";
  }

  function renderScript(b) {
    var parts = (b.parts || []).map(function (p) {
      return '<section class="script__part"><h3 class="script__head">' + esc(p.heading) + "</h3>" +
        (p.body ? '<div class="script__body">' + esc(p.body).replace(/\n/g, "<br>") + "</div>"
                : '<div class="script__empty">Paste this part of your script in content.js</div>') +
        "</section>";
    }).join("");
    return '<div class="card script">' + parts + "</div>";
  }

  // Announcements come from a Google Sheet (IAG.announcements). The block renders
  // immediately from cache/fallback, then loadAnnouncements() refreshes from the
  // sheet. See loadAnnouncements() below.
  var ANN_CACHE = "iag-ann";

  function annItemHTML(a) {
    return '<div class="ann">' +
      (a.date ? '<div class="ann__date">' + esc(a.date) + "</div>" : "") +
      '<div class="ann__title">' + esc(a.title) + "</div>" +
      (a.body ? '<div class="ann__body">' + esc(a.body) + "</div>" : "") + "</div>";
  }
  function annReadCache() { try { return JSON.parse(localStorage.getItem(ANN_CACHE) || "[]"); } catch (e) { return []; } }
  function annWriteCache(items) { try { localStorage.setItem(ANN_CACHE, JSON.stringify(items)); } catch (e) {} }

  function renderAnnList(el, items) {
    el.innerHTML = (items && items.length)
      ? items.map(annItemHTML).join("")
      : '<div class="ann ann--empty">No announcements right now.</div>';
  }

  function renderAnnouncements() {
    var cfg = IAG.announcements || {};
    var initial = annReadCache();
    if (!initial.length) initial = cfg.fallback || [];
    var inner = initial.length ? initial.map(annItemHTML).join("")
                               : '<div class="ann ann--empty">No announcements right now.</div>';
    return '<div class="card card--list ann-list" id="annList">' + inner + "</div>";
  }

  // Minimal RFC-4180 CSV parser (handles quotes, commas, and newlines in cells).
  function parseCSV(text) {
    var rows = [], row = [], cur = "", q = false, i = 0;
    while (i < text.length) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
        else cur += c;
      } else if (c === '"') { q = true; }
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (c !== "\r") { cur += c; }
      i++;
    }
    if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function isoOf(s) {
    s = String(s == null ? "" : s).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    var d = new Date(s);
    if (!isNaN(d.getTime())) return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
    return s;
  }

  // Map sheet rows → announcement objects, honoring Show From / Show Until dates.
  function rowsToAnnouncements(rows) {
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return String(h || "").trim().toLowerCase(); });
    function col(names) { for (var n = 0; n < names.length; n++) { var k = head.indexOf(names[n]); if (k !== -1) return k; } return -1; }
    var iDate = col(["date", "when"]),
        iTitle = col(["title", "announcement", "headline"]),
        iBody = col(["body", "details", "detail", "description", "note"]),
        iFrom = col(["show from", "show_from", "from", "start"]),
        iUntil = col(["show until", "show_until", "until", "end", "expires"]);
    var today = todayISO(), out = [];
    function cell(row, k) { return k > -1 && row[k] != null ? String(row[k]).trim() : ""; }
    for (var r = 1; r < rows.length; r++) {
      var row = rows[r];
      var title = cell(row, iTitle), date = cell(row, iDate), body = cell(row, iBody);
      if (!title && !date && !body) continue;                 // blank row
      var from = cell(row, iFrom), until = cell(row, iUntil);
      if (from && isoOf(from) > today) continue;              // not yet
      if (until && isoOf(until) < today) continue;            // expired
      out.push({ date: date, title: title, body: body });
    }
    return out;
  }

  function announcementsUrl(cfg) {
    if (cfg.csvUrl) return cfg.csvUrl;
    if (cfg.googleSheetId)
      return "https://docs.google.com/spreadsheets/d/" + cfg.googleSheetId +
        "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(cfg.sheetName || "Sheet1");
    return "";
  }

  function loadAnnouncements() {
    var cfg = IAG.announcements || {};
    var listEl = el("annList");
    if (!listEl) return;
    var url = announcementsUrl(cfg);
    if (!url) return;                                          // no sheet → fallback already shown
    fetch(url, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("http"); return r.text(); })
      .then(function (text) {
        var items = rowsToAnnouncements(parseCSV(text));
        annWriteCache(items);
        renderAnnList(listEl, items.length ? items : (cfg.fallback || []));
      })
      .catch(function () {
        if (!annReadCache().length) renderAnnList(listEl, cfg.fallback || []);  // offline/blocked → keep shown
      });
  }

  var RENDERERS = {
    card: renderCard, link: renderLink, note: renderNote, address: renderAddress,
    schedule: renderSchedule, meetingMarks: renderMeetingMarks, links: renderLinks, prayer: renderPrayer,
    pdf: renderPdf, youtube: renderYoutube, pdflist: renderPdfList, image: renderImage,
    script: renderScript, announcements: renderAnnouncements,
  };

  function renderBlocks(blocks) {
    return (blocks || []).map(function (b) {
      var fn = RENDERERS[b.type];
      return fn ? fn(b) : "";
    }).join("");
  }

  /* ---- Screens ----------------------------------------------------------- */
  function renderHome() {
    var m = IAG.home.meeting || {};
    var r = IAG.home.reflection || {};
    var bg = (IAG.home && IAG.home.background) || "";
    var st = meetingStatus();

    // Meeting status: "Live" during a meeting, otherwise the next meeting time.
    var kicker, bigWord, sub;
    if (st && st.live) {
      kicker  = "The " + esc(st.short) + " meeting is";
      bigWord = '<span class="dawn__live"><span class="dawn__dot"></span>Live</span>';
      sub     = esc(st.label) + " " + esc(m.tzLabel || "") + (st.name ? " · " + esc(st.name) : "") + " · " + esc(todayFull());
    } else if (st) {
      kicker  = "The next meeting is";
      bigWord = '<span class="dawn__live dawn__live--time">' + esc(st.label) + "</span>";
      sub     = esc(st.when) + (st.name ? " · " + esc(st.name) : "") + " · " + esc(m.tzLabel || "") + (st.zoomOnly ? " · Zoom only" : "");
    } else {
      kicker = ""; bigWord = ""; sub = esc(todayFull());
    }

    var sun =
      '<div class="sun" aria-hidden="true">' +
        '<div class="sun__glow"></div>' +
        '<div class="sun__rays"></div>' +
        '<div class="sun__pillar"></div>' +
        '<div class="sun__core"></div>' +
      "</div>";

    var reflection =
      '<a class="dawn__reflection" href="' + esc(r.href) + '" target="_blank" rel="noopener">' +
        '<span class="dawn__rk">' + esc(r.kicker || "Today's Reflection") + " · " + esc(todayLong()) + "</span>" +
        (r.line ? '<span class="dawn__rline">' + esc(r.line) + "</span>" : "") +
        '<span class="dawn__rlink">' + esc(r.linkLabel || "Read on aa.org") + " " + svg("external", "dawn__rlink-ic") + "</span>" +
      "</a>";

    // Start in the pre-dawn state; startDawn() animates the sun up to live time.
    var initial = "--p:0; --sun-y:130px; --sun-scale:.78; --sun-op:.25; --glow-op:0; --bg-op:.95";
    return '<div class="dawn" style="' + initial + '">' +
      (bg ? '<div class="dawn__bg" style="background-image:url(\'' + esc(bg) + '\')"></div>' : "") +
      '<div class="dawn__sky"></div>' +
      '<div class="dawn__head">' +
        '<h1 class="dawn__name">' + esc(IAG.meta.name) + "</h1>" +
        (kicker ? '<p class="dawn__kicker">' + kicker + "</p>" : "") +
        bigWord +
        '<p class="dawn__tag">' + esc(IAG.meta.tagline) + "</p>" +
        '<p class="dawn__sub">' + sub + "</p>" +
      "</div>" +
      sun +
      '<a class="btn btn--primary dawn__join" href="' + esc(IAG.links.zoom) + '" target="_blank" rel="noopener">' +
        svg("video", "btn-ic") + "<span>Join the Zoom now</span></a>" +
      reflection +
    "</div>";
  }

  function renderSection(s) {
    var isArticle = s.layout === "article";
    return '<div class="section' + (isArticle ? " section--article" : "") + '">' +
      (isArticle ? renderArticle(s.blocks) : renderBlocks(s.blocks)) + "</div>";
  }

  function renderMore() {
    var first = IAG.moreFirst || [];
    var ordered = [];
    first.forEach(function (id) { var s = sectionById(id); if (s) ordered.push(s); });
    IAG.sections.forEach(function (s) { if (first.indexOf(s.id) === -1) ordered.push(s); });
    var rows = ordered.map(function (s) {
      return '<a class="row" href="#/' + esc(s.id) + '">' +
        '<span class="row__ic">' + svg(s.icon) + "</span>" +
        '<span class="row__text"><span class="row__label">' + esc(s.title) + "</span></span>" +
        svg("chevron", "row__chev") + "</a>";
    }).join("");
    return '<div class="section"><div class="card card--list">' + rows + "</div></div>";
  }

  /* ---- Top bar & tab bar ------------------------------------------------- */
  function renderTopbar(route, title) {
    var isHome = route === "home";
    var left = isHome
      ? ""   // the dawn hero shows the group name large
      : '<button class="iconbtn" id="backBtn" aria-label="Back">' + svg("back") + "</button>";
    var mid = isHome ? "" : '<h1 class="topbar__title">' + esc(title) + "</h1>";
    var right = '<button class="iconbtn" id="shareBtn" aria-label="Share">' + svg("share") + "</button>";
    return '<div class="topbar__side topbar__side--left">' + left + "</div>" + mid +
      '<div class="topbar__side topbar__side--right">' + right + "</div>";
  }

  function renderTabbar(activeId) {
    var tabs = IAG.tabs.map(function (id) {
      var s = sectionById(id);
      if (!s) return "";
      var active = id === activeId ? " is-active" : "";
      return '<a class="tab' + active + '" href="#/' + esc(id) + '">' +
        svg(s.icon, "tab__ic") + '<span class="tab__label">' + esc(s.tabLabel || s.title) + "</span></a>";
    }).join("");
    var moreActive = (IAG.tabs.indexOf(activeId) === -1 && activeId !== "home") || activeId === "more";
    tabs += '<a class="tab' + (moreActive ? " is-active" : "") + '" href="#/more">' +
      svg("grid", "tab__ic") + '<span class="tab__label">More</span></a>';
    return tabs;
  }

  /* ---- Router ------------------------------------------------------------ */
  function parseHash() {
    var h = (location.hash || "#/").replace(/^#\/?/, "");
    return h === "" ? "home" : h;
  }

  function navigate() {
    var key = parseHash();
    var contentHTML, title, activeForTab;

    if (key === "home") {
      contentHTML = renderHome(); title = ""; activeForTab = "home";
    } else if (key === "more") {
      contentHTML = renderMore(); title = "More"; activeForTab = "more";
    } else {
      var s = sectionById(key);
      if (!s) { location.replace("#/"); return; }
      contentHTML = renderSection(s); title = s.title; activeForTab = key;
    }

    var route = key === "home" ? "home" : (key === "more" ? "more" : "section");
    el("topbar").innerHTML = renderTopbar(route, title);
    el("tabbar").innerHTML = renderTabbar(activeForTab);

    var view = el("content");
    view.classList.toggle("is-home", key === "home");
    view.innerHTML = '<div class="view">' + contentHTML + "</div>";
    view.scrollTop = 0;
    // trigger enter animation
    var v = view.firstChild;
    requestAnimationFrame(function () { v.classList.add("view--in"); });

    document.title = (title ? title + " · " : "") + IAG.meta.name;
    wireScreen();
    if (key === "home") startDawn();
    if (key === "announcements") loadAnnouncements();
  }

  /* ---- Per-screen wiring (back, share, copy) ----------------------------- */
  function wireScreen() {
    var back = el("backBtn");
    if (back) back.addEventListener("click", function () {
      if (history.length > 1) history.back(); else location.hash = "#/";
    });

    var share = el("shareBtn");
    if (share) share.addEventListener("click", doShare);

    Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (btn) {
      btn.addEventListener("click", function () { copyText(btn.getAttribute("data-copy")); });
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-video-src]"), function (btn) {
      btn.addEventListener("click", function () {
        var src = btn.getAttribute("data-video-src");
        if (!src) return;
        var frame = document.createElement("iframe");
        frame.src = src + "&autoplay=1";
        frame.title = "YouTube video player";
        frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        frame.allowFullscreen = true;
        frame.setAttribute("allowfullscreen", "");
        btn.parentNode.replaceChild(frame, btn);
      });
    });
  }

  function shareUrl() {
    if (IAG.meta.shareUrl) {
      // share the app root link (cleaner for newcomers)
      return IAG.meta.shareUrl;
    }
    return location.href;
  }

  function doShare() {
    var data = { title: IAG.meta.name, text: IAG.meta.name + " — " + IAG.meta.tagline, url: shareUrl() };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
    } else {
      copyText(shareUrl(), "Link copied — paste it to a newcomer");
    }
  }

  function copyText(text, msg) {
    function ok() { toast(msg || "Copied"); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { legacyCopy(text); ok(); });
    } else { legacyCopy(text); ok(); }
  }
  function legacyCopy(text) {
    var t = document.createElement("textarea");
    t.value = text; t.setAttribute("readonly", ""); t.style.position = "absolute"; t.style.left = "-9999px";
    document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(t);
  }

  var toastTimer;
  function toast(msg) {
    var t = el("toast");
    t.textContent = msg; t.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-show"); }, 2200);
  }

  /* ---- Install hints ----------------------------------------------------- */
  function setupInstall() {
    // Android / Chrome: capture the prompt and offer a banner button.
    var deferred = null;
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault(); deferred = e;
      showBanner("Install Into Action on your phone", "Install", function () {
        hideBanner();
        deferred.prompt();
        deferred.userChoice.finally(function () { deferred = null; });
      });
    });

    // iOS Safari: no automatic prompt — show a one-time hint.
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    var standalone = ("standalone" in navigator) ? navigator.standalone
                    : window.matchMedia("(display-mode: standalone)").matches;
    var dismissed = false;
    try { dismissed = localStorage.getItem("iag-ios-hint") === "1"; } catch (e) {}
    if (isIOS && !standalone && !dismissed) {
      showBanner("Add to Home Screen: tap Share, then “Add to Home Screen”.", null, null, function () {
        try { localStorage.setItem("iag-ios-hint", "1"); } catch (e) {}
      });
    }
  }

  function showBanner(text, actionLabel, onAction, onClose) {
    var b = el("banner");
    b.innerHTML = '<span class="banner__text">' + esc(text) + "</span>" +
      (actionLabel ? '<button class="banner__action" id="bannerAction">' + esc(actionLabel) + "</button>" : "") +
      '<button class="banner__close" id="bannerClose" aria-label="Dismiss">&times;</button>';
    b.classList.add("is-show");
    if (actionLabel && onAction) el("bannerAction").addEventListener("click", onAction);
    el("bannerClose").addEventListener("click", function () { hideBanner(); if (onClose) onClose(); });
  }
  function hideBanner() { el("banner").classList.remove("is-show"); }

  /* ---- Service worker ---------------------------------------------------- */
  function setupSW() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("sw.js").catch(function () {});
      });
    }
  }

  /* ---- Boot -------------------------------------------------------------- */
  window.addEventListener("hashchange", navigate);
  document.addEventListener("DOMContentLoaded", function () {
    navigate();
    setupInstall();
    setupSW();
  });

})();
