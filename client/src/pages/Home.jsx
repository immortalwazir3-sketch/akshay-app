import React from "react";
import {
  Box, Flex, Text, Heading, Button, IconButton,
  HStack, VStack, Badge, Textarea, Input, SimpleGrid, Portal, Avatar,
} from "@chakra-ui/react";
import { Settings, Info, Plus, X } from "lucide-react";
import {
  lookupString,
  renderFormattedTimelineHeaderString,
  getRelativeTimelineStringRepresentation,
} from "../utils";

export default function Home({
  t,
  user,
  meta,
  wins,
  stats,
  allTags,
  isRecording,
  liveText,
  setLiveText,
  textInputBox,
  handleManualTextInput,
  transcriptionStatus,
  isEditableMode,
  speechError,
  hasVoiceSupport,
  selectedTag,
  setSelectedTag,
  filterTag,
  setFilterTag,
  showCustomTagInput,
  setShowCustomTagInput,
  customTagInput,
  setCustomTagInput,
  showShareNudge,
  setShowShareNudge,
  activeDashboardFilteredWins,
  onClear,
  onSave,
  onAddCustomTag,
  onNavigate,
  onViewWin,
  onSpiral,
  onOpenShare,
}) {
  const {
    colorMode,
    textPrimary,
    textSecondary,
    textTertiary,
    cardBgSolid,
    cardBgHover,
    borderColor,
    borderColorHover,
    accentBase,
    accentGrad,
    accentGradHover,
    accentBg,
    accentBorder,
    invertText,
    dangerBg,
    dangerBorder,
    antiSpiralBg,
    antiSpiralBorder,
    antiSpiralText,
    bentoColors,
    bentoBorders,
  } = t;

  return (
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
            fontFamily="'Outfit', sans-serif"
            fontWeight="800"
            tracking="tight"
          >
            {user?.name ? (
              <span>{user.name}'s Stack</span>
            ) : (
              <span>Your Stack</span>
            )}
          </Heading>
        </Box>
        <Flex gap={2} align="center">
          <IconButton
            p={3}
            bg={cardBgSolid}
            _hover={{ bg: cardBgHover, borderColor: accentBorder }}
            borderRadius="xl"
            transition="all 0.2s"
            border={`1px solid ${borderColor}`}
            icon={<Settings size={18} color={textPrimary} />}
            onClick={() => onNavigate("settings")}
            aria-label="Settings"
          />
          <Box
            as="button"
            onClick={() => onNavigate("profile")}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            bg={cardBgSolid}
            p="6px"
            _hover={{ borderColor: accentBorder, bg: cardBgHover }}
            transition="all 0.2s"
            display="flex"
            alignItems="center"
            justifyContent="center"
            aria-label="Profile"
          >
            <Avatar
              size="xs"
              name={user?.name || user?.email || "?"}
              src={user?.picture || undefined}
              bg={accentBase}
              color={colorMode === "dark" ? "#08090A" : "white"}
              fontWeight="bold"
              w="28px"
              h="28px"
              fontSize="10px"
            />
          </Box>
        </Flex>
      </Flex>

      {/* Stats bento grid */}
      <SimpleGrid columns={2} spacing={3} mb={3}>
        <Box
          p={5}
          bg={colorMode === "light" ? "#e0f2fe" : "rgba(56,189,248,0.18)"}
          borderRadius="28px"
          boxShadow="0 4px 12px rgba(0,0,0,0.04)"
          position="relative"
          overflow="hidden"
          border={`1px solid ${colorMode === "dark" ? "rgba(56,189,248,0.25)" : borderColor}`}
        >
          <Text
            fontSize="36px"
            fontFamily="'Outfit', sans-serif"
            fontWeight="800"
            color={textPrimary}
            lineHeight="1"
            mb={1}
          >
            {stats.total}
          </Text>
          <Text fontSize="13px" fontWeight="600" color={textSecondary}>
            {lookupString("stat_victories")}
          </Text>
          <Box
            position="absolute"
            top="16px"
            right="16px"
            w="32px"
            h="32px"
            bg={
              colorMode === "dark"
                ? "rgba(56,189,248,0.2)"
                : "rgba(255,255,255,0.5)"
            }
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="16px"
          >
            🏆
          </Box>
        </Box>
        <Box
          p={5}
          bg={colorMode === "light" ? "#ffe4e8" : "rgba(251,113,133,0.18)"}
          borderRadius="28px"
          boxShadow="0 4px 12px rgba(0,0,0,0.04)"
          position="relative"
          overflow="hidden"
          border={`1px solid ${colorMode === "dark" ? "rgba(251,113,133,0.25)" : borderColor}`}
        >
          <Text
            fontSize="36px"
            fontFamily="'Outfit', sans-serif"
            fontWeight="800"
            color={textPrimary}
            lineHeight="1"
            mb={1}
          >
            {stats.week}
          </Text>
          <Text fontSize="13px" fontWeight="600" color={textSecondary}>
            {lookupString("stat_week")}
          </Text>
          <Box
            position="absolute"
            top="16px"
            right="16px"
            w="32px"
            h="32px"
            bg={
              colorMode === "dark"
                ? "rgba(251,113,133,0.2)"
                : "rgba(255,255,255,0.5)"
            }
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="16px"
          >
            🔥
          </Box>
        </Box>
      </SimpleGrid>
      <Box
        p={5}
        bg={colorMode === "light" ? "#e9e5ff" : "rgba(167,139,250,0.18)"}
        borderRadius="28px"
        boxShadow="0 4px 12px rgba(0,0,0,0.04)"
        position="relative"
        overflow="hidden"
        mb={5}
        border={`1px solid ${colorMode === "dark" ? "rgba(167,139,250,0.25)" : borderColor}`}
      >
        <Text
          fontSize="36px"
          fontFamily="'Outfit', sans-serif"
          fontWeight="800"
          color={textPrimary}
          lineHeight="1"
          mb={1}
        >
          {stats.streak}
        </Text>
        <Text fontSize="13px" fontWeight="600" color={textSecondary}>
          {lookupString("stat_streak")}
        </Text>
        <Box
          position="absolute"
          top="16px"
          right="16px"
          w="32px"
          h="32px"
          bg={
            colorMode === "dark"
              ? "rgba(167,139,250,0.2)"
              : "rgba(255,255,255,0.5)"
          }
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="16px"
        >
          ⚡
        </Box>
      </Box>

      {stats.grace && stats.streak > 0 && (
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
          onInput={(e) => handleManualTextInput(e.target.value)}
        />
      )}

      {(isRecording || liveText) && (
        <VStack
          align="stretch"
          bg={
            isRecording
              ? colorMode === "light"
                ? "#ffe4e8"
                : "rgba(251,113,133,0.15)"
              : colorMode === "light"
                ? "#e9e5ff"
                : "rgba(167,139,250,0.15)"
          }
          backdropFilter="blur(10px)"
          borderRadius="28px"
          p={5}
          border={`1px solid ${borderColor}`}
          boxShadow="0 12px 32px rgba(0,0,0,0.06)"
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
            {isRecording ? lookupString("recording") : "Tap to edit if needed ✦"}
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

          {!isEditableMode ? (
            <Text
              fontSize="lg"
              fontFamily="body"
              fontWeight="light"
              fontStyle="italic"
              lineHeight="relaxed"
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
              fontFamily="body"
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
              fontFamily="body"
            >
              {lookupString("edit_hint")}
            </Text>
          )}
        </VStack>
      )}

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
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {allTags.map((tag) => (
              <Button
                key={`save-tag-${tag}`}
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
                bg={selectedTag === tag ? accentBase : "transparent"}
                color={selectedTag === tag ? invertText : textSecondary}
                borderColor={selectedTag === tag ? accentBase : borderColor}
                _hover={{
                  borderColor:
                    selectedTag === tag ? accentBase : borderColorHover,
                }}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
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
              borderColor={showCustomTagInput ? accentBorder : borderColor}
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
                  if (e.key === "Enter") onAddCustomTag(customTagInput);
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
                onClick={() => onAddCustomTag(customTagInput)}
              >
                Add
              </Button>
            </HStack>
          )}
        </VStack>
      )}

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
            borderRadius="20px"
            onClick={onClear}
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
            borderRadius="20px"
            boxShadow="0 8px 20px rgba(0,0,0,0.15)"
            onClick={onSave}
          >
            {lookupString("stack")}
          </Button>
        </SimpleGrid>
      )}

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
            onOpenShare();
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
        onClick={onSpiral}
      >
        <Text
          fontSize="sm"
          fontFamily="body"
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
            flexShrink={0}
            bg={!filterTag ? textPrimary : cardBgSolid}
            color={!filterTag ? t.bgBase : textSecondary}
            borderColor={!filterTag ? textPrimary : borderColor}
            fontWeight={!filterTag ? "bold" : "normal"}
            onClick={() => setFilterTag(null)}
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={`filter-home-${tag}`}
              size="xs"
              px={4}
              py={4}
              borderRadius="lg"
              variant="unset"
              border="1px solid"
              whiteSpace="nowrap"
              transition="all"
              flexShrink={0}
              bg={filterTag === tag ? textPrimary : cardBgSolid}
              color={filterTag === tag ? t.bgBase : textSecondary}
              borderColor={filterTag === tag ? textPrimary : borderColor}
              fontWeight={filterTag === tag ? "bold" : "normal"}
              onClick={() => setFilterTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </Flex>

        <VStack align="stretch" spacing={3} pt={2}>
          {activeDashboardFilteredWins.length ? (
            activeDashboardFilteredWins.map((win, idx) => (
              <Box
                key={win.id}
                p={4}
                bg={bentoColors[idx % 5]}
                _hover={{ bg: cardBgHover, borderColor: accentBorder }}
                borderRadius="24px"
                border={`1px solid ${bentoBorders[idx % 5]}`}
                transition="all 0.2s"
                cursor="pointer"
                boxShadow="0 4px 12px rgba(0,0,0,0.03)"
                _active={{ transform: "scale(0.99)" }}
                onClick={() => onViewWin(win.id, "home")}
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <Text
                    fontSize="10px"
                    fontFamily="body"
                    tracking="wider"
                    color={textTertiary}
                  >
                    {getRelativeTimelineStringRepresentation(win.date)}
                  </Text>
                  {win.tag && (
                    <Badge
                      fontSize="9px"
                      fontFamily="body"
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
                      {win.tag}
                    </Badge>
                  )}
                </Flex>
                <Text
                  fontSize="md"
                  color={textPrimary}
                  fontWeight="light"
                  lineHeight="relaxed"
                  noOfLines={3}
                  fontFamily="body"
                  fontStyle="italic"
                >
                  {win.text}
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
  );
}
