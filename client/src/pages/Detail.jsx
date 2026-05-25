import React from "react";
import {
  Box, Flex, Text, Button, IconButton, Input,
  HStack, VStack, Badge, SimpleGrid, Center,
} from "@chakra-ui/react";
import { ChevronLeft, Share2, RefreshCw, Plus, X, Play, Pause } from "lucide-react";
import { lookupString, getExtendedLongDateRepresentation } from "../utils";

export default function Detail({
  t, win, allTags,
  audioRecordings, playingAudioId, onToggleAudio,
  showCustomTagInput, setShowCustomTagInput,
  customTagInput, setCustomTagInput,
  onAddCustomTag, onTagChange,
  onBack, onShare, onResurface, onDelete,
}) {
  if (!win) return null;

  const {
    textPrimary, textSecondary, textTertiary,
    colorMode, cardBgSolid, cardBgHover, borderColor,
    accentBase, accentBg, accentBorder, accentGrad,
    invertText, dangerBg,
    backBtnHover, tagUnselectedBg, quoteMarkColor,
  } = t;

  return (
    <Box maxW="md" mx="auto" px={6} pt={12}>
      <VStack align="stretch" spacing={6}>
        <Flex justify="flex-start">
          <Button
            size="sm" variant="unstyled" display="inline-flex" alignItems="center"
            color={accentBase} _hover={{ color: backBtnHover }} transition="colors"
            leftIcon={<ChevronLeft size={16} />}
            onClick={onBack}
          >
            {lookupString("back")}
          </Button>
        </Flex>

        <Text
          fontSize="xs" textTransform="uppercase" tracking="widest" color={textTertiary}
          fontFamily="body" borderBottom={`1px solid ${borderColor}`} pb={4}
        >
          {getExtendedLongDateRepresentation(win.date)}
        </Text>

        {/* Tag editor */}
        <Box p={4} bg={cardBgSolid} rounded="2xl" border={`1px solid ${borderColor}`}>
          <Text fontSize="10px" textTransform="uppercase" tracking="widest" color={textSecondary} fontWeight="bold" mb={4}>
            Inline Classifier Tag
          </Text>
          <HStack flexWrap="wrap" gap={2} spacing={0}>
            {allTags.map((tag) => (
              <Button
                key={`detail-tag-${tag}`}
                size="xs" px={3} py={3.5} rounded="xl" tracking="wide"
                variant="unset" border="1px solid" transition="all 0.2s"
                bg={win.tag === tag ? accentBase : tagUnselectedBg}
                color={win.tag === tag ? invertText : textSecondary}
                borderColor={win.tag === tag ? accentBase : borderColor}
                _hover={{ borderColor: win.tag === tag ? accentBase : textSecondary }}
                onClick={() => onTagChange(tag)}
              >
                {tag}
              </Button>
            ))}
            <Button
              size="xs" px={3} py={3.5} rounded="xl" variant="unset" border="1px dashed"
              transition="all 0.2s"
              bg={showCustomTagInput ? accentBg : "transparent"}
              color={showCustomTagInput ? accentBase : textTertiary}
              borderColor={showCustomTagInput ? accentBorder : borderColor}
              onClick={() => setShowCustomTagInput((v) => !v)}
            >
              <Plus size={12} />
            </Button>
            <Button
              size="xs" px={3} py={3.5} rounded="xl" tracking="wide"
              variant="unset" border="1px dashed" transition="all"
              borderColor={!win.tag ? "red.400" : borderColor}
              color={!win.tag ? "red.500" : textTertiary}
              bg={!win.tag ? dangerBg : "transparent"}
              onClick={() => onTagChange(null)}
            >
              None
            </Button>
          </HStack>
          {showCustomTagInput && (
            <HStack spacing={2} mt={2}>
              <Input
                size="sm" flex="1" bg={cardBgSolid}
                border={`1px solid ${borderColor}`}
                _focus={{ borderColor: accentBorder, boxShadow: "none" }}
                borderRadius="xl" color={textPrimary} _placeholder={{ color: textTertiary }}
                placeholder="New tag name…" maxLength={20} value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onAddCustomTag(customTagInput);
                  if (e.key === "Escape") { setShowCustomTagInput(false); setCustomTagInput(""); }
                }}
                autoFocus
              />
              <Button size="sm" px={4} bgGradient={accentGrad} color={invertText} borderRadius="xl" fontWeight="bold" onClick={() => onAddCustomTag(customTagInput)}>
                Add
              </Button>
            </HStack>
          )}
        </Box>

        {/* Main text card */}
        <Flex
          p={6}
          bgGradient={colorMode === "dark"
            ? "linear(to-br, rgba(0,230,153,0.08), rgba(56,189,248,0.05))"
            : `linear(to-br, ${cardBgHover}, transparent)`}
          rounded="3xl"
          border={`1px solid ${colorMode === "dark" ? "rgba(0,230,153,0.2)" : borderColor}`}
          shadow={colorMode === "dark" ? "0 0 40px rgba(0,230,153,0.07)" : "xl"}
          minH="160px" flexDirection="column" justifyContent="center" position="relative"
        >
          <Text
            position="absolute" top="2px" left="4px" fontSize="6xl" fontFamily="body"
            pointerEvents="none" userSelect="none" color={quoteMarkColor} lineHeight="none"
          >
            "
          </Text>
          <Text
            fontSize={{ base: "xl", md: "2xl" }} fontFamily="body" fontWeight="light"
            fontStyle="italic" lineHeight="relaxed" color={textPrimary}
            textAlign="center" px={4} position="relative" zIndex="10"
          >
            {win.text}
          </Text>
        </Flex>

        {/* Audio playback */}
        {audioRecordings[win.id] && (
          <Box
            p={4} bg={cardBgSolid} rounded="2xl"
            border={`1px solid ${playingAudioId === win.id ? accentBorder : borderColor}`}
            transition="border-color 0.3s ease"
          >
            <Text
              fontSize="10px" textTransform="uppercase" tracking="widest"
              color={playingAudioId === win.id ? accentBase : textSecondary}
              fontWeight="bold" mb={3} transition="color 0.3s ease"
            >
              Voice Recording
            </Text>
            <HStack spacing={3} align="center">
              <IconButton
                size="sm" borderRadius="full" bg={accentBase} color="white"
                _hover={{ bg: backBtnHover }}
                style={{ animation: playingAudioId === win.id ? "audioGlow 1.5s ease-in-out infinite" : "none" }}
                icon={playingAudioId === win.id ? <Pause size={14} /> : <Play size={14} />}
                onClick={() => onToggleAudio(win.id)}
              />
              {playingAudioId === win.id ? (
                <HStack spacing="3px" h="20px" align="center">
                  {[0, 0.12, 0.24, 0.36, 0.48].map((delay, i) => (
                    <Box key={i} w="3px" h="3px" borderRadius="full" bg={accentBase}
                      style={{ animation: "soundBar 0.7s ease-in-out infinite", animationDelay: `${delay}s` }}
                    />
                  ))}
                  <Text fontSize="xs" color={accentBase} fontWeight="medium" ml={1}>Playing…</Text>
                </HStack>
              ) : (
                <Text fontSize="xs" color={textSecondary} fontWeight="light">Tap to play your voice note</Text>
              )}
            </HStack>
          </Box>
        )}

        {/* Action buttons */}
        <SimpleGrid columns={2} spacing={3}>
          <Button
            py={6} bg={cardBgSolid}
            _hover={{ bg: cardBgHover, color: textPrimary }}
            rounded="xl" border={`1px solid ${borderColor}`}
            fontSize="sm" fontWeight="medium" transition="all" color={accentBase}
            leftIcon={<Share2 size={14} />}
            onClick={onShare}
          >
            Share
          </Button>
          <Button
            py={6} rounded="xl" border="1px solid" fontSize="sm" fontWeight="medium" transition="all"
            leftIcon={<RefreshCw size={14} />}
            bg={win.resurface ? accentBase : cardBgSolid}
            color={win.resurface ? invertText : textSecondary}
            borderColor={win.resurface ? accentBase : borderColor}
            _hover={{ bg: win.resurface ? backBtnHover : cardBgHover }}
            onClick={onResurface}
          >
            {win.resurface ? "Set ✦" : "Resurface"}
          </Button>
        </SimpleGrid>

        <Center pt={8}>
          <Button
            variant="unstyled" fontSize="xs" textTransform="uppercase" tracking="widest"
            color="red.500" opacity="0.6" _hover={{ opacity: 1 }} fontWeight="medium" transition="colors"
            onClick={onDelete}
          >
            Delete this victory
          </Button>
        </Center>
      </VStack>
    </Box>
  );
}
