export const TAGS = ["Work", "Health", "Money", "Love", "Mind", "Other"];

export const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "zh-CN", label: "Chinese" },
  { code: "hi-IN", label: "Hindi" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "ar-SA", label: "Arabic" },
  { code: "ru-RU", label: "Russian" },
  { code: "pt-BR", label: "Portuguese" },
  { code: "de-DE", label: "German" },
  { code: "ja-JP", label: "Japanese" },
  { code: "ko-KR", label: "Korean" },
];

export const TEM = {
  Work: "💼",
  Health: "🫀",
  Money: "💸",
  Love: "💛",
  Mind: "🧠",
  Other: "✦",
};

export const STRINGS = {
  en: {
    greeting_morning: "Good morning",
    greeting_afternoon: "Good afternoon",
    greeting_evening: "Good evening",
    greeting_night: "Still up,",
    stat_victories: "Victories",
    stat_streak: "Day streak",
    stat_week: "This week",
    tap_hint: "Log a victory",
    recording: "Recording…",
    transcribing: "Transcribing…",
    speak_ph: "Begin speaking…",
    edit_hint: "Tap above to fix any errors before saving",
    tag_lbl: "Tag this win (optional)",
    stack: "Stack it ✦",
    discard: "Discard",
    spiral_btn: "⟳    I'm spiraling — remind me who I am",
    spiral_sub: "Shows your own victories when doubt kicks in",
    recent: "Recent victories",
    share_nudge: "Share this win →",
    search_ph: "Search your victories…",
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    anchors: [
      "What did you believe about yourself when this happened?",
      "What strength made this possible?",
      "What would you tell a friend who doubted they could do this?",
      "How did it feel in the moment you realized it worked?",
      "What fear did you push through to get here?",
      "What changed in you after this victory?",
      "Who believed in you when this happened?",
      "What would past-you think seeing you accomplish this?",
    ],
    sample_win:
      "I opened Victory Journal and decided to start tracking my wins. That took courage.",
    victory: "victory",
    victories: "victories",
    victories_in: "victories in",
    no_wins_home: "Your first victory is waiting to be recorded. Tap the mic above.",
    no_wins_month: "No victories this month yet.",
    no_wins_search: "No victories match that search.",
    grace: "✦ grace day active — log a win today",
    empty_spiral:
      "Record your first victory — then come back here when you need a reminder.",
    back: "Back",
    del_body:
      "Victories, once lived, cannot be unlived. This will permanently remove it from your journal.",
    del_keep: "Keep it",
    del_remove: "Remove it",
    clr_body:
      "This permanently deletes all your victories. Export your data first if you want a backup.",
    clr_cancel: "Cancel",
    clr_yes: "Yes, clear all",
    settings_lang: "Language",
    settings_install: "Install",
    settings_danger: "Danger zone",
    settings_data: "Your data",
  },
};

export const getAnimationStyles = (isDark) => {
  const accent = isDark ? "#00E699" : "#111111";
  return `
    @keyframes micPulse {
      0%, 100% { transform: scale(1); }
      50%       { transform: scale(1.1); }
    }
    @keyframes micRipple {
      0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.7; }
      100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0;   }
    }
    @keyframes audioGlow {
      0%, 100% { box-shadow: 0 0 0 0   ${accent}88; }
      50%       { box-shadow: 0 0 0 12px ${accent}00; }
    }
    @keyframes soundBar {
      0%, 100% { height: 3px;  }
      50%       { height: 16px; }
    }
    .mic-ripple-1, .mic-ripple-2 {
      position: absolute;
      top: 50%; left: 50%;
      width: 56px; height: 56px;
      border-radius: 50%;
      border: 2px solid rgba(229, 62, 62, 0.7);
      pointer-events: none;
    }
    .mic-ripple-1 { animation: micRipple 1.7s ease-out infinite; }
    .mic-ripple-2 { animation: micRipple 1.7s ease-out infinite 0.65s; }
  `;
};

export const getStackStyles = (isDark) => `
  .bscene {
    position: relative;
    width: 100%;
    height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 820px;
    overflow: visible;
    margin: 12px 0 8px;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }
  .sc-floor {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    width: 270px;
    height: 52px;
    background: radial-gradient(ellipse, rgba(15, 23, 42, 0.16) 0%, transparent 70%);
    pointer-events: none;
    filter: blur(1px);
  }
  .bdrum {
    position: relative;
    width: 0;
    height: 0;
    transform-style: preserve-3d;
    touch-action: none;
    cursor: grab;
    z-index: 1;
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .bpg {
    position: absolute;
    width: 64px;
    height: 248px;
    left: -32px;
    top: -124px;
    transform-origin: 50% 50%;
    transition: opacity 0.25s ease, filter 0.25s ease;
  }
  .bpg-win {
    position: absolute;
    inset: 0;
    background: ${
      isDark
        ? "linear-gradient(180deg, rgba(28,32,44,0.98) 0%, rgba(18,22,32,0.96) 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,249,252,0.96) 100%)"
    };
    border: 1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"};
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 14px 10px;
    text-align: center;
    box-shadow: ${
      isDark ? "0 10px 28px rgba(0,0,0,0.5)" : "0 10px 28px rgba(15,23,42,0.08)"
    };
    backdrop-filter: blur(8px);
  }
  .bpg.elv .bpg-win {
    box-shadow: ${
      isDark
        ? "0 18px 38px rgba(0,0,0,0.65)"
        : "0 18px 38px rgba(15,23,42,0.16)"
    };
    transform: translateZ(1px);
  }
  .bpg-em {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    font-size: 22px;
    background: ${isDark ? "rgba(0,230,153,0.15)" : "rgba(0,179,119,0.12)"};
  }
  .bpg-ttl {
    font-size: 12px;
    font-weight: 600;
    line-height: 1.35;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    max-height: 140px;
    overflow: hidden;
    color: ${isDark ? "#EDE8E0" : "#1A202C"};
  }
  .bpg-blank {
    position: absolute;
    inset: 0;
    background: ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"};
    border-radius: 18px;
    border: 1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"};
    backdrop-filter: blur(8px);
  }
`;
