import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Input,
  Textarea,
  SimpleGrid,
  IconButton,
  HStack,
  VStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast,
  Portal,
  Center,
  Image,
  VisuallyHidden,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Settings,
  Mic,
  Square,
  Trash2,
  Share2,
  RefreshCw,
  Search,
  Calendar,
  Home,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  X,
  Sparkles,
  Info,
  Moon,
  Sun,
  Play,
  Pause,
  Plus,
} from "lucide-react";
import { wrap } from "regenerator-runtime";

// Core Application Configurations
const TAGS = ["Work", "Health", "Money", "Love", "Mind", "Other"];
const TEM = {
  Work: "💼",
  Health: "🫀",
  Money: "💸",
  Love: "💛",
  Mind: "🧠",
  Other: "✦",
};

const STRINGS = {
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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
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
    no_wins_home:
      "Your first victory is waiting to be recorded. Tap the mic above.",
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

const getAnimationStyles = (isDark) => {
  const accent = isDark ? "#00E699" : "#00B377";
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

const getStackStyles = (isDark) => `
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

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const drumRef = useRef(null);
  const bsceneRef = useRef(null);
  const drumAngle = useRef(0);
  const stackRafRef = useRef(null);
  const dragStateRef = useRef({ active: false, startX: 0, startAngle: 0 });

  // ═══ THEME TOKENS (Safely placed at the top level of the component) ═══
  const bgBase = useColorModeValue("#F7F9FC", "#08090A");
  const bgGrad = useColorModeValue(
    "radial-gradient(circle at 50% -20%, rgba(0, 2w, 153, 0.08), transparent 75%)",
    "radial-gradient(circle at 50% -20%, rgba(0, 230, 153, 0.05), transparent 75%)",
  );
  const textPrimary = useColorModeValue("#1A202C", "#EDE8E0");
  const textSecondary = useColorModeValue("blackAlpha.600", "whiteAlpha.400");
  const textTertiary = useColorModeValue("blackAlpha.400", "whiteAlpha.300");
  const cardBg = useColorModeValue("white", "rgba(255, 255, 255, 0.01)");
  const cardBgHover = useColorModeValue("gray.50", "rgba(255, 255, 255, 0.03)");
  const cardBgSolid = useColorModeValue("white", "rgba(255, 255, 255, 0.02)");
  const borderColor = useColorModeValue(
    "blackAlpha.100",
    "rgba(255, 255, 255, 0.05)",
  );
  const borderColorHover = useColorModeValue(
    "blackAlpha.300",
    "rgba(255, 255, 255, 0.15)",
  );
  const accentBase = useColorModeValue("#00B377", "#00E699");
  const accentGrad = useColorModeValue(
    "linear(to-br, #00B377, #008055)",
    "linear(to-br, #00E699, #00B377)",
  );
  const accentGradHover = useColorModeValue(
    "linear(to-br, #008055, #00B377)",
    "linear(to-br, #00B377, #00E699)",
  );
  const accentBg = useColorModeValue(
    "rgba(0, 230, 153, 0.15)",
    "rgba(0, 230, 153, 0.05)",
  );
  const accentBorder = useColorModeValue(
    "rgba(0, 230, 153, 0.4)",
    "rgba(0, 230, 153, 0.15)",
  );
  const glassBg = useColorModeValue(
    "rgba(247, 249, 252, 0.85)",
    "rgba(8, 9, 10, 0.85)",
  );
  const invertText = useColorModeValue("white", "#08090A");

  // Danger Tokens
  const dangerBg = useColorModeValue(
    "rgba(229, 62, 62, 0.05)",
    "rgba(229, 62, 62, 0.01)",
  );
  const dangerBorder = useColorModeValue(
    "rgba(229, 62, 62, 0.2)",
    "rgba(229, 62, 62, 0.12)",
  );
  const dangerHover = useColorModeValue(
    "rgba(229, 62, 62, 0.1)",
    "rgba(229, 62, 62, 0.03)",
  );

  // Extracted Component Specific Colors (No inline hooks allowed below)
  const cellEmptyBg = useColorModeValue(
    "rgba(0,0,0,0.02)",
    "rgba(255,255,255,0.02)",
  );
  const cellEmptyBorder = useColorModeValue(
    "rgba(0,0,0,0.05)",
    "rgba(255,255,255,0.03)",
  );
  const lvl1Bg = useColorModeValue(
    "rgba(0, 230, 153, 0.1)",
    "rgba(0, 230, 153, 0.06)",
  );
  const lvl1Border = useColorModeValue(
    "rgba(0, 230, 153, 0.3)",
    "rgba(0, 230, 153, 0.2)",
  );
  const lvl2Bg = useColorModeValue(
    "rgba(0, 230, 153, 0.25)",
    "rgba(0, 230, 153, 0.15)",
  );
  const lvl2Border = useColorModeValue(
    "rgba(0, 230, 153, 0.5)",
    "rgba(0, 230, 153, 0.4)",
  );
  const lvl3Bg = useColorModeValue(
    "rgba(0, 230, 153, 0.5)",
    "rgba(0, 230, 153, 0.4)",
  );
  const lvl3Border = useColorModeValue(
    "rgba(0, 230, 153, 0.6)",
    "rgba(0, 230, 153, 0.5)",
  );
  const antiSpiralBg = useColorModeValue(
    "linear(to-r, rgba(147, 51, 234, 0.08), rgba(59, 130, 246, 0.08))",
    "linear(to-r, rgba(147, 51, 234, 0.06), rgba(59, 130, 246, 0.06))",
  );
  const antiSpiralBorder = useColorModeValue(
    "rgba(147, 51, 234, 0.15)",
    "rgba(147, 51, 234, 0.1)",
  );
  const antiSpiralText = useColorModeValue("purple.600", "purple.300");
  const calNavBg = useColorModeValue("blackAlpha.50", "rgba(12, 12, 16, 0.4)");
  const calNavBgHover = useColorModeValue(
    "blackAlpha.100",
    "rgba(12, 12, 16, 0.6)",
  );
  const backBtnHover = useColorModeValue("#008055", "#00B377");
  const tagUnselectedBg = useColorModeValue(
    "blackAlpha.50",
    "rgba(12, 12, 16, 0.4)",
  );
  const modalOverlayBg = useColorModeValue("whiteAlpha.600", "blackAlpha.600");
  const modalContentGlassBg = useColorModeValue(
    "rgba(255, 255, 255, 0.9)",
    "rgba(255, 255, 255, 0.01)",
  );
  const spiralEvidenceBg = useColorModeValue(
    "linear(to-b, rgba(147, 51, 234, 0.08), transparent)",
    "linear(to-b, rgba(147, 51, 234, 0.06), transparent)",
  );
  const spiralEvidenceBorder = useColorModeValue(
    "rgba(147, 51, 234, 0.2)",
    "rgba(147, 51, 234, 0.15)",
  );
  const quoteMarkColor = useColorModeValue(
    "rgba(0,0,0,0.03)",
    "rgba(0, 230, 153, 0.05)",
  );

  // --- Core State Machine ---
  const [wins, setWins] = useState(() =>
    JSON.parse(localStorage.getItem("vj4") || "[]"),
  );
  const [meta, setMeta] = useState(() =>
    JSON.parse(localStorage.getItem("vj4m") || "{}"),
  );
  const [screen, setScreen] = useState(meta.onboarded ? "home" : "ob1");
  const [lang, setLang] = useState(
    () => localStorage.getItem("vj_lang") || "en",
  );

  // --- UI Interactivity State ---
  const [nameInput, setNameInput] = useState(meta.name || "");
  const [liveText, setLiveText] = useState("");
  const [textInputBox, setTextInputBox] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilterTag, setSearchFilterTag] = useState(null);

  // --- Recording, Analytics & Custom Engine States ---
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState("listening");
  const [isEditableMode, setIsEditableMode] = useState(false);
  const [speechEngineMode, setSpeechEngineMode] = useState("Checking…");
  const [speechError, setSpeechError] = useState("");
  const [showShareNudge, setShowShareNudge] = useState(false);
  const [spinState, setSpinState] = useState("idle");
  const [audioRecordings, setAudioRecordings] = useState(() =>
    JSON.parse(localStorage.getItem("vj4_audio") || "{}"),
  );
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const audioPlayerRef = useRef(null);
  const savedAudioRef = useRef(null);
  const [customTagInput, setCustomTagInput] = useState("");
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  // --- Active Calendars & Active Target Dynamic References ---
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [targetDayData, setTargetDayData] = useState({
    year: null,
    month: null,
    day: null,
    dayWins: [],
  });
  const [selectedWinId, setSelectedWinId] = useState(null);
  const [previousScreenTracker, setPreviousScreenTracker] = useState("home");
  const [spiralWin, setSpiralWin] = useState({
    text: "",
    details: "",
    anchor: "",
  });
  const [usedSpiralIds, setUsedSpiralIds] = useState([]);

  // --- Modal Overlay Engine Controllers ---
  const [activeOverlays, setActiveOverlays] = useState({
    delete: false,
    clearAll: false,
    share: false,
    install: false,
  });

  const buildCylinder = (winsData) => {
    const drum = drumRef.current;
    const scene = bsceneRef.current;
    if (!drum) return;

    // Scale card size and cylinder radius to the available scene width
    const sceneW = scene ? scene.offsetWidth : 340;
    const cardW = Math.min(64, Math.max(48, Math.round(sceneW * 0.17)));
    const cardH = Math.min(248, Math.max(180, Math.round(sceneW * 0.65)));
    const radius = Math.min(155, Math.max(100, Math.round((sceneW - cardW) * 0.42)));
    if (scene) scene.style.height = `${cardH + 112}px`;

    drum.innerHTML = "";
    const sorted = [...winsData]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20);
    const slots = Math.max(24, sorted.length * 3);
    const step = 360 / Math.max(1, slots);

    for (let i = 0; i < slots; i += 1) {
      const pageIndex = Math.floor(i / 3);
      const w =
        i % 3 === 0
          ? sorted[pageIndex] || { tag: null, text: "" }
          : { tag: null, text: "" };
      const pg = document.createElement("div");
      pg.className = "bpg";
      pg.style.width = `${cardW}px`;
      pg.style.height = `${cardH}px`;
      pg.style.left = `${-Math.round(cardW / 2)}px`;
      pg.style.top = `${-Math.round(cardH / 2)}px`;
      pg.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px) rotateY(90deg)`;
      if (!w.text) {
        pg.innerHTML = `<div class="bpg-blank"></div>`;
        drum.appendChild(pg);
        continue;
      }
      pg.dataset.winId = w.id || "";
      pg.innerHTML = `
        <div class="bpg-win">
          <div class="bpg-em">${TEM[w.tag] || "✦"}</div>
          <div class="bpg-ttl">${w.text.slice(0, 30)}...</div>
        </div>`;
      drum.appendChild(pg);
    }
  };

  const updateFrontStackCard = () => {
    const drum = drumRef.current;
    if (!drum) return;

    const pages = [...drum.querySelectorAll(".bpg")];
    if (!pages.length) return;

    let frontIndex = 0;
    let smallestDistance = Infinity;

    pages.forEach((page, index) => {
      const match = page.style.transform.match(/rotateY\(([-\d.]+)deg\)/);
      const pageAngle = match ? Number(match[1]) : 0;
      const relativeAngle =
        (((pageAngle + drumAngle.current) % 360) + 360) % 360;
      const distance = Math.min(relativeAngle, 360 - relativeAngle);

      page.style.opacity = `${Math.max(0.1, 1 - distance / 120)}`;
      page.style.filter = `saturate(${Math.max(0.72, 1 - distance / 360)})`;

      if (distance < smallestDistance) {
        smallestDistance = distance;
        frontIndex = index;
      }
    });

    pages.forEach((page, index) => {
      page.classList.toggle("elv", index === frontIndex);
    });
  };

  const triggerStackSpin = () => {
    if (!wins.length || spinState === "spinning") return;

    const sorted = [...wins]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20);

    const randomIndex = Math.floor(Math.random() * sorted.length);
    const targetWin = sorted[randomIndex];

    const slots = Math.max(24, sorted.length * 3);
    const step = 360 / slots;
    const pageAngle = randomIndex * 3 * step;

    // Compute target drum angle: 6 full rotations + land on the chosen win
    const current = drumAngle.current;
    const targetRemainder = ((-pageAngle % 360) + 360) % 360;
    const currentRemainder = ((current % 360) + 360) % 360;
    let delta = targetRemainder - currentRemainder;
    if (delta < 0) delta += 360;
    const targetAngle = current + delta + 6 * 360;

    setSpinState("spinning");

    const duration = 3500;
    const startAngle = current;
    const startTime = performance.now();

    const animate = (timestamp) => {
      const t = Math.min((timestamp - startTime) / duration, 1);
      // ease-out quart: decelerate sharply at the end
      const eased = 1 - Math.pow(1 - t, 4);

      drumAngle.current = startAngle + (targetAngle - startAngle) * eased;
      if (drumRef.current) {
        drumRef.current.style.transform = `rotateY(${drumAngle.current}deg)`;
      }
      updateFrontStackCard();

      if (t < 1) {
        stackRafRef.current = requestAnimationFrame(animate);
      } else {
        drumAngle.current = targetAngle;
        stackRafRef.current = null;
        setTimeout(() => {
          routeToSpecificScreen(targetWin.id, "stack");
          setSpinState("idle");
        }, 600);
      }
    };

    if (stackRafRef.current) cancelAnimationFrame(stackRafRef.current);
    stackRafRef.current = requestAnimationFrame(animate);
  };

  const handleDrumPointerDown = (clientX) => {
    if (spinState === "spinning") return;
    if (stackRafRef.current) {
      cancelAnimationFrame(stackRafRef.current);
      stackRafRef.current = null;
    }
    dragStateRef.current = { active: true, startX: clientX, startAngle: drumAngle.current };
  };

  const handleDrumPointerMove = (clientX) => {
    if (!dragStateRef.current.active) return;
    const delta = clientX - dragStateRef.current.startX;
    drumAngle.current = dragStateRef.current.startAngle + delta * 0.5;
    if (drumRef.current) {
      drumRef.current.style.transform = `rotateY(${drumAngle.current}deg)`;
    }
    updateFrontStackCard();
  };

  const handleDrumPointerUp = () => {
    dragStateRef.current.active = false;
  };

  useEffect(() => {
    if (screen === "stack") {
      buildCylinder(wins);
      setSpinState("idle");
      const onResize = () => buildCylinder(wins);
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        if (stackRafRef.current) {
          cancelAnimationFrame(stackRafRef.current);
          stackRafRef.current = null;
        }
      };
    }
    return () => {
      if (stackRafRef.current) {
        cancelAnimationFrame(stackRafRef.current);
        stackRafRef.current = null;
      }
    };
  }, [screen, wins]);

  // --- HTML5 Audio Recording Framework Refs ---
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef([]);
  const recordingStreamSourceRef = useRef(null);
  const speechFallbackTimerRef = useRef(null);
  const nativeCanvasRef = useRef(null);
  const [shareImageBlob, setShareImageBlob] = useState(null);
  const [shareCanvasPreviewUrl, setShareCanvasPreviewUrl] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const hasVoiceSupport =
    browserSupportsSpeechRecognition || !!window.MediaRecorder;

  const chakraToast = useToast();

  const lookupString = (key) => STRINGS.en[key] || key;

  const triggerHapticFeedback = (duration = 40) => {
    try {
      if (navigator.vibrate) navigator.vibrate(duration);
    } catch (e) {
      /* Haptic Fail-Safe */
    }
  };

  const displayToast = (message) => {
    chakraToast({
      title: message,
      status: "info",
      duration: 2500,
      isClosable: true,
      position: "top",
      variant: "subtle",
    });
  };

  useEffect(() => {
    localStorage.setItem("vj4", JSON.stringify(wins));
  }, [wins]);

  useEffect(() => {
    localStorage.setItem("vj4m", JSON.stringify(meta));
  }, [meta]);

  useEffect(() => {
    localStorage.setItem("vj_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("vj4_audio", JSON.stringify(audioRecordings));
  }, [audioRecordings]);

  useEffect(() => {
    const webAppManifestData = {
      name: "Victory Journal",
      short_name: "Victory",
      description: "Your personal proof library",
      start_url: ".",
      display: "standalone",
      background_color: colorMode === "dark" ? "#08090A" : "#F7F9FC",
      theme_color: colorMode === "dark" ? "#08090A" : "#F7F9FC",
      icons: [
        {
          src:
            "data:image/svg+xml," +
            encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="36" fill="${colorMode === "dark" ? "#08090A" : "#F7F9FC"}"/><text x="96" y="130" font-size="110" text-anchor="middle" fill="#00E699" font-family="serif" font-style="italic">✦</text></svg>`,
            ),
          sizes: "192x192",
          type: "image/svg+xml",
        },
      ],
    };
    try {
      const manifestFileBlob = new Blob([JSON.stringify(webAppManifestData)], {
        type: "application/manifest+json",
      });
      document.getElementById("ml").href =
        URL.createObjectURL(manifestFileBlob);
    } catch (e) {}
  }, [colorMode]);

  useEffect(() => {
    setSpeechEngineMode(
      browserSupportsSpeechRecognition ? "Speech API" : "Basic mode",
    );

    async function evaluateServerTransmissionProxy() {
      try {
        const response = await fetch("/api/transcribe", { method: "OPTIONS" });
        if (response.ok || [200, 204, 405].includes(response.status)) {
          setSpeechEngineMode(browserSupportsSpeechRecognition ?? "Speech API");
        } else {
          setSpeechEngineMode("Basic mode");
        }
      } catch (e) {
        setSpeechEngineMode("Basic mode");
      }
    }
    evaluateServerTransmissionProxy();
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      setLiveText(transcript);
      if (!listening && transcript.trim()) {
        setIsEditableMode(true);
        setTranscriptionStatus("idle");
      }
    }
  }, [transcript, listening, browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (meta.onboarded) {
      const currentCalendarDayString = new Date().toDateString();
      const eligibleResurfaceWin = wins.find(
        (w) =>
          w.resurface &&
          new Date(w.resurface).toDateString() === currentCalendarDayString,
      );
      if (eligibleResurfaceWin) {
        setTimeout(() => {
          routeToSpecificScreen(eligibleResurfaceWin.id, "home");
          displayToast("A win resurfaced for you ✦");
        }, 1000);
      }
    }
  }, []);

  const calculateStatisticalDashboardData = () => {
    const historicalLookbackLimit = new Date();
    historicalLookbackLimit.setDate(historicalLookbackLimit.getDate() - 7);
    const localizedWeekWinsCount = wins.filter(
      (w) => new Date(w.date) >= historicalLookbackLimit,
    ).length;

    const baselineDailyTimeTracker = new Date();
    baselineDailyTimeTracker.setHours(0, 0, 0, 0);

    let streakCounter = 0;
    let isGracePeriodActive = false;

    for (let indexOffset = 0; indexOffset < 365; indexOffset++) {
      const computedDayIndex = new Date(baselineDailyTimeTracker);
      computedDayIndex.setDate(computedDayIndex.getDate() - indexOffset);
      const dayHasLoggedVictory = wins.some(
        (w) =>
          new Date(w.date).toDateString() === computedDayIndex.toDateString(),
      );

      if (dayHasLoggedVictory) {
        streakCounter++;
      } else if (indexOffset === 0) {
        isGracePeriodActive = true;
      } else {
        break;
      }
    }
    return {
      total: wins.length,
      streak: streakCounter,
      week: localizedWeekWinsCount,
      grace: isGracePeriodActive,
    };
  };

  const appDashboardStatistics = calculateStatisticalDashboardData();

  const executeScreenTransitionPipeline = (targetScreenName) => {
    setSearchQuery("");
    setFilterTag(null);
    setSearchFilterTag(null);
    setShowCustomTagInput(false);
    setCustomTagInput("");
    setScreen(targetScreenName);
  };

  const completeUserOnboardingProfile = () => {
    const trimmedAccountName = nameInput.trim();
    const runtimeMetaConfiguration = { ...meta, onboarded: true };
    if (trimmedAccountName) runtimeMetaConfiguration.name = trimmedAccountName;
    setMeta(runtimeMetaConfiguration);

    if (!wins.length) {
      const introductorySeedVictory = [
        {
          id: "sample_" + Date.now(),
          text: lookupString("sample_win"),
          date: new Date().toISOString(),
          resurface: null,
          tag: null,
          sample: true,
        },
      ];
      setWins(introductorySeedVictory);
    }
    setScreen("home");
  };

  const executeUnifiedVoiceInputToggle = () => {
    isRecording ? terminateVoiceRecordingCycle() : initialVoiceRecordingCycle();
  };

  const initialVoiceRecordingCycle = async () => {
    setSpeechError("");
    triggerHapticFeedback(30);

    // Clean up any stale recording state
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setLiveText("");
    setTextInputBox("");
    setSelectedTag(null);
    setIsEditableMode(false);
    setIsRecording(true);
    setTranscriptionStatus("listening");

    if (browserSupportsSpeechRecognition) {
      resetTranscript();
      try {
        await SpeechRecognition.startListening({
          continuous: true,
          interimResults: true,
          language: "en-IN",
        });
      } catch (e) {
        setSpeechError("Voice recognition failed to start.");
        setIsRecording(false);
        return;
      }
      // Run MediaRecorder in parallel to capture audio for saving
      if (window.MediaRecorder) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          recordingStreamSourceRef.current = stream;
          const mimeType = MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "";
          const recorder = new MediaRecorder(
            stream,
            mimeType ? { mimeType } : {},
          );
          audioStreamRef.current = [];
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioStreamRef.current.push(e.data);
          };
          mediaRecorderRef.current = recorder;
          recorder.start(100);
        } catch (err) {
          // Audio capture unavailable — transcription still works
        }
      }
      return;
    }

    if (window.MediaRecorder) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        recordingStreamSourceRef.current = stream;

        const mimeType = MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
        const recorder = new MediaRecorder(
          stream,
          mimeType ? { mimeType } : {},
        );

        audioStreamRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioStreamRef.current.push(e.data);
        };

        mediaRecorderRef.current = recorder;
        recorder.start(100);
      } catch (err) {
        setIsRecording(false);
        setSpeechError("Microphone access denied.");
      }
    }
  };

  const terminateVoiceRecordingCycle = () => {
    setIsRecording(false);
    if (speechFallbackTimerRef.current) {
      clearTimeout(speechFallbackTimerRef.current);
    }
    triggerHapticFeedback(20);

    // Handle Speech Recognition API (if active)
    if (browserSupportsSpeechRecognition) {
      if (listening) {
        try {
          SpeechRecognition.stopListening();
        } catch (e) {
          console.warn("Speech recognition stop error", e);
        }
      }

      // Stop the parallel MediaRecorder and save the audio blob
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        const capturedMime = mediaRecorderRef.current.mimeType || "audio/webm";
        mediaRecorderRef.current.onstop = () => {
          if (recordingStreamSourceRef.current) {
            recordingStreamSourceRef.current
              .getTracks()
              .forEach((t) => t.stop());
            recordingStreamSourceRef.current = null;
          }
          if (audioStreamRef.current.length > 0) {
            const blob = new Blob(audioStreamRef.current, {
              type: capturedMime,
            });
            if (blob.size >= 2000) {
              savedAudioRef.current = { blob, mime: capturedMime };
            }
            audioStreamRef.current = [];
          }
        };
        mediaRecorderRef.current.stop();
      }

      if (liveText.trim()) {
        setIsEditableMode(true);
      }
      setTranscriptionStatus("idle");
      return;
    }

    // Handle pure MediaRecorder path (transcription via server)
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      setTranscriptionStatus("transcribing");

      mediaRecorderRef.current.onstop = async () => {
        if (recordingStreamSourceRef.current) {
          recordingStreamSourceRef.current
            .getTracks()
            .forEach((track) => track.stop());
          recordingStreamSourceRef.current = null;
        }
        await executeAudioBase64TranscriptionPipeline();
      };

      mediaRecorderRef.current.stop();
    } else {
      if (liveText.trim()) {
        setIsEditableMode(true);
      }
      setTranscriptionStatus("idle");
    }
  };
  const executeAudioBase64TranscriptionPipeline = async () => {
    if (!audioStreamRef.current.length) {
      setTranscriptionStatus("idle");
      setSpeechError("No audio captured — hold button while speaking");
      return;
    }
    const internalActiveMimeType =
      mediaRecorderRef.current?.mimeType ||
      audioStreamRef.current[0]?.type ||
      "audio/webm";
    const computedFileExtension =
      internalActiveMimeType.includes("mp4") ||
      internalActiveMimeType.includes("m4a")
        ? "m4a"
        : internalActiveMimeType.includes("ogg")
          ? "ogg"
          : "webm";
    const localizedAudioPayloadBlob = new Blob(audioStreamRef.current, {
      type: internalActiveMimeType,
    });
    savedAudioRef.current = {
      blob: localizedAudioPayloadBlob,
      mime: internalActiveMimeType,
    };

    if (localizedAudioPayloadBlob.size < 2000) {
      setTranscriptionStatus("idle");
      setSpeechError("Recording too short — speak for at least 1 second");
      audioStreamRef.current = [];
      return;
    }

    try {
      const audioBase64String = await new Promise((resolve, reject) => {
        const fileReaderInstance = new FileReader();
        fileReaderInstance.onload = () =>
          resolve(fileReaderInstance.result.split(",")[1]);
        fileReaderInstance.onerror = reject;
        fileReaderInstance.readAsDataURL(localizedAudioPayloadBlob);
      });

      displayToast(
        `Sending ${Math.round(
          localizedAudioPayloadBlob.size / 1024,
        )}kb to server…`,
      );

      const networkRequestStream = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: audioBase64String,
          mimeType: internalActiveMimeType,
          ext: computedFileExtension,
          prompt:
            "Personal wins journal. Victories and achievements. May include Hindi, English or Hinglish words.",
        }),
      });

      if (!networkRequestStream.ok) {
        const structuralErrorPayload = await networkRequestStream
          .json()
          .catch(() => ({}));
        throw new Error(
          networkRequestStream.status === 401
            ? "Invalid API key — check server setup"
            : networkRequestStream.status === 413
              ? "Recording too long — try a shorter clip"
              : structuralErrorPayload.error?.message ||
                `Server error ${networkRequestStream.status}`,
        );
      }

      const serializationResponseData = await networkRequestStream.json();
      const parsedOutputText = (serializationResponseData.text || "").trim();

      setTranscriptionStatus("idle");
      if (parsedOutputText) {
        setLiveText(parsedOutputText);
        setIsEditableMode(true);
      } else {
        setSpeechError("Nothing detected — speak clearly and try again");
      }
    } catch (err) {
      setTranscriptionStatus("idle");
      const connectionErrorFallbackMessage =
        err.message === "Failed to fetch"
          ? "Cannot reach server — check internet connection"
          : err.message;
      setSpeechError(connectionErrorFallbackMessage);
      displayToast("Transcription error: " + connectionErrorFallbackMessage);
    }
    audioStreamRef.current = [];
  };

  const handleManualTextInputMapping = (incomingValue) => {
    setTextInputBox(incomingValue);
    setLiveText(incomingValue);
  };

  const clearActiveVictoryInputInterface = () => {
    setLiveText("");
    setTextInputBox("");
    setIsRecording(false);
    setSelectedTag(null);
    if (speechFallbackTimerRef.current)
      clearTimeout(speechFallbackTimerRef.current);
    setSpeechError("");

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (recordingStreamSourceRef.current) {
      recordingStreamSourceRef.current
        .getTracks()
        .forEach((track) => track.stop());
      recordingStreamSourceRef.current = null;
    }
    mediaRecorderRef.current = null;
    audioStreamRef.current = [];
    setIsEditableMode(false);
    setTranscriptionStatus("idle");
    savedAudioRef.current = null;
    setShowCustomTagInput(false);
    setCustomTagInput("");
    try {
      if (browserSupportsSpeechRecognition) {
        SpeechRecognition.stopListening();
      }
    } catch (e) {}
  };

  const persistCurrentVictoryToStorage = () => {
    const fullyParsedTextContent = liveText.trim();
    if (!fullyParsedTextContent) return;

    const consolidatedVictoryModel = {
      id: Date.now().toString(),
      text: fullyParsedTextContent,
      date: new Date().toISOString(),
      resurface: null,
      tag: selectedTag,
    };

    setWins((prevVictories) => [consolidatedVictoryModel, ...prevVictories]);
    if (
      savedAudioRef.current?.blob &&
      savedAudioRef.current.blob.size < 524288
    ) {
      const { blob: audioBlob, mime: audioMime } = savedAudioRef.current;
      const winId = consolidatedVictoryModel.id;
      const fr = new FileReader();
      fr.onload = () => {
        setAudioRecordings((prev) => ({
          ...prev,
          [winId]: { data: fr.result.split(",")[1], mime: audioMime },
        }));
      };
      fr.readAsDataURL(audioBlob);
    }
    savedAudioRef.current = null;
    triggerHapticFeedback(60);
    const assignedVictoryId = consolidatedVictoryModel.id;
    clearActiveVictoryInputInterface();
    displayToast("Victory stacked ✦");

    setTimeout(() => {
      setSelectedWinId(assignedVictoryId);
      setPreviousScreenTracker("home");
      setShowShareNudge(true);
    }, 400);
  };

  const toggleVictorySmartResurfacing = () => {
    if (!selectedWinId) return;
    const modifiedWinsList = [...wins];
    const targetModelIndex = modifiedWinsList.findIndex(
      (w) => w.id === selectedWinId,
    );
    if (targetModelIndex < 0) return;

    if (modifiedWinsList[targetModelIndex].resurface) {
      modifiedWinsList[targetModelIndex].resurface = null;
      setWins(modifiedWinsList);
      displayToast("Resurface removed");
    } else {
      const randomlyGeneratedIntervalDays = [7, 10, 14, 21][
        Math.floor(Math.random() * 4)
      ];
      const targetFutureResurfaceDate = new Date();
      targetFutureResurfaceDate.setDate(
        targetFutureResurfaceDate.getDate() + randomlyGeneratedIntervalDays,
      );
      modifiedWinsList[targetModelIndex].resurface =
        targetFutureResurfaceDate.toISOString();
      setWins(modifiedWinsList);
      displayToast(`Will return in ${randomlyGeneratedIntervalDays} days`);
    }
  };

  const deleteTargetVictoryModelRecord = () => {
    if (!selectedWinId) return;
    const synchronizedFilteredWins = wins.filter((w) => w.id !== selectedWinId);
    setWins(synchronizedFilteredWins);
    setAudioRecordings((prev) => {
      const u = { ...prev };
      delete u[selectedWinId];
      return u;
    });
    setActiveOverlays((prev) => ({ ...prev, delete: false }));
    displayToast("Victory removed");
    executeScreenTransitionPipeline(previousScreenTracker);
  };

  const clearCompleteJournalDatabase = () => {
    setWins([]);
    setAudioRecordings({});
    setActiveOverlays((prev) => ({ ...prev, clearAll: false }));
    displayToast("All victories cleared");
  };

  const toggleAudioPlayback = (winId) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (playingAudioId === winId) {
      setPlayingAudioId(null);
      return;
    }
    const rec = audioRecordings[winId];
    if (!rec) return;
    const bytes = atob(rec.data);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: rec.mime });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => {
      setPlayingAudioId(null);
      URL.revokeObjectURL(url);
      audioPlayerRef.current = null;
    };
    audio.play().catch(() => {});
    audioPlayerRef.current = audio;
    setPlayingAudioId(winId);
  };

  const addCustomTag = (tagName) => {
    const trimmed = tagName.trim();
    if (!trimmed || trimmed.length > 20) return;
    const existing = [...TAGS, ...(meta.customTags || [])];
    if (existing.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      displayToast("Tag already exists");
      return;
    }
    setMeta((prev) => ({
      ...prev,
      customTags: [...(prev.customTags || []), trimmed],
    }));
    setCustomTagInput("");
    setShowCustomTagInput(false);
    displayToast(`"${trimmed}" tag created ✦`);
  };

  const removeCustomTag = (tagName) => {
    setMeta((prev) => ({
      ...prev,
      customTags: (prev.customTags || []).filter((t) => t !== tagName),
    }));
    setWins((prev) =>
      prev.map((w) => (w.tag === tagName ? { ...w, tag: null } : w)),
    );
    displayToast(`"${tagName}" tag removed`);
  };

  const routeToSpecificScreen = (
    victoryIdentifier,
    operationalSourceScreen,
  ) => {
    setSelectedWinId(victoryIdentifier);
    setPreviousScreenTracker(operationalSourceScreen);
    executeScreenTransitionPipeline("detail");
  };

  const adjustInlineVictoryTagMapping = (computedTagIdentifier) => {
    if (!selectedWinId) return;
    const localizedModifiableWins = [...wins];
    const searchTargetIndex = localizedModifiableWins.findIndex(
      (w) => w.id === selectedWinId,
    );
    if (searchTargetIndex < 0) return;

    localizedModifiableWins[searchTargetIndex].tag = computedTagIdentifier;
    setWins(localizedModifiableWins);
    triggerHapticFeedback(20);
    displayToast(
      computedTagIdentifier
        ? `Tagged as ${computedTagIdentifier}`
        : "Tag removed",
    );
  };

  const generateAntiSpiralProofData = () => {
    let internalRuntimeTrackingIds = [...usedSpiralIds];
    if (!wins.length) {
      setSpiralWin({
        text: lookupString("empty_spiral"),
        details: "",
        anchor: lookupString("anchors")[0],
      });
      return;
    }
    if (internalRuntimeTrackingIds.length >= wins.length) {
      internalRuntimeTrackingIds = [];
    }
    const processingPool = wins.filter(
      (w) => !internalRuntimeTrackingIds.includes(w.id),
    );
    const chosenContextWin =
      processingPool[Math.floor(Math.random() * processingPool.length)];
    internalRuntimeTrackingIds.push(chosenContextWin.id);
    setUsedSpiralIds(internalRuntimeTrackingIds);

    setSpiralWin({
      text: chosenContextWin.text,
      details:
        (chosenContextWin.tag ? chosenContextWin.tag + " · " : "") +
        getExtendedLongDateRepresentation(chosenContextWin.date),
      anchor:
        lookupString("anchors")[
          Math.floor(Math.random() * lookupString("anchors").length)
        ],
    });
  };

  const triggerAntiSpiralWorkflowMode = () => {
    setUsedSpiralIds([]);
    executeScreenTransitionPipeline("spiral");
    setTimeout(() => {
      generateAntiSpiralProofData();
    }, 50);
  };

  const designSocialSharePosterGraph = (targetVictoryInstance) => {
    const rawDesignCanvas = nativeCanvasRef.current;
    if (!rawDesignCanvas) return;
    const renderingContext2D = rawDesignCanvas.getContext("2d");
    const squareResolutionBounds = 1080;

    rawDesignCanvas.width = squareResolutionBounds;
    rawDesignCanvas.height = squareResolutionBounds;

    const canvasBgColor = colorMode === "dark" ? "#08090A" : "#F7F9FC";
    const canvasTextColor = colorMode === "dark" ? "#EDE8E0" : "#1A202C";
    const canvasAccent =
      colorMode === "dark" ? "rgba(0,230,153,0.5)" : "rgba(0,179,119,0.7)";

    renderingContext2D.fillStyle = canvasBgColor;
    renderingContext2D.fillRect(
      0,
      0,
      squareResolutionBounds,
      squareResolutionBounds,
    );

    const computationalRadialGradient = renderingContext2D.createRadialGradient(
      squareResolutionBounds * 0.35,
      squareResolutionBounds * 0.25,
      0,
      squareResolutionBounds * 0.35,
      squareResolutionBounds * 0.25,
      squareResolutionBounds * 0.7,
    );

    computationalRadialGradient.addColorStop(
      0,
      colorMode === "dark" ? "rgba(0,230,153,0.06)" : "rgba(0,230,153,0.1)",
    );
    computationalRadialGradient.addColorStop(1, "transparent");
    renderingContext2D.fillStyle = computationalRadialGradient;
    renderingContext2D.fillRect(
      0,
      0,
      squareResolutionBounds,
      squareResolutionBounds,
    );

    renderingContext2D.strokeStyle = "rgba(0,230,153,0.25)";
    renderingContext2D.lineWidth = 1.5;
    drawRoundedBoundingBoxEdge(
      renderingContext2D,
      40,
      40,
      squareResolutionBounds - 80,
      squareResolutionBounds - 80,
      40,
    );
    renderingContext2D.stroke();

    const linearGlowBoundaryEffect = renderingContext2D.createLinearGradient(
      120,
      0,
      squareResolutionBounds - 120,
      0,
    );
    linearGlowBoundaryEffect.addColorStop(0, "transparent");
    linearGlowBoundaryEffect.addColorStop(0.4, "rgba(0,230,153,0.5)");
    linearGlowBoundaryEffect.addColorStop(0.6, "rgba(0,230,153,0.5)");
    linearGlowBoundaryEffect.addColorStop(1, "transparent");
    renderingContext2D.strokeStyle = linearGlowBoundaryEffect;
    renderingContext2D.lineWidth = 1;
    renderingContext2D.beginPath();
    renderingContext2D.moveTo(120, 40);
    renderingContext2D.lineTo(squareResolutionBounds - 120, 40);
    renderingContext2D.stroke();

    renderingContext2D.fillStyle = "rgba(0,230,153,0.07)";
    renderingContext2D.font = "380px Georgia,serif";
    renderingContext2D.textAlign = "left";
    renderingContext2D.fillText('"', 70, 380);

    let variableFontMeasurementScale = 72;
    let computedTextLinesArray = mapStringTokensIntoTextLines(
      renderingContext2D,
      targetVictoryInstance.text,
      squareResolutionBounds - 200,
      `italic ${variableFontMeasurementScale}px Georgia,serif`,
    );

    while (
      computedTextLinesArray.length > 6 &&
      variableFontMeasurementScale > 32
    ) {
      variableFontMeasurementScale -= 4;
      computedTextLinesArray = mapStringTokensIntoTextLines(
        renderingContext2D,
        targetVictoryInstance.text,
        squareResolutionBounds - 200,
        `italic ${variableFontMeasurementScale}px Georgia,serif`,
      );
    }

    const balancedVerticalTextHeightOffset = Math.max(
      180,
      (squareResolutionBounds -
        computedTextLinesArray.length * (variableFontMeasurementScale + 20)) /
        2,
    );
    renderingContext2D.font = `italic ${variableFontMeasurementScale}px Georgia,serif`;
    renderingContext2D.fillStyle = canvasTextColor;
    renderingContext2D.textAlign = "left";

    computedTextLinesArray.forEach((currentLineItem, textLineIndex) => {
      renderingContext2D.fillText(
        currentLineItem,
        100,
        balancedVerticalTextHeightOffset +
          textLineIndex * (variableFontMeasurementScale + 20),
      );
    });

    if (targetVictoryInstance.tag) {
      renderingContext2D.font = "300 22px monospace";
      renderingContext2D.fillStyle = canvasAccent;
      renderingContext2D.textAlign = "left";
      renderingContext2D.fillText(
        targetVictoryInstance.tag.toUpperCase(),
        100,
        squareResolutionBounds - 160,
      );
    }

    renderingContext2D.font = "300 22px monospace";
    renderingContext2D.fillStyle =
      colorMode === "dark" ? "rgba(237,232,224,0.3)" : "rgba(26,32,44,0.4)";
    renderingContext2D.textAlign = "left";
    renderingContext2D.fillText(
      getExtendedLongDateRepresentation(
        targetVictoryInstance.date,
      ).toUpperCase(),
      100,
      squareResolutionBounds - 130,
    );

    renderingContext2D.font = "300 22px monospace";
    renderingContext2D.fillStyle = canvasAccent;
    renderingContext2D.textAlign = "right";
    renderingContext2D.fillText(
      "VICTORY JOURNAL",
      squareResolutionBounds - 80,
      squareResolutionBounds - 130,
    );

    renderingContext2D.font = "28px serif";
    renderingContext2D.fillStyle = "rgba(0,230,153,0.6)";
    renderingContext2D.fillText(
      "✦",
      squareResolutionBounds - 76,
      squareResolutionBounds - 158,
    );

    rawDesignCanvas.toBlob((generatedBlobData) => {
      setShareImageBlob(generatedBlobData);
      setShareCanvasPreviewUrl(rawDesignCanvas.toDataURL());
    }, "image/png");
  };

  const drawRoundedBoundingBoxEdge = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const mapStringTokensIntoTextLines = (
    ctx,
    textString,
    totalWidthBound,
    cssFontSpecString,
  ) => {
    ctx.font = cssFontSpecString;
    const separateWordTokens = textString.split(" ");
    const calculatedLinesCollection = [];
    let processingLineBuffer = "";

    separateWordTokens.forEach((wordToken) => {
      const theoreticalLineCombination = processingLineBuffer
        ? processingLineBuffer + " " + wordToken
        : wordToken;
      if (
        ctx.measureText(theoreticalLineCombination).width > totalWidthBound &&
        processingLineBuffer
      ) {
        calculatedLinesCollection.push(processingLineBuffer);
        processingLineBuffer = wordToken;
      } else {
        processingLineBuffer = theoreticalLineCombination;
      }
    });
    if (processingLineBuffer)
      calculatedLinesCollection.push(processingLineBuffer);
    return calculatedLinesCollection;
  };

  const triggerNativePlatformShareInterface = async () => {
    if (!shareImageBlob || !navigator.share) return;
    try {
      const shareableFileContainer = new File([shareImageBlob], "victory.png", {
        type: "image/png",
      });
      await navigator.share({
        files: [shareableFileContainer],
        title: "My Victory",
        text: "From my Victory Journal",
      });
    } catch (e) {}
  };

  const localDeviceImageDownloadAction = () => {
    if (!shareImageBlob) return;
    const pseudoDownloadAnchor = document.createElement("a");
    pseudoDownloadAnchor.href = URL.createObjectURL(shareImageBlob);
    pseudoDownloadAnchor.download = `victory-${Date.now()}.png`;
    pseudoDownloadAnchor.click();
    displayToast("Image saved ✦");
  };

  const triggerModalOverlayActivation = (targetOverlayKey, stateStatus) => {
    if (targetOverlayKey === "share" && stateStatus) {
      const lookupObjectData = wins.find((w) => w.id === selectedWinId);
      if (lookupObjectData) designSocialSharePosterGraph(lookupObjectData);
    }
    setActiveOverlays((prevOverlaysState) => ({
      ...prevOverlaysState,
      [targetOverlayKey]: stateStatus,
    }));
  };

  const handleFileSystemBackupExport = () => {
    const backupStructuredModel = {
      exported: new Date().toISOString(),
      meta: meta,
      wins: wins,
    };
    const simulatedDataPayloadBlob = new Blob(
      [JSON.stringify(backupStructuredModel, null, 2)],
      { type: "application/json" },
    );
    const downloadExecutionAnchor = document.createElement("a");
    downloadExecutionAnchor.href = URL.createObjectURL(
      simulatedDataPayloadBlob,
    );
    downloadExecutionAnchor.download = `victory-journal-${new Date()
      .toLocaleDateString("en-US")
      .replace(/\//g, "-")}.json`;
    downloadExecutionAnchor.click();
    displayToast("Exported successfully");
  };

  const handleFileSystemBackupImport = (eventTargetReference) => {
    const chosenBackupFile = eventTargetReference.files[0];
    if (!chosenBackupFile) return;
    const fileReaderEngine = new FileReader();

    fileReaderEngine.onload = (executionEvent) => {
      try {
        const structuralImportedPayload = JSON.parse(
          executionEvent.target.result,
        );
        const processingVictoriesCollection =
          structuralImportedPayload.wins ||
          (Array.isArray(structuralImportedPayload)
            ? structuralImportedPayload
            : []);

        if (!processingVictoriesCollection.length) {
          displayToast("No victories found in file");
          return;
        }

        const existingVictoriesCollection = [...wins];
        const uniqueKeysMap = new Set(
          existingVictoriesCollection.map((w) => w.id),
        );
        const filteredNewVictories = processingVictoriesCollection.filter(
          (w) => !uniqueKeysMap.has(w.id),
        );

        const outputSortedWins = [
          ...existingVictoriesCollection,
          ...filteredNewVictories,
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        setWins(outputSortedWins);

        if (structuralImportedPayload.meta?.name && !meta.name) {
          setMeta((prev) => ({
            ...prev,
            name: structuralImportedPayload.meta.name,
          }));
          setNameInput(structuralImportedPayload.meta.name);
        }
        displayToast(`Imported ${filteredNewVictories.length} victories`);
      } catch (err) {
        displayToast("Could not read file");
      }
    };
    fileReaderEngine.readAsText(chosenBackupFile);
    eventTargetReference.value = "";
  };

  const renderFormattedTimelineHeaderString = () => {
    const activeHourIndex = new Date().getHours();
    if (activeHourIndex < 12) return lookupString("greeting_morning");
    if (activeHourIndex < 17) return lookupString("greeting_afternoon");
    if (activeHourIndex < 21) return lookupString("greeting_evening");
    return lookupString("greeting_night");
  };

  const getRelativeTimelineStringRepresentation = (isoTimestampString) => {
    const inputDateTimeObject = new Date(isoTimestampString);
    const comparisonDateTimeObject = new Date();
    const cumulativeDayDifference = Math.floor(
      (comparisonDateTimeObject - inputDateTimeObject) / 86400000,
    );

    if (cumulativeDayDifference === 0) {
      return (
        "Today · " +
        inputDateTimeObject.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }
    if (cumulativeDayDifference === 1) return "Yesterday";
    if (cumulativeDayDifference < 7)
      return `${cumulativeDayDifference} days ago`;

    return inputDateTimeObject.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getExtendedLongDateRepresentation = (isoTimestampString) => {
    return new Date(isoTimestampString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const processTimelineCalendarRenderingEngine = () => {
    const calendarYearBound = currentCalendarDate.getFullYear();
    const calendarMonthBound = currentCalendarDate.getMonth();
    const currentDayExecutionTracker = new Date();

    const historicalMonthActivityMatrix = {};
    wins.forEach((winObject) => {
      const parsedWinDate = new Date(winObject.date);
      if (
        parsedWinDate.getFullYear() === calendarYearBound &&
        parsedWinDate.getMonth() === calendarMonthBound
      ) {
        const matrixDayKey = parsedWinDate.getDate();
        historicalMonthActivityMatrix[matrixDayKey] =
          (historicalMonthActivityMatrix[matrixDayKey] || 0) + 1;
      }
    });

    const indexFirstWeekDayOfMonth = new Date(
      calendarYearBound,
      calendarMonthBound,
      1,
    ).getDay();
    const totalAggregatedDaysInMonth = new Date(
      calendarYearBound,
      calendarMonthBound + 1,
      0,
    ).getDate();

    const calendarStructuralElementsGrid = [];

    // Header Day Mapping Loop
    lookupString("days").forEach((dayLabel, index) => {
      calendarStructuralElementsGrid.push(
        <Text
          key={`header-label-${index}`}
          textAlign="center"
          fontSize="xs"
          fontWeight="semibold"
          color={textTertiary}
          py={2}
          textTransform="uppercase"
          letterSpacing="widest"
        >
          {dayLabel}
        </Text>,
      );
    });

    // Padding Grid Offset Loop
    for (
      let emptyCellIndex = 0;
      emptyCellIndex < indexFirstWeekDayOfMonth;
      emptyCellIndex++
    ) {
      calendarStructuralElementsGrid.push(
        <Box key={`empty-cell-${emptyCellIndex}`} aspectRatio="1" />,
      );
    }

    // Dynamic Calendar Grid Engine Day Builder
    for (
      let monthDayIteration = 1;
      monthDayIteration <= totalAggregatedDaysInMonth;
      monthDayIteration++
    ) {
      const matchIsToday =
        currentDayExecutionTracker.getFullYear() === calendarYearBound &&
        currentDayExecutionTracker.getMonth() === calendarMonthBound &&
        currentDayExecutionTracker.getDate() === monthDayIteration;

      const loggedDayVictoriesCount =
        historicalMonthActivityMatrix[monthDayIteration] || 0;

      let bgStyleProps = {
        bg: cellEmptyBg,
        color: textPrimary,
        border: `1px solid ${cellEmptyBorder}`,
      };
      if (loggedDayVictoriesCount === 1)
        bgStyleProps = {
          bg: lvl1Bg,
          color: accentBase,
          border: `1px solid ${lvl1Border}`,
        };
      if (loggedDayVictoriesCount === 2)
        bgStyleProps = {
          bg: lvl2Bg,
          color: textPrimary,
          border: `1px solid ${lvl2Border}`,
        };
      if (loggedDayVictoriesCount === 3)
        bgStyleProps = {
          bg: lvl3Bg,
          color: invertText,
          fontWeight: "bold",
          border: `1px solid ${lvl3Border}`,
        };
      if (loggedDayVictoriesCount > 3)
        bgStyleProps = {
          bgGradient: accentGrad,
          color: invertText,
          fontWeight: "black",
          boxShadow: "0 0 20px rgba(0, 230, 153, 0.3)",
        };

      const executeTargetDayRouteAction = () => {
        if (loggedDayVictoriesCount === 0) return;
        const localizedFilteredDayWins = wins.filter((w) => {
          const d = new Date(w.date);
          return (
            d.getFullYear() === calendarYearBound &&
            d.getMonth() === calendarMonthBound &&
            d.getDate() === monthDayIteration
          );
        });

        if (localizedFilteredDayWins.length === 1) {
          routeToSpecificScreen(localizedFilteredDayWins[0].id, "calendar");
        } else {
          setTargetDayData({
            year: calendarYearBound,
            month: calendarMonthBound,
            day: monthDayIteration,
            dayWins: localizedFilteredDayWins,
          });
          executeScreenTransitionPipeline("day");
        }
      };

      calendarStructuralElementsGrid.push(
        <Flex
          key={`calendar-day-${monthDayIteration}`}
          aspectRatio="1"
          borderRadius="xl"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          position="relative"
          fontSize="sm"
          cursor="pointer"
          transition="all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
          _hover={{
            transform: "translateY(-1px)",
            border: `1px solid ${lvl2Border}`,
          }}
          _active={{ transform: "scale(0.96)" }}
          onClick={executeTargetDayRouteAction}
          {...bgStyleProps}
          {...(matchIsToday
            ? {
                ring: "2",
                ringColor: accentBase,
                ringOffset: "2",
                ringOffsetColor: bgBase,
              }
            : {})}
        >
          {loggedDayVictoriesCount > 1 && (
            <Badge
              position="absolute"
              top="-2px"
              right="-2px"
              fontSize="9px"
              px={1.5}
              bg={invertText}
              color={accentBase}
              borderRadius="full"
              border={`1px solid ${lvl1Border}`}
              minW="16px"
              textAlign="center"
              variant="unset"
            >
              {loggedDayVictoriesCount}
            </Badge>
          )}
          {monthDayIteration}
        </Flex>,
      );
    }
    return calendarStructuralElementsGrid;
  };

  const handleMonthStepNavigation = (directionalOffsetIndex) => {
    const updatedTargetCalendarDate = new Date(currentCalendarDate);
    updatedTargetCalendarDate.setMonth(
      updatedTargetCalendarDate.getMonth() + directionalOffsetIndex,
    );
    setCurrentCalendarDate(updatedTargetCalendarDate);
  };

  const handleQueryRegexHighlighting = (
    targetTextPhrase,
    searchKeywordToken,
  ) => {
    if (!searchKeywordToken.trim()) return targetTextPhrase;
    const extractionRegularExpression = new RegExp(
      "(" + searchKeywordToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
      "gi",
    );
    return targetTextPhrase.replace(
      extractionRegularExpression,
      `<mark style="background:${colorMode === "dark" ? "rgba(0,230,153,.2)" : "rgba(0,179,119,.3)"};color:${textPrimary};border-radius:4px;padding:0 3px">$1</mark>`,
    );
  };

  const allTags = [...TAGS, ...(meta.customTags || [])];

  const activeDashboardFilteredWins = wins
    .filter((w) => !filterTag || w.tag === filterTag)
    .slice(0, 8);

  const activeSearchFilteredWins = wins.filter((w) => {
    const dynamicTagFilterConstraint =
      !searchFilterTag || w.tag === searchFilterTag;
    const dynamicQueryConstraint =
      !searchQuery.trim() ||
      w.text.toLowerCase().includes(searchQuery.toLowerCase());
    return dynamicTagFilterConstraint && dynamicQueryConstraint;
  });

  const activeMonthTimelineWins = wins.filter((w) => {
    const d = new Date(w.date);
    return (
      d.getFullYear() === currentCalendarDate.getFullYear() &&
      d.getMonth() === currentCalendarDate.getMonth()
    );
  });

  return (
    <>
      <style>{getStackStyles(colorMode === "dark")}</style>
      <style>{getAnimationStyles(colorMode === "dark")}</style>
      <Box
        minH="100vh"
        bg={bgBase}
        bgGradient={bgGrad}
        color={textPrimary}
        px={0}
        pb="112px"
        position="relative"
        overflowX="hidden"
        transition="all 0.3s ease"
      >
        {/* ═══ ONBOARDING SCREEN 1 ═══ */}
        {screen === "ob1" && (
          <Flex
            maxW="md"
            mx="auto"
            px={6}
            pt="80px"
            pb="40px"
            minH="100vh"
            flexDirection="column"
            justifyContent="space-between"
          >
            <VStack align="stretch" spacing={10} my="auto">
              <Text
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                tracking="widest"
                color={accentBase}
                bg={accentBg}
                alignSelf="flex-start"
                px={3.5}
                py={1}
                borderRadius="full"
                border={`1px solid ${accentBorder}`}
              >
                Victory Journal
              </Text>
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "5xl" }}
                fontFamily="serif"
                fontWeight="light"
                tracking="tight"
                lineHeight="tight"
              >
                Your wins
                <br />
                are{" "}
                <Box
                  as="em"
                  fontStyle="italic"
                  fontWeight="normal"
                  color={accentBase}
                  bgGradient={accentGrad}
                  bgClip="text"
                >
                  evidence.
                </Box>
              </Heading>
              <Text
                color={textSecondary}
                fontSize="md"
                lineHeight="relaxed"
                fontWeight="light"
              >
                Every time something works — big or small — you record it.
                <br />
                <br />
                Over time, you build{" "}
                <strong style={{ fontWeight: 500, color: textPrimary }}>
                  your own proof
                </strong>{" "}
                that you're capable. When doubt arrives, you read your own
                record — not a stranger's story.
              </Text>
            </VStack>
            <VStack pt={10} spacing={6}>
              <Button
                w="full"
                py={7}
                bgGradient={accentGrad}
                _hover={{
                  bgGradient: accentGradHover,
                  boxShadow: "0 0 25px rgba(0,230,153,0.25)",
                }}
                color={invertText}
                fontWeight="bold"
                borderRadius="2xl"
                transition="all 0.3s"
                _active={{ transform: "scale(0.98)" }}
                onClick={() => executeScreenTransitionPipeline("ob2")}
              >
                Begin &nbsp;→
              </Button>
              <Box fontSize="2xl" color={accentBorder}>
                <Sparkles size={20} />
              </Box>
            </VStack>
          </Flex>
        )}

        {/* ═══ ONBOARDING SCREEN 2 ═══ */}
        {screen === "ob2" && (
          <Flex
            maxW="md"
            mx="auto"
            px={6}
            pt="80px"
            pb="40px"
            minH="100vh"
            flexDirection="column"
            justifyContent="space-between"
            position="relative"
          >
            <VStack align="stretch" spacing={8} my="auto" w="full">
              <Text
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                tracking="widest"
                color={accentBase}
                bg={accentBg}
                alignSelf="flex-start"
                px={3.5}
                py={1}
                borderRadius="full"
                border={`1px solid ${accentBorder}`}
              >
                Victory Journal
              </Text>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="serif"
                fontWeight="light"
                tracking="tight"
              >
                What should
                <br />
                we call you?
              </Heading>
              <Text color={textSecondary} fontSize="sm" fontWeight="light">
                Your journal knows your name.
              </Text>
              <Input
                w="full"
                bg={cardBg}
                border={`1px solid ${borderColor}`}
                _focus={{
                  borderColor: accentBorder,
                  boxShadow: "0 0 12px rgba(0, 230, 153, 0.15)",
                  bg: cardBgHover,
                }}
                borderRadius="2xl"
                px={5}
                py={7}
                color={textPrimary}
                placeholder="Your name…"
                _placeholder={{ color: textTertiary }}
                outline="none"
                transition="all 0.3s"
                maxLength={32}
                autoComplete="off"
                spellCheck="false"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && completeUserOnboardingProfile()
                }
              />
            </VStack>
            <VStack pt={10} spacing={4} w="full">
              <Button
                w="full"
                py={7}
                bgGradient={accentGrad}
                _hover={{
                  bgGradient: accentGradHover,
                  boxShadow: "0 0 25px rgba(0,230,153,0.2)",
                }}
                color={invertText}
                fontWeight="bold"
                borderRadius="2xl"
                transition="all 0.3s"
                _active={{ transform: "scale(0.98)" }}
                onClick={completeUserOnboardingProfile}
              >
                Open my journal &nbsp;✦
              </Button>
              <Button
                variant="unstyled"
                fontSize="xs"
                color={textTertiary}
                _hover={{ color: textSecondary }}
                py={2}
                textTransform="uppercase"
                tracking="widest"
                transition="colors"
                onClick={completeUserOnboardingProfile}
              >
                Skip
              </Button>
            </VStack>
          </Flex>
        )}

        {/* ═══ SYSTEM HOME DASHBOARD ═══ */}
        {screen === "home" && (
          <Box maxW="md" mx="auto" px={6} pt={12}>
            <Flex justify="space-between" align="center" mb={8}>
              <Box>
                <Text
                  fontSize="10px"
                  textTransform="uppercase"
                  tracking="widest"
                  color={textTertiary}
                  fontWeight="bold"
                  mb={1}
                >
                  {renderFormattedTimelineHeaderString()}
                </Text>
                <Heading
                  as="h1"
                  fontSize="2xl"
                  fontFamily="serif"
                  fontWeight="light"
                  tracking="tight"
                >
                  {meta.name ? (
                    <span>
                      <Box
                        as="em"
                        fontStyle="italic"
                        fontWeight="normal"
                        color={accentBase}
                      >
                        {meta.name}.
                      </Box>
                    </span>
                  ) : (
                    <span>
                      Your{" "}
                      <Box
                        as="em"
                        fontStyle="italic"
                        fontWeight="normal"
                        color={accentBase}
                      >
                        journal.
                      </Box>
                    </span>
                  )}
                </Heading>
              </Box>
              <IconButton
                p={3}
                bg={cardBgSolid}
                _hover={{
                  bg: cardBgHover,
                  borderColor: accentBorder,
                }}
                borderRadius="xl"
                transition="all 0.2s"
                border={`1px solid ${borderColor}`}
                icon={<Settings size={18} color={textPrimary} />}
                onClick={() => executeScreenTransitionPipeline("settings")}
              />
            </Flex>

            {/* Analytics Dashboard Grid */}
            <SimpleGrid
              columns={3}
              spacing={3}
              bg={cardBg}
              borderRadius="2xl"
              p={4}
              border={`1px solid ${borderColor}`}
              mb={5}
              backdropFilter="blur(16px)"
            >
              <Box textAlign="center">
                <Text
                  fontSize="2xl"
                  fontFamily="serif"
                  fontWeight="light"
                  color={accentBase}
                >
                  {appDashboardStatistics.total}
                </Text>
                <Text
                  fontSize="9px"
                  textTransform="uppercase"
                  tracking="wider"
                  color={textSecondary}
                  mt={1}
                >
                  {lookupString("stat_victories")}
                </Text>
              </Box>
              <Box
                borderLeft={`1px solid ${borderColor}`}
                borderRight={`1px solid ${borderColor}`}
                textAlign="center"
              >
                <Text
                  fontSize="2xl"
                  fontFamily="serif"
                  fontWeight="light"
                  color={accentBase}
                >
                  {appDashboardStatistics.streak}
                </Text>
                <Text
                  fontSize="9px"
                  textTransform="uppercase"
                  tracking="wider"
                  color={textSecondary}
                  mt={1}
                >
                  {lookupString("stat_streak")}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text
                  fontSize="2xl"
                  fontFamily="serif"
                  fontWeight="light"
                  color={accentBase}
                >
                  {appDashboardStatistics.week}
                </Text>
                <Text
                  fontSize="9px"
                  textTransform="uppercase"
                  tracking="wider"
                  color={textSecondary}
                  mt={1}
                >
                  {lookupString("stat_week")}
                </Text>
              </Box>
            </SimpleGrid>

            {appDashboardStatistics.grace &&
              appDashboardStatistics.streak > 0 && (
                <Box
                  mb={6}
                  py={2.5}
                  px={4}
                  bg={accentBg}
                  border={`1px solid ${accentBorder}`}
                  borderRadius="xl"
                  fontSize="xs"
                  color={accentBase}
                  textAlign="center"
                  tracking="wide"
                  fontWeight="medium"
                >
                  {lookupString("grace")}
                </Box>
              )}

            {/* Browser Unsupported Speech Notification Fallback */}
            {!hasVoiceSupport && (
              <Box
                mb={6}
                py={3}
                px={4}
                bg={dangerBg}
                border={`1px solid ${dangerBorder}`}
                borderRadius="xl"
                fontSize="xs"
                color="red.500"
                textAlign="center"
              >
                <Flex align="center" justify="center" gap={2}>
                  <Info size={14} />
                  Voice recording isn't supported here. Type your win below.
                </Flex>
              </Box>
            )}

            {/* Recording status — shown when footer mic is active */}
            {speechError && (
              <Text
                fontSize="xs"
                color="red.500"
                fontWeight="light"
                textAlign="center"
                mb={4}
              >
                {speechError}
              </Text>
            )}

            {/* Direct Manual Typing Input Sandbox Area */}
            {!isRecording && !liveText && !hasVoiceSupport && (
              <Textarea
                w="full"
                h="128px"
                bg={cardBgSolid}
                border={`1px solid ${borderColor}`}
                _focus={{
                  borderColor: accentBorder,
                  boxShadow: "0 0 10px rgba(0,230,153,0.03)",
                }}
                borderRadius="2xl"
                p={4}
                color={textPrimary}
                _placeholder={{ color: textTertiary }}
                resize="none"
                fontSize="lg"
                fontWeight="light"
                fontStyle="italic"
                lineHeight="relaxed"
                placeholder="Write your win here…"
                value={textInputBox}
                onInput={(e) => handleManualTextInputMapping(e.target.value)}
              />
            )}

            {/* Transcription Live Card Visualizers */}
            {(isRecording ||
              liveText ||
              transcriptionStatus === "transcribing") && (
              <VStack
                align="stretch"
                bg={cardBg}
                backdropFilter="blur(10px)"
                borderRadius="2xl"
                p={5}
                border={`1px solid ${borderColor}`}
                shadow="2xl"
                spacing={4}
                mb={6}
              >
                <Text
                  fontSize="9px"
                  textTransform="uppercase"
                  tracking="widest"
                  color={accentBase}
                  fontWeight="bold"
                >
                  {isRecording
                    ? lookupString("recording")
                    : transcriptionStatus === "transcribing"
                      ? lookupString("transcribing")
                      : "Tap to edit if needed ✦"}
                </Text>

                {isRecording && window.MediaRecorder && (
                  <HStack h="24px" py={1} align="stretch" spacing={1}>
                    {[...Array(9)].map((_, i) => (
                      <Box
                        key={i}
                        flex="1"
                        bg={accentBorder}
                        borderRadius="full"
                        h="full"
                        animation="pulse 2s infinite"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </HStack>
                )}

                {transcriptionStatus === "transcribing" && (
                  <HStack
                    spacing={3}
                    py={2}
                    fontSize="sm"
                    color={textSecondary}
                    fontWeight="light"
                  >
                    <Box
                      w="14px"
                      h="14px"
                      border={`2px solid ${accentBase}`}
                      borderTopColor="transparent"
                      borderRadius="full"
                      animation="spin 1s linear infinite"
                    />
                    <Text>Transcribing with AI…</Text>
                  </HStack>
                )}

                {!isEditableMode ? (
                  <Text
                    fontSize="lg"
                    fontFamily="serif"
                    fontWeight="light"
                    fontStyle="italic"
                    lineHeight="relaxed"
                    display={
                      transcriptionStatus === "transcribing" ? "none" : "block"
                    }
                  >
                    {liveText ? (
                      liveText
                    ) : (
                      <Text as="span" color={textTertiary}>
                        {lookupString("speak_ph")}
                      </Text>
                    )}
                  </Text>
                ) : (
                  <Textarea
                    w="full"
                    minH="100px"
                    bg="transparent"
                    border="none"
                    borderBottom={`1px solid ${accentBorder}`}
                    color={textPrimary}
                    fontFamily="serif"
                    fontWeight="light"
                    fontStyle="italic"
                    fontSize="lg"
                    lineHeight="relaxed"
                    resize="none"
                    outline="none"
                    _focus={{ borderColor: accentBase }}
                    pb={2}
                    p={0}
                    borderRadius="none"
                    value={liveText}
                    onChange={(e) => setLiveText(e.target.value)}
                    placeholder="Edit your win…"
                  />
                )}

                {isEditableMode && (
                  <Text
                    fontSize="9px"
                    textTransform="uppercase"
                    tracking="widest"
                    color={textTertiary}
                    fontFamily="mono"
                  >
                    {lookupString("edit_hint")}
                  </Text>
                )}
              </VStack>
            )}

            {/* Tag Selection Strips */}
            {!isRecording && liveText && (
              <VStack align="stretch" spacing={2} mb={6}>
                <Text
                  fontSize="xs"
                  color={textSecondary}
                  fontWeight="bold"
                  textTransform="uppercase"
                  tracking="wider"
                >
                  {lookupString("tag_lbl")}
                </Text>
                <HStack
                  overflowX="auto"
                  overflowY="hidden"
                  w="full"
                  pb={2}
                  spacing={2}
                  flexWrap="nowrap"
                  css={{
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",

                    /* Hide scrollbar */
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",

                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  {allTags.map((tagItem) => (
                    <Button
                      key={`save-tag-${tagItem}`}
                      size="sm"
                      px={4}
                      py={4}
                      fontSize="xs"
                      borderRadius="xl"
                      tracking="wide"
                      variant="unset"
                      border="1px solid"
                      transition="all 0.2s"
                      flexShrink={0}
                      bg={selectedTag === tagItem ? accentBase : "transparent"}
                      color={
                        selectedTag === tagItem ? invertText : textSecondary
                      }
                      borderColor={
                        selectedTag === tagItem ? accentBase : borderColor
                      }
                      _hover={{
                        borderColor:
                          selectedTag === tagItem
                            ? accentBase
                            : borderColorHover,
                      }}
                      onClick={() =>
                        setSelectedTag(selectedTag === tagItem ? null : tagItem)
                      }
                    >
                      {tagItem}
                    </Button>
                  ))}

                  <Button
                    size="sm"
                    px={3}
                    py={4}
                    borderRadius="xl"
                    variant="unset"
                    border="1px dashed"
                    transition="all 0.2s"
                    flexShrink={0}
                    bg={showCustomTagInput ? accentBg : "transparent"}
                    color={showCustomTagInput ? accentBase : textTertiary}
                    borderColor={
                      showCustomTagInput ? accentBorder : borderColor
                    }
                    onClick={() => setShowCustomTagInput((v) => !v)}
                  >
                    <Plus size={12} />
                  </Button>
                </HStack>
                {showCustomTagInput && (
                  <HStack spacing={2}>
                    <Input
                      size="sm"
                      flex="1"
                      bg={cardBgSolid}
                      border={`1px solid ${borderColor}`}
                      _focus={{ borderColor: accentBorder, boxShadow: "none" }}
                      borderRadius="xl"
                      color={textPrimary}
                      _placeholder={{ color: textTertiary }}
                      placeholder="New tag name…"
                      maxLength={20}
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addCustomTag(customTagInput);
                        if (e.key === "Escape") {
                          setShowCustomTagInput(false);
                          setCustomTagInput("");
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      px={4}
                      bgGradient={accentGrad}
                      color={invertText}
                      borderRadius="xl"
                      fontWeight="bold"
                      onClick={() => addCustomTag(customTagInput)}
                    >
                      Add
                    </Button>
                  </HStack>
                )}
              </VStack>
            )}

            {/* Editor Action Callouts */}
            {!isRecording && liveText && (
              <SimpleGrid columns={2} spacing={3} mb={8}>
                <Button
                  py={6}
                  bg={cardBgSolid}
                  _hover={{
                    bg: dangerBg,
                    color: "red.500",
                    borderColor: dangerBorder,
                  }}
                  border={`1px solid ${borderColor}`}
                  fontSize="sm"
                  fontWeight="medium"
                  borderRadius="xl"
                  onClick={clearActiveVictoryInputInterface}
                >
                  {lookupString("discard")}
                </Button>
                <Button
                  py={6}
                  bgGradient={accentGrad}
                  _hover={{ bgGradient: accentGradHover }}
                  color={invertText}
                  fontSize="sm"
                  fontWeight="bold"
                  borderRadius="xl"
                  shadow="lg"
                  onClick={persistCurrentVictoryToStorage}
                >
                  {lookupString("stack")}
                </Button>
              </SimpleGrid>
            )}

            {/* Fixed Toast-Style Share Nudge Prompt Trigger */}
            <Portal>
              <Box
                position="fixed"
                bottom="100px"
                left="24px"
                right="24px"
                maxW="sm"
                mx="auto"
                bgGradient={accentGrad}
                color={invertText}
                p={4}
                borderRadius="2xl"
                shadow="2xl"
                transition="all 0.5s transform, opacity"
                zIndex="50"
                display={showShareNudge ? "flex" : "none"}
                alignItems="center"
                justifyContent="space-between"
                onClick={() => {
                  triggerModalOverlayActivation("share", true);
                  setShowShareNudge(false);
                }}
              >
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  tracking="wider"
                  fontWeight="bold"
                >
                  {lookupString("share_nudge")}
                </Text>
                <IconButton
                  size="xs"
                  borderRadius="full"
                  bg="blackAlpha.100"
                  _hover={{ bg: "blackAlpha.200" }}
                  icon={<X size={12} color={invertText} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShareNudge(false);
                  }}
                />
              </Box>
            </Portal>

            {/* Anti Spiral Trigger Route Widget */}
            <Button
              w="full"
              h="auto"
              textAlign="left"
              p={5}
              bgGradient={antiSpiralBg}
              border="1px solid"
              borderColor={antiSpiralBorder}
              borderRadius="2xl"
              _hover={{
                borderColor: "purple.400",
                boxShadow: "0 0 15px rgba(147, 51, 234, 0.08)",
              }}
              transition="all 0.2s"
              mb={10}
              display="block"
              variant="unset"
              onClick={triggerAntiSpiralWorkflowMode}
            >
              <Text
                fontSize="sm"
                fontFamily="serif"
                fontStyle="italic"
                color={antiSpiralText}
                fontWeight="medium"
              >
                {lookupString("spiral_btn")}
              </Text>
              <Text
                fontSize="11px"
                tracking="wide"
                color={textSecondary}
                mt={1}
                fontWeight="normal"
              >
                {lookupString("spiral_sub")}
              </Text>
            </Button>

            {/* Feed Headers & Inline Segment Filter Tags */}
            <VStack align="stretch" spacing={4}>
              <Text
                fontSize="xs"
                textTransform="uppercase"
                tracking="widest"
                color={textTertiary}
                fontWeight="bold"
              >
                {lookupString("recent")}
              </Text>
              <Flex
                gap={2}
                wrap={{ base: "nowrap", md: "wrap" }}
                overflowX={{ base: "auto", md: "visible" }}
                pb={1}
                sx={{
                  "&::-webkit-scrollbar": { display: "none" },
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
              >
                <Button
                  size="xs"
                  px={4}
                  py={4}
                  borderRadius="lg"
                  variant="unset"
                  border="1px solid"
                  transition="all"
                  flexShrink={0} // Prevents squeezing on mobile
                  bg={!filterTag ? textPrimary : cardBgSolid}
                  color={!filterTag ? bgBase : textSecondary}
                  borderColor={!filterTag ? textPrimary : borderColor}
                  fontWeight={!filterTag ? "bold" : "normal"}
                  onClick={() => setFilterTag(null)}
                >
                  All
                </Button>

                {allTags.map((tagItem) => (
                  <Button
                    key={`filter-home-${tagItem}`}
                    size="xs"
                    px={4}
                    py={4}
                    borderRadius="lg"
                    variant="unset"
                    border="1px solid"
                    whiteSpace="nowrap"
                    transition="all"
                    flexShrink={0} // Prevents squeezing on mobile
                    bg={filterTag === tagItem ? textPrimary : cardBgSolid}
                    color={filterTag === tagItem ? bgBase : textSecondary}
                    borderColor={
                      filterTag === tagItem ? textPrimary : borderColor
                    }
                    fontWeight={filterTag === tagItem ? "bold" : "normal"}
                    onClick={() => setFilterTag(tagItem)}
                  >
                    {tagItem}
                  </Button>
                ))}
              </Flex>

              {/* Timeline Stack Rows Feed */}
              <VStack align="stretch" spacing={3} pt={2}>
                {activeDashboardFilteredWins.length ? (
                  activeDashboardFilteredWins.map((winObject) => (
                    <Box
                      key={winObject.id}
                      p={4}
                      bg={cardBg}
                      _hover={{
                        bg: cardBgHover,
                        borderColor: accentBorder,
                      }}
                      borderRadius="2xl"
                      border={`1px solid ${borderColor}`}
                      transition="all 0.2s"
                      cursor="pointer"
                      _active={{ transform: "scale(0.99)" }}
                      onClick={() =>
                        routeToSpecificScreen(winObject.id, "home")
                      }
                    >
                      <Flex justify="space-between" align="center" mb={2}>
                        <Text
                          fontSize="10px"
                          fontFamily="mono"
                          tracking="wider"
                          color={textTertiary}
                        >
                          {getRelativeTimelineStringRepresentation(
                            winObject.date,
                          )}
                        </Text>
                        {winObject.tag && (
                          <Badge
                            fontSize="9px"
                            fontFamily="mono"
                            bg={accentBg}
                            color={accentBase}
                            px={2.5}
                            py={0.5}
                            borderRadius="md"
                            border={`1px solid ${accentBorder}`}
                            textTransform="uppercase"
                            tracking="wider"
                            variant="unset"
                          >
                            {winObject.tag}
                          </Badge>
                        )}
                      </Flex>
                      <Text
                        fontSize="md"
                        color={textPrimary}
                        fontWeight="light"
                        lineHeight="relaxed"
                        noOfLines={3}
                        fontFamily="serif"
                        fontStyle="italic"
                      >
                        {winObject.text}
                      </Text>
                    </Box>
                  ))
                ) : (
                  <Text
                    textAlign="center"
                    py={12}
                    fontSize="sm"
                    color={textTertiary}
                    fontWeight="light"
                    border={`1px dashed ${borderColor}`}
                    borderRadius="2xl"
                  >
                    {lookupString("no_wins_home")}
                  </Text>
                )}
              </VStack>
            </VStack>
          </Box>
        )}

        {/* ═══ ARCHIVAL TEXT SEARCH QUERY CONSOLE ═══ */}
        {screen === "search" && (
          <Box maxW="md" mx="auto" px={6} pt={12}>
            <VStack align="stretch" spacing={1} mb={6}>
              <Text
                fontSize="xs"
                textTransform="uppercase"
                tracking="widest"
                color={textTertiary}
              >
                Victory Journal
              </Text>
              <Heading
                as="h1"
                fontSize="3xl"
                fontFamily="serif"
                fontWeight="light"
                tracking="tight"
              >
                Find a{" "}
                <Box
                  as="em"
                  fontStyle="italic"
                  fontWeight="normal"
                  color={accentBase}
                >
                  win.
                </Box>
              </Heading>
            </VStack>

            <Flex
              align="center"
              bg={cardBgSolid}
              rounded="2xl"
              border={`1px solid ${borderColor}`}
              px={4}
              py={1}
              mb={4}
              _focusWithin={{ borderColor: accentBorder }}
              transition="all 0.2s"
            >
              <Box color={textTertiary} mr={3}>
                <Search size={18} />
              </Box>
              <Input
                w="full"
                bg="transparent"
                border="none"
                color={textPrimary}
                _placeholder={{ color: textTertiary }}
                outline="none"
                _focus={{ boxShadow: "none" }}
                fontSize="md"
                fontWeight="light"
                py={4}
                px={0}
                placeholder={lookupString("search_ph")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                spellCheck="false"
              />
              {searchQuery && (
                <IconButton
                  size="sm"
                  variant="unstyled"
                  fontSize="lg"
                  color={textTertiary}
                  _hover={{ color: textPrimary }}
                  ml={2}
                  icon={<X size={18} />}
                  onClick={() => setSearchQuery("")}
                />
              )}
            </Flex>

            <Flex
              gap={2}
              wrap={{ base: "nowrap", md: "wrap" }}
              overflowX={{ base: "auto", md: "visible" }}
              pb={4}
              mb={4}
              borderBottom={`1px solid ${borderColor}`}
              sx={{
                "&::-webkit-scrollbar": { display: "none" },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              <Button
                size="xs"
                px={4}
                py={4}
                borderRadius="lg"
                variant="unset"
                border="1px solid"
                transition="all"
                flexShrink={0} // Prevents the button from squishing on mobile
                bg={!searchFilterTag ? accentBase : cardBgSolid}
                color={!searchFilterTag ? invertText : textSecondary}
                borderColor={!searchFilterTag ? accentBase : borderColor}
                fontWeight={!searchFilterTag ? "bold" : "normal"}
                onClick={() => setSearchFilterTag(null)}
              >
                All
              </Button>

              {allTags.map((tagItem) => (
                <Button
                  key={`search-tag-${tagItem}`}
                  size="xs"
                  px={4}
                  py={4}
                  borderRadius="lg"
                  variant="unset"
                  border="1px solid"
                  whiteSpace="nowrap"
                  flexShrink={0} // Prevents the button from squishing on mobile
                  transition="all"
                  bg={searchFilterTag === tagItem ? accentBase : cardBgSolid}
                  color={
                    searchFilterTag === tagItem ? invertText : textSecondary
                  }
                  borderColor={
                    searchFilterTag === tagItem ? accentBase : borderColor
                  }
                  fontWeight={searchFilterTag === tagItem ? "bold" : "normal"}
                  onClick={() => setSearchFilterTag(tagItem)}
                >
                  {tagItem}
                </Button>
              ))}
            </Flex>

            <Text
              fontSize="xs"
              color={textSecondary}
              tracking="wider"
              mb={4}
              fontFamily="mono"
            >
              {searchQuery.trim()
                ? `${activeSearchFilteredWins.length} result${
                    activeSearchFilteredWins.length !== 1 ? "s" : ""
                  }`
                : `${activeSearchFilteredWins.length} ${
                    activeSearchFilteredWins.length === 1
                      ? "victory"
                      : "victories"
                  }`}
            </Text>

            <VStack align="stretch" spacing={3}>
              {activeSearchFilteredWins.length ? (
                activeSearchFilteredWins.slice(0, 20).map((winObject) => (
                  <Box
                    key={winObject.id}
                    p={4}
                    bg={cardBg}
                    _hover={{ bg: cardBgHover }}
                    borderRadius="2xl"
                    border={`1px solid ${borderColor}`}
                    transition="all"
                    cursor="pointer"
                    onClick={() =>
                      routeToSpecificScreen(winObject.id, "search")
                    }
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text
                        fontSize="10px"
                        fontFamily="mono"
                        tracking="wider"
                        color={textTertiary}
                      >
                        {getRelativeTimelineStringRepresentation(
                          winObject.date,
                        )}
                      </Text>
                      {winObject.tag && (
                        <Badge
                          fontSize="9px"
                          fontFamily="mono"
                          bg={accentBg}
                          color={accentBase}
                          px={2.5}
                          py={0.5}
                          borderRadius="md"
                          border={`1px solid ${accentBorder}`}
                          textTransform="uppercase"
                          tracking="wider"
                          variant="unset"
                        >
                          {winObject.tag}
                        </Badge>
                      )}
                    </Flex>
                    <Text
                      fontSize="md"
                      color={textPrimary}
                      fontWeight="light"
                      lineHeight="relaxed"
                      fontFamily="serif"
                      fontStyle="italic"
                      dangerouslySetInnerHTML={{
                        __html: handleQueryRegexHighlighting(
                          winObject.text,
                          searchQuery,
                        ),
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Text
                  textAlign="center"
                  py={12}
                  fontSize="sm"
                  color={textTertiary}
                  fontWeight="light"
                  border={`1px dashed ${borderColor}`}
                  borderRadius="2xl"
                >
                  {lookupString("no_wins_search")}
                </Text>
              )}
            </VStack>
          </Box>
        )}

        {/* ═══ ARCHIVAL TIMELINE MONTHLY MATRIX ═══ */}
        {screen === "calendar" && (
          <Box maxW="md" mx="auto" px={6} pt={12}>
            <VStack align="stretch" spacing={1} mb={6}>
              <Text
                fontSize="xs"
                textTransform="uppercase"
                tracking="widest"
                color={textTertiary}
              >
                Victory Journal
              </Text>
              <Heading
                as="h1"
                fontSize="3xl"
                fontFamily="serif"
                fontWeight="light"
                tracking="tight"
              >
                Your{" "}
                <Box
                  as="em"
                  fontStyle="italic"
                  fontWeight="normal"
                  color={accentBase}
                >
                  timeline.
                </Box>
              </Heading>
            </VStack>

            <Flex
              justify="space-between"
              align="center"
              bg={cardBgSolid}
              rounded="2xl"
              p={2}
              border={`1px solid ${borderColor}`}
              mb={6}
            >
              <IconButton
                size="md"
                variant="unstyled"
                borderRadius="xl"
                bg={calNavBg}
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{ bg: calNavBgHover }}
                _active={{ transform: "scale(0.95)" }}
                icon={<ChevronLeft size={20} color={textPrimary} />}
                onClick={() => handleMonthStepNavigation(-1)}
              />
              <Text
                fontSize="sm"
                fontWeight="bold"
                textTransform="uppercase"
                tracking="widest"
                color={accentBase}
                fontFamily="mono"
              >
                {lookupString("months")[currentCalendarDate.getMonth()]}{" "}
                {currentCalendarDate.getFullYear()}
              </Text>
              <IconButton
                size="md"
                variant="unstyled"
                borderRadius="xl"
                bg={calNavBg}
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{ bg: calNavBgHover }}
                _active={{ transform: "scale(0.95)" }}
                icon={<ChevronRight size={20} color={textPrimary} />}
                onClick={() => handleMonthStepNavigation(1)}
              />
            </Flex>

            <SimpleGrid columns={7} spacing={2} mb={6}>
              {processTimelineCalendarRenderingEngine()}
            </SimpleGrid>

            <Text
              fontSize="xs"
              textTransform="uppercase"
              tracking="widest"
              color={textSecondary}
              fontWeight="bold"
              mb={4}
              borderTop={`1px solid ${borderColor}`}
              pt={6}
            >
              <Box
                as="span"
                color={accentBase}
                fontWeight="black"
                fontSize="sm"
                fontFamily="mono"
                mr={1}
              >
                {activeMonthTimelineWins.length}
              </Box>
              {activeMonthTimelineWins.length === 1
                ? lookupString("victory")
                : lookupString("victories")}{" "}
              — {lookupString("months")[currentCalendarDate.getMonth()]}
            </Text>

            <VStack align="stretch" spacing={3}>
              {activeMonthTimelineWins.length ? (
                activeMonthTimelineWins.map((winObject) => (
                  <Box
                    key={winObject.id}
                    p={4}
                    bg={cardBg}
                    _hover={{ bg: cardBgHover }}
                    borderRadius="2xl"
                    border={`1px solid ${borderColor}`}
                    transition="all"
                    cursor="pointer"
                    onClick={() =>
                      routeToSpecificScreen(winObject.id, "calendar")
                    }
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text
                        fontSize="10px"
                        fontFamily="mono"
                        tracking="wider"
                        color={textTertiary}
                      >
                        {getRelativeTimelineStringRepresentation(
                          winObject.date,
                        )}
                      </Text>
                      {winObject.tag && (
                        <Badge
                          fontSize="9px"
                          fontFamily="mono"
                          bg={accentBg}
                          color={accentBase}
                          px={2.5}
                          py={0.5}
                          borderRadius="md"
                          border={`1px solid ${accentBorder}`}
                          textTransform="uppercase"
                          tracking="wider"
                          variant="unset"
                        >
                          {winObject.tag}
                        </Badge>
                      )}
                    </Flex>
                    <Text
                      fontSize="md"
                      color={textPrimary}
                      fontWeight="light"
                      lineHeight="relaxed"
                      fontFamily="serif"
                      fontStyle="italic"
                    >
                      {winObject.text}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text
                  textAlign="center"
                  py={8}
                  fontSize="sm"
                  color={textTertiary}
                  fontWeight="light"
                  border={`1px dashed ${borderColor}`}
                  borderRadius="2xl"
                >
                  {lookupString("no_wins_month")}
                </Text>
              )}
            </VStack>
          </Box>
        )}

        {/* ═══ CALENDAR HOURLY DAY EXPANSION LIST ═══ */}
        {screen === "day" && (
          <Box maxW="md" mx="auto" px={6} pt={12}>
            <Button
              size="sm"
              variant="unstyled"
              display="inline-flex"
              alignItems="center"
              color={accentBase}
              mb={6}
              _hover={{ color: backBtnHover }}
              transition="colors"
              leftIcon={<ChevronLeft size={16} />}
              onClick={() => executeScreenTransitionPipeline("calendar")}
            >
              {lookupString("back")}
            </Button>

            <VStack align="stretch" spacing={1} mb={8}>
              <Text
                fontSize="xs"
                textTransform="uppercase"
                tracking="widest"
                color={textTertiary}
              >
                Victory Journal
              </Text>
              <Heading
                as="h1"
                fontSize="3xl"
                fontFamily="serif"
                fontWeight="light"
                tracking="tight"
                color={textPrimary}
              >
                {targetDayData.month !== null &&
                  `${lookupString("months")[targetDayData.month]} ${
                    targetDayData.day
                  }`}
              </Heading>
              <Text
                fontSize="sm"
                fontFamily="mono"
                color={accentBase}
                fontWeight="bold"
              >
                {targetDayData.dayWins.length} victories
              </Text>
            </VStack>

            <VStack align="stretch" spacing={3}>
              {targetDayData.dayWins.map((winObject) => (
                <Box
                  key={winObject.id}
                  p={4}
                  bg={cardBgSolid}
                  _hover={{ bg: cardBgHover }}
                  borderRadius="2xl"
                  border={`1px solid ${borderColor}`}
                  transition="all"
                  cursor="pointer"
                  onClick={() => routeToSpecificScreen(winObject.id, "day")}
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text
                      fontSize="10px"
                      fontFamily="mono"
                      tracking="wider"
                      color={textTertiary}
                    >
                      {getRelativeTimelineStringRepresentation(winObject.date)}
                    </Text>
                    {winObject.tag && (
                      <Badge
                        fontSize="9px"
                        fontFamily="mono"
                        bg={accentBg}
                        color={accentBase}
                        px={2.5}
                        py={0.5}
                        borderRadius="md"
                        border={`1px solid ${accentBorder}`}
                        textTransform="uppercase"
                        tracking="wider"
                        variant="unset"
                      >
                        {winObject.tag}
                      </Badge>
                    )}
                  </Flex>
                  <Text
                    fontSize="md"
                    color={textPrimary}
                    fontWeight="light"
                    lineHeight="relaxed"
                    fontFamily="serif"
                    fontStyle="italic"
                  >
                    {winObject.text}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* ═══ DETAILED FOCUS DATA RECORD INSPECTOR ═══ */}
        {screen === "detail" && (
          <Box maxW="md" mx="auto" px={6} pt={12}>
            {(() => {
              const focusItemModel = wins.find((w) => w.id === selectedWinId);
              if (!focusItemModel) return null;
              return (
                <VStack align="stretch" spacing={6}>
                  <Flex justify="flex-start">
                    <Button
                      size="sm"
                      variant="unstyled"
                      display="inline-flex"
                      alignItems="center"
                      color={accentBase}
                      _hover={{ color: backBtnHover }}
                      transition="colors"
                      leftIcon={<ChevronLeft size={16} />}
                      onClick={() =>
                        executeScreenTransitionPipeline(previousScreenTracker)
                      }
                    >
                      {lookupString("back")}
                    </Button>
                  </Flex>

                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    tracking="widest"
                    color={textTertiary}
                    fontFamily="mono"
                    borderBottom={`1px solid ${borderColor}`}
                    pb={4}
                  >
                    {getExtendedLongDateRepresentation(focusItemModel.date)}
                  </Text>

                  {/* Tag Editor Panel */}
                  <Box
                    p={4}
                    bg={cardBgSolid}
                    rounded="2xl"
                    border={`1px solid ${borderColor}`}
                    className="space-y-3"
                  >
                    <Text
                      fontSize="10px"
                      textTransform="uppercase"
                      tracking="widest"
                      color={textSecondary}
                      fontWeight="bold"
                      mb={4}
                    >
                      Inline Classifier Tag
                    </Text>
                    <HStack flexWrap="wrap" gap={2} spacing={0}>
                      {allTags.map((tagItem) => (
                        <Button
                          key={`detail-modify-tag-${tagItem}`}
                          size="xs"
                          px={3}
                          py={3.5}
                          rounded="xl"
                          tracking="wide"
                          variant="unset"
                          border="1px solid"
                          transition="all 0.2s"
                          bg={
                            focusItemModel.tag === tagItem
                              ? accentBase
                              : tagUnselectedBg
                          }
                          color={
                            focusItemModel.tag === tagItem
                              ? invertText
                              : textSecondary
                          }
                          borderColor={
                            focusItemModel.tag === tagItem
                              ? accentBase
                              : borderColor
                          }
                          _hover={{
                            borderColor:
                              focusItemModel.tag === tagItem
                                ? accentBase
                                : textSecondary,
                          }}
                          onClick={() => adjustInlineVictoryTagMapping(tagItem)}
                        >
                          {tagItem}
                        </Button>
                      ))}
                      <Button
                        size="xs"
                        px={3}
                        py={3.5}
                        rounded="xl"
                        variant="unset"
                        border="1px dashed"
                        transition="all 0.2s"
                        bg={showCustomTagInput ? accentBg : "transparent"}
                        color={showCustomTagInput ? accentBase : textTertiary}
                        borderColor={
                          showCustomTagInput ? accentBorder : borderColor
                        }
                        onClick={() => setShowCustomTagInput((v) => !v)}
                      >
                        <Plus size={12} />
                      </Button>
                      <Button
                        size="xs"
                        px={3}
                        py={3.5}
                        rounded="xl"
                        tracking="wide"
                        variant="unset"
                        border="1px dashed"
                        transition="all"
                        borderColor={
                          !focusItemModel.tag ? "red.400" : borderColor
                        }
                        color={!focusItemModel.tag ? "red.500" : textTertiary}
                        bg={!focusItemModel.tag ? dangerBg : "transparent"}
                        onClick={() => adjustInlineVictoryTagMapping(null)}
                      >
                        None
                      </Button>
                    </HStack>
                    {showCustomTagInput && (
                      <HStack spacing={2} mt={2}>
                        <Input
                          size="sm"
                          flex="1"
                          bg={cardBgSolid}
                          border={`1px solid ${borderColor}`}
                          _focus={{
                            borderColor: accentBorder,
                            boxShadow: "none",
                          }}
                          borderRadius="xl"
                          color={textPrimary}
                          _placeholder={{ color: textTertiary }}
                          placeholder="New tag name…"
                          maxLength={20}
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addCustomTag(customTagInput);
                            if (e.key === "Escape") {
                              setShowCustomTagInput(false);
                              setCustomTagInput("");
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          px={4}
                          bgGradient={accentGrad}
                          color={invertText}
                          borderRadius="xl"
                          fontWeight="bold"
                          onClick={() => addCustomTag(customTagInput)}
                        >
                          Add
                        </Button>
                      </HStack>
                    )}
                  </Box>

                  {/* Luxury Display Card */}
                  <Flex
                    p={6}
                    bgGradient={`linear(to-br, ${cardBgHover}, transparent)`}
                    rounded="3xl"
                    border={`1px solid ${borderColor}`}
                    relative
                    shadow="xl"
                    minH="160px"
                    flexDirection="column"
                    justifyContent="center"
                    position="relative"
                  >
                    <Text
                      position="absolute"
                      top="2px"
                      left="4px"
                      fontSize="6xl"
                      fontFamily="serif"
                      pointerEvents="none"
                      userSelect="none"
                      color={quoteMarkColor}
                      lineHeight="none"
                    >
                      "
                    </Text>
                    <Text
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontFamily="serif"
                      fontWeight="light"
                      fontStyle="italic"
                      lineHeight="relaxed"
                      color={textPrimary}
                      textAlign="center"
                      px={4}
                      position="relative"
                      zIndex="10"
                    >
                      {focusItemModel.text}
                    </Text>
                  </Flex>

                  {/* Audio Playback */}
                  {audioRecordings[focusItemModel.id] && (
                    <Box
                      p={4}
                      bg={cardBgSolid}
                      rounded="2xl"
                      border={`1px solid ${
                        playingAudioId === focusItemModel.id
                          ? accentBorder
                          : borderColor
                      }`}
                      transition="border-color 0.3s ease"
                    >
                      <Text
                        fontSize="10px"
                        textTransform="uppercase"
                        tracking="widest"
                        color={
                          playingAudioId === focusItemModel.id
                            ? accentBase
                            : textSecondary
                        }
                        fontWeight="bold"
                        mb={3}
                        transition="color 0.3s ease"
                      >
                        Voice Recording
                      </Text>
                      <HStack spacing={3} align="center">
                        <IconButton
                          size="sm"
                          borderRadius="full"
                          bg={accentBase}
                          color="white"
                          _hover={{ bg: backBtnHover }}
                          style={{
                            animation:
                              playingAudioId === focusItemModel.id
                                ? "audioGlow 1.5s ease-in-out infinite"
                                : "none",
                          }}
                          icon={
                            playingAudioId === focusItemModel.id ? (
                              <Pause size={14} />
                            ) : (
                              <Play size={14} />
                            )
                          }
                          onClick={() => toggleAudioPlayback(focusItemModel.id)}
                        />
                        {playingAudioId === focusItemModel.id ? (
                          <HStack spacing="3px" h="20px" align="center">
                            {[0, 0.12, 0.24, 0.36, 0.48].map((delay, i) => (
                              <Box
                                key={i}
                                w="3px"
                                h="3px"
                                borderRadius="full"
                                bg={accentBase}
                                style={{
                                  animation:
                                    "soundBar 0.7s ease-in-out infinite",
                                  animationDelay: `${delay}s`,
                                }}
                              />
                            ))}
                            <Text
                              fontSize="xs"
                              color={accentBase}
                              fontWeight="medium"
                              ml={1}
                            >
                              Playing…
                            </Text>
                          </HStack>
                        ) : (
                          <Text
                            fontSize="xs"
                            color={textSecondary}
                            fontWeight="light"
                          >
                            Tap to play your voice note
                          </Text>
                        )}
                      </HStack>
                    </Box>
                  )}

                  {/* Controls */}
                  <SimpleGrid columns={2} spacing={3}>
                    <Button
                      py={6}
                      bg={cardBgSolid}
                      _hover={{
                        bg: cardBgHover,
                        color: textPrimary,
                      }}
                      rounded="xl"
                      border={`1px solid ${borderColor}`}
                      fontSize="sm"
                      fontWeight="medium"
                      transition="all"
                      color={accentBase}
                      leftIcon={<Share2 size={14} />}
                      onClick={() =>
                        triggerModalOverlayActivation("share", true)
                      }
                    >
                      Share
                    </Button>

                    <Button
                      py={6}
                      rounded="xl"
                      border="1px solid"
                      fontSize="sm"
                      fontWeight="medium"
                      transition="all"
                      leftIcon={<RefreshCw size={14} />}
                      bg={focusItemModel.resurface ? accentBase : cardBgSolid}
                      color={
                        focusItemModel.resurface ? invertText : textSecondary
                      }
                      borderColor={
                        focusItemModel.resurface ? accentBase : borderColor
                      }
                      _hover={{
                        bg: focusItemModel.resurface
                          ? backBtnHover
                          : cardBgHover,
                      }}
                      onClick={toggleVictorySmartResurfacing}
                    >
                      {focusItemModel.resurface ? "Set ✦" : "Resurface"}
                    </Button>
                  </SimpleGrid>

                  <Center pt={8}>
                    <Button
                      variant="unstyled"
                      fontSize="xs"
                      textTransform="uppercase"
                      tracking="widest"
                      color="red.500"
                      opacity="0.6"
                      _hover={{ opacity: 1 }}
                      fontWeight="medium"
                      transition="colors"
                      onClick={() =>
                        triggerModalOverlayActivation("delete", true)
                      }
                    >
                      Delete this victory
                    </Button>
                  </Center>
                </VStack>
              );
            })()}
          </Box>
        )}

        {/* ═══ ANTI-SPIRAL COGNITIVE REFLECTION SUITE ═══ */}
        {screen === "spiral" && (
          <Flex
            maxW="md"
            mx="auto"
            px={6}
            pt={12}
            minH="100vh"
            flexDirection="column"
            justifyContent="space-between"
          >
            <VStack align="stretch" spacing={8} my="auto" w="full">
              <Box>
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  tracking="widest"
                  color={accentBase}
                  fontWeight="bold"
                  mb={1}
                >
                  Evidence
                </Text>
                <Heading
                  as="h1"
                  fontSize="3xl"
                  fontFamily="serif"
                  fontWeight="light"
                  tracking="tight"
                  color={textPrimary}
                >
                  You've done
                  <br />
                  <Box
                    as="em"
                    fontStyle="italic"
                    fontWeight="normal"
                    color={accentBase}
                  >
                    hard things.
                  </Box>
                </Heading>
                <Text
                  color={textTertiary}
                  fontSize="xs"
                  mt={2}
                  fontWeight="light"
                >
                  From your own record. Read it slowly.
                </Text>
              </Box>

              <VStack
                p={6}
                bgGradient={spiralEvidenceBg}
                rounded="3xl"
                border="1px solid"
                borderColor={spiralEvidenceBorder}
                shadow="2xl"
                minH="140px"
                justify="center"
                align="stretch"
              >
                <Text
                  fontSize="xl"
                  fontFamily="serif"
                  fontWeight="light"
                  fontStyle="italic"
                  lineHeight="relaxed"
                  color={textPrimary}
                  textAlign="center"
                  mb={4}
                >
                  "{spiralWin.text}"
                </Text>
                <Text
                  textAlign="center"
                  fontSize="10px"
                  fontFamily="mono"
                  textTransform="uppercase"
                  tracking="widest"
                  color={accentBase}
                  fontWeight="bold"
                >
                  {spiralWin.details}
                </Text>
              </VStack>

              <VStack
                align="stretch"
                p={5}
                bg={cardBgSolid}
                rounded="2xl"
                border={`1px solid ${borderColor}`}
                spacing={2}
              >
                <Text
                  fontSize="10px"
                  textTransform="uppercase"
                  tracking="widest"
                  color={accentBase}
                  fontWeight="bold"
                >
                  Reflect
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="light"
                  color={textSecondary}
                  lineHeight="relaxed"
                  fontFamily="serif"
                  fontStyle="italic"
                >
                  {spiralWin.anchor}
                </Text>
              </VStack>
            </VStack>

            <VStack pt={10} spacing={3} w="full">
              <Button
                w="full"
                py={7}
                bg={cardBgSolid}
                _hover={{ bg: cardBgHover }}
                border={`1px solid ${borderColor}`}
                rounded="2xl"
                fontSize="sm"
                fontWeight="medium"
                transition="all"
                onClick={generateAntiSpiralProofData}
              >
                Show me another →
              </Button>
              <Button
                variant="unstyled"
                w="full"
                py={3}
                fontSize="xs"
                textTransform="uppercase"
                tracking="widest"
                fontFamily="mono"
                color={textTertiary}
                _hover={{ color: textSecondary }}
                transition="colors"
                onClick={() => executeScreenTransitionPipeline("home")}
              >
                I'm grounded — take me back
              </Button>
            </VStack>
          </Flex>
        )}

        {/* ═══ REVEAL APPLICATION DATA PREFERENCE SETTINGS ═══ */}
        {screen === "settings" && (
          <Box maxW="md" mx="auto" px={6} pt={12}>
            <Button
              size="sm"
              variant="unstyled"
              display="inline-flex"
              color={accentBase}
              mb={6}
              _hover={{ color: backBtnHover }}
              transition="colors"
              leftIcon={<ChevronLeft size={16} />}
              onClick={() => executeScreenTransitionPipeline("home")}
            >
              <span>{lookupString("back")}</span>
            </Button>

            <Heading
              as="h1"
              fontSize="3xl"
              fontFamily="serif"
              fontWeight="light"
              tracking="tight"
              mb={8}
            >
              Settings.
            </Heading>

            <VStack align="stretch" spacing={6}>
              {/* Section: Profile */}
              <VStack align="stretch" spacing={3}>
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  tracking="widest"
                  color={textTertiary}
                  fontWeight="bold"
                >
                  Your Profile
                </Text>
                <Flex
                  p={4}
                  bg={cardBgSolid}
                  rounded="2xl"
                  border={`1px solid ${borderColor}`}
                  align="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      Your name
                    </Text>
                    <Text fontSize="xs" color={textTertiary} mt={0.5}>
                      Used in your greeting
                    </Text>
                  </Box>
                  <Input
                    bg={bgBase}
                    border={`1px solid ${borderColor}`}
                    _focus={{
                      borderColor: accentBorder,
                      boxShadow: "none",
                    }}
                    rounded="xl"
                    px={3}
                    py={2}
                    fontSize="sm"
                    color={textPrimary}
                    textAlign="right"
                    maxW="140px"
                    outline="none"
                    transition="colors"
                    type="text"
                    placeholder="Add name…"
                    maxLength={32}
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      setMeta((prev) => ({
                        ...prev,
                        name: e.target.value.trim(),
                      }));
                    }}
                  />
                </Flex>
              </VStack>

              {/* Section: Custom Tags */}
              <VStack align="stretch" spacing={3}>
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  tracking="widest"
                  color={textTertiary}
                  fontWeight="bold"
                >
                  Custom Tags
                </Text>
                <Box
                  p={4}
                  bg={cardBgSolid}
                  rounded="2xl"
                  border={`1px solid ${borderColor}`}
                >
                  {(meta.customTags || []).length > 0 && (
                    <VStack align="stretch" spacing={2} mb={3}>
                      {(meta.customTags || []).map((tag) => (
                        <Flex
                          key={`settings-tag-${tag}`}
                          justify="space-between"
                          align="center"
                        >
                          <HStack spacing={2}>
                            <Box
                              w="6px"
                              h="6px"
                              borderRadius="full"
                              bg={accentBase}
                            />
                            <Text
                              fontSize="sm"
                              color={textPrimary}
                              fontWeight="medium"
                            >
                              {tag}
                            </Text>
                          </HStack>
                          <IconButton
                            size="xs"
                            variant="ghost"
                            color={textTertiary}
                            _hover={{ color: "red.500" }}
                            icon={<X size={12} />}
                            onClick={() => removeCustomTag(tag)}
                          />
                        </Flex>
                      ))}
                    </VStack>
                  )}
                  {!showCustomTagInput ? (
                    <Button
                      size="sm"
                      variant="unstyled"
                      color={accentBase}
                      fontSize="xs"
                      fontWeight="medium"
                      display="inline-flex"
                      alignItems="center"
                      gap={1}
                      _hover={{ opacity: 0.8 }}
                      onClick={() => setShowCustomTagInput(true)}
                    >
                      <Plus size={12} />
                      &nbsp;Add new tag
                    </Button>
                  ) : (
                    <HStack spacing={2}>
                      <Input
                        size="sm"
                        flex="1"
                        bg={bgBase}
                        border={`1px solid ${borderColor}`}
                        _focus={{
                          borderColor: accentBorder,
                          boxShadow: "none",
                        }}
                        borderRadius="xl"
                        color={textPrimary}
                        _placeholder={{ color: textTertiary }}
                        placeholder="Tag name…"
                        maxLength={20}
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addCustomTag(customTagInput);
                          if (e.key === "Escape") {
                            setShowCustomTagInput(false);
                            setCustomTagInput("");
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        px={4}
                        bgGradient={accentGrad}
                        color={invertText}
                        borderRadius="xl"
                        fontWeight="bold"
                        onClick={() => addCustomTag(customTagInput)}
                      >
                        Add
                      </Button>
                    </HStack>
                  )}
                  {(meta.customTags || []).length === 0 &&
                    !showCustomTagInput && (
                      <Text
                        fontSize="xs"
                        color={textTertiary}
                        fontWeight="light"
                        mt={1}
                      >
                        No custom tags yet.
                      </Text>
                    )}
                </Box>
              </VStack>

              {/* Section: Appearance */}
              <VStack align="stretch" spacing={3}>
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  tracking="widest"
                  color={textTertiary}
                  fontWeight="bold"
                >
                  Appearance
                </Text>
                <Flex
                  p={4}
                  bg={cardBgSolid}
                  rounded="2xl"
                  border={`1px solid ${borderColor}`}
                  align="center"
                  justifyContent="space-between"
                  cursor="pointer"
                  _hover={{ bg: cardBgHover }}
                  onClick={toggleColorMode}
                  transition="colors"
                >
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      Theme
                    </Text>
                    <Text fontSize="xs" color={textTertiary} mt={0.5}>
                      Toggle {colorMode === "light" ? "dark" : "light"} mode
                    </Text>
                  </Box>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    color={textSecondary}
                    icon={
                      colorMode === "light" ? (
                        <Moon size={18} />
                      ) : (
                        <Sun size={18} />
                      )
                    }
                    onClick={toggleColorMode}
                    aria-label="Toggle Color Mode"
                  />
                </Flex>
              </VStack>

              {/* Section: Backups */}
              <VStack align="stretch" spacing={2}>
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  tracking="widest"
                  color={textTertiary}
                  fontWeight="bold"
                >
                  Storage & Backup
                </Text>
                <Flex
                  p={4}
                  bg={cardBgSolid}
                  rounded="2xl"
                  border={`1px solid ${borderColor}`}
                  align="center"
                  justifyContent="space-between"
                  cursor="pointer"
                  _hover={{ bg: cardBgHover }}
                  transition="colors"
                  onClick={handleFileSystemBackupExport}
                >
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      Export victories
                    </Text>
                    <Text fontSize="xs" color={textTertiary} mt={0.5}>
                      Download as JSON backup
                    </Text>
                  </Box>
                  <Box color={textTertiary}>
                    <ArrowDown size={16} />
                  </Box>
                </Flex>

                <Flex
                  p={4}
                  bg={cardBgSolid}
                  rounded="2xl"
                  border={`1px solid ${borderColor}`}
                  align="center"
                  justifyContent="space-between"
                  cursor="pointer"
                  _hover={{ bg: cardBgHover }}
                  transition="colors"
                  onClick={() => document.getElementById("imp").click()}
                >
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      Import victories
                    </Text>
                    <Text fontSize="xs" color={textTertiary} mt={0.5}>
                      Restore from JSON file
                    </Text>
                  </Box>
                  <Box color={textTertiary}>
                    <ArrowUp size={16} />
                  </Box>
                </Flex>
                <VisuallyHidden>
                  <input
                    type="file"
                    id="imp"
                    accept=".json"
                    onChange={(e) => handleFileSystemBackupImport(e.target)}
                  />
                </VisuallyHidden>
              </VStack>

              {/* PWA Prompt Link Node */}
              <Flex
                p={4}
                bg={cardBgSolid}
                rounded="2xl"
                border={`1px solid ${borderColor}`}
                align="center"
                justifyContent="space-between"
                cursor="pointer"
                _hover={{ bg: cardBgHover }}
                transition="colors"
                onClick={() => triggerModalOverlayActivation("install", true)}
              >
                <Box>
                  <Text fontSize="sm" fontWeight="medium">
                    Add to Home Screen
                  </Text>
                  <Text fontSize="xs" color={textTertiary} mt={0.5}>
                    Works offline, feels native
                  </Text>
                </Box>
                <Text fontSize="sm" color={textTertiary}>
                  →
                </Text>
              </Flex>

              {/* Section: Danger Zone */}
              <VStack
                align="stretch"
                spacing={2}
                pt={4}
                borderTop={`1px solid ${borderColor}`}
              >
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  tracking="widest"
                  color="red.500"
                  opacity="0.8"
                  fontWeight="bold"
                >
                  {lookupString("settings_danger")}
                </Text>
                <Flex
                  p={4}
                  bg={dangerBg}
                  border={`1px solid ${dangerBorder}`}
                  rounded="2xl"
                  align="center"
                  justifyContent="space-between"
                  cursor="pointer"
                  _hover={{ bg: dangerHover }}
                  transition="all"
                  onClick={() =>
                    triggerModalOverlayActivation("clearAll", true)
                  }
                >
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="red.500">
                      Clear all victories
                    </Text>
                    <Text fontSize="xs" color="red.500" opacity="0.6" mt={0.5}>
                      This cannot be undone
                    </Text>
                  </Box>
                  <Box color="red.500" opacity="0.6">
                    <Trash2 size={16} />
                  </Box>
                </Flex>
              </VStack>
            </VStack>

            <Text
              textAlign="center"
              py={12}
              fontSize="9px"
              fontFamily="mono"
              tracking="widest"
              color={textTertiary}
              textTransform="uppercase"
              leading="relaxed"
            >
              Victory Journal · v3
              <br />
              Your proof library
            </Text>
          </Box>
        )}

        {screen === "stack" && (
          <Box maxW="md" mx="auto" px={{ base: 4, md: 6 }} pt={{ base: 8, md: 12 }} textAlign="center">
            <Heading
              mb={1}
              fontFamily="serif"
              fontWeight="light"
              fontSize={{ base: "2xl", md: "3xl" }}
            >
              Victory Stack
            </Heading>
            <Text color={textSecondary} fontSize="sm" mb={{ base: 3, md: 5 }}>
              Spin to rediscover a random win.
            </Text>

            <Box
              className="bscene"
              ref={bsceneRef}
              cursor={spinState === "spinning" ? "default" : "grab"}
              onMouseDown={(e) => handleDrumPointerDown(e.clientX)}
              onMouseMove={(e) => handleDrumPointerMove(e.clientX)}
              onMouseUp={handleDrumPointerUp}
              onMouseLeave={handleDrumPointerUp}
              onTouchStart={(e) => handleDrumPointerDown(e.touches[0].clientX)}
              onTouchMove={(e) => handleDrumPointerMove(e.touches[0].clientX)}
              onTouchEnd={handleDrumPointerUp}
            >
              <Box className="bdrum" ref={drumRef} />
            </Box>

            {wins.length > 0 && (
              <Text
                fontSize="9px"
                color={textTertiary}
                fontFamily="mono"
                textTransform="uppercase"
                letterSpacing="widest"
                mt={1}
                mb={3}
              >
                Drag to explore · Tap spin to discover
              </Text>
            )}

            {!wins.length ? (
              <Text fontSize="sm" color={textTertiary} mt={6}>
                Record your first victory to bring the stack to life.
              </Text>
            ) : (
              <Button
                w={{ base: "full", md: "auto" }}
                px={8}
                py={6}
                bgGradient={accentGrad}
                _hover={{
                  bgGradient: accentGradHover,
                  boxShadow: "0 0 20px rgba(0,230,153,0.25)",
                }}
                color={invertText}
                fontWeight="bold"
                borderRadius="xl"
                fontSize="sm"
                isLoading={spinState === "spinning"}
                loadingText="Spinning…"
                transition="all 0.2s"
                _active={{ transform: "scale(0.97)" }}
                onClick={triggerStackSpin}
              >
                Spin ✦
              </Button>
            )}
          </Box>
        )}

        {/* ═══ PERSISTENT SYSTEM APPLICATION NAVIGATION FOOTER BAR ═══ */}
        {meta.onboarded &&
          ["home", "search", "calendar", "stack"].includes(screen) && (
            <Box
              position="fixed"
              bottom="0"
              left="0"
              right="0"
              bg={glassBg}
              backdropFilter="blur(24px)"
              borderTop={`1px solid ${borderColor}`}
              py={3}
              px={6}
              zIndex="40"
            >
              <Flex maxW="md" mx="auto" justify="space-around" align="center">
                <IconButton
                  aria-label="Go to home"
                  icon={<Home size={18} />}
                  onClick={() => executeScreenTransitionPipeline("home")}
                  variant="ghost"
                  color={screen === "home" ? accentBase : textTertiary}
                  _hover={{
                    color: screen === "home" ? accentBase : textSecondary,
                    bg: "transparent",
                  }}
                />
                <IconButton
                  aria-label="Open victory stack"
                  icon={<RefreshCw size={18} />}
                  onClick={() => executeScreenTransitionPipeline("stack")}
                  variant="ghost"
                  color={screen === "stack" ? accentBase : textTertiary}
                  _hover={{
                    color: screen === "stack" ? accentBase : textSecondary,
                    bg: "transparent",
                  }}
                />
                <Box
                  position="relative"
                  mt="-36px"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {isRecording && (
                    <>
                      <Box className="mic-ripple-1" />
                      <Box className="mic-ripple-2" />
                    </>
                  )}
                  <Box
                    w="56px"
                    h="56px"
                    borderRadius="full"
                    bg={isRecording ? "red.500" : accentBase}
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    shadow={isRecording ? "0 0 24px rgba(229,62,62,0.45)" : "lg"}
                    cursor="pointer"
                    onClick={executeUnifiedVoiceInputToggle}
                    border={`4px solid ${bgBase}`}
                    transition="background 0.3s ease, box-shadow 0.3s ease"
                    style={{
                      animation: isRecording
                        ? "micPulse 1.2s ease-in-out infinite"
                        : "none",
                    }}
                  >
                    {isRecording && window.MediaRecorder ? (
                      <Square size={20} fill="currentColor" stroke="none" />
                    ) : (
                      <Mic size={24} />
                    )}
                  </Box>
                </Box>
                <IconButton
                  aria-label="Open calendar"
                  icon={<Calendar size={18} />}
                  onClick={() => executeScreenTransitionPipeline("calendar")}
                  variant="ghost"
                  color={screen === "calendar" ? accentBase : textTertiary}
                  _hover={{
                    color: screen === "calendar" ? accentBase : textSecondary,
                    bg: "transparent",
                  }}
                />
                <IconButton
                  aria-label="Open search"
                  icon={<Search size={18} />}
                  onClick={() => executeScreenTransitionPipeline("search")}
                  variant="ghost"
                  color={screen === "search" ? accentBase : textTertiary}
                  _hover={{
                    color: screen === "search" ? accentBase : textSecondary,
                    bg: "transparent",
                  }}
                />
              </Flex>
            </Box>
          )}

        {/* ═══ INTERACTIVE OVERLAYS MODALS FLOW ENGINE ═══ */}

        {/* Target Item Elimination Modal */}
        <Modal
          isOpen={activeOverlays.delete}
          onClose={() => triggerModalOverlayActivation("delete", false)}
          isCentered
          size="xs"
        >
          <ModalOverlay backdropFilter="blur(5px)" bg={modalOverlayBg} />
          <ModalContent
            bg={bgBase}
            border={`1px solid ${borderColor}`}
            borderRadius="2xl"
            color={textPrimary}
          >
            <ModalHeader fontSize="xl" fontFamily="serif" fontWeight="light">
              Delete this{" "}
              <Box
                as="em"
                fontStyle="italic"
                fontWeight="normal"
                color={accentBase}
              >
                victory?
              </Box>
            </ModalHeader>
            <ModalBody
              fontSize="sm"
              color={textSecondary}
              fontWeight="light"
              lineHeight="relaxed"
            >
              {lookupString("del_body")}
            </ModalBody>
            <ModalFooter display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
              <Button
                py={5}
                bg={cardBgSolid}
                _hover={{ bg: cardBgHover }}
                borderRadius="xl"
                fontSize="sm"
                fontWeight="medium"
                onClick={() => triggerModalOverlayActivation("delete", false)}
              >
                {lookupString("del_keep")}
              </Button>
              <Button
                py={5}
                bg="red.500"
                _hover={{ bg: "red.600" }}
                color="white"
                fontWeight="bold"
                borderRadius="xl"
                fontSize="sm"
                shadow="lg"
                onClick={deleteTargetVictoryModelRecord}
              >
                {lookupString("del_remove")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Journal Reset Confirmation Overlays */}
        <Modal
          isOpen={activeOverlays.clearAll}
          onClose={() => triggerModalOverlayActivation("clearAll", false)}
          isCentered
          size="xs"
        >
          <ModalOverlay backdropFilter="blur(5px)" bg={modalOverlayBg} />
          <ModalContent
            bg={bgBase}
            border={`1px solid ${borderColor}`}
            borderRadius="2xl"
            color={textPrimary}
          >
            <ModalHeader fontSize="xl" fontFamily="serif" fontWeight="light">
              Clear{" "}
              <Box
                as="em"
                fontStyle="italic"
                fontWeight="normal"
                color="red.500"
              >
                everything?
              </Box>
            </ModalHeader>
            <ModalBody
              fontSize="sm"
              color={textSecondary}
              fontWeight="light"
              lineHeight="relaxed"
            >
              {lookupString("clr_body")}
            </ModalBody>
            <ModalFooter display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
              <Button
                py={5}
                bg={cardBgSolid}
                _hover={{ bg: cardBgHover }}
                borderRadius="xl"
                fontSize="sm"
                fontWeight="medium"
                onClick={() => triggerModalOverlayActivation("clearAll", false)}
              >
                {lookupString("clr_cancel")}
              </Button>
              <Button
                py={5}
                bg="red.500"
                _hover={{ bg: "red.600" }}
                color="white"
                fontWeight="bold"
                borderRadius="xl"
                fontSize="sm"
                shadow="lg"
                onClick={clearCompleteJournalDatabase}
              >
                {lookupString("clr_yes")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Meta Social Sharing Engine Poster Generator Overlay */}
        <Modal
          isOpen={activeOverlays.share}
          onClose={() => triggerModalOverlayActivation("share", false)}
          isCentered
          size="xs"
        >
          <ModalOverlay backdropFilter="blur(10px)" bg={modalOverlayBg} />
          <ModalContent
            bg={modalContentGlassBg}
            border={`1px solid ${borderColor}`}
            borderRadius="3xl"
            p={2}
            backdropFilter="blur(24px)"
            shadow="2xl"
            color={textPrimary}
          >
            <ModalHeader
              fontSize="lg"
              fontFamily="serif"
              fontWeight="light"
              textAlign="center"
            >
              Share your{" "}
              <Box
                as="em"
                fontStyle="italic"
                fontWeight="normal"
                color={accentBase}
              >
                win.
              </Box>
            </ModalHeader>
            <ModalBody p={4}>
              <Box
                overflow="hidden"
                border={`1px solid ${borderColor}`}
                borderRadius="2xl"
                bg={colorMode === "dark" ? "#08090A" : "#F7F9FC"}
              >
                {shareCanvasPreviewUrl && (
                  <Image
                    src={shareCanvasPreviewUrl}
                    alt="Victory Preview Poster"
                    w="full"
                    h="auto"
                    display="block"
                  />
                )}
              </Box>
            </ModalBody>
            <ModalFooter
              display="flex"
              flexDirection="column"
              width="full"
              gap={2}
              p={4}
            >
              <Button
                w="full"
                py={6}
                bgGradient={accentGrad}
                _hover={{ bgGradient: accentGradHover }}
                color={invertText}
                fontWeight="bold"
                fontSize="sm"
                borderRadius="xl"
                shadow="md"
                onClick={localDeviceImageDownloadAction}
              >
                Download image
              </Button>
              {navigator.share && (
                <Button
                  w="full"
                  py={6}
                  bg={cardBgSolid}
                  _hover={{ bg: cardBgHover }}
                  border={`1px solid ${borderColor}`}
                  fontSize="sm"
                  fontWeight="medium"
                  borderRadius="xl"
                  onClick={triggerNativePlatformShareInterface}
                >
                  Share via…
                </Button>
              )}
              <Button
                variant="unstyled"
                w="full"
                py={1}
                fontSize="xs"
                fontFamily="mono"
                color={textTertiary}
                _hover={{ color: textSecondary }}
                transition="colors"
                onClick={() => triggerModalOverlayActivation("share", false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Progressive Web App System Native Instructions Overlay */}
        <Modal
          isOpen={activeOverlays.install}
          onClose={() => triggerModalOverlayActivation("install", false)}
          isCentered
          size="xs"
        >
          <ModalOverlay backdropFilter="blur(10px)" bg={modalOverlayBg} />
          <ModalContent
            bg={modalContentGlassBg}
            border={`1px solid ${borderColor}`}
            borderRadius="3xl"
            p={3}
            backdropFilter="blur(24px)"
            shadow="2xl"
            color={textPrimary}
            textAlign="center"
          >
            <ModalHeader fontSize="lg" fontFamily="serif" fontWeight="light">
              Install the{" "}
              <Box
                as="em"
                fontStyle="italic"
                fontWeight="normal"
                color={accentBase}
              >
                app.
              </Box>
            </ModalHeader>
            <ModalBody
              fontSize="sm"
              color={textSecondary}
              fontWeight="light"
              lineHeight="relaxed"
              borderTop={`1px solid ${borderColor}`}
              borderBottom={`1px solid ${borderColor}`}
              py={5}
              dangerouslySetInnerHTML={{
                __html: /iPhone|iPad/.test(navigator.userAgent)
                  ? `In Safari: tap the <strong style="color: ${colorMode === "dark" ? "#EDE8E0" : "#1A202C"}; font-weight: 500;">Share button</strong> at the bottom, then <strong style="color: ${colorMode === "dark" ? "#00E699" : "#00B377"}; font-weight: 500;">"Add to Home Screen"</strong>.`
                  : /Android/.test(navigator.userAgent)
                    ? `In Chrome: tap the <strong style="color: ${colorMode === "dark" ? "#EDE8E0" : "#1A202C"}; font-weight: 500;">three-dot menu</strong>, then <strong style="color: ${colorMode === "dark" ? "#00E699" : "#00B377"}; font-weight: 500;">"Add to Home screen"</strong>.`
                    : `In Chrome or Edge: look for the <strong style="color: ${colorMode === "dark" ? "#00E699" : "#00B377"}; font-weight: 500;">install icon (⊕)</strong> in the address bar.`,
              }}
            />
            <ModalFooter p={3}>
              <Button
                w="full"
                py={6}
                bg={textPrimary}
                _hover={{ opacity: 0.9 }}
                color={bgBase}
                fontWeight="bold"
                fontSize="sm"
                borderRadius="xl"
                onClick={() => triggerModalOverlayActivation("install", false)}
              >
                Got it
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* System Standard Resolution Rendering Canvas Container */}
        <canvas
          id="sc"
          ref={nativeCanvasRef}
          className="hidden"
          style={{ display: "none" }}
        />
      </Box>
    </>
  );
}
