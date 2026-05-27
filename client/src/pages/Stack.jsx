import React, { useRef, useEffect } from "react";
import { Box, Text, Heading, Button } from "@chakra-ui/react";
import { TEM } from "../constants";

export default function Stack({ t, wins, onViewWin }) {
  const { textPrimary, textSecondary, textTertiary, accentBase, accentGrad, accentGradHover, invertText } = t;

  const drumRef = useRef(null);
  const bsceneRef = useRef(null);
  const drumAngle = useRef(0);
  const stackRafRef = useRef(null);
  const autoSpinRafRef = useRef(null);
  const isAutoSpinning = useRef(false);
  const dragStateRef = useRef({ active: false, startX: 0, startAngle: 0 });
  const spinStateRef = useRef("idle");
  const [spinState, setSpinState] = React.useState("idle");

  const escHtml = (str) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const buildCylinder = (winsData) => {
    const drum = drumRef.current;
    const scene = bsceneRef.current;
    if (!drum) return;

    const sceneW = scene ? scene.offsetWidth : 340;
    const cardW = Math.min(64, Math.max(48, Math.round(sceneW * 0.17)));
    const cardH = Math.min(248, Math.max(180, Math.round(sceneW * 0.65)));
    const radius = Math.min(155, Math.max(100, Math.round((sceneW - cardW) * 0.42)));
    if (scene) scene.style.height = `${cardH + 112}px`;

    drum.innerHTML = "";
    const sorted = [...winsData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
    const slots = Math.max(24, sorted.length * 3);
    const step = 360 / Math.max(1, slots);

    for (let i = 0; i < slots; i++) {
      const pageIndex = Math.floor(i / 3);
      const w = i % 3 === 0 ? sorted[pageIndex] || { tag: null, text: "" } : { tag: null, text: "" };
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
          <div class="bpg-ttl">${escHtml(w.text.slice(0, 30))}...</div>
        </div>`;
      drum.appendChild(pg);
    }
  };

  const updateFrontCard = () => {
    const drum = drumRef.current;
    if (!drum) return;
    const pages = [...drum.querySelectorAll(".bpg")];
    if (!pages.length) return;
    let frontIndex = 0;
    let smallestDist = Infinity;
    pages.forEach((page, index) => {
      const match = page.style.transform.match(/rotateY\(([-\d.]+)deg\)/);
      const angle = match ? Number(match[1]) : 0;
      const rel = (((angle + drumAngle.current) % 360) + 360) % 360;
      const dist = Math.min(rel, 360 - rel);
      page.style.opacity = `${Math.max(0.1, 1 - dist / 120)}`;
      page.style.filter = `saturate(${Math.max(0.72, 1 - dist / 360)})`;
      if (dist < smallestDist) { smallestDist = dist; frontIndex = index; }
    });
    pages.forEach((page, index) => page.classList.toggle("elv", index === frontIndex));
  };

  const startAutoSpin = () => {
    if (isAutoSpinning.current) return;
    isAutoSpinning.current = true;
    const loop = () => {
      if (!isAutoSpinning.current) return;
      drumAngle.current += 0.28;
      if (drumRef.current) drumRef.current.style.transform = `rotateY(${drumAngle.current}deg)`;
      updateFrontCard();
      autoSpinRafRef.current = requestAnimationFrame(loop);
    };
    autoSpinRafRef.current = requestAnimationFrame(loop);
  };

  const stopAutoSpin = () => {
    isAutoSpinning.current = false;
    if (autoSpinRafRef.current) { cancelAnimationFrame(autoSpinRafRef.current); autoSpinRafRef.current = null; }
  };

  const triggerSpin = () => {
    if (!wins.length || spinStateRef.current === "spinning") return;
    stopAutoSpin();
    const sorted = [...wins].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
    const randomIndex = Math.floor(Math.random() * sorted.length);
    const targetWin = sorted[randomIndex];
    const slots = Math.max(24, sorted.length * 3);
    const step = 360 / slots;
    const pageAngle = randomIndex * 3 * step;
    const current = drumAngle.current;
    const targetRemainder = ((-pageAngle % 360) + 360) % 360;
    const currentRemainder = ((current % 360) + 360) % 360;
    let delta = targetRemainder - currentRemainder;
    if (delta < 0) delta += 360;
    const targetAngle = current + delta + 6 * 360;

    spinStateRef.current = "spinning";
    setSpinState("spinning");

    const duration = 3500;
    const startAngle = current;
    const startTime = performance.now();

    const animate = (timestamp) => {
      const t = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      drumAngle.current = startAngle + (targetAngle - startAngle) * eased;
      if (drumRef.current) drumRef.current.style.transform = `rotateY(${drumAngle.current}deg)`;
      updateFrontCard();
      if (t < 1) {
        stackRafRef.current = requestAnimationFrame(animate);
      } else {
        drumAngle.current = targetAngle;
        stackRafRef.current = null;
        setTimeout(() => {
          onViewWin(targetWin.id, "stack");
          spinStateRef.current = "idle";
          setSpinState("idle");
          startAutoSpin();
        }, 600);
      }
    };
    if (stackRafRef.current) cancelAnimationFrame(stackRafRef.current);
    stackRafRef.current = requestAnimationFrame(animate);
  };

  const handlePointerDown = (clientX) => {
    if (spinStateRef.current === "spinning") return;
    stopAutoSpin();
    if (stackRafRef.current) { cancelAnimationFrame(stackRafRef.current); stackRafRef.current = null; }
    dragStateRef.current = { active: true, startX: clientX, startAngle: drumAngle.current };
  };

  const handlePointerMove = (clientX) => {
    if (!dragStateRef.current.active) return;
    drumAngle.current = dragStateRef.current.startAngle + (clientX - dragStateRef.current.startX) * 0.5;
    if (drumRef.current) drumRef.current.style.transform = `rotateY(${drumAngle.current}deg)`;
    updateFrontCard();
  };

  const handlePointerUp = () => {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    startAutoSpin();
  };

  useEffect(() => {
    buildCylinder(wins);
    spinStateRef.current = "idle";
    setSpinState("idle");
    startAutoSpin();
    const onResize = () => buildCylinder(wins);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      stopAutoSpin();
      if (stackRafRef.current) { cancelAnimationFrame(stackRafRef.current); stackRafRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wins]);

  return (
    <Box maxW="md" mx="auto" px={{ base: 4, md: 6 }} pt={{ base: 8, md: 12 }} textAlign="center">
      <Heading mb={1} fontFamily="'Outfit', sans-serif" fontWeight="800" fontSize={{ base: "2xl", md: "3xl" }}>
        Victory Stack
      </Heading>
      <Text color={textSecondary} fontSize="sm" mb={{ base: 3, md: 5 }}>
        Spin to rediscover a random win.
      </Text>

      <Box
        className="bscene"
        ref={bsceneRef}
        cursor={spinState === "spinning" ? "default" : "grab"}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
      >
        <Box className="bdrum" ref={drumRef} />
      </Box>

      {wins.length > 0 && (
        <Text fontSize="9px" color={textTertiary} fontFamily="body" textTransform="uppercase" letterSpacing="widest" mt={1} mb={3}>
          Drag to explore · Tap spin to discover
        </Text>
      )}

      {!wins.length ? (
        <Text fontSize="sm" color={textTertiary} mt={6}>
          Record your first victory to bring the stack to life.
        </Text>
      ) : (
        <Button
          w={{ base: "full", md: "auto" }} px={10} py={7}
          bgGradient={accentGrad}
          _hover={{ bgGradient: accentGradHover, boxShadow: "0 0 20px rgba(0,0,0,0.15)" }}
          color={invertText} fontWeight="bold" borderRadius="30px" fontSize="md"
          isLoading={spinState === "spinning"} loadingText="Spinning…"
          transition="all 0.2s" boxShadow="0 10px 24px rgba(0,0,0,0.15)"
          _active={{ transform: "scale(0.97)" }}
          onClick={triggerSpin}
        >
          Spin ✦
        </Button>
      )}
    </Box>
  );
}
