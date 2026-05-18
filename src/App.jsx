import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './index.css';

// Core Application Configurations
const TAGS = ['Work', 'Health', 'Money', 'Love', 'Mind', 'Other'];

const STRINGS = {
  en: {
    greeting_morning: 'Good morning', greeting_afternoon: 'Good afternoon',
    greeting_evening: 'Good evening', greeting_night: 'Still up,',
    stat_victories: 'Victories', stat_streak: 'Day streak', stat_week: 'This week',
    tap_hint: 'Log a victory', recording: 'Recording…', transcribing: 'Transcribing…',
    speak_ph: 'Begin speaking…', edit_hint: 'Tap above to fix any errors before saving',
    tag_lbl: 'Tag this win (optional)', stack: 'Stack it ✦', discard: 'Discard',
    spiral_btn: "⟳   I'm spiraling — remind me who I am",
    spiral_sub: 'Shows your own victories when doubt kicks in',
    recent: 'Recent victories', share_nudge: 'Share this win →', search_ph: 'Search your victories…',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    anchors: [
      'What did you believe about yourself when this happened?',
      'What strength made this possible?',
      'What would you tell a friend who doubted they could do this?',
      'How did it feel in the moment you realized it worked?',
      'What fear did you push through to get here?',
      'What changed in you after this victory?',
      'Who believed in you when this happened?',
      'What would past-you think seeing you accomplish this?'
    ],
    sample_win: 'I opened Victory Journal and decided to start tracking my wins. That took courage.',
    victory: 'victory', victories: 'victories', victories_in: 'victories in',
    no_wins_home: 'Your first victory is waiting to be recorded. Tap the mic above.',
    no_wins_month: 'No victories this month yet.', no_wins_search: 'No victories match that search.',
    grace: '✦ grace day active — log a win today',
    empty_spiral: 'Record your first victory — then come back here when you need a reminder.', back: 'Back',
    del_body: 'Victories, once lived, cannot be unlived. This will permanently remove it from your journal.',
    del_keep: 'Keep it', del_remove: 'Remove it',
    clr_body: 'This permanently deletes all your victories. Export your data first if you want a backup.',
    clr_cancel: 'Cancel', clr_yes: 'Yes, clear all',
    settings_lang: 'Language', settings_install: 'Install',
    settings_danger: 'Danger zone', settings_data: 'Your data',
  },
  hi: {
    greeting_morning: 'सुप्रभात', greeting_afternoon: 'शुभ दोपहर',
    greeting_evening: 'शुभ संध्या', greeting_night: 'अभी जागे हैं,',
    stat_victories: 'जीत', stat_streak: 'दिन की लकीर', stat_week: 'इस हफ्ते',
    tap_hint: 'जीत बोलें', recording: 'रिकॉर्ड हो रहा है…', transcribing: 'लिख रहे हैं…',
    speak_ph: 'बोलना शुरू करें…', edit_hint: 'सेव करने से पहले ऊपर टैप करके ठीक करें',
    tag_lbl: 'टैग करें (वैकल्पिक)', stack: 'सेव करें ✦', discard: 'हटाएं',
    spiral_btn: '⟳  मुझे याद दिलाओ — मैं कौन हूं',
    spiral_sub: 'जब शक हो तब अपनी जीत देखें',
    recent: 'हाल की जीत', share_nudge: 'इसे शेयर करें →', search_ph: 'अपनी जीत खोजें…',
    months: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्तूबर', 'नवंबर', 'दिसंबर'],
    days: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
    anchors: [
      'जब यह हुआ तो आपने खुद के बारे में क्या सोचा?',
      'किस ताकत से यह संभव हुआ?',
      'किसी दोस्त को क्या कहते जो यह नहीं कर पाता?',
      'जब पता चला कि काम हो गया — उस पल कैसा लगा?',
      'कौन सा डर था जो आपने पार किया?',
      'इस जीत के बाद आप में क्या बदला?',
      'उस वक्त किसने आप पर भरोसा किया?',
      'पुराना आप यह देखकर क्या सोचता?'
    ],
    sample_win: 'मैंने Victory Journal खोला और अपनी जीत दर्ज करने का फैसला किया। यह भी एक हिम्मत थी।',
    victory: 'जीत', victories: 'जीत', victories_in: 'जीत',
    no_wins_home: 'आपकी पहली जीत दर्ज होने का इंतज़ार है। ऊपर माइक टैप करें।',
    no_wins_month: 'इस महीने अभी कोई जीत नहीं।', no_wins_search: 'कोई जीत नहीं मिली।',
    grace: '✦ आज जीत दर्ज करें — लकीर बची है',
    empty_spiral: 'पहले एक जीत रिकॉर्ड करें — फिर यहाँ आएं जब याद दिलाना हो।', back: 'वापस',
    del_body: 'जो हो चुका है वो बदला नहीं जा सकता। यह आपके जर्नल से हमेशा के लिए हट जाएगा।',
    del_keep: 'रखें', del_remove: 'हटाएं',
    clr_body: 'यह सभी जीत हमेशा के लिए मिटा देगा। पहले बैकअप लें।',
    clr_cancel: 'रद्द करें', clr_yes: 'हाँ, सब मिटाएं',
    settings_lang: 'भाषा', settings_install: 'इंस्टॉल करें',
    settings_danger: 'खतरा क्षेत्र', settings_data: 'आपका डेटा',
  }
};

