/* ============================================================================
   INTO ACTION GROUP — content.js
   ----------------------------------------------------------------------------
   ★ THIS IS THE ONLY FILE YOU NEED TO EDIT. ★

   Everything members see — text, links, the schedule, the Zoom URL, the
   donation links — lives here. Change a value between the quotes, save, and
   re-upload. You never have to touch the design (css/styles.css) or the logic
   (js/app.js).

   COPYRIGHT NOTE: This app intentionally contains NO copyrighted A.A. text.
   The Steps, Traditions, Preamble, prayers, Daily Reflection and books are
   provided as LINKS to the official site, aa.org, or as empty slots you can
   fill with your group's own wording. Please keep it that way.

   QUICK EDITS:
     • Zoom link ............. LINKS.zoom            (search for "zoom:")
     • Meeting times ......... section "meetings" -> "schedule"
     • Donation links ........ LINKS.squareDonate / LINKS.zelleEmail
     • Add an announcement ... section "announcements" -> add one { } line
     • Share link (after you deploy) ... META.shareUrl

   HOW A SECTION IS BUILT:
     Each section is a list of "blocks". A block is one of these types:
       { type: "card",     title, body }                a white card of text
       { type: "link",     label, href, variant }       a button (primary/secondary)
       { type: "links",    title, items:[...] }          a list of tappable rows
      { type: "address",  name, lines, mapsQuery }      a tappable address card
      { type: "schedule", rows:[...], note }            a meeting-times table
      { type: "meetingMarks", items:[...] }             premium meeting emblem cards
      { type: "prayer",   title, body, href }           a prayer slot (read-aloud)
      { type: "pdf",      title, body, href }           an inline PDF preview + open button
      { type: "youtube",  title, body, videoId, start } a tap-to-load YouTube video
      { type: "script",   parts:[...] }                 the meeting-script template
      { type: "announcements", items:[...] }            dated announcement list
      { type: "note",     body, variant }               a small highlighted note
     "body" can be one string, or a list of strings (each becomes a paragraph).
   ============================================================================ */

/* ---- Reused links & values (edit these first) ---------------------------- */
const LINKS = {
  // ★ Paste your recurring Zoom meeting link here:
  zoom: "https://us04web.zoom.us/j/172241515?pwd=QktCSmNkNmZWL0ZvSGRHSzB2L0h0dz09",

  // 7th Tradition donations:
  squareDonate: "https://intoaction-2021.square.site",
  zelleEmail:   "intoaction21@gmail.com",
};

/* ---- Official aa.org links (verified; no copyrighted text is copied) ------ */
const AA = {
  dailyReflection: "https://www.aa.org/daily-reflections",
  bigBook:         "https://www.aa.org/the-big-book",
  twelveAndTwelve: "https://www.aa.org/twelve-steps-twelve-traditions",
  asBillSeesIt:    "https://www.aa.org/as-bill-sees-it",
  twelveSteps:     "https://www.aa.org/the-twelve-steps",
  twelveTraditions:"https://www.aa.org/the-twelve-traditions",
  preamble:        "https://www.aa.org/aa-preamble",
  safetyCardPdf:   "https://www.aa.org/sites/default/files/literature/F-211_1025.pdf",
  safetyResource:  "https://www.aa.org/aa-guidelines-safety-and-aa-groups",
  // Big Book chapter PDFs:
  chHowItWorks:    "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt5.pdf",
  chIntoAction:    "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt6.pdf",
  chVisionForYou:  "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt11.pdf",
};

