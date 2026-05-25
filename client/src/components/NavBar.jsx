import React from "react";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { Home, RefreshCw, Calendar, Search, Mic, Square } from "lucide-react";

export default function NavBar({ t, screen, isRecording, onNavigate, onMicToggle }) {
  const { accentBase, textTertiary, textSecondary, glassBg, colorMode } = t;

  const iconBtn = (label, icon, target) => (
    <IconButton
      aria-label={label}
      icon={icon}
      onClick={() => onNavigate(target)}
      variant="ghost"
      color={screen === target ? accentBase : textTertiary}
      _hover={{ color: screen === target ? accentBase : textSecondary, bg: "transparent" }}
    />
  );

  return (
    <Box
      position="fixed"
      bottom="20px"
      left="50%"
      transform="translateX(-50%)"
      width="calc(100% - 48px)"
      maxW="382px"
      height="68px"
      bg={glassBg}
      backdropFilter="blur(24px)"
      border={colorMode === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.8)"}
      borderRadius="34px"
      boxShadow={colorMode === "dark" ? "0 0 0 1px rgba(0,230,153,0.08), 0 12px 40px rgba(0,0,0,0.4)" : "0 12px 32px rgba(0,0,0,0.08)"}
      zIndex="40"
      display="flex"
      alignItems="center"
      px={4}
    >
      <Flex w="full" justify="space-around" align="center">
        {iconBtn("Home", <Home size={18} />, "home")}
        {iconBtn("Stack", <RefreshCw size={18} />, "stack")}

        {/* Mic */}
        <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
          {isRecording && (
            <>
              <Box className="mic-ripple-1" />
              <Box className="mic-ripple-2" />
            </>
          )}
          <Box
            w="56px" h="56px" borderRadius="full"
            bg={isRecording ? "red.500" : accentBase}
            color="white"
            display="flex" alignItems="center" justifyContent="center"
            shadow={isRecording ? "0 0 24px rgba(229,62,62,0.45)" : "0 8px 20px rgba(0,0,0,0.15)"}
            cursor="pointer" onClick={onMicToggle} border="none"
            transition="background 0.3s ease, box-shadow 0.3s ease"
            style={{ animation: isRecording ? "micPulse 1.2s ease-in-out infinite" : "none" }}
          >
            {isRecording && window.MediaRecorder
              ? <Square size={20} fill="currentColor" stroke="none" />
              : <Mic size={24} />}
          </Box>
        </Box>

        {iconBtn("Calendar", <Calendar size={18} />, "calendar")}
        {iconBtn("Search", <Search size={18} />, "search")}
      </Flex>
    </Box>
  );
}