export default function App() {
  // --- Core State Machine ---
  const [wins, setWins] = useState(() => JSON.parse(localStorage.getItem('vj4') || '[]'));
  const [meta, setMeta] = useState(() => JSON.parse(localStorage.getItem('vj4m') || '{}'));
  const [screen, setScreen] = useState(meta.onboarded ? 'home' : 'ob1');
  const [lang, setLang] = useState(() => localStorage.getItem('vj_lang') || 'en');

  // --- UI Interactivity State ---
  const [nameInput, setNameInput] = useState(meta.name || '');
  const [liveText, setLiveText] = useState('');
  const [textInputBox, setTextInputBox] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilterTag, setSearchFilterTag] = useState(null);
  
  // --- Recording, Analytics & Custom Engine States ---
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState('listening'); // listening, transcribing, idle
  const [isEditableMode, setIsEditableMode] = useState(false);
  const [speechEngineMode, setSpeechEngineMode] = useState('Checking…');
  const [speechError, setSpeechError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showShareNudge, setShowShareNudge] = useState(false);
  
  // --- Active Calendars & Active Target Dynamic References ---
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [targetDayData, setTargetDayData] = useState({ year: null, month: null, day: null, dayWins: [] });
  const [selectedWinId, setSelectedWinId] = useState(null);
  const [previousScreenTracker, setPreviousScreenTracker] = useState('home');
  const [spiralWin, setSpiralWin] = useState({ text: '', details: '', anchor: '' });
  const [usedSpiralIds, setUsedSpiralIds] = useState([]);

  // --- Modal Overlay Engine Controllers ---
  const [activeOverlays, setActiveOverlays] = useState({ delete: false, clearAll: false, share: false, install: false });

  // --- HTML5 Audio Recording Framework Refs ---
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef([]);
  const recordingStreamSourceRef = useRef(null);
  const speechFallbackTimerRef = useRef(null);
  const nativeCanvasRef = useRef(null);
  const [shareImageBlob, setShareImageBlob] = useState(null);
  const [shareCanvasPreviewUrl, setShareCanvasPreviewUrl] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const hasVoiceSupport = browserSupportsSpeechRecognition || !!window.MediaRecorder;

  // Local API Key Validator Utility
  const lookupString = (key) => (STRINGS[lang] || STRINGS.en)[key] || STRINGS.en[key] || key;

  // Micro Haptic Pulse Trigger Engine
  const triggerHapticFeedback = (duration = 40) => {
    try {
      if (navigator.vibrate) navigator.vibrate(duration);
    } catch (e) { /* Haptic Fail-Safe */ }
  };

  // Toast System Component Displayer
  const displayToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2800);
  };

  // --- Core Lifecycle Hooks ---
  useEffect(() => {
    localStorage.setItem('vj4', JSON.stringify(wins));
  }, [wins]);

  useEffect(() => {
    localStorage.setItem('vj4m', JSON.stringify(meta));
  }, [meta]);

  useEffect(() => {
    localStorage.setItem('vj_lang', lang);
  }, [lang]);

  // Manifest PWA Execution Strategy
  useEffect(() => {
    const webAppManifestData = {
      name: "Victory Journal",
      short_name: "Victory",
      description: "Your personal proof library",
      start_url: ".",
      display: "standalone",
      background_color: "#0C0C10",
      theme_color: "#0C0C10",
      icons: [{
        src: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" rx="36" fill="#0C0C10"/><text x="96" y="130" font-size="110" text-anchor="middle" fill="#C4A278" font-family="serif" font-style="italic">✦</text></svg>`),
        sizes: "192x192",
        type: "image/svg+xml"
      }]
    };
    try {
      const manifestFileBlob = new Blob([JSON.stringify(webAppManifestData)], { type: 'application/manifest+json' });
      document.getElementById('ml').href = URL.createObjectURL(manifestFileBlob);
    } catch (e) { /* Non-blocking dynamic manifest architecture setup failure */ }
  }, []);

  // Speech engine support and server-side transcription probe
  useEffect(() => {
    setSpeechEngineMode(browserSupportsSpeechRecognition ? 'Speech API' : 'Basic mode');

    async function evaluateServerTransmissionProxy() {
      try {
        const response = await fetch('/api/transcribe', { method: 'OPTIONS' });
        if (response.ok || [200, 204, 405].includes(response.status)) {
          setSpeechEngineMode(browserSupportsSpeechRecognition ? 'Speech API' : 'Nova-2 ✦');
        } else {
          setSpeechEngineMode('Basic mode');
        }
      } catch (e) {
        setSpeechEngineMode('Basic mode');
      }
    }
    evaluateServerTransmissionProxy();
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      setLiveText(transcript);
      if (!listening && transcript.trim()) {
        setIsEditableMode(true);
        setTranscriptionStatus('idle');
      }
    }
  }, [transcript, listening, browserSupportsSpeechRecognition]);

  // Resurface Check Engine Controller Lifecycle
  useEffect(() => {
    if (meta.onboarded) {
      const currentCalendarDayString = new Date().toDateString();
      const eligibleResurfaceWin = wins.find(w => w.resurface && new Date(w.resurface).toDateString() === currentCalendarDayString);
      if (eligibleResurfaceWin) {
        setTimeout(() => {
          routeToSpecificScreen(eligibleResurfaceWin.id, 'home');
          displayToast('A win resurfaced for you ✦');
        }, 1000);
      }
    }
  }, []);

  // --- Business Logic Calculations Engine ---
  const calculateStatisticalDashboardData = () => {
    const historicalLookbackLimit = new Date();
    historicalLookbackLimit.setDate(historicalLookbackLimit.getDate() - 7);
    const localizedWeekWinsCount = wins.filter(w => new Date(w.date) >= historicalLookbackLimit).length;
    
    const baselineDailyTimeTracker = new Date();
    baselineDailyTimeTracker.setHours(0, 0, 0, 0);

    let streakCounter = 0;
    let isGracePeriodActive = false;

    for (let indexOffset = 0; indexOffset < 365; indexOffset++) {
      const computedDayIndex = new Date(baselineDailyTimeTracker);
      computedDayIndex.setDate(computedDayIndex.getDate() - indexOffset);
      const dayHasLoggedVictory = wins.some(w => new Date(w.date).toDateString() === computedDayIndex.toDateString());

      if (dayHasLoggedVictory) {
        streakCounter++;
      } else if (indexOffset === 0) {
        isGracePeriodActive = true;
      } else {
        break;
      }
    }
    return { total: wins.length, streak: streakCounter, week: localizedWeekWinsCount, grace: isGracePeriodActive };
  };

  const appDashboardStatistics = calculateStatisticalDashboardData();

  // --- Navigation & Flow Interface Handlers ---
  const executeScreenTransitionPipeline = (targetScreenName) => {
    setSearchQuery('');
    setFilterTag(null);
    setSearchFilterTag(null);
    setScreen(targetScreenName);
  };

  const completeUserOnboardingProfile = () => {
    const trimmedAccountName = nameInput.trim();
    const runtimeMetaConfiguration = { ...meta, onboarded: true };
    if (trimmedAccountName) runtimeMetaConfiguration.name = trimmedAccountName;
    setMeta(runtimeMetaConfiguration);

    if (!wins.length) {
      const introductorySeedVictory = [{
        id: 'sample_' + Date.now(),
        text: lookupString('sample_win'),
        date: new Date().toISOString(),
        resurface: null,
        tag: null,
        sample: true
      }];
      setWins(introductorySeedVictory);
    }
    setScreen('home');
  };

  // --- Core Speech Analytics Engine Controllers ---
  const executeUnifiedVoiceInputToggle = () => {
    isRecording ? terminateVoiceRecordingCycle() : initialVoiceRecordingCycle();
  };

  const initialVoiceRecordingCycle = async () => {
    setSpeechError('');
    triggerHapticFeedback(30);
    setLiveText('');
    setTextInputBox('');
    setSelectedTag(null);
    setIsEditableMode(false);
    setIsRecording(true);
    setTranscriptionStatus('listening');

    if (browserSupportsSpeechRecognition) {
      resetTranscript();
      speechFallbackTimerRef.current = setTimeout(() => {
        if (isRecording && !transcript.trim()) {
          setSpeechError('No speech detected — try speaking louder');
        }
      }, 7000);
      try {
        SpeechRecognition.startListening({ continuous: true, interimResults: true, language: lang === 'hi' ? 'hi-IN' : 'en-IN' });
      } catch (e) {
        setSpeechError('Voice recognition failed to start — refresh and try again');
        setIsRecording(false);
      }
      return;
    }

    if (window.MediaRecorder) {
      try {
        const structuralMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        recordingStreamSourceRef.current = structuralMediaStream;
        const localizedMediaRecorder = new MediaRecorder(structuralMediaStream);
        
        audioStreamRef.current = [];
        localizedMediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) audioStreamRef.current.push(e.data);
        };

        localizedMediaRecorder.onerror = () => {
          setSpeechError('Recording error — try again');
          terminateVoiceRecordingCycle();
        };

        mediaRecorderRef.current = localizedMediaRecorder;
        localizedMediaRecorder.start(1000);
      } catch (err) {
        setIsRecording(false);
        const generatedErrorMessage = err.name === 'NotAllowedError' ? 'Microphone permission denied — tap Allow when asked' :
                                      err.name === 'NotFoundError' ? 'No microphone found on this device' :
                                      'Could not start recording — try refreshing the page';
        setSpeechError(generatedErrorMessage);
      }
    } else {
      setSpeechError('Voice not supported — use the text box below');
      setIsRecording(false);
    }
  };

  const terminateVoiceRecordingCycle = () => {
    setIsRecording(false);
    if (speechFallbackTimerRef.current) clearTimeout(speechFallbackTimerRef.current);
    triggerHapticFeedback(20);

    if (browserSupportsSpeechRecognition && listening) {
      try {
        SpeechRecognition.stopListening();
      } catch (e) { /* Fail-safe stop */ }
      if (liveText.trim()) {
        setIsEditableMode(true);
      }
      setTranscriptionStatus('idle');
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      setTranscriptionStatus('transcribing');
      mediaRecorderRef.current.onstop = async () => {
        if (recordingStreamSourceRef.current) {
          recordingStreamSourceRef.current.getTracks().forEach(track => track.stop());
          recordingStreamSourceRef.current = null;
        }
        await executeAudioBase64TranscriptionPipeline();
      };
      mediaRecorderRef.current.stop();
    } else {
      if (liveText.trim()) {
        setIsEditableMode(true);
        setTranscriptionStatus('idle');
      }
    }
  };

  const executeAudioBase64TranscriptionPipeline = async () => {
    if (!audioStreamRef.current.length) {
      setTranscriptionStatus('idle');
      setSpeechError('No audio captured — hold button while speaking');
      return;
    }
    const internalActiveMimeType = mediaRecorderRef.current?.mimeType || audioStreamRef.current[0]?.type || 'audio/webm';
    const computedFileExtension = internalActiveMimeType.includes('mp4') || internalActiveMimeType.includes('m4a') ? 'm4a' : 
                                   internalActiveMimeType.includes('ogg') ? 'ogg' : 'webm';
    const localizedAudioPayloadBlob = new Blob(audioStreamRef.current, { type: internalActiveMimeType });

    if (localizedAudioPayloadBlob.size < 2000) {
      setTranscriptionStatus('idle');
      setSpeechError('Recording too short — speak for at least 1 second');
      audioStreamRef.current = [];
      return;
    }

    try {
      const audioBase64String = await new Promise((resolve, reject) => {
        const fileReaderInstance = new FileReader();
        fileReaderInstance.onload = () => resolve(fileReaderInstance.result.split(',')[1]);
        fileReaderInstance.onerror = reject;
        fileReaderInstance.readAsDataURL(localizedAudioPayloadBlob);
      });

      displayToast(`Sending ${Math.round(localizedAudioPayloadBlob.size / 1024)}kb to Deepgram…`);

      const networkRequestStream = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio: audioBase64String,
          mimeType: internalActiveMimeType,
          ext: computedFileExtension,
          prompt: 'Personal wins journal. Victories and achievements. May include Hindi, English or Hinglish words.'
        })
      });

      if (!networkRequestStream.ok) {
        const structuralErrorPayload = await networkRequestStream.json().catch(() => ({}));
        throw new Error(
          networkRequestStream.status === 401 ? 'Invalid API key — check Vercel environment variables' :
          networkRequestStream.status === 413 ? 'Recording too long — try a shorter clip' :
          structuralErrorPayload.error?.message || `Server error ${networkRequestStream.status}`
        );
      }

      const serializationResponseData = await networkRequestStream.json();
      const parsedOutputText = (serializationResponseData.text || '').trim();
      
      setTranscriptionStatus('idle');
      if (parsedOutputText) {
        setLiveText(parsedOutputText);
        setIsEditableMode(true);
      } else {
        setSpeechError('Nothing detected — speak clearly and try again');
      }
    } catch (err) {
      setTranscriptionStatus('idle');
      const connectionErrorFallbackMessage = err.message === 'Failed to fetch' ? 'Cannot reach server — check internet connection' : err.message;
      setSpeechError(connectionErrorFallbackMessage);
      displayToast('Transcription error: ' + connectionErrorFallbackMessage);
    }
    audioStreamRef.current = [];
  };

  const handleManualTextInputMapping = (incomingValue) => {
    setTextInputBox(incomingValue);
    setLiveText(incomingValue);
  };

  const clearActiveVictoryInputInterface = () => {
    setLiveText('');
    setTextInputBox('');
    setIsRecording(false);
    setSelectedTag(null);
    if (speechFallbackTimerRef.current) clearTimeout(speechFallbackTimerRef.current);
    setSpeechError('');

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (e) { /* Fail-safe */ }
    }
    if (recordingStreamSourceRef.current) {
      recordingStreamSourceRef.current.getTracks().forEach(track => track.stop());
      recordingStreamSourceRef.current = null;
    }
    mediaRecorderRef.current = null;
    audioStreamRef.current = [];
    setIsEditableMode(false);
    setTranscriptionStatus('idle');
    try {
      if (browserSupportsSpeechRecognition) {
        SpeechRecognition.stopListening();
      }
    } catch (e) { /* Isolation catch */ }
  };

  const persistCurrentVictoryToStorage = () => {
    const fullyParsedTextContent = liveText.trim();
    if (!fullyParsedTextContent) return;

    const consolidatedVictoryModel = {
      id: Date.now().toString(),
      text: fullyParsedTextContent,
      date: new Date().toISOString(),
      resurface: null,
      tag: selectedTag
    };

    setWins(prevVictories => [consolidatedVictoryModel, ...prevVictories]);
    triggerHapticFeedback(60);
    const assignedVictoryId = consolidatedVictoryModel.id;
    clearActiveVictoryInputInterface();
    displayToast('Victory stacked ✦');

    setTimeout(() => {
      setSelectedWinId(assignedVictoryId);
      setPreviousScreenTracker('home');
      setShowShareNudge(true);
    }, 400);
  };

  // --- Dynamic Reminders Data Mechanics ---
  const toggleVictorySmartResurfacing = () => {
    if (!selectedWinId) return;
    const modifiedWinsList = [...wins];
    const targetModelIndex = modifiedWinsList.findIndex(w => w.id === selectedWinId);
    if (targetModelIndex < 0) return;

    if (modifiedWinsList[targetModelIndex].resurface) {
      modifiedWinsList[targetModelIndex].resurface = null;
      setWins(modifiedWinsList);
      displayToast('Resurface removed');
    } else {
      const randomlyGeneratedIntervalDays = [7, 10, 14, 21][Math.floor(Math.random() * 4)];
      const targetFutureResurfaceDate = new Date();
      targetFutureResurfaceDate.setDate(targetFutureResurfaceDate.getDate() + randomlyGeneratedIntervalDays);
      modifiedWinsList[targetModelIndex].resurface = targetFutureResurfaceDate.toISOString();
      setWins(modifiedWinsList);
      displayToast(`Will return in ${randomlyGeneratedIntervalDays} days`);
    }
  };

  const deleteTargetVictoryModelRecord = () => {
    if (!selectedWinId) return;
    const synchronizedFilteredWins = wins.filter(w => w.id !== selectedWinId);
    setWins(synchronizedFilteredWins);
    setActiveOverlays(prev => ({ ...prev, delete: false }));
    displayToast('Victory removed');
    executeScreenTransitionPipeline(previousScreenTracker);
  };

  const clearCompleteJournalDatabase = () => {
    setWins([]);
    setActiveOverlays(prev => ({ ...prev, clearAll: false }));
    displayToast('All victories cleared');
  };

  // --- Core Application Custom State Screen Routers ---
  const routeToSpecificScreen = (victoryIdentifier, operationalSourceScreen) => {
    setSelectedWinId(victoryIdentifier);
    setPreviousScreenTracker(operationalSourceScreen);
    executeScreenTransitionPipeline('detail');
  };

  const adjustInlineVictoryTagMapping = (computedTagIdentifier) => {
    if (!selectedWinId) return;
    const localizedModifiableWins = [...wins];
    const searchTargetIndex = localizedModifiableWins.findIndex(w => w.id === selectedWinId);
    if (searchTargetIndex < 0) return;

    localizedModifiableWins[searchTargetIndex].tag = computedTagIdentifier;
    setWins(localizedModifiableWins);
    triggerHapticFeedback(20);
    displayToast(computedTagIdentifier ? `Tagged as ${computedTagIdentifier}` : 'Tag removed');
  };

  const generateAntiSpiralProofData = () => {
    let internalRuntimeTrackingIds = [...usedSpiralIds];
    if (!wins.length) {
      setSpiralWin({
        text: lookupString('empty_spiral'),
        details: '',
        anchor: lookupString('anchors')[0]
      });
      return;
    }
    if (internalRuntimeTrackingIds.length >= wins.length) {
      internalRuntimeTrackingIds = [];
    }
    const processingPool = wins.filter(w => !internalRuntimeTrackingIds.includes(w.id));
    const chosenContextWin = processingPool[Math.floor(Math.random() * processingPool.length)];
    internalRuntimeTrackingIds.push(chosenContextWin.id);
    setUsedSpiralIds(internalRuntimeTrackingIds);

    setSpiralWin({
      text: chosenContextWin.text,
      details: (chosenContextWin.tag ? chosenContextWin.tag + ' · ' : '') + getExtendedLongDateRepresentation(chosenContextWin.date),
      anchor: lookupString('anchors')[Math.floor(Math.random() * lookupString('anchors').length)]
    });
  };

  const triggerAntiSpiralWorkflowMode = () => {
    setUsedSpiralIds([]);
    executeScreenTransitionPipeline('spiral');
    setTimeout(() => {
      generateAntiSpiralProofData();
    }, 50);
  };

  // --- HTML5 Rendering Engine Generation Modules ---
  const designSocialSharePosterGraph = (targetVictoryInstance) => {
    const rawDesignCanvas = nativeCanvasRef.current;
    if (!rawDesignCanvas) return;
    const renderingContext2D = rawDesignCanvas.getContext('2d');
    const squareResolutionBounds = 1080;

    rawDesignCanvas.width = squareResolutionBounds;
    rawDesignCanvas.height = squareResolutionBounds;

    renderingContext2D.fillStyle = '#0C0C10';
    renderingContext2D.fillRect(0, 0, squareResolutionBounds, squareResolutionBounds);

    const computationalRadialGradient = renderingContext2D.createRadialGradient(
      squareResolutionBounds * 0.35, squareResolutionBounds * 0.25, 0,
      squareResolutionBounds * 0.35, squareResolutionBounds * 0.25, squareResolutionBounds * 0.7
    );
    computationalRadialGradient.addColorStop(0, 'rgba(196,162,120,0.07)');
    computationalRadialGradient.addColorStop(1, 'transparent');
    renderingContext2D.fillStyle = computationalRadialGradient;
    renderingContext2D.fillRect(0, 0, squareResolutionBounds, squareResolutionBounds);

    renderingContext2D.strokeStyle = 'rgba(196,162,120,0.25)';
    renderingContext2D.lineWidth = 1.5;
    drawRoundedBoundingBoxEdge(renderingContext2D, 40, 40, squareResolutionBounds - 80, squareResolutionBounds - 80, 40);
    renderingContext2D.stroke();

    const linearGlowBoundaryEffect = renderingContext2D.createLinearGradient(120, 0, squareResolutionBounds - 120, 0);
    linearGlowBoundaryEffect.addColorStop(0, 'transparent');
    linearGlowBoundaryEffect.addColorStop(0.4, 'rgba(196,162,120,0.5)');
    linearGlowBoundaryEffect.addColorStop(0.6, 'rgba(196,162,120,0.5)');
    linearGlowBoundaryEffect.addColorStop(1, 'transparent');
    renderingContext2D.strokeStyle = linearGlowBoundaryEffect;
    renderingContext2D.lineWidth = 1;
    renderingContext2D.beginPath();
    renderingContext2D.moveTo(120, 40);
    renderingContext2D.lineTo(squareResolutionBounds - 120, 40);
    renderingContext2D.stroke();

    renderingContext2D.fillStyle = 'rgba(196,162,120,0.07)';
    renderingContext2D.font = '380px Georgia,serif';
    renderingContext2D.textAlign = 'left';
    renderingContext2D.fillText('"', 70, 380);

    let variableFontMeasurementScale = 72;
    let computedTextLinesArray = mapStringTokensIntoTextLines(renderingContext2D, targetVictoryInstance.text, squareResolutionBounds - 200, `italic ${variableFontMeasurementScale}px Georgia,serif`);
    
    while (computedTextLinesArray.length > 6 && variableFontMeasurementScale > 32) {
      variableFontMeasurementScale -= 4;
      computedTextLinesArray = mapStringTokensIntoTextLines(renderingContext2D, targetVictoryInstance.text, squareResolutionBounds - 200, `italic ${variableFontMeasurementScale}px Georgia,serif`);
    }

    const balancedVerticalTextHeightOffset = Math.max(180, (squareResolutionBounds - computedTextLinesArray.length * (variableFontMeasurementScale + 20)) / 2);
    renderingContext2D.font = `italic ${variableFontMeasurementScale}px Georgia,serif`;
    renderingContext2D.fillStyle = '#EDE8E0';
    renderingContext2D.textAlign = 'left';
    
    computedTextLinesArray.forEach((currentLineItem, textLineIndex) => {
      renderingContext2D.fillText(currentLineItem, 100, balancedVerticalTextHeightOffset + textLineIndex * (variableFontMeasurementScale + 20));
    });

    if (targetVictoryInstance.tag) {
      renderingContext2D.font = '300 22px monospace';
      renderingContext2D.fillStyle = 'rgba(196,162,120,0.5)';
      renderingContext2D.textAlign = 'left';
      renderingContext2D.fillText(targetVictoryInstance.tag.toUpperCase(), 100, squareResolutionBounds - 160);
    }

    renderingContext2D.font = '300 22px monospace';
    renderingContext2D.fillStyle = 'rgba(237,232,224,0.3)';
    renderingContext2D.textAlign = 'left';
    renderingContext2D.fillText(getExtendedLongDateRepresentation(targetVictoryInstance.date).toUpperCase(), 100, squareResolutionBounds - 130);

    renderingContext2D.font = '300 22px monospace';
    renderingContext2D.fillStyle = 'rgba(196,162,120,0.5)';
    renderingContext2D.textAlign = 'right';
    renderingContext2D.fillText('VICTORY JOURNAL', squareResolutionBounds - 80, squareResolutionBounds - 130);

    renderingContext2D.font = '28px serif';
    renderingContext2D.fillStyle = 'rgba(196,162,120,0.6)';
    renderingContext2D.fillText('✦', squareResolutionBounds - 76, squareResolutionBounds - 158);

    rawDesignCanvas.toBlob(generatedBlobData => {
      setShareImageBlob(generatedBlobData);
      setShareCanvasPreviewUrl(rawDesignCanvas.toDataURL());
    }, 'image/png');
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

  const mapStringTokensIntoTextLines = (ctx, textString, totalWidthBound, cssFontSpecString) => {
    ctx.font = cssFontSpecString;
    const separateWordTokens = textString.split(' ');
    const calculatedLinesCollection = [];
    let processingLineBuffer = '';

    separateWordTokens.forEach(wordToken => {
      const theoreticalLineCombination = processingLineBuffer ? processingLineBuffer + ' ' + wordToken : wordToken;
      if (ctx.measureText(theoreticalLineCombination).width > totalWidthBound && processingLineBuffer) {
        calculatedLinesCollection.push(processingLineBuffer);
        processingLineBuffer = wordToken;
      } else {
        processingLineBuffer = theoreticalLineCombination;
      }
    });
    if (processingLineBuffer) calculatedLinesCollection.push(processingLineBuffer);
    return calculatedLinesCollection;
  };

  const triggerNativePlatformShareInterface = async () => {
    if (!shareImageBlob || !navigator.share) return;
    try {
      const shareableFileContainer = new File([shareImageBlob], 'victory.png', { type: 'image/png' });
      await navigator.share({
        files: [shareableFileContainer],
        title: 'My Victory',
        text: 'From my Victory Journal'
      });
    } catch (e) { /* Execution interruption guard */ }
  };

  const localDeviceImageDownloadAction = () => {
    if (!shareImageBlob) return;
    const pseudoDownloadAnchor = document.createElement('a');
    pseudoDownloadAnchor.href = URL.createObjectURL(shareImageBlob);
    pseudoDownloadAnchor.download = `victory-${Date.now()}.png`;
    pseudoDownloadAnchor.click();
    displayToast('Image saved ✦');
  };

  const triggerModalOverlayActivation = (targetOverlayKey, stateStatus) => {
    if (targetOverlayKey === 'share' && stateStatus) {
      const lookupObjectData = wins.find(w => w.id === selectedWinId);
      if (lookupObjectData) designSocialSharePosterGraph(lookupObjectData);
    }
    setActiveOverlays(prevOverlaysState => ({ ...prevOverlaysState, [targetOverlayKey]: stateStatus }));
  };

  // --- Native Systems Data Backups & Restorations ---
  const handleFileSystemBackupExport = () => {
    const backupStructuredModel = { exported: new Date().toISOString(), meta: meta, wins: wins };
    const simulatedDataPayloadBlob = new Blob([JSON.stringify(backupStructuredModel, null, 2)], { type: 'application/json' });
    const downloadExecutionAnchor = document.createElement('a');
    downloadExecutionAnchor.href = URL.createObjectURL(simulatedDataPayloadBlob);
    downloadExecutionAnchor.download = `victory-journal-${new Date().toLocaleDateString('en-US').replace(/\//g, '-')}.json`;
    downloadExecutionAnchor.click();
    displayToast('Exported successfully');
  };

  const handleFileSystemBackupImport = (eventTargetReference) => {
    const chosenBackupFile = eventTargetReference.files[0];
    if (!chosenBackupFile) return;
    const fileReaderEngine = new FileReader();
    
    fileReaderEngine.onload = (executionEvent) => {
      try {
        const structuralImportedPayload = JSON.parse(executionEvent.target.result);
        const processingVictoriesCollection = structuralImportedPayload.wins || (Array.isArray(structuralImportedPayload) ? structuralImportedPayload : []);
        
        if (!processingVictoriesCollection.length) {
          displayToast('No victories found in file');
          return;
        }
        
        const existingVictoriesCollection = [...wins];
        const uniqueKeysMap = new Set(existingVictoriesCollection.map(w => w.id));
        const filteredNewVictories = processingVictoriesCollection.filter(w => !uniqueKeysMap.has(w.id));
        
        const outputSortedWins = [...existingVictoriesCollection, ...filteredNewVictories].sort((a, b) => new Date(b.date) - new Date(a.date));
        setWins(outputSortedWins);

        if (structuralImportedPayload.meta?.name && !meta.name) {
          setMeta(prev => ({ ...prev, name: structuralImportedPayload.meta.name }));
          setNameInput(structuralImportedPayload.meta.name);
        }
        displayToast(`Imported ${filteredNewVictories.length} victories`);
      } catch (err) {
        displayToast('Could not read file');
      }
    };
    fileReaderEngine.readAsText(chosenBackupFile);
    eventTargetReference.value = '';
  };

  // --- Localization String Helper Engines ---
  const renderFormattedTimelineHeaderString = () => {
    const activeHourIndex = new Date().getHours();
    if (activeHourIndex < 12) return lookupString('greeting_morning');
    if (activeHourIndex < 17) return lookupString('greeting_afternoon');
    if (activeHourIndex < 21) return lookupString('greeting_evening');
    return lookupString('greeting_night');
  };

  const getRelativeTimelineStringRepresentation = (isoTimestampString) => {
    const inputDateTimeObject = new Date(isoTimestampString);
    const comparisonDateTimeObject = new Date();
    const cumulativeDayDifference = Math.floor((comparisonDateTimeObject - inputDateTimeObject) / 86400000);

    if (cumulativeDayDifference === 0) {
      return 'Today · ' + inputDateTimeObject.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    if (cumulativeDayDifference === 1) return 'Yesterday';
    if (cumulativeDayDifference < 7) return `${cumulativeDayDifference} days ago`;
    
    return inputDateTimeObject.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getExtendedLongDateRepresentation = (isoTimestampString) => {
    return new Date(isoTimestampString).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  // --- Timeline Component Engine Blocks ---
  const processTimelineCalendarRenderingEngine = () => {
    const calendarYearBound = currentCalendarDate.getFullYear();
    const calendarMonthBound = currentCalendarDate.getMonth();
    const currentDayExecutionTracker = new Date();

    const historicalMonthActivityMatrix = {};
    wins.forEach(winObject => {
      const parsedWinDate = new Date(winObject.date);
      if (parsedWinDate.getFullYear() === calendarYearBound && parsedWinDate.getMonth() === calendarMonthBound) {
        const matrixDayKey = parsedWinDate.getDate();
        historicalMonthActivityMatrix[matrixDayKey] = (historicalMonthActivityMatrix[matrixDayKey] || 0) + 1;
      }
    });

    const indexFirstWeekDayOfMonth = new Date(calendarYearBound, calendarMonthBound, 1).getDay();
    const totalAggregatedDaysInMonth = new Date(calendarYearBound, calendarMonthBound + 1, 0).getDate();

    const calendarStructuralElementsGrid = [];

    // Header Day Mapping Loop
    lookupString('days').forEach((dayLabel, index) => {
      calendarStructuralElementsGrid.push(
        <div key={`header-label-${index}`} className="cal-dname">{dayLabel}</div>
      );
    });

    // Padding Grid Offset Loop
    for (let emptyCellIndex = 0; emptyCellIndex < indexFirstWeekDayOfMonth; emptyCellIndex++) {
      calendarStructuralElementsGrid.push(<div key={`empty-cell-${emptyCellIndex}`} className="cc"></div>);
    }

    // Dynamic Calendar Grid Engine Day Builder
    for (let monthDayIteration = 1; monthDayIteration <= totalAggregatedDaysInMonth; monthDayIteration++) {
      const matchIsToday = currentDayExecutionTracker.getFullYear() === calendarYearBound && 
                           currentDayExecutionTracker.getMonth() === calendarMonthBound && 
                           currentDayExecutionTracker.getDate() === monthDayIteration;
                           
      const loggedDayVictoriesCount = historicalMonthActivityMatrix[monthDayIteration] || 0;
      const thermalHeatmapTierClass = loggedDayVictoriesCount === 0 ? '' : 
                                      loggedDayVictoriesCount === 1 ? 'w1' : 
                                      loggedDayVictoriesCount === 2 ? 'w2' : 
                                      loggedDayVictoriesCount === 3 ? 'w3' : 'w4';

      const aggregateBadgeDisplayElement = loggedDayVictoriesCount > 1 ? <span className="cbadge">{loggedDayVictoriesCount}</span> : '';
      const compoundDynamicClassString = ['cc', matchIsToday ? 'today' : '', loggedDayVictoriesCount > 0 ? 'hw' : '', thermalHeatmapTierClass].filter(Boolean).join(' ');

      const executeTargetDayRouteAction = () => {
        if (loggedDayVictoriesCount === 0) return;
        const localizedFilteredDayWins = wins.filter(w => {
          const d = new Date(w.date);
          return d.getFullYear() === calendarYearBound && d.getMonth() === calendarMonthBound && d.getDate() === monthDayIteration;
        });
        
        if (localizedFilteredDayWins.length === 1) {
          routeToSpecificScreen(localizedFilteredDayWins[0].id, 'calendar');
        } else {
          setTargetDayData({
            year: calendarYearBound,
            month: calendarMonthBound,
            day: monthDayIteration,
            dayWins: localizedFilteredDayWins
          });
          executeScreenTransitionPipeline('day');
        }
      };

      calendarStructuralElementsGrid.push(
        <div key={`calendar-day-${monthDayIteration}`} className={compoundDynamicClassString} onClick={executeTargetDayRouteAction}>
          {aggregateBadgeDisplayElement}
          {monthDayIteration}
        </div>
      );
    }
    return calendarStructuralElementsGrid;
  };

  const handleMonthStepNavigation = (directionalOffsetIndex) => {
    const updatedTargetCalendarDate = new Date(currentCalendarDate);
    updatedTargetCalendarDate.setMonth(updatedTargetCalendarDate.getMonth() + directionalOffsetIndex);
    setCurrentCalendarDate(updatedTargetCalendarDate);
  };

  // --- Dynamic Live Text Highlighting Filter Engine ---
  const handleQueryRegexHighlighting = (targetTextPhrase, searchKeywordToken) => {
    if (!searchKeywordToken.trim()) return targetTextPhrase;
    const extractionRegularExpression = new RegExp('(' + searchKeywordToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return targetTextPhrase.replace(extractionRegularExpression, '<mark style="background:rgba(196,162,120,.25);color:var(--gt);border-radius:3px;padding:0 2px">$1</mark>');
  };

  // --- Dynamic Filtering & Text Sub-selection Precomputations ---
  const activeDashboardFilteredWins = wins.filter(w => !filterTag || w.tag === filterTag).slice(0, 8);
  
  const activeSearchFilteredWins = wins.filter(w => {
    const dynamicTagFilterConstraint = !searchFilterTag || w.tag === searchFilterTag;
    const dynamicQueryConstraint = !searchQuery.trim() || w.text.toLowerCase().includes(searchQuery.toLowerCase());
    return dynamicTagFilterConstraint && dynamicQueryConstraint;
  });

  const activeMonthTimelineWins = wins.filter(w => {
    const d = new Date(w.date);
    return d.getFullYear() === currentCalendarDate.getFullYear() && d.getMonth() === currentCalendarDate.getMonth();
  });

  return (
    <div id="app">

      {/* ═══ ONBOARDING SCREEN 1 ═══ */}
      <div className={`scr ${screen === 'ob1' ? 'on' : ''}`} id="s-ob1">
        <div className="ob">
          <div className="ob-logo">Victory Journal</div>
          <div className="ob-title">Your wins<br />are <em>evidence.</em></div>
          <div className="ob-body">Every time something works — big or small — you record it.<br /><br />Over time, you build <strong>your own proof</strong> that you're capable. When doubt arrives, you read your own record — not a stranger's story.</div>
          <div className="ob-cta">
            <button className="btn bp" onClick={() => executeScreenTransitionPipeline('ob2')}>Begin &nbsp;→</button>
          </div>
          <div className="ob-orn">✦</div>
        </div>
      </div>

      {/* ═══ ONBOARDING SCREEN 2 ═══ */}
      <div className={`scr ${screen === 'ob2' ? 'on' : ''}`} id="s-ob2">
        <div className="ob">
          <div className="ob-logo">Victory Journal</div>
          <div className="ob-title" style={{ fontSize: '28px', marginBottom: '14px' }}>What should<br />we call you?</div>
          <div className="ob-body" style={{ marginBottom: '30px' }}>Your journal knows your name.</div>
          <input 
            className="ob-inp" 
            id="ni" 
            type="text" 
            placeholder="Your name…" 
            maxLength={32} 
            autoComplete="off" 
            spellCheck="false"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && completeUserOnboardingProfile()}
          />
          <div className="ob-cta">
            <button className="btn bp" onClick={completeUserOnboardingProfile}>Open my journal &nbsp;✦</button>
            <button className="ob-skip" onClick={completeUserOnboardingProfile}>Skip</button>
          </div>
          <div className="ob-orn" style={{ fontSize: '90px', opacity: '.04' }}>✦</div>
        </div>
      </div>

      {/* ═══ SYSTEM HOME DASHBOARD ═══ */}
      <div className={`scr ${screen === 'home' ? 'on' : ''}`} id="s-home">
        <div className="pp">
          <div className="hdr">
            <div>
              <div className="h-greet" id="hg">{renderFormattedTimelineHeaderString()}</div>
              <div className="h-name" id="hn">
                {meta.name ? <span><em>{meta.name}.</em></span> : <span>Your <em>journal.</em></span>}
              </div>
            </div>
            <div className="cog" onClick={() => executeScreenTransitionPipeline('settings')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2.5" stroke="#EDE8E0" strokeOpacity=".45" strokeWidth="1.2" />
                <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.4 3.4l.85.85M11.75 11.75l.85.85M3.4 12.6l.85-.85M11.75 4.25l.85-.85" stroke="#EDE8E0" strokeOpacity=".45" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="stats">
            <div className="sc"><div className="sn" id="st">{appDashboardStatistics.total}</div><div className="sl2">{lookupString('stat_victories')}</div></div>
            <div className="sdv"></div>
            <div className="sc"><div className="sn" id="ss">{appDashboardStatistics.streak}</div><div className="sl2">{lookupString('stat_streak')}</div></div>
            <div className="sdv"></div>
            <div className="sc"><div className="sn" id="sw">{appDashboardStatistics.week}</div><div className="sl2">{lookupString('stat_week')}</div></div>
          </div>
          
          {appDashboardStatistics.grace && appDashboardStatistics.streak > 0 && (
            <div className="grace-note" id="gn">{lookupString('grace')}</div>
          )}

          {/* Browser Unsupported Speech Notification Fallback */}
          {!hasVoiceSupport && (
            <div className="unbar" id="ub" style={{ display: 'block' }}>Voice recording isn't supported here. Type your win below.</div>
          )}

          {/* Core Recording Trigger Engine */}
          {hasVoiceSupport && (
            <div className="rsec" id="rsec">
              <div className={`ra ${isRecording ? 'rec' : ''}`} id="ra" onClick={executeUnifiedVoiceInputToggle}>
                <div className="ro">
                  <div className="rc">
                    <svg className="ms" width="28" height="28" viewBox="0 0 28 28" fill="none">
                      {isRecording && window.MediaRecorder ? (
                        <rect x="8" y="8" width="12" height="12" rx="2" fill="#C4A278" />
                      ) : (
                        <>
                          <rect x="8.5" y="2" width="11" height="17" rx="5.5" stroke="#C4A278" strokeWidth="1.25"/>
                          <path d="M4 13.5C4 19.023 8.477 23.5 14 23.5S24 19.023 24 13.5" stroke="#C4A278" strokeWidth="1.25" strokeLinecap="round"/>
                          <line x1="14" y1="23.5" x2="14" y2="26.5" stroke="#C4A278" strokeWidth="1.25" strokeLinecap="round"/>
                          <line x1="10" y1="26.5" x2="18" y2="26.5" stroke="#C4A278" strokeWidth="1.25" strokeLinecap="round"/>
                        </>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
              <div className={`rstat ${isRecording || transcriptionStatus === 'transcribing' ? 'ir' : ''}`} id="rst">
                <div className="rdot"></div>
                <div className="rlbl" id="rec-lbl">
                  {transcriptionStatus === 'transcribing' ? lookupString('transcribing') : lookupString('recording')}
                </div>
                {!isRecording && transcriptionStatus !== 'transcribing' && <div className="thint" id="tap-hint-txt">{lookupString('tap_hint')}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
                <div id="mode-badge" style={{ fontFamily: 'var(--sm)', fontSize: '9px', letterSpacing: '.12em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '20px', background: 'var(--bgr)', border: '.5px solid var(--ln)', color: 'var(--i3)' }}>
                  {speechEngineMode}
                </div>
              </div>
              <div id="lang-hint" style={{ fontFamily: 'var(--sm)', fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(116,102,120,0.45)', textAlign: 'center', marginTop: '6px' }}>
                Speak in any language &nbsp;·&nbsp; किसी भी भाषा में बोलें
              </div>
              <div className={`speech-err ${speechError ? 'vis' : ''}`} id="serr">{speechError}</div>
            </div>
          )}

          {/* Direct Manual Typing Input Sandbox Area */}
          {(!isRecording && !liveText && !hasVoiceSupport) && (
            <textarea 
              id="tb" 
              className="tbox" 
              style={{ display: 'block' }}
              placeholder="Write your win here…" 
              value={textInputBox}
              onInput={(e) => handleManualTextInputMapping(e.target.value)}
            ></textarea>
          )}

          {/* Custom Processing Transcriptions Waveforms Stream Card */}
          {(isRecording || liveText || transcriptionStatus === 'transcribing') && (
            <div className="lcard vis" id="lc">
              <div className="lcard-lbl" id="lcard-lbl">
                {isRecording ? lookupString('recording') : transcriptionStatus === 'transcribing' ? lookupString('transcribing') : 'Tap to edit if needed ✦'}
              </div>
              
              {isRecording && window.MediaRecorder && (
                <div className="waveform-wrap vis" id="waveform">
                  <div className="wv-bar"></div><div className="wv-bar"></div><div className="wv-bar"></div>
                  <div className="wv-bar"></div><div className="wv-bar"></div><div className="wv-bar"></div>
                  <div className="wv-bar"></div><div className="wv-bar"></div><div className="wv-bar"></div>
                </div>
              )}

              {transcriptionStatus === 'transcribing' && (
                <div className="proc-state vis" id="proc-state">
                  <div className="proc-ring"></div>
                  <div className="proc-lbl">Transcribing with Whisper…</div>
                </div>
              )}

              {/* Dynamic Live Subtext Switcher Element Block */}
              {!isEditableMode ? (
                <div className="ltxt" id="lt" style={{ display: transcriptionStatus === 'transcribing' ? 'none' : '' }}>
                  {liveText ? liveText : <span className="lph">{lookupString('speak_ph')}</span>}
                </div>
              ) : (
                <textarea 
                  id="lt-ta" 
                  style={{ display: 'block', width: '100%', minHeight: '72px', background: 'none', border: 'none', borderBottom: '.5px solid rgba(196,162,120,.35)', color: 'var(--ink)', fontFamily: 'var(--sf)', fontSize: '18px', fontStyle: 'italic', lineHeight: '1.65', resize: 'none', outline: 'none', paddingBottom: '6px', caretColor: 'var(--g)' }} 
                  value={liveText}
                  onChange={(e) => setLiveText(e.target.value)}
                  placeholder="Edit your win…"
                />
              )}
              
              {isEditableMode && (
                <div id="lcard-edit-hint" style={{ display: 'block', fontFamily: 'var(--sm)', fontSize: '9px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(196,162,120,0.5)', marginTop: '10px' }}>
                  {lookupString('edit_hint')}
                </div>
              )}
            </div>
          )}

          {/* Dynamic Target Selected Saving Categorization Workflow Wrappers */}
          {!isRecording && liveText && (
            <div className="tag-select-wrap vis" id="tsw">
              <div className="tag-select-lbl">{lookupString('tag_lbl')}</div>
              <div className="tag-strip" id="tag-sel-strip">
                {TAGS.map(tagItem => (
                  <div 
                    key={`save-tag-${tagItem}`} 
                    className={`tag-pill ${selectedTag === tagItem ? 'sel' : ''}`}
                    onClick={() => setSelectedTag(selectedTag === tagItem ? null : tagItem)}
                  >
                    {tagItem}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isRecording && liveText && (
            <div className="crow vis" id="cr">
              <button className="btn bg2" onClick={clearActiveVictoryInputInterface}>{lookupString('discard')}</button>
              <button className="btn bp" onClick={persistCurrentVictoryToStorage}>{lookupString('stack')}</button>
            </div>
          )}

          {/* Post Storage Saving Interaction Share Nudge Alerts */}
          <div className={`share-nudge ${showShareNudge ? 'vis' : ''}`} id="snudge" onClick={() => { triggerModalOverlayActivation('share', true); setShowShareNudge(false); }}>
            <span className="share-nudge-txt">{lookupString('share_nudge')}</span>
            <button className="share-nudge-close" onClick={(e) => { e.stopPropagation(); setShowShareNudge(false); }}>×</button>
          </div>

          <button className="strig" onClick={triggerAntiSpiralWorkflowMode}>
            {lookupString('spiral_btn')}
            <span className="strig-sub">{lookupString('spiral_sub')}</span>
          </button>

          {/* Timeline Feed Stream Categorization Modules */}
          <div className="sl" id="recent-label">{lookupString('recent')}</div>
          <div className="tag-strip" id="filter-strip">
            <div className={`tag-pill filter-all ${!filterTag ? 'on' : ''}`} onClick={() => setFilterTag(null)}>All</div>
            {TAGS.map(tagItem => (
              <div 
                key={`filter-home-${tagItem}`} 
                className={`tag-pill ${filterTag === tagItem ? 'on' : ''}`} 
                onClick={() => setFilterTag(tagItem)}
              >
                {tagItem}
              </div>
            ))}
          </div>

          <div id="rl">
            {activeDashboardFilteredWins.length ? (
              activeDashboardFilteredWins.map(winObject => (
                <div key={winObject.id} className="wc" onClick={() => routeToSpecificScreen(winObject.id, 'home')}>
                  <div className="wc-top">
                    <div className="wc-date">{getRelativeTimelineStringRepresentation(winObject.date)}</div>
                    {winObject.tag && <span className="wc-tag">{winObject.tag}</span>}
                  </div>
                  <div className="wc-text">{winObject.text}</div>
                </div>
              ))
            ) : (
              <div className="empty">{lookupString('no_wins_home')}</div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ ARCHIVAL TEXT SEARCH QUERY CONSOLE ═══ */}
      <div className={`scr ${screen === 'search' ? 'on' : ''}`} id="s-search">
        <div className="pp">
          <div className="ey">Victory Journal</div>
          <div className="ptit"><em>Find</em> a win.</div>
          <div className="sbar">
            <svg className="sico" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="7.5" cy="7.5" r="5" stroke="#EDE8E0" strokeOpacity=".3" strokeWidth="1.2"/>
              <path d="M11.5 11.5L15 15" stroke="#EDE8E0" strokeOpacity=".3" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input 
              className="sinp" 
              id="si" 
              type="text" 
              placeholder={lookupString('search_ph')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off" 
              spellCheck="false"
            />
            {searchQuery && <button className="sclr vis" id="sc2" onClick={() => setSearchQuery('')}>×</button>}
          </div>
          
          <div className="tag-strip" id="search-tag-strip">
            <div className={`tag-pill filter-all ${!searchFilterTag ? 'on' : ''}`} onClick={() => setSearchFilterTag(null)}>All</div>
            {TAGS.map(tagItem => (
              <div 
                key={`search-tag-${tagItem}`} 
                className={`tag-pill ${searchFilterTag === tagItem ? 'on' : ''}`} 
                onClick={() => setSearchFilterTag(tagItem)}
              >
                {tagItem}
              </div>
            ))}
          </div>

          <div className="srlbl" id="srl">
            {searchQuery.trim() ? `${activeSearchFilteredWins.length} result${activeSearchFilteredWins.length !== 1 ? 's' : ''}` : `${activeSearchFilteredWins.length} ${activeSearchFilteredWins.length === 1 ? 'victory' : 'victories'}`}
          </div>

          <div id="sr">
            {activeSearchFilteredWins.length ? (
              activeSearchFilteredWins.slice(0, 20).map(winObject => (
                <div key={winObject.id} className="wc" onClick={() => routeToSpecificScreen(winObject.id, 'search')}>
                  <div className="wc-top">
                    <div className="wc-date">{getRelativeTimelineStringRepresentation(winObject.date)}</div>
                    {winObject.tag && <span className="wc-tag">{winObject.tag}</span>}
                  </div>
                  <div 
                    className="wc-text"
                    dangerouslySetInnerHTML={{ __html: handleQueryRegexHighlighting(winObject.text, searchQuery) }}
                  />
                </div>
              ))
            ) : (
              <div className="empty">{lookupString('no_wins_search')}</div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ ARCHIVAL TIMELINE MONTHLY MATRIX ═══ */}
      <div className={`scr ${screen === 'calendar' ? 'on' : ''}`} id="s-calendar">
        <div className="pp">
          <div className="ey">Victory Journal</div>
          <div className="ptit">Your <em>timeline.</em></div>
          <div className="cmr">
            <button className="carr" onClick={() => handleMonthStepNavigation(-1)}>‹</button>
            <div className="cmn" id="cmn">{lookupString('months')[currentCalendarDate.getMonth()]} {currentCalendarDate.getFullYear()}</div>
            <button className="carr" onClick={() => handleMonthStepNavigation(1)}>›</button>
          </div>
          
          <div className="cal-grid" id="cg">
            {processTimelineCalendarRenderingEngine()}
          </div>

          <div className="mwl" id="mwl">
            <span className="mwc">{activeMonthTimelineWins.length}</span> {activeMonthTimelineWins.length === 1 ? lookupString('victory') : lookupString('victories')} — {lookupString('months')[currentCalendarDate.getMonth()]}
          </div>

          <div id="cl">
            {activeMonthTimelineWins.length ? (
              activeMonthTimelineWins.map(winObject => (
                <div key={winObject.id} className="wc" onClick={() => routeToSpecificScreen(winObject.id, 'calendar')}>
                  <div className="wc-top">
                    <div className="wc-date">{getRelativeTimelineStringRepresentation(winObject.date)}</div>
                    {winObject.tag && <span className="wc-tag">{winObject.tag}</span>}
                  </div>
                  <div className="wc-text">{winObject.text}</div>
                </div>
              ))
            ) : (
              <div className="empty" style={{ padding: '24px 0' }}>{lookupString('no_wins_month')}</div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ CALENDAR HOURLY DAY EXPANSION LIST ═══ */}
      <div className={`scr ${screen === 'day' ? 'on' : ''}`} id="s-day">
        <div className="pp">
          <div className="backrow" id="dbkday" onClick={() => executeScreenTransitionPipeline('calendar')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="#EDE8E0" strokeOpacity=".35" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{lookupString('back')}</span>
          </div>
          <div className="ey">Victory Journal</div>
          <div className="day-title" id="day-title">
            {targetDayData.month !== null && `${lookupString('months')[targetDayData.month]} ${targetDayData.day}`}
          </div>
          <div className="day-sub" id="day-sub">{targetDayData.dayWins.length} victories</div>
          <div id="day-list">
            {targetDayData.dayWins.map(winObject => (
              <div key={winObject.id} className="wc" onClick={() => routeToSpecificScreen(winObject.id, 'day')}>
                <div className="wc-top">
                  <div className="wc-date">{getRelativeTimelineStringRepresentation(winObject.date)}</div>
                  {winObject.tag && <span className="wc-tag">{winObject.tag}</span>}
                </div>
                <div className="wc-text">{winObject.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ DETAILED FOCUS DATA RECORD INSPECTOR ═══ */}
      <div className={`scr ${screen === 'detail' ? 'on' : ''}`} id="s-detail">
        {(() => {
          const focusItemModel = wins.find(w => w.id === selectedWinId);
          if (!focusItemModel) return null;
          return (
            <div className="pp">
              <div className="backrow" id="dbk" onClick={() => executeScreenTransitionPipeline(previousScreenTracker)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="#EDE8E0" strokeOpacity=".35" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{lookupString('back')}</span>
              </div>
              <div className="ddate" id="dd">{getExtendedLongDateRepresentation(focusItemModel.date)}</div>
              
              <div className="dtag-row" id="dtag-row" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--sm)', fontSize: '9px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--i3)' }}>Tag</span>
                <div id="dtag-strip" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {TAGS.map(tagItem => (
                    <div 
                      key={`detail-modify-tag-${tagItem}`}
                      className={`tag-pill ${focusItemModel.tag === tagItem ? 'sel' : ''}`} 
                      onClick={() => adjustInlineVictoryTagMapping(tagItem)}
                    >
                      {tagItem}
                    </div>
                  ))}
                  <div className={`tag-pill ${!focusItemModel.tag ? 'sel' : ''}`} onClick={() => adjustInlineVictoryTagMapping(null)} style={{ opacity: 0.5 }}>None</div>
                </div>
              </div>

              <div className="vcard">
                <div className="vorn">"</div>
                <div className="vtxt" id="dt">{focusItemModel.text}</div>
              </div>
              
              <div className="dacts">
                <button className="shrbtn" onClick={() => triggerModalOverlayActivation('share', true)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="11" cy="3" r="1.5" stroke="#D4B48C" strokeWidth="1.1"/>
                    <circle cx="11" cy="11" r="1.5" stroke="#D4B48C" strokeWidth="1.1"/>
                    <circle cx="3" cy="7" r="1.5" stroke="#D4B48C" strokeWidth="1.1"/>
                    <path d="M4.3 6.25l5.2-2.75M4.3 7.75l5.2 2.75" stroke="#D4B48C" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                  Share
                </button>
                <button className={`rsbtn ${focusItemModel.resurface ? 'set' : ''}`} id="rsb" onClick={toggleVictorySmartResurfacing}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7a5 5 0 109.9-1M12 2v4H8" stroke={focusItemModel.resurface ? '#D4B48C' : '#EDE8E0'} strokeOpacity={focusItemModel.resurface ? '1' : '.4'} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {focusItemModel.resurface ? 'Set ✦' : 'Resurface'}
                </button>
              </div>
              <button className="deltrig" onClick={() => triggerModalOverlayActivation('delete', true)}>Delete this victory</button>
            </div>
          );
        })()}
      </div>

      {/* ═══ ANTI-SPIRAL COGNITIVE REFLECTION SUITE ═══ */}
      <div className={`scr ${screen === 'spiral' ? 'on' : ''}`} id="s-spiral">
        <div className="pp">
          <div className="ey">Evidence</div>
          <div className="ptit" style={{ marginBottom: '6px' }}><em>You've done</em><br />hard things.</div>
          <div style={{ fontSize: '13px', color: 'var(--i3)', marginBottom: '28px', lineHeight: '1.7' }}>From your own record. Read it slowly.</div>
          <div className="spvcard">
            <div className="sporn">"</div>
            <div className="sptxt" id="spt">{spiralWin.text}</div>
            <div className="spdt" id="spd">{spiralWin.details}</div>
          </div>
          <div className="anc">
            <div className="anc-lbl">Reflect</div>
            <div className="anc-q" id="aq">{spiralWin.anchor}</div>
          </div>
          <div className="spacts">
            <button className="btn bg2" style={{ width: '100%', justifyContent: 'center' }} onClick={generateAntiSpiralProofData}>Show me another →</button>
            <button className="btn" style={{ width: '100%', justifyContent: 'center', background: 'var(--bgr)', border: '.5px solid var(--ln)', color: 'var(--i2)', fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--ss)' }} onClick={() => executeScreenTransitionPipeline('home')}>I'm grounded — take me back</button>
          </div>
        </div>
      </div>

      {/* ═══ REVEAL APPLICATION DATA PREFERENCE SETTINGS ═══ */}
      <div className={`scr ${screen === 'settings' ? 'on' : ''}`} id="s-settings">
        <div className="pp">
          <div className="backrow" onClick={() => executeScreenTransitionPipeline('home')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="#EDE8E0" strokeOpacity=".35" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{lookupString('back')}</span>
          </div>
          <div className="ptit" style={{ marginBottom: '32px' }}><em>Settings.</em></div>
          
          <div style={{ marginBottom: '28px' }}>
            <div className="sl">Your profile</div>
            <div className="ssr" style={{ cursor: 'default' }}>
              <div>
                <div className="ssr-lbl">Your name</div>
                <div className="ssr-sub">Used in your greeting</div>
              </div>
              <input 
                className="sni" 
                id="sname" 
                type="text" 
                placeholder="Add name…" 
                maxLength={32}
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setMeta(prev => ({ ...prev, name: e.target.value.trim() }));
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <div className="sl" id="s-data-label">{lookupString('settings_data')}</div>
            <div className="ssr" onClick={handleFileSystemBackupExport}>
              <div><div className="ssr-lbl">Export victories</div><div className="ssr-sub">Download as JSON backup</div></div>
              <div className="ssr-r">↓</div>
            </div>
            <div className="ssr" onClick={() => document.getElementById('imp').click()}>
              <div><div className="ssr-lbl">Import victories</div><div className="ssr-sub">Restore from JSON file</div></div>
              <div className="ssr-r">↑</div>
            </div>
            <input type="file" id="imp" accept=".json" style={{ display: 'none' }} onChange={(e) => handleFileSystemBackupImport(e.target)} />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <div className="sl" id="s-lang-label">{lookupString('settings_lang')}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button id="lang-en" onClick={() => setLang('en')} style={{ flex: 1, padding: '13px', borderRadius: 'var(--r)', fontFamily: 'var(--sm)', fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s', border: lang === 'en' ? '5px solid var(--g)' : '.5px solid var(--ln)', background: lang === 'en' ? 'var(--gd)' : 'var(--bgr)', color: lang === 'en' ? 'var(--gt)' : 'var(--i3)' }}>English</button>
              <button id="lang-hi" onClick={() => setLang('hi')} style={{ flex: 1, padding: '13px', borderRadius: 'var(--r)', fontFamily: 'var(--sm)', fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s', border: lang === 'hi' ? '.5px solid var(--g)' : '.5px solid var(--ln)', background: lang === 'hi' ? 'var(--gd)' : 'var(--bgr)', color: lang === 'hi' ? 'var(--gt)' : 'var(--i3)' }}>हिन्दी</button>
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <div className="ssr" onClick={() => triggerModalOverlayActivation('install', true)}>
              <div><div className="ssr-lbl">Add to Home Screen</div><div className="ssr-sub">Works offline, feels native</div></div>
              <div className="ssr-r">→</div>
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <div className="sl" id="s-danger-label">{lookupString('settings_danger')}</div>
            <div className="ssr danger" onClick={() => triggerModalOverlayActivation('clearAll', true)}>
              <div><div className="ssr-lbl">Clear all victories</div><div className="ssr-sub">This cannot be undone</div></div>
              <div className="ssr-r" style={{ color: 'rgba(184,112,112,.6)' }}>×</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px', fontFamily: 'var(--sm)', fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--i3)', lineHeight: 2 }}>
            Victory Journal · v3<br />Your proof library
          </div>
        </div>
      </div>

      {/* ═══ PERSISTENT SYSTEM APPLICATION NAVIGATION FOOTER BAR ═══ */}
      {meta.onboarded && ['home', 'search', 'calendar'].includes(screen) && (
        <div className="nav" id="nav" style={{ display: 'block' }}>
          <div className="navi">
            <button className={`nb ${screen === 'home' ? 'on' : ''}`} id="nb-home" onClick={() => executeScreenTransitionPipeline('home')}>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M2 7L8.5 2 15 7v8.5h-4v-4h-5v4H2V7z" stroke="#C4A278" strokeWidth="1.1" strokeLinejoin="round"/></svg>Home
            </button>
            <button className={`nb ${screen === 'search' ? 'on' : ''}`} id="nb-search" onClick={() => executeScreenTransitionPipeline('search')}>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="7.5" cy="7.5" r="5" stroke="#C4A278" strokeWidth="1.1"/><path d="M11.5 11.5L15 15" stroke="#C4A278" strokeWidth="1.1" strokeLinecap="round"/></svg>Search
            </button>
            <button className={`nb ${screen === 'calendar' ? 'on' : ''}`} id="nb-calendar" onClick={() => executeScreenTransitionPipeline('calendar')}>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><rect x="2" y="3.5" width="13" height="12" rx="2" stroke="#C4A278" strokeWidth="1.1"/><path d="M2 7.5h13M6 2v3M11 2v3" stroke="#C4A278" strokeWidth="1.1" strokeLinecap="round"/><circle cx="6" cy="11" r="1" fill="#C4A278"/><circle cx="8.5" cy="11" r="1" fill="#C4A278"/><circle cx="11" cy="11" r="1" fill="#C4A278"/></svg>Calendar
            </button>
          </div>
        </div>
      )}

      {/* ═══ INTERACTIVE SYSTEM OVERLAYS MODALS FLOW ENGINE ═══ */}
      
      {/* Target Item Elimination Modal */}
      <div className={`ov ${activeOverlays.delete ? 'open' : ''}`} id="ov-del">
        <div className="ovs">
          <div className="ov-hdl"></div>
          <div className="ov-title">Delete this <em>victory?</em></div>
          <div className="ov-body" id="del-body-txt">{lookupString('del_body')}</div>
          <div className="ov-acts">
            <button className="bcancel" id="del-keep-btn" onClick={() => triggerModalOverlayActivation('delete', false)}>{lookupString('del_keep')}</button>
            <button className="bdanger" id="del-remove-btn" onClick={deleteTargetVictoryModelRecord}>{lookupString('del_remove')}</button>
          </div>
        </div>
      </div>

      {/* Journal Reset Confirmation Overlays */}
      <div className={`ov ${activeOverlays.clearAll ? 'open' : ''}`} id="ov-clr">
        <div className="ovs">
          <div className="ov-hdl"></div>
          <div className="ov-title">Clear <em>everything?</em></div>
          <div className="ov-body" id="clr-body-txt">{lookupString('clr_body')}</div>
          <div className="ov-acts">
            <button className="bcancel" id="clr-cancel-btn" onClick={() => triggerModalOverlayActivation('clearAll', false)}>{lookupString('clr_cancel')}</button>
            <button className="bdanger" id="clr-yes-btn" onClick={clearCompleteJournalDatabase}>{lookupString('clr_yes')}</button>
          </div>
        </div>
      </div>

      {/* Meta Social Sharing Engine Poster Generator Overlay */}
      <div className={`ov center ${activeOverlays.share ? 'open' : ''}`} id="ov-share">
        <div className="ovs" style={{ borderRadius: 'var(--rxl)' }}>
          <div className="ov-hdl"></div>
          <div className="ov-title" style={{ marginBottom: '16px' }}>Share your <em>win.</em></div>
          <div className="scwrap" id="scwrap">
            {shareCanvasPreviewUrl && <img src={shareCanvasPreviewUrl} alt="Victory Preview Poster" style={{ width: '100%', borderRadius: '12px', display: 'block' }} />}
          </div>
          <button className="sdl" onClick={localDeviceImageDownloadAction}>Download image</button>
          {navigator.share && <button className="sweb vis" id="swb" onClick={triggerNativePlatformShareInterface}>Share via…</button>}
          <button className="bcancel" style={{ width: '100%', padding: '13px', borderRadius: 'var(--r)', border: '.5px solid var(--ln)' }} onClick={() => triggerModalOverlayActivation('share', false)}>Close</button>
        </div>
      </div>

      {/* Progressive Web App System Native Instructions Overlay */}
      <div className={`ov center ${activeOverlays.install ? 'open' : ''}`} id="ov-install">
        <div className="ovs" style={{ borderRadius: 'var(--rxl)' }}>
          <div className="ov-hdl"></div>
          <div className="ov-title">Install the <em>app.</em></div>
          <div className="ov-body" id="ib" dangerouslySetInnerHTML={{ __html: /iPhone|iPad/.test(navigator.userAgent) ? 'In Safari: tap the <strong>Share button</strong> at the bottom, then <strong>"Add to Home Screen"</strong>.' : /Android/.test(navigator.userAgent) ? 'In Chrome: tap the <strong>three-dot menu</strong>, then <strong>"Add to Home screen"</strong>.' : 'In Chrome or Edge: look for the <strong>install icon (⊕)</strong> in the address bar.' }}></div>
          <button className="bcancel" style={{ width: '100%', padding: '13px', borderRadius: 'var(--r)', border: '.5px solid var(--ln)' }} onClick={() => triggerModalOverlayActivation('install', false)}>Got it</button>
        </div>
      </div>

      {/* Global Application Toast Notifications Center */}
      <div className={`toast ${toastMessage ? 'show' : ''}`} id="toast">{toastMessage}</div>
      
      {/* System Standard Resolution Rendering Canvas Container */}
      <canvas id="sc" ref={nativeCanvasRef} style={{ display: 'none' }}></canvas>

    </div>
  );
}