window.IAG = {

  /* ===== App-wide settings =============================================== */
  meta: {
    name:      "Into Action Group",
    shortName: "Into Action",
    tagline:   "One day at a time",
    updatesEmail: "intoactionkingwood@gmail.com",
    // After you deploy, paste the public URL here so the Share button sends a
    // clean link. Leave "" to share whatever page is currently open.
    shareUrl:  "",
  },

  links: LINKS,

  /* The four primary tabs in the bottom bar (a 5th "More" tab is automatic).
     Anything not listed here still lives in the "More" menu. */
  tabs: ["meetings", "daily-reflections", "prayers", "seventh-tradition"],

  /* Section id(s) pinned to the TOP of the "More" menu (before the rest, in order). */
  moreFirst: ["meeting-script"],

  /* ===== Home screen ("First Light" dawn view) =========================== */
  home: {
    // Background image shown in the pre-dawn dark. As the sun rises it dissolves
    // away. Swap this file (or path) to change it.
    background: "assets/dawn-bg.png",

    // How the sun behaves when the home screen opens:
    //   "always" — every open plays the full sunrise: pre-dawn (sculpture shown)
    //              → fully ablaze (sculpture dissolved away). The signature intro.
    //   "live"   — the sun's height tracks the real clock (rises through the
    //              morning, fully ablaze by meeting time).
    sunrise: "live",

      // The home screen knows the time: it reads "Live" during a meeting,
      // otherwise it shows the next meeting. On days with more than one meeting,
      // it resets to the next same-day meeting after the earlier meeting ends.
      // The sun also rises with the clock — it starts climbing "riseMins" before
      // the next meeting and is fully ablaze at meeting time, by which point the
      // background has dissolved completely.
      meeting: {
        tzLabel:    "CST",              // label shown to members
        ianaTz:     "America/Chicago",  // used to compute the current time correctly
        windowMins: 75,                 // how long after the start time it still reads "Live"
        riseMins:   180,                // how long before the meeting the sun starts rising (3h → climbs through the morning)
        times: [
          { days: [1, 2, 3, 4, 5], h: 7, m: 0,  label: "7:00 AM", short: "7:00" },
          { days: [1],             h: 17, m: 30, label: "5:30 PM", short: "5:30", name: "Ladies Meeting" },
          { days: [2],             h: 19, m: 0,  label: "7:00 PM", short: "7:00", name: "Book Study" },
          { days: [4],             h: 19, m: 0,  label: "7:00 PM", short: "7:00", name: "Men's Meeting" },
          { days: [6],             h: 7, m: 30, label: "7:30 AM", short: "7:30" },
          { days: [0],             h: 7, m: 30, label: "7:30 AM", short: "7:30", zoomOnly: true },
        ],
      },
    // Today's reflection block under the sun. Generic — no copyrighted AA text.
    // Edit "line" freely; the date is added automatically.
    reflection: {
      kicker:    "Today's Reflection",
      line:      "A quiet moment before the day begins.",
      linkLabel: "Continue on aa.org",
      href:      AA.dailyReflection,
    },
  },

  /* ===== Announcements (edited in a Google Sheet — no code, no redeploy) ==
     SETUP (once):
       1. Make a Google Sheet with a header row in this order:
            Date | Title | Body | Show From | Show Until
       2. Share → "Anyone with the link" → Viewer.
       3. Copy the ID from the sheet URL (the long string between /d/ and /edit)
          and paste it into googleSheetId below.
     UPDATING (anytime, by anyone): just edit rows in the sheet. The app shows
     the new list on next open. Dates in "Show From"/"Show Until" (use YYYY-MM-DD)
     make an item appear/disappear on its own — perfect for weekly/monthly notes.
     Leave googleSheetId "" to just use the manual fallback list below.        */
  announcements: {
    googleSheetId: "",                  // e.g. "1A2b3C4d..."  (from the sheet URL)
    sheetName:     "Announcements",     // the tab name at the bottom of the sheet
    csvUrl:        "",                  // advanced: a full CSV / Apps Script URL instead of an ID
    // Shown before the sheet loads, if it's empty, or if there's no connection:
    fallback: [
      { date: "1st Saturday", title: "Birthday Saturday", body: "We celebrate sobriety birthdays on the 1st Saturday of the month." },
    ],
  },

  /* ===== The 19 sections (in display order) ============================== */
  sections: [

    /* 1 ------------------------------------------------------------------ */
    {
      id: "meetings", title: "Meetings", icon: "pin",
      blocks: [
        { type: "address",
          name: "Christ the King Lutheran Church",
          lines: ["3803 W Lake Houston Pkwy", "Humble, TX 77339"],
          mapsQuery: "Christ the King Lutheran Church, 3803 W Lake Houston Pkwy, Humble, TX 77339" },

        { type: "meetingMarks",
          items: [
            { emblem: "morning", title: "Morning Meeting", time: "Monday – Friday · 7:00 AM",
              note: "In person and on Zoom" },
            { emblem: "ladies", title: "Ladies Meeting", time: "Monday · 5:30 PM",
              note: "In person and on Zoom" },
            { emblem: "book", title: "Book Study", time: "Tuesday · 7:00 PM",
              note: "In person and on Zoom" },
            { emblem: "men", title: "Men's Meeting", time: "Thursday · 7:00 PM",
              note: "In person and on Zoom. This meeting uses a separate app and Zoom link; get with one of the men for access." },
            { emblem: "morning", title: "Saturday Morning", time: "Saturday · 7:30 AM",
              note: "In person and on Zoom" },
            { emblem: "zoom", title: "Sunday Morning", time: "Sunday · 7:30 AM",
              note: "Zoom only" },
          ] },

        { type: "note", body: "Meetings are held inside the Student Center building, adjacent to the Church." },

        { type: "link", label: "Join the Main Zoom Meeting", href: LINKS.zoom, external: true, variant: "primary" },

        { type: "note", variant: "gold",
          body: "Birthdays are celebrated on the 1st Saturday of the month — let us know yours!" },
      ],
    },

    /* 2 ------------------------------------------------------------------ */
    {
      id: "daily-reflections", title: "Daily Reflections", tabLabel: "Reflections", icon: "sun",
      blocks: [
        { type: "card", title: "Before the meeting",
          body: ["We read today's reflection together, then share our experience, strength, and hope.",
                 "Tap below to open today's reflection on the official A.A. site."] },

        { type: "link", label: "Open Today's Reflection", href: AA.dailyReflection, external: true, variant: "primary" },

        { type: "links", title: "Readings",
          items: [
            { label: "How It Works", sublabel: "Big Book, Chapter 5",              href: AA.chHowItWorks,   external: true },
            { label: "Into Action",  sublabel: "Big Book, Chapter 6",              href: AA.chIntoAction,   external: true },
            { label: "The Ninth Step Promises", sublabel: "Big Book, Chapter 6, pp. 83–84", href: AA.chIntoAction, external: true },
            { label: "On Awakening", sublabel: "Big Book, Chapter 6, pp. 86–88", href: AA.chIntoAction, external: true },
            { label: "A Vision for You", sublabel: "Big Book, Chapter 11",         href: AA.chVisionForYou, external: true },
          ] },
      ],
    },

    /* 3 ------------------------------------------------------------------ */
    {
      id: "prayers", title: "Prayers", icon: "flame",
      blocks: [
        // Public-domain prayers are shown in full. The 3rd & 7th Step prayers are
        // from the copyrighted Big Book, so they link out instead of reprinting.
        { type: "prayer", title: "The Serenity Prayer",
          body: "God, grant me the serenity\nto accept the things I cannot change,\nthe courage to change the things I can,\nand the wisdom to know the difference." },

        { type: "prayer", title: "The Lord's Prayer",
          body: "Our Father, who art in heaven,\nhallowed be Thy name;\nThy kingdom come,\nThy will be done,\non earth as it is in heaven.\nGive us this day our daily bread,\nand forgive us our trespasses,\nas we forgive those who trespass against us;\nand lead us not into temptation,\nbut deliver us from evil.\nFor Thine is the kingdom, and the power,\nand the glory, forever.\nAmen." },

        { type: "prayer", title: "Prayer of St. Francis",
          body: "Lord, make me an instrument of Your peace.\nWhere there is hatred, let me sow love;\nwhere there is injury, pardon;\nwhere there is doubt, faith;\nwhere there is despair, hope;\nwhere there is darkness, light;\nand where there is sadness, joy.\n\nO Divine Master, grant that I may not so much seek\nto be consoled as to console,\nto be understood as to understand,\nto be loved as to love.\nFor it is in giving that we receive,\nit is in pardoning that we are pardoned,\nand it is in dying that we are born to eternal life." },

        { type: "prayer", title: "Third Step Prayer",
          note: "From the Big Book, Chapter 5 — “How It Works” (p. 63).", href: AA.chHowItWorks },

        { type: "prayer", title: "Seventh Step Prayer",
          note: "From the Big Book, Chapter 6 — “Into Action” (p. 76).", href: AA.chIntoAction },
      ],
    },

    /* 4 ------------------------------------------------------------------ */
    {
      id: "seventh-tradition", title: "7th Tradition", icon: "heart",
      blocks: [
        { type: "card", title: "The Seventh Tradition",
          body: "Every A.A. group is fully self-supporting, declining outside contributions." },

        { type: "note", variant: "gold",
          body: "Suggested $2 — covers coffee, paper goods, literature, and Zoom." },

        { type: "link", label: "Donate with Square", href: LINKS.squareDonate, external: true, variant: "primary" },

        { type: "links", title: "Other ways to give",
          items: [
            { label: "Zelle", sublabel: LINKS.zelleEmail, copy: LINKS.zelleEmail },
          ] },
      ],
    },

    /* 5 ------------------------------------------------------------------ */
    {
      id: "preamble", title: "Preamble", icon: "doc",
      blocks: [
        { type: "card", title: "The A.A. Preamble",
          body: ["Alcoholics Anonymous is a fellowship of men and women who share their experience, strength and hope with each other that they may solve their common problem and help others to recover from alcoholism.",
                 "The only requirement for membership is a desire to stop drinking. There are no dues or fees for AA membership; we are self-supporting through our own contributions. AA is not allied with any sect, denomination, politics, organization or institution; does not wish to engage in any controversy, neither endorses nor opposes any causes. Our primary purpose is to stay sober and help other alcoholics to achieve sobriety."] },
        { type: "note", body: "© The A.A. Grapevine, Inc.; reprinted with permission." },
        { type: "link", label: "The A.A. Preamble on aa.org", href: AA.preamble, external: true, variant: "secondary" },
      ],
    },

    /* 6 ------------------------------------------------------------------ */
    {
      id: "big-book", title: "Big Book", icon: "book",
      blocks: [
        { type: "card", title: "Alcoholics Anonymous (the Big Book)",
          body: "The basic text of A.A. Tap any part to read it in the viewer." },
        { type: "pdflist", title: "Read by chapter",
          items: [
            { label: "Foreword to the First Edition", href: "assets/docs/bigbook/foreword-1st.pdf" },
            { label: "Foreword to the Second Edition", href: "assets/docs/bigbook/foreword-2nd.pdf" },
            { label: "Foreword to the Third Edition", href: "assets/docs/bigbook/foreword-3rd.pdf" },
            { label: "Foreword to the Fourth Edition", href: "assets/docs/bigbook/foreword-4th.pdf" },
            { label: "The Doctor's Opinion", href: "assets/docs/bigbook/doctors-opinion.pdf" },
            { label: "Chapter 1 — Bill's Story", href: "assets/docs/bigbook/ch01.pdf" },
            { label: "Chapter 2 — There Is a Solution", href: "assets/docs/bigbook/ch02.pdf" },
            { label: "Chapter 3 — More About Alcoholism", href: "assets/docs/bigbook/ch03.pdf" },
            { label: "Chapter 4 — We Agnostics", href: "assets/docs/bigbook/ch04.pdf" },
            { label: "Chapter 5 — How It Works", href: "assets/docs/bigbook/ch05.pdf" },
            { label: "Chapter 6 — Into Action", href: "assets/docs/bigbook/ch06.pdf" },
            { label: "Chapter 7 — Working With Others", href: "assets/docs/bigbook/ch07.pdf" },
            { label: "Chapter 8 — To Wives", href: "assets/docs/bigbook/ch08.pdf" },
            { label: "Chapter 9 — The Family Afterward", href: "assets/docs/bigbook/ch09.pdf" },
            { label: "Chapter 10 — To Employers", href: "assets/docs/bigbook/ch10.pdf" },
            { label: "Chapter 11 — A Vision for You", href: "assets/docs/bigbook/ch11.pdf" },
            { label: "Personal Stories", href: "assets/docs/bigbook/stories-preface.pdf" },
            { label: "Part I — Pioneers of A.A.", href: "assets/docs/bigbook/stories-part1.pdf" },
            { label: "Part II — They Stopped in Time", href: "assets/docs/bigbook/stories-part2.pdf" },
            { label: "Appendix I — The A.A. Tradition", href: "assets/docs/bigbook/appendix-1.pdf" },
            { label: "Appendix II — Spiritual Experience", href: "assets/docs/bigbook/appendix-2.pdf" },
            { label: "Appendix III — The Medical View on A.A.", href: "assets/docs/bigbook/appendix-3.pdf" },
            { label: "Appendix IV — The Lasker Award", href: "assets/docs/bigbook/appendix-4.pdf" },
            { label: "Appendix V — The Religious View on A.A.", href: "assets/docs/bigbook/appendix-5.pdf" },
            { label: "Appendix VI — How to Get in Touch With A.A.", href: "assets/docs/bigbook/appendix-6.pdf" },
            { label: "Appendix VII", href: "assets/docs/bigbook/appendix-7.pdf" },
          ] },
        { type: "link", label: "The full Big Book on aa.org", href: AA.bigBook, external: true, variant: "secondary" },
      ],
    },

    /* 7 ------------------------------------------------------------------ */
    {
      id: "twelve-and-twelve", title: "Twelve & Twelve", icon: "book",
      blocks: [
        { type: "card", title: "Twelve Steps and Twelve Traditions",
          body: "The \"12 & 12\" explains each of A.A.'s Twelve Steps and Twelve Traditions. Tap any part to read it." },
        { type: "pdflist", title: "The Twelve Steps",
          items: [
            { label: "Contents", href: "assets/docs/1212/contents.pdf" },
            { label: "Foreword", href: "assets/docs/1212/foreword.pdf" },
            { label: "Introduction", href: "assets/docs/1212/intro.pdf" },
            { label: "Step One", href: "assets/docs/1212/step-01.pdf" },
            { label: "Step Two", href: "assets/docs/1212/step-02.pdf" },
            { label: "Step Three", href: "assets/docs/1212/step-03.pdf" },
            { label: "Step Four", href: "assets/docs/1212/step-04.pdf" },
            { label: "Step Five", href: "assets/docs/1212/step-05.pdf" },
            { label: "Step Six", href: "assets/docs/1212/step-06.pdf" },
            { label: "Step Seven", href: "assets/docs/1212/step-07.pdf" },
            { label: "Step Eight", href: "assets/docs/1212/step-08.pdf" },
            { label: "Step Nine", href: "assets/docs/1212/step-09.pdf" },
            { label: "Step Ten", href: "assets/docs/1212/step-10.pdf" },
            { label: "Step Eleven", href: "assets/docs/1212/step-11.pdf" },
            { label: "Step Twelve", href: "assets/docs/1212/step-12.pdf" },
          ] },
        { type: "pdflist", title: "The Twelve Traditions",
          items: [
            { label: "Tradition One", href: "assets/docs/1212/tradition-01.pdf" },
            { label: "Tradition Two", href: "assets/docs/1212/tradition-02.pdf" },
            { label: "Tradition Three", href: "assets/docs/1212/tradition-03.pdf" },
            { label: "Tradition Four", href: "assets/docs/1212/tradition-04.pdf" },
            { label: "Tradition Five", href: "assets/docs/1212/tradition-05.pdf" },
            { label: "Tradition Six", href: "assets/docs/1212/tradition-06.pdf" },
            { label: "Tradition Seven", href: "assets/docs/1212/tradition-07.pdf" },
            { label: "Tradition Eight", href: "assets/docs/1212/tradition-08.pdf" },
            { label: "Tradition Nine", href: "assets/docs/1212/tradition-09.pdf" },
            { label: "Tradition Ten", href: "assets/docs/1212/tradition-10.pdf" },
            { label: "Tradition Eleven", href: "assets/docs/1212/tradition-11.pdf" },
            { label: "Tradition Twelve", href: "assets/docs/1212/tradition-12.pdf" },
            { label: "The Twelve Traditions (Long Form)", href: "assets/docs/1212/traditions-longform.pdf" },
          ] },
        { type: "link", label: "The full 12 & 12 on aa.org", href: AA.twelveAndTwelve, external: true, variant: "secondary" },
      ],
    },

    /* Facilitator Guides ------------------------------------------------- */
    {
      id: "plain-language-bb-guide", title: "Plain Language Big Book Guide", icon: "book",
      blocks: [
        { type: "pdf", title: "Plain Language Big Book — Facilitator's Guide",
          body: "A guide for facilitating a study of the Plain Language Big Book.",
          href: "assets/docs/plain-language-big-book-facilitators-guide.pdf" },
      ],
    },

    {
      id: "twelve-and-twelve-guide", title: "12 & 12 Facilitator Guide", icon: "book",
      blocks: [
        { type: "pdf", title: "Twelve & Twelve — Facilitator's Guide",
          body: "A guide for facilitating a study of the Twelve Steps and Twelve Traditions.",
          href: "assets/docs/12-and-12-facilitators-guide.pdf" },
      ],
    },

    /* 8 ------------------------------------------------------------------ */
    {
      id: "as-bill-sees-it", title: "As Bill Sees It", icon: "bookOpen",
      blocks: [
        { type: "pdf", title: "As Bill Sees It",
          body: "A collection of Bill W.'s writings on acceptance, gratitude, and spirituality.",
          href: "assets/docs/as-bill-sees-it.pdf" },
      ],
    },

    /* 9 ------------------------------------------------------------------ */
    {
      id: "group-conscience", title: "Group Conscience", icon: "doc",
      blocks: [
        { type: "pdf", title: "Group Conscience — June 13, 2026",
          body: "Minutes from our group's business meetings.",
          href: "assets/docs/group-conscience-2026-06-13.pdf" },
      ],
    },

    /* Sponsor Lists ------------------------------------------------------ */
    {
      id: "sponsor-lists", title: "Sponsor Lists", icon: "users",
      blocks: [
        { type: "note", body: "Reach out — someone here is glad to sponsor you." },
        { type: "image", title: "Men's Sponsor List",
          src: "assets/docs/sponsors/mens-sponsor-list.jpeg" },
        { type: "image", title: "Women's Sponsor List",
          src: "assets/docs/sponsors/ladies-sponsor-list.jpeg" },
      ],
    },

    /* 10 ----------------------------------------------------------------- */
    {
      id: "the-twelve", title: "The 12", icon: "list",
      blocks: [
        { type: "card", title: "The Twelve Steps & Twelve Traditions",
          body: "Read the official Twelve Steps and Twelve Traditions on aa.org." },
        { type: "links", title: "Official A.A. links",
          items: [
            { label: "The Twelve Steps", href: AA.twelveSteps, external: true },
            { label: "The Twelve Traditions", href: AA.twelveTraditions, external: true },
          ] },
      ],
    },

    /* 11 ----------------------------------------------------------------- */
    {
      id: "speaker-tapes", title: "Speaker Tapes", icon: "headphones",
      blocks: [
        { type: "card", title: "Speaker Tapes",
          body: "A collection of A.A. speaker recordings to listen to." },
        { type: "link", label: "Listen on Mixcloud (Team Recovery)", href: "https://www.mixcloud.com/teamrecovery/", external: true, variant: "primary" },
      ],
    },

    /* 12 ----------------------------------------------------------------- */
    {
      id: "speaker-video", title: "Speaker Video", icon: "play",
      blocks: [
        { type: "card", title: "Speaker Video",
          body: "A playlist of A.A. speaker videos to watch." },
        { type: "link", label: "Watch on YouTube", href: "https://www.youtube.com/playlist?list=PLp_ljyWSCI4vJzNq0az2muf50JEAbEieD", external: true, variant: "primary" },
      ],
    },

    /* 13 ----------------------------------------------------------------- */
    {
      id: "featured-video", title: "Featured Video", icon: "video",
      blocks: [
        { type: "youtube", title: "Featured Video",
          body: "A video selected for the group.",
          videoId: "HUngLgGRJpo", start: 89,
          href: "https://www.youtube.com/watch?v=HUngLgGRJpo&t=89s" },
      ],
    },

    /* 14 ----------------------------------------------------------------- */
    {
      id: "two-way-prayer", title: "Two Way Prayer", icon: "chat",
      blocks: [
        { type: "card", title: "Two Way Prayer",
          body: "Two-way prayer is the practice of not only talking to God, but taking quiet time to listen — an Eleventh Step tool the earliest A.A.s carried over from the Oxford Group. TwoWayPrayer.org is a nonprofit with a book, workshops, and resources for the practice." },
        { type: "link", label: "Visit Two Way Prayer", href: "https://www.twowayprayer.org", external: true, variant: "primary" },
      ],
    },

    /* 14 ----------------------------------------------------------------- */
    {
      id: "announcements", title: "Announcements", icon: "megaphone",
      blocks: [
        // Pulls from the Google Sheet configured in IAG.announcements above.
        { type: "announcements" },
      ],
    },

    /* 15 ----------------------------------------------------------------- */
    {
      id: "safety", title: "Safety", icon: "shield",
      blocks: [
        { type: "card", title: "Safety and A.A.",
          body: "Safety is everyone's responsibility. The official “Safety Card for A.A. Groups” offers guidance for keeping meetings safe and welcoming." },
        { type: "link", label: "Open the Safety Card (PDF)", href: AA.safetyCardPdf, external: true, variant: "primary" },
        { type: "link", label: "A.A. Guidelines on Safety", href: AA.safetyResource, external: true, variant: "secondary" },
      ],
    },

    /* 16 ----------------------------------------------------------------- */
    {
      id: "aa-safety-card", title: "AA Safety Card", icon: "shield",
      blocks: [
        // Interactive PDF. Drop any PDF in assets/docs/ and point "href" at it.
        { type: "pdf", title: "Safety Card for A.A. Groups",
          href: "assets/docs/aa-safety-card.pdf" },
      ],
    },

    /* 17 ----------------------------------------------------------------- */
    {
      id: "meeting-script", title: "Meeting Script", icon: "mic",
      blocks: [
        { type: "note", body: "The chair's script for the In2Action Group. Blanks ( ______ ) are where the chair fills in names." },
        { type: "script",
          parts: [
            { heading: "1 · Welcome",
              body: "Good morning; welcome to the In2Action Group of Alcoholics Anonymous. My name is ______, and I am an alcoholic.\n\nWe are a group of alcoholics that desire not to drink by practicing the principles set forth under the Alcoholics Anonymous program of recovery." },

            { heading: "2 · The A.A. Preamble",
              body: "Alcoholics Anonymous is a fellowship of men and women who share their experience, strength, and hope with each other that they may solve their common problem and help others to recover from alcoholism.\n\nThe only requirement for membership is a desire to stop drinking. There are no dues or fees for AA membership; we are self-supporting through our own contributions. AA is not allied with any sect, denomination, politics, organization or institution; does not wish to engage in any controversy, neither endorses nor opposes any causes. Our primary purpose is to stay sober and help other alcoholics to achieve sobriety." },

            { heading: "3 · Moment of Silence & Serenity Prayer",
              body: "Let's have a moment of silence followed by the Serenity Prayer." },

            { heading: "4 · Tradition Five",
              body: "Our group honors AA's Tradition 5, which states: “Each group has but one primary purpose — to carry its message to the alcoholic that still suffers.”" },

            { heading: "5 · How We Share",
              body: "Following the Preamble guidance, we share:\n\n“Our experience” — who we were\n“Our strength” — what we did to recover\n“Our hope” — what we are like now\n\nOur topic is taken from the “Daily Reflection” or other published AA literature. In the spirit of humility, we do not take volunteers to share, nor stray from our meeting topic.\n\nPlease keep your shares to under 3 minutes to allow others the opportunity to share during this meeting.\n\nI have asked my friend, ______, to start us off with a reading.\n\nThank you, ______.\n\nNext, I have asked ______ to get us started with our topic for this morning's meeting." },

            { heading: "6 · Meeting in Progress",
              body: "— the group shares —" },

            { heading: "7 · Closing",
              body: "We are out of time, and thank you for a good meeting. We encourage and welcome newcomers to hang around immediately following this meeting." },

            { heading: "8 · Chips & Birthdays",
              body: "We give chips at the In2Action group, with the first chip being a “Desire Chip,” which is an outward sign of an inward commitment to not drink for the next 24 hours. Would anyone like a “Desire Chip”?\n\nWe also celebrate monthly sobriety — months one through eleven. Is anyone celebrating a monthly birthday?\n\nAnnual birthdays and 18 months are celebrated on the 1st Saturday of each month. Please let ____________ know when your birthday is near so we can plan accordingly." },

            { heading: "9 · Announcements & 7th Tradition",
              body: "Are there any AA-related announcements from the floor?\n\nWe have our ladies meeting Monday at 5:30 PM, in person and on Zoom. Tuesday night Book Study is at 7:00 PM, in person and on Zoom. Both use the Into Action app.\n\nThursday at 7:00 PM we have the men's group on a different app and Zoom. Get with one of the guys if you need that.\n\nIn observance of the 7th Tradition, we collect donations from the members of this group. These donations pay for our Zoom subscription, rent, coffee, and paper goods, as well as literature for the newcomer. The suggested donation is $2, and can be donated either through the basket in the room or our virtual basket within our App, which has numerous options such as Zelle, Debit Card, Google, and Apple Pay." },

            { heading: "10 · Lord's Prayer & Closing",
              body: "Let's end this meeting affirming the 12th Tradition, which states:\n\n“Anonymity is the spiritual foundation of all our traditions, reminding us to put principles before personalities.”\n\nPlease remember our Anonymity … what is said here … stays here!\n\nThis concludes today's meeting. Please join us in the Lord's Prayer.\n\n______ or ROOM, will you take us out." },
          ] },
      ],
    },

    /* 18 ----------------------------------------------------------------- */
    {
      id: "texas-history", title: "Birth of AA in Texas", icon: "star", layout: "article",
      blocks: [
        { type: "card", title: "The Birth of A.A. in Texas",
          body: ["The seeds of Texas A.A. were planted in the winter of 1940 when Larry J., a newly sober newspaperman from Cleveland, took a job with The Houston Press. Larry was sponsored by Dr. Bob & Clarence S. (Clarence's story, “Home Brewmeister,” appeared in the first three editions of the Big Book.) Larry completed the steps while detoxing in the hospital, and did not attend a single meeting before coming to Houston. He boarded the train to Texas with nothing more than the first edition of our basic text and a spiritual experience. During this train ride, Larry had another spiritual awakening while reading the Big Book. This led him to write a six-part series on A.A. for The Houston Press, which was published in February of 1940. These articles were the catalysts for two major events. Not only were they eventually re-published as A.A.'s first pamphlet, but they also put Larry in touch with Roy Y., a native Houstonian. These two men would form the first Texas A.A. group in April of that year. The original Houston Group still meets today.",
                 "Larry J. is also believed to be the author of the “Texas Prayer,” which was used to open A.A. meetings across the state for years. The prayer — which can also be found in Bill Pittman's book Steppingstone to Recovery — is as follows."] },

        { type: "prayer", title: "The Texas Prayer",
          body: "Our Father, we come to You as a friend.\nYou have said that, where two or three are gathered in Your name, there You will be in the midst. We believe You are with us now.\nWe believe this is something You would have us do, and that it has Your blessing.\nWe believe that You want us to be real partners with You in this business of living, accepting our full responsibility, and certain that the rewards will be freedom, and growth, and happiness.\nFor this, we are grateful.\nWe ask You, always, to guide us. Help us daily to come closer to You and grant us new ways of living our gratitude." },

        { type: "card",
          body: "Unfortunately, Larry's story ended on a sad note. He found himself at odds with the early Houston members, and they formed a steering committee to replace him as the leader of the Houston group. He became resentful over the matter and was never able to fully reconcile with the other members. He returned to active addiction, and he was unable to regain his sobriety, save for a few brief intervals. Larry J. passed away in May of 1944. However, his struggles at the end do not diminish the fact that Larry J. founded A.A. in Texas. And for that, we all owe him a debt of eternal gratitude." },
      ],
    },

  ],
};
