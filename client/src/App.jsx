import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Box,
  useToast,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  TAGS,
  LANGUAGES,
  getAnimationStyles,
  getStackStyles,
} from "./constants";
import { lookupString, getExtendedLongDateRepresentation } from "./utils";

import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Onboarding1 from "./pages/Onboarding1";
import Onboarding2 from "./pages/Onboarding2";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Calendar from "./pages/Calendar";
import Day from "./pages/Day";
import Detail from "./pages/Detail";
import Spiral from "./pages/Spiral";
import Settings from "./pages/Settings";
import Stack from "./pages/Stack";
import NavBar from "./components/NavBar";
import Modals from "./components/Modals";
import { apiUrl } from "./lib/api";

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) return null;
    return { token, id: payload.id, email: payload.email, name: payload.name || "", picture: payload.picture || "" };
  } catch {
    return null;
  }
}

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  // ─── Auth ────────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("vj4_token");
    return saved ? decodeToken(saved) : null;
  });

  // ─── Theme tokens ───────────────────────────────────────────────────────────
  const bgBase = useColorModeValue("#f5f3f7", "#08090A");
  const textPrimary = useColorModeValue("#1c1c1e", "#EDE8E0");
  const textSecondary = useColorModeValue("#5c5c60", "whiteAlpha.400");
  const textTertiary = useColorModeValue("#8e8e93", "whiteAlpha.300");
  const cardBg = useColorModeValue(
    "rgba(255,255,255,0.85)",
    "rgba(255, 255, 255, 0.01)",
  );
  const cardBgHover = useColorModeValue(
    "rgba(255,255,255,0.95)",
    "rgba(255, 255, 255, 0.03)",
  );
  const cardBgSolid = useColorModeValue(
    "rgba(255,255,255,0.9)",
    "rgba(255, 255, 255, 0.02)",
  );
  const borderColor = useColorModeValue(
    "rgba(255,255,255,0.5)",
    "rgba(255, 255, 255, 0.05)",
  );
  const borderColorHover = useColorModeValue(
    "rgba(255,255,255,0.8)",
    "rgba(255, 255, 255, 0.15)",
  );
  const accentBase = useColorModeValue("#111111", "#00E699");
  const accentGrad = useColorModeValue(
    "linear(to-br, #111111, #333333)",
    "linear(to-br, #00E699, #00B377)",
  );
  const accentGradHover = useColorModeValue(
    "linear(to-br, #333333, #111111)",
    "linear(to-br, #00B377, #00E699)",
  );
  const accentBg = useColorModeValue(
    "rgba(17,17,17,0.06)",
    "rgba(0, 230, 153, 0.05)",
  );
  const accentBorder = useColorModeValue(
    "rgba(17,17,17,0.12)",
    "rgba(0, 230, 153, 0.15)",
  );
  const glassBg = useColorModeValue(
    "rgba(255,255,255,0.65)",
    "rgba(8, 9, 10, 0.85)",
  );
  const invertText = useColorModeValue("white", "#08090A");
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
  const cellEmptyBg = useColorModeValue(
    "rgba(0,0,0,0.02)",
    "rgba(255,255,255,0.02)",
  );
  const cellEmptyBorder = useColorModeValue(
    "rgba(0,0,0,0.05)",
    "rgba(255,255,255,0.03)",
  );
  const lvl1Bg = useColorModeValue(
    "rgba(17,17,17,0.08)",
    "rgba(0, 230, 153, 0.06)",
  );
  const lvl1Border = useColorModeValue(
    "rgba(17,17,17,0.2)",
    "rgba(0, 230, 153, 0.2)",
  );
  const lvl2Bg = useColorModeValue(
    "rgba(17,17,17,0.2)",
    "rgba(0, 230, 153, 0.15)",
  );
  const lvl2Border = useColorModeValue(
    "rgba(17,17,17,0.35)",
    "rgba(0, 230, 153, 0.4)",
  );
  const lvl3Bg = useColorModeValue(
    "rgba(17,17,17,0.45)",
    "rgba(0, 230, 153, 0.4)",
  );
  const lvl3Border = useColorModeValue(
    "rgba(17,17,17,0.55)",
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
  const calNavBg = useColorModeValue(
    "rgba(255,255,255,0.5)",
    "rgba(12, 12, 16, 0.4)",
  );
  const calNavBgHover = useColorModeValue(
    "rgba(255,255,255,0.8)",
    "rgba(12, 12, 16, 0.6)",
  );
  const backBtnHover = useColorModeValue("#333333", "#00B377");
  const tagUnselectedBg = useColorModeValue(
    "rgba(255,255,255,0.5)",
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
  const bentoColors =
    colorMode === "light"
      ? ["rgba(255,255,255,0.85)", "#e0f2fe", "#ffe4e8", "#fef3c7", "#dcfce7"]
      : [
          "rgba(255,255,255,0.02)",
          "rgba(56,189,248,0.18)",
          "rgba(251,113,133,0.18)",
          "rgba(251,191,36,0.18)",
          "rgba(74,222,128,0.18)",
        ];
  const bentoBorders =
    colorMode === "light"
      ? Array(5).fill(borderColor)
      : [
          "rgba(255,255,255,0.07)",
          "rgba(56,189,248,0.35)",
          "rgba(251,113,133,0.35)",
          "rgba(251,191,36,0.35)",
          "rgba(74,222,128,0.35)",
        ];

  const t = {
    colorMode,
    bgBase,
    textPrimary,
    textSecondary,
    textTertiary,
    cardBg,
    cardBgHover,
    cardBgSolid,
    borderColor,
    borderColorHover,
    accentBase,
    accentGrad,
    accentGradHover,
    accentBg,
    accentBorder,
    glassBg,
    invertText,
    dangerBg,
    dangerBorder,
    dangerHover,
    cellEmptyBg,
    cellEmptyBorder,
    lvl1Bg,
    lvl1Border,
    lvl2Bg,
    lvl2Border,
    lvl3Bg,
    lvl3Border,
    antiSpiralBg,
    antiSpiralBorder,
    antiSpiralText,
    calNavBg,
    calNavBgHover,
    backBtnHover,
    tagUnselectedBg,
    modalOverlayBg,
    modalContentGlassBg,
    spiralEvidenceBg,
    spiralEvidenceBorder,
    quoteMarkColor,
    bentoColors,
    bentoBorders,
  };

  // ─── State ──────────────────────────────────────────────────────────────────
  const [wins, setWins] = useState(() =>
    JSON.parse(localStorage.getItem("vj4") || "[]"),
  );
  const [meta, setMeta] = useState(() =>
    JSON.parse(localStorage.getItem("vj4m") || "{}"),
  );
  const [screen, setScreen] = useState(() => {
    const saved = localStorage.getItem("vj4_token");
    if (!saved || !decodeToken(saved)) return "login";
    return JSON.parse(localStorage.getItem("vj4m") || "{}").onboarded ? "home" : "ob1";
  });
  const [selectedLanguage, setSelectedLanguage] = useState(
    () => localStorage.getItem("vj_slang") || "en-IN",
  );
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [liveText, setLiveText] = useState("");
  const [textInputBox, setTextInputBox] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilterTag, setSearchFilterTag] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState("listening");
  const [isEditableMode, setIsEditableMode] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [showShareNudge, setShowShareNudge] = useState(false);
  const [audioRecordings, setAudioRecordings] = useState(() =>
    JSON.parse(localStorage.getItem("vj4_audio") || "{}"),
  );
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [customTagInput, setCustomTagInput] = useState("");
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);
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
  const [activeOverlays, setActiveOverlays] = useState({
    delete: false,
    clearAll: false,
    share: false,
    install: false,
  });
  const [shareImageBlob, setShareImageBlob] = useState(null);
  const [shareCanvasPreviewUrl, setShareCanvasPreviewUrl] = useState("");

  // ─── Refs ────────────────────────────────────────────────────────────────────
  const audioPlayerRef = useRef(null);
  const savedAudioRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef([]);
  const recordingStreamSourceRef = useRef(null);
  const speechFallbackTimerRef = useRef(null);
  const nativeCanvasRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const hasVoiceSupport =
    browserSupportsSpeechRecognition || !!window.MediaRecorder;
  const chakraToast = useToast();

  // ─── Persistence effects ────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("vj4", JSON.stringify(wins));
  }, [wins]);
  useEffect(() => {
    localStorage.setItem("vj4m", JSON.stringify(meta));
  }, [meta]);
  useEffect(() => { localStorage.setItem("vj_slang", selectedLanguage); }, [selectedLanguage]);
  useEffect(() => {
    localStorage.setItem("vj4_audio", JSON.stringify(audioRecordings));
  }, [audioRecordings]);

  useEffect(() => {
    const manifest = {
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
      const blob = new Blob([JSON.stringify(manifest)], {
        type: "application/manifest+json",
      });
      document.getElementById("ml").href = URL.createObjectURL(blob);
    } catch (e) {}
  }, [colorMode]);

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
      const today = new Date().toDateString();
      const resurface = wins.find(
        (w) => w.resurface && new Date(w.resurface).toDateString() === today,
      );
      if (resurface) {
        setTimeout(() => {
          routeToWin(resurface.id, "home");
          displayToast("A win resurfaced for you ✦");
        }, 1000);
      }
    }
  }, []);

  // ─── Auth handlers ───────────────────────────────────────────────────────────
  const handleLoginSuccess = ({ token, user: userData }) => {
    localStorage.setItem("vj4_token", token);
    setUser({ token, ...userData });
    setScreen(meta.onboarded ? "home" : "ob1");
  };

  const handleLogout = () => {
    localStorage.removeItem("vj4_token");
    setUser(null);
    setScreen("login");
  };

  const handleUpdateUser = ({ token, user: userData }) => {
    localStorage.setItem("vj4_token", token);
    setUser({ token, ...userData });
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const displayToast = (message) =>
    chakraToast({
      title: message,
      status: "info",
      duration: 2500,
      isClosable: true,
      position: "top",
      variant: "subtle",
    });

  const triggerHaptic = (ms = 40) => {
    try {
      if (navigator.vibrate) navigator.vibrate(ms);
    } catch (e) {}
  };

  const navigate = (targetScreen) => {
    setSearchQuery("");
    setFilterTag(null);
    setSearchFilterTag(null);
    setShowCustomTagInput(false);
    setCustomTagInput("");
    setScreen(targetScreen);
  };

  const routeToWin = (id, from) => {
    setSelectedWinId(id);
    setPreviousScreenTracker(from);
    navigate("detail");
  };

  // ─── Stats ───────────────────────────────────────────────────────────────────
  const calcStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const week = wins.filter((w) => new Date(w.date) >= weekAgo).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let grace = false;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const hit = wins.some(
        (w) => new Date(w.date).toDateString() === d.toDateString(),
      );
      if (hit) {
        streak++;
      } else if (i === 0) {
        grace = true;
      } else {
        break;
      }
    }
    return { total: wins.length, streak, week, grace };
  };
  const stats = calcStats();
  const allTags = [...TAGS, ...(meta.customTags || [])];
  const activeDashboardFilteredWins = wins
    .filter((w) => !filterTag || w.tag === filterTag)
    .slice(0, 8);
  const activeSearchFilteredWins = wins.filter((w) => {
    const tagOk = !searchFilterTag || w.tag === searchFilterTag;
    const textOk =
      !searchQuery.trim() ||
      w.text.toLowerCase().includes(searchQuery.toLowerCase());
    return tagOk && textOk;
  });

  // ─── Onboarding ──────────────────────────────────────────────────────────────
  const completeOnboarding = async () => {
    setMeta({ ...meta, onboarded: true });
    if (nameInput.trim() && user?.token) {
      try {
        const res = await fetch(apiUrl("/api/auth/profile"), {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
          body: JSON.stringify({ name: nameInput.trim() }),
        });
        const data = await res.json();
        if (res.ok) handleUpdateUser(data);
      } catch {}
    }
    if (!wins.length) {
      setWins([
        {
          id: "sample_" + Date.now(),
          text: lookupString("sample_win"),
          date: new Date().toISOString(),
          resurface: null,
          tag: null,
          sample: true,
        },
      ]);
    }
    setScreen("home");
  };

  // ─── Recording ──────────────────────────────────────────────────────────────
  const startRecording = async () => {
    setSpeechError("");
    triggerHaptic(30);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    )
      mediaRecorderRef.current.stop();
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
          language: selectedLanguage,
        });
      } catch (e) {
        setSpeechError("Voice recognition failed to start.");
        setIsRecording(false);
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
        } catch (e) {}
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
      } catch (e) {
        setIsRecording(false);
        setSpeechError("Microphone access denied.");
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (speechFallbackTimerRef.current)
      clearTimeout(speechFallbackTimerRef.current);
    triggerHaptic(20);

    if (browserSupportsSpeechRecognition) {
      if (listening) {
        try {
          SpeechRecognition.stopListening();
        } catch (e) {}
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        const mime = mediaRecorderRef.current.mimeType || "audio/webm";
        mediaRecorderRef.current.onstop = () => {
          if (recordingStreamSourceRef.current) {
            recordingStreamSourceRef.current
              .getTracks()
              .forEach((t) => t.stop());
            recordingStreamSourceRef.current = null;
          }
          if (audioStreamRef.current.length > 0) {
            const blob = new Blob(audioStreamRef.current, { type: mime });
            if (blob.size >= 2000) savedAudioRef.current = { blob, mime };
            audioStreamRef.current = [];
          }
        };
        mediaRecorderRef.current.stop();
      }
      if (liveText.trim()) setIsEditableMode(true);
      setTranscriptionStatus("idle");
      return;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      setTranscriptionStatus("transcribing");
      mediaRecorderRef.current.onstop = async () => {
        if (recordingStreamSourceRef.current) {
          recordingStreamSourceRef.current.getTracks().forEach((t) => t.stop());
          recordingStreamSourceRef.current = null;
        }
        await transcribeAudio();
      };
      mediaRecorderRef.current.stop();
    } else {
      if (liveText.trim()) setIsEditableMode(true);
      setTranscriptionStatus("idle");
    }
  };

  const transcribeAudio = async () => {
    if (!audioStreamRef.current.length) {
      setTranscriptionStatus("idle");
      setSpeechError("No audio captured — hold button while speaking");
      return;
    }
    const activeMime =
      mediaRecorderRef.current?.mimeType ||
      audioStreamRef.current[0]?.type ||
      "audio/webm";
    const ext =
      activeMime.includes("mp4") || activeMime.includes("m4a")
        ? "m4a"
        : activeMime.includes("ogg")
          ? "ogg"
          : "webm";
    const blob = new Blob(audioStreamRef.current, { type: activeMime });
    savedAudioRef.current = { blob, mime: activeMime };
    if (blob.size < 2000) {
      setTranscriptionStatus("idle");
      setSpeechError("Recording too short — speak for at least 1 second");
      audioStreamRef.current = [];
      return;
    }
    try {
      const b64 = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result.split(",")[1]);
        fr.onerror = reject;
        fr.readAsDataURL(blob);
      });
      displayToast(`Sending ${Math.round(blob.size / 1024)}kb to server…`);
      const res = await fetch(apiUrl("/api/transcribe"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify({
          audio: b64,
          mimeType: activeMime,
          ext,
          language: selectedLanguage,
          prompt: `Personal wins journal. Victories and achievements. Transcribe in language: ${LANGUAGES.find((l) => l.code === selectedLanguage)?.label || selectedLanguage}.`,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          res.status === 401
            ? "Invalid API key — check server setup"
            : res.status === 413
              ? "Recording too long — try a shorter clip"
              : err.error?.message || `Server error ${res.status}`,
        );
      }
      const data = await res.json();
      const text = (data.text || "").trim();
      setTranscriptionStatus("idle");
      if (text) {
        setLiveText(text);
        setIsEditableMode(true);
      } else {
        setSpeechError("Nothing detected — speak clearly and try again");
      }
    } catch (err) {
      setTranscriptionStatus("idle");
      const msg =
        err.message === "Failed to fetch"
          ? "Cannot reach server — check internet connection"
          : err.message;
      setSpeechError(msg);
      displayToast("Transcription error: " + msg);
    }
    audioStreamRef.current = [];
  };

  const clearInput = () => {
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
      recordingStreamSourceRef.current.getTracks().forEach((t) => t.stop());
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
      if (browserSupportsSpeechRecognition) SpeechRecognition.stopListening();
    } catch (e) {}
  };

  const saveWin = () => {
    const text = liveText.trim();
    if (!text) return;
    const win = {
      id: Date.now().toString(),
      text,
      date: new Date().toISOString(),
      resurface: null,
      tag: selectedTag,
    };
    setWins((prev) => [win, ...prev]);
    if (
      savedAudioRef.current?.blob &&
      savedAudioRef.current.blob.size < 524288
    ) {
      const { blob, mime } = savedAudioRef.current;
      const fr = new FileReader();
      fr.onload = () =>
        setAudioRecordings((prev) => ({
          ...prev,
          [win.id]: { data: fr.result.split(",")[1], mime },
        }));
      fr.readAsDataURL(blob);
    }
    savedAudioRef.current = null;
    triggerHaptic(60);
    clearInput();
    displayToast("Victory stacked ✦");
    setTimeout(() => {
      setSelectedWinId(win.id);
      setPreviousScreenTracker("home");
      setShowShareNudge(true);
    }, 400);
  };

  // ─── Win actions ─────────────────────────────────────────────────────────────
  const toggleResurface = () => {
    if (!selectedWinId) return;
    const updated = [...wins];
    const i = updated.findIndex((w) => w.id === selectedWinId);
    if (i < 0) return;
    if (updated[i].resurface) {
      updated[i].resurface = null;
      setWins(updated);
      displayToast("Resurface removed");
    } else {
      const days = [7, 10, 14, 21][Math.floor(Math.random() * 4)];
      const d = new Date();
      d.setDate(d.getDate() + days);
      updated[i].resurface = d.toISOString();
      setWins(updated);
      displayToast(`Will return in ${days} days`);
    }
  };

  const deleteWin = () => {
    if (!selectedWinId) return;
    setWins(wins.filter((w) => w.id !== selectedWinId));
    setAudioRecordings((prev) => {
      const u = { ...prev };
      delete u[selectedWinId];
      return u;
    });
    setActiveOverlays((prev) => ({ ...prev, delete: false }));
    displayToast("Victory removed");
    navigate(previousScreenTracker);
  };

  const clearAllWins = () => {
    setWins([]);
    setAudioRecordings({});
    setActiveOverlays((prev) => ({ ...prev, clearAll: false }));
    displayToast("All victories cleared");
  };

  const changeTag = (tag) => {
    if (!selectedWinId) return;
    const updated = [...wins];
    const i = updated.findIndex((w) => w.id === selectedWinId);
    if (i < 0) return;
    updated[i].tag = tag;
    setWins(updated);
    triggerHaptic(20);
    displayToast(tag ? `Tagged as ${tag}` : "Tag removed");
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

  const addCustomTag = (name) => {
    const trimmed = name.trim();
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

  const removeCustomTag = (name) => {
    setMeta((prev) => ({
      ...prev,
      customTags: (prev.customTags || []).filter((t) => t !== name),
    }));
    setWins((prev) =>
      prev.map((w) => (w.tag === name ? { ...w, tag: null } : w)),
    );
    displayToast(`"${name}" tag removed`);
  };

  // ─── Spiral ──────────────────────────────────────────────────────────────────
  const genSpiralWin = () => {
    let ids = [...usedSpiralIds];
    if (!wins.length) {
      setSpiralWin({
        text: lookupString("empty_spiral"),
        details: "",
        anchor: lookupString("anchors")[0],
      });
      return;
    }
    if (ids.length >= wins.length) ids = [];
    const pool = wins.filter((w) => !ids.includes(w.id));
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    ids.push(chosen.id);
    setUsedSpiralIds(ids);
    setSpiralWin({
      text: chosen.text,
      details:
        (chosen.tag ? chosen.tag + " · " : "") +
        getExtendedLongDateRepresentation(chosen.date),
      anchor:
        lookupString("anchors")[
          Math.floor(Math.random() * lookupString("anchors").length)
        ],
    });
  };

  const startSpiral = () => {
    setUsedSpiralIds([]);
    navigate("spiral");
    setTimeout(genSpiralWin, 50);
  };

  // ─── Share / canvas ─────────────────────────────────────────────────────────
  const drawRoundedRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const wrapText = (ctx, text, maxW, font) => {
    ctx.font = font;
    const words = text.split(" ");
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  };

  const drawShareCanvas = (win) => {
    const canvas = nativeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const S = 1080;
    canvas.width = S;
    canvas.height = S;
    const isDark = colorMode === "dark";
    ctx.fillStyle = isDark ? "#08090A" : "#F7F9FC";
    ctx.fillRect(0, 0, S, S);
    const grad = ctx.createRadialGradient(
      S * 0.35,
      S * 0.25,
      0,
      S * 0.35,
      S * 0.25,
      S * 0.7,
    );
    grad.addColorStop(
      0,
      isDark ? "rgba(0,230,153,0.06)" : "rgba(0,230,153,0.1)",
    );
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = "rgba(0,230,153,0.25)";
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, 40, 40, S - 80, S - 80, 40);
    ctx.stroke();
    const lg = ctx.createLinearGradient(120, 0, S - 120, 0);
    lg.addColorStop(0, "transparent");
    lg.addColorStop(0.4, "rgba(0,230,153,0.5)");
    lg.addColorStop(0.6, "rgba(0,230,153,0.5)");
    lg.addColorStop(1, "transparent");
    ctx.strokeStyle = lg;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(120, 40);
    ctx.lineTo(S - 120, 40);
    ctx.stroke();
    ctx.fillStyle = "rgba(0,230,153,0.07)";
    ctx.font = "380px Georgia,serif";
    ctx.textAlign = "left";
    ctx.fillText('"', 70, 380);
    let fontSize = 72;
    let lines = wrapText(
      ctx,
      win.text,
      S - 200,
      `italic ${fontSize}px Georgia,serif`,
    );
    while (lines.length > 6 && fontSize > 32) {
      fontSize -= 4;
      lines = wrapText(
        ctx,
        win.text,
        S - 200,
        `italic ${fontSize}px Georgia,serif`,
      );
    }
    const yOff = Math.max(180, (S - lines.length * (fontSize + 20)) / 2);
    ctx.font = `italic ${fontSize}px Georgia,serif`;
    ctx.fillStyle = isDark ? "#EDE8E0" : "#1A202C";
    ctx.textAlign = "left";
    lines.forEach((l, i) => ctx.fillText(l, 100, yOff + i * (fontSize + 20)));
    const accent = isDark ? "rgba(0,230,153,0.5)" : "rgba(0,179,119,0.7)";
    if (win.tag) {
      ctx.font = "300 22px monospace";
      ctx.fillStyle = accent;
      ctx.textAlign = "left";
      ctx.fillText(win.tag.toUpperCase(), 100, S - 160);
    }
    ctx.font = "300 22px monospace";
    ctx.fillStyle = isDark ? "rgba(237,232,224,0.3)" : "rgba(26,32,44,0.4)";
    ctx.textAlign = "left";
    ctx.fillText(
      getExtendedLongDateRepresentation(win.date).toUpperCase(),
      100,
      S - 130,
    );
    ctx.font = "300 22px monospace";
    ctx.fillStyle = accent;
    ctx.textAlign = "right";
    ctx.fillText("VICTORY JOURNAL", S - 80, S - 130);
    ctx.font = "28px serif";
    ctx.fillStyle = "rgba(0,230,153,0.6)";
    ctx.fillText("✦", S - 76, S - 158);
    canvas.toBlob((blob) => {
      setShareImageBlob(blob);
      setShareCanvasPreviewUrl(canvas.toDataURL());
    }, "image/png");
  };

  const openShare = (overlayKey, open) => {
    if (overlayKey === "share" && open) {
      const win = wins.find((w) => w.id === selectedWinId);
      if (win) drawShareCanvas(win);
    }
    setActiveOverlays((prev) => ({ ...prev, [overlayKey]: open }));
  };

  const downloadImage = () => {
    if (!shareImageBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(shareImageBlob);
    a.download = `victory-${Date.now()}.png`;
    a.click();
    displayToast("Image saved ✦");
  };

  const nativeShare = async () => {
    if (!shareImageBlob || !navigator.share) return;
    try {
      await navigator.share({
        files: [
          new File([shareImageBlob], "victory.png", { type: "image/png" }),
        ],
        title: "My Victory",
        text: "From my Victory Journal",
      });
    } catch (e) {}
  };

  // ─── Data export / import ────────────────────────────────────────────────────
  const exportData = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          { exported: new Date().toISOString(), meta, wins },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `victory-journal-${new Date().toLocaleDateString("en-US").replace(/\//g, "-")}.json`;
    a.click();
    displayToast("Exported successfully");
  };

  const importData = (input) => {
    const file = input.files[0];
    if (!file) return;
    const fr = new FileReader();
    fr.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const incoming = data.wins || (Array.isArray(data) ? data : []);
        if (!incoming.length) {
          displayToast("No victories found in file");
          return;
        }
        const existingIds = new Set(wins.map((w) => w.id));
        const newWins = incoming.filter((w) => !existingIds.has(w.id));
        setWins(
          [...wins, ...newWins].sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          ),
        );
        if (data.meta?.customTags && !meta.customTags) {
          setMeta((prev) => ({ ...prev, customTags: data.meta.customTags }));
        }
        displayToast(`Imported ${newWins.length} victories`);
      } catch (e) {
        displayToast("Could not read file");
      }
    };
    fr.readAsText(file);
    input.value = "";
  };

  const micToggle = () => {
    isRecording ? stopRecording() : startRecording();
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>

      <style>{getStackStyles(colorMode === "dark")}</style>
      <style>{getAnimationStyles(colorMode === "dark")}</style>
      <Box
        minH="100vh"
        bg={bgBase}
        color={textPrimary}
        px={0}
        pb="120px"
        position="relative"
        overflowX="hidden"
        transition="all 0.3s ease"
        style={
          colorMode === "light"
            ? {
                backgroundImage:
                  "radial-gradient(circle at 10% 20%, rgba(234, 212, 255, 0.7) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(212, 230, 255, 0.8) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255, 235, 204, 0.6) 0%, transparent 40%), radial-gradient(circle at 20% 90%, rgba(215, 248, 230, 0.6) 0%, transparent 40%)",
              }
            : {
                backgroundImage:
                  "radial-gradient(circle at 10% 15%, rgba(56,189,248,0.06) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(167,139,250,0.06) 0%, transparent 40%), radial-gradient(circle at 80% 85%, rgba(0,230,153,0.05) 0%, transparent 40%), radial-gradient(circle at 15% 85%, rgba(251,113,133,0.05) 0%, transparent 40%)",
              }
        }
      >
        {screen === "login" && (
          <Login t={t} onLoginSuccess={handleLoginSuccess} />
        )}
        {screen === "profile" && (
          <Profile
            t={t}
            user={user}
            wins={wins}
            onBack={() => navigate("home")}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
          />
        )}
        {screen === "ob1" && (
          <Onboarding1 t={t} onNext={() => navigate("ob2")} />
        )}
        {screen === "ob2" && (
          <Onboarding2
            t={t}
            nameInput={nameInput}
            setNameInput={setNameInput}
            onComplete={completeOnboarding}
          />
        )}
        {screen === "home" && (
          <Home
            t={t}
            user={user}
            meta={meta}
            wins={wins}
            stats={stats}
            allTags={allTags}
            isRecording={isRecording}
            liveText={liveText}
            setLiveText={setLiveText}
            textInputBox={textInputBox}
            handleManualTextInput={(v) => {
              setTextInputBox(v);
              setLiveText(v);
            }}
            transcriptionStatus={transcriptionStatus}
            isEditableMode={isEditableMode}
            speechError={speechError}
            hasVoiceSupport={hasVoiceSupport}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            filterTag={filterTag}
            setFilterTag={setFilterTag}
            showCustomTagInput={showCustomTagInput}
            setShowCustomTagInput={setShowCustomTagInput}
            customTagInput={customTagInput}
            setCustomTagInput={setCustomTagInput}
            showShareNudge={showShareNudge}
            setShowShareNudge={setShowShareNudge}
            activeDashboardFilteredWins={activeDashboardFilteredWins}
            onClear={clearInput}
            onSave={saveWin}
            onAddCustomTag={addCustomTag}
            onNavigate={navigate}
            onViewWin={routeToWin}
            onSpiral={startSpiral}
            onOpenShare={() => openShare("share", true)}
          />
        )}
        {screen === "search" && (
          <Search
            t={t}
            wins={wins}
            allTags={allTags}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchFilterTag={searchFilterTag}
            setSearchFilterTag={setSearchFilterTag}
            activeSearchFilteredWins={activeSearchFilteredWins}
            onViewWin={routeToWin}
          />
        )}
        {screen === "calendar" && (
          <Calendar
            t={t}
            wins={wins}
            currentCalendarDate={currentCalendarDate}
            onPrevMonth={() => {
              const d = new Date(currentCalendarDate);
              d.setMonth(d.getMonth() - 1);
              setCurrentCalendarDate(d);
            }}
            onNextMonth={() => {
              const d = new Date(currentCalendarDate);
              d.setMonth(d.getMonth() + 1);
              setCurrentCalendarDate(d);
            }}
            onViewWin={routeToWin}
            onViewDay={(data) => {
              setTargetDayData(data);
              navigate("day");
            }}
          />
        )}
        {screen === "day" && (
          <Day
            t={t}
            targetDayData={targetDayData}
            onBack={() => navigate("calendar")}
            onViewWin={routeToWin}
          />
        )}
        {screen === "detail" && (
          <Detail
            t={t}
            win={wins.find((w) => w.id === selectedWinId)}
            allTags={allTags}
            audioRecordings={audioRecordings}
            playingAudioId={playingAudioId}
            onToggleAudio={toggleAudioPlayback}
            showCustomTagInput={showCustomTagInput}
            setShowCustomTagInput={setShowCustomTagInput}
            customTagInput={customTagInput}
            setCustomTagInput={setCustomTagInput}
            onAddCustomTag={addCustomTag}
            onTagChange={changeTag}
            onBack={() => navigate(previousScreenTracker)}
            onShare={() => openShare("share", true)}
            onResurface={toggleResurface}
            onDelete={() => openShare("delete", true)}
          />
        )}
        {screen === "spiral" && (
          <Spiral
            t={t}
            spiralWin={spiralWin}
            onNext={genSpiralWin}
            onBack={() => navigate("home")}
          />
        )}
        {screen === "settings" && (
          <Settings
            t={t}
            meta={meta}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            showCustomTagInput={showCustomTagInput}
            setShowCustomTagInput={setShowCustomTagInput}
            customTagInput={customTagInput}
            setCustomTagInput={setCustomTagInput}
            onAddCustomTag={addCustomTag}
            onRemoveCustomTag={removeCustomTag}
            onExport={exportData}
            onImport={importData}
            onInstall={() => openShare("install", true)}
            onClearAll={() => openShare("clearAll", true)}
            onBack={() => navigate("home")}
            toggleColorMode={toggleColorMode}
          />
        )}
        {screen === "stack" && (
          <Stack t={t} wins={wins} onViewWin={routeToWin} />
        )}

        {meta.onboarded &&
          ["home", "search", "calendar", "stack"].includes(screen) && (
            <NavBar
              t={t}
              screen={screen}
              isRecording={isRecording}
              onNavigate={navigate}
              onMicToggle={micToggle}
            />
          )}

        <Modals
          t={t}
          activeOverlays={activeOverlays}
          onClose={(key) =>
            setActiveOverlays((prev) => ({ ...prev, [key]: false }))
          }
          onDelete={deleteWin}
          onClearAll={clearAllWins}
          shareCanvasPreviewUrl={shareCanvasPreviewUrl}
          onDownloadImage={downloadImage}
          onNativeShare={nativeShare}
          colorMode={colorMode}
        />

        <canvas id="sc" ref={nativeCanvasRef} style={{ display: "none" }} />
      </Box>
    </>
  );
}
