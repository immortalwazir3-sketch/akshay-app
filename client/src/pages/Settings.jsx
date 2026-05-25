import React from "react";
import {
  Box, Flex, Text, Heading, Button, IconButton,
  Input, VStack, VisuallyHidden,
} from "@chakra-ui/react";
// Input kept for custom-tag inline form
import {
  ChevronLeft, ArrowDown, ArrowUp, Trash2, Plus, X, Moon, Sun,
} from "lucide-react";
import { lookupString } from "../utils";
import { LANGUAGES } from "../constants";

export default function Settings({
  t, meta,
  selectedLanguage, setSelectedLanguage,
  showCustomTagInput, setShowCustomTagInput,
  customTagInput, setCustomTagInput,
  onAddCustomTag, onRemoveCustomTag,
  onExport, onImport, onInstall, onClearAll,
  onBack, toggleColorMode,
}) {
  const {
    colorMode, textPrimary, textSecondary, textTertiary,
    bgBase, cardBgSolid, cardBgHover, borderColor,
    accentBase, accentBg, accentBorder, accentGrad,
    invertText, dangerBg, dangerBorder, dangerHover,
    backBtnHover,
  } = t;

  return (
    <Box maxW="md" mx="auto" px={6} pt={12} pb="140px">
      <Button
        size="sm" variant="unstyled" display="inline-flex" color={accentBase}
        mb={6} _hover={{ color: backBtnHover }} transition="colors"
        leftIcon={<ChevronLeft size={16} />} onClick={onBack}
      >
        <span>{lookupString("back")}</span>
      </Button>

      <Heading as="h1" fontSize="3xl" fontFamily="'Outfit', sans-serif" fontWeight="800" mb={8}>
        Settings.
      </Heading>

      <VStack align="stretch" spacing={6}>

        {/* ── Language ─────────────────────────────────────────────────────── */}
        <VStack align="stretch" spacing={3}>
          <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color={textTertiary} fontWeight="bold">
            Transcription Language
          </Text>
          <Box
            p={4}
            bg={colorMode === "dark" ? "rgba(74,222,128,0.10)" : cardBgSolid}
            rounded="2xl"
            border={`1px solid ${colorMode === "dark" ? "rgba(74,222,128,0.25)" : borderColor}`}
          >
            <Text fontSize="xs" color={textTertiary} mb={3} fontWeight="light">
              Used for voice recording and transcription
            </Text>
            <Flex gap={2} flexWrap="wrap">
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang.code} size="sm" px={3} py={2} fontSize="xs" borderRadius="xl"
                  variant="unset" border="1px solid" transition="all 0.2s"
                  bg={selectedLanguage === lang.code ? accentBase : "transparent"}
                  color={selectedLanguage === lang.code ? invertText : textSecondary}
                  borderColor={selectedLanguage === lang.code ? accentBase : borderColor}
                  _hover={{ borderColor: selectedLanguage === lang.code ? accentBase : accentBorder }}
                  onClick={() => setSelectedLanguage(lang.code)}
                >
                  {lang.label}
                </Button>
              ))}
            </Flex>
          </Box>
        </VStack>

        {/* ── Custom Tags ──────────────────────────────────────────────────── */}
        <VStack align="stretch" spacing={3}>
          <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color={textTertiary} fontWeight="bold">
            Custom Tags
          </Text>
          <Box
            p={4}
            bg={colorMode === "dark" ? "rgba(167,139,250,0.10)" : cardBgSolid}
            rounded="2xl"
            border={`1px solid ${colorMode === "dark" ? "rgba(167,139,250,0.25)" : borderColor}`}
          >
            {(meta.customTags || []).length > 0 && (
              <VStack align="stretch" spacing={2} mb={3}>
                {(meta.customTags || []).map((tag) => (
                  <Flex key={`st-${tag}`} justify="space-between" align="center">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box w="6px" h="6px" borderRadius="full" bg={accentBase} />
                      <Text fontSize="sm" color={textPrimary} fontWeight="medium">{tag}</Text>
                    </Box>
                    <IconButton
                      size="xs" variant="ghost" color={textTertiary}
                      _hover={{ color: "red.500" }} icon={<X size={12} />}
                      onClick={() => onRemoveCustomTag(tag)}
                    />
                  </Flex>
                ))}
              </VStack>
            )}
            {!showCustomTagInput ? (
              <Button
                size="sm" variant="unstyled" color={accentBase} fontSize="xs" fontWeight="medium"
                display="inline-flex" alignItems="center" gap={1} _hover={{ opacity: 0.8 }}
                onClick={() => setShowCustomTagInput(true)}
              >
                <Plus size={12} />&nbsp;Add new tag
              </Button>
            ) : (
              <Box display="flex" gap={2}>
                <Input
                  size="sm" flex="1" bg={bgBase} border={`1px solid ${borderColor}`}
                  _focus={{ borderColor: accentBorder, boxShadow: "none" }}
                  borderRadius="xl" color={textPrimary} _placeholder={{ color: textTertiary }}
                  placeholder="Tag name…" maxLength={20} value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onAddCustomTag(customTagInput);
                    if (e.key === "Escape") { setShowCustomTagInput(false); setCustomTagInput(""); }
                  }}
                  autoFocus
                />
                <Button size="sm" px={4} bgGradient={accentGrad} color={invertText} borderRadius="xl" fontWeight="bold"
                  onClick={() => onAddCustomTag(customTagInput)}>
                  Add
                </Button>
              </Box>
            )}
            {(meta.customTags || []).length === 0 && !showCustomTagInput && (
              <Text fontSize="xs" color={textTertiary} fontWeight="light" mt={1}>No custom tags yet.</Text>
            )}
          </Box>
        </VStack>

        {/* ── Appearance ───────────────────────────────────────────────────── */}
        <VStack align="stretch" spacing={3}>
          <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color={textTertiary} fontWeight="bold">
            Appearance
          </Text>
          <Flex
            p={4}
            bg={colorMode === "dark" ? "rgba(251,191,36,0.10)" : cardBgSolid}
            rounded="2xl"
            border={`1px solid ${colorMode === "dark" ? "rgba(251,191,36,0.25)" : borderColor}`}
            align="center" justifyContent="space-between" cursor="pointer"
            _hover={{ bg: cardBgHover }} onClick={toggleColorMode} transition="colors"
          >
            <Box>
              <Text fontSize="sm" fontWeight="medium">Theme</Text>
              <Text fontSize="xs" color={textTertiary} mt={0.5}>
                Toggle {colorMode === "light" ? "dark" : "light"} mode
              </Text>
            </Box>
            <IconButton
              size="sm" variant="ghost" color={textSecondary}
              icon={colorMode === "light" ? <Moon size={18} /> : <Sun size={18} />}
              onClick={toggleColorMode} aria-label="Toggle Color Mode"
            />
          </Flex>
        </VStack>

        {/* ── Backup ───────────────────────────────────────────────────────── */}
        <VStack align="stretch" spacing={2}>
          <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color={textTertiary} fontWeight="bold">
            Storage & Backup
          </Text>
          <Flex
            p={4}
            bg={colorMode === "dark" ? "rgba(56,189,248,0.10)" : cardBgSolid}
            rounded="2xl"
            border={`1px solid ${colorMode === "dark" ? "rgba(56,189,248,0.25)" : borderColor}`}
            align="center" justifyContent="space-between" cursor="pointer"
            _hover={{ bg: cardBgHover }} transition="colors" onClick={onExport}
          >
            <Box>
              <Text fontSize="sm" fontWeight="medium">Export victories</Text>
              <Text fontSize="xs" color={textTertiary} mt={0.5}>Download as JSON backup</Text>
            </Box>
            <Box color={textTertiary}><ArrowDown size={16} /></Box>
          </Flex>
          <Flex
            p={4}
            bg={colorMode === "dark" ? "rgba(56,189,248,0.10)" : cardBgSolid}
            rounded="2xl"
            border={`1px solid ${colorMode === "dark" ? "rgba(56,189,248,0.25)" : borderColor}`}
            align="center" justifyContent="space-between" cursor="pointer"
            _hover={{ bg: cardBgHover }} transition="colors"
            onClick={() => document.getElementById("imp").click()}
          >
            <Box>
              <Text fontSize="sm" fontWeight="medium">Import victories</Text>
              <Text fontSize="xs" color={textTertiary} mt={0.5}>Restore from JSON file</Text>
            </Box>
            <Box color={textTertiary}><ArrowUp size={16} /></Box>
          </Flex>
          <VisuallyHidden>
            <input type="file" id="imp" accept=".json" onChange={(e) => onImport(e.target)} />
          </VisuallyHidden>
        </VStack>

        {/* ── PWA install ──────────────────────────────────────────────────── */}
        <Flex
          p={4}
          bg={colorMode === "dark" ? "rgba(74,222,128,0.10)" : cardBgSolid}
          rounded="2xl"
          border={`1px solid ${colorMode === "dark" ? "rgba(74,222,128,0.25)" : borderColor}`}
          align="center" justifyContent="space-between" cursor="pointer"
          _hover={{ bg: cardBgHover }} transition="colors" onClick={onInstall}
        >
          <Box>
            <Text fontSize="sm" fontWeight="medium">Add to Home Screen</Text>
            <Text fontSize="xs" color={textTertiary} mt={0.5}>Works offline, feels native</Text>
          </Box>
          <Text fontSize="sm" color={textTertiary}>→</Text>
        </Flex>

        {/* ── Danger zone ──────────────────────────────────────────────────── */}
        <VStack align="stretch" spacing={2} pt={4} borderTop={`1px solid ${borderColor}`}>
          <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color="red.500" opacity="0.8" fontWeight="bold">
            {lookupString("settings_danger")}
          </Text>
          <Flex
            p={4} bg={dangerBg} border={`1px solid ${dangerBorder}`} rounded="2xl"
            align="center" justifyContent="space-between" cursor="pointer"
            _hover={{ bg: dangerHover }} transition="all" onClick={onClearAll}
          >
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="red.500">Clear all victories</Text>
              <Text fontSize="xs" color="red.500" opacity="0.6" mt={0.5}>This cannot be undone</Text>
            </Box>
            <Box color="red.500" opacity="0.6"><Trash2 size={16} /></Box>
          </Flex>
        </VStack>
      </VStack>

      <Text
        textAlign="center" py={12} fontSize="9px" fontFamily="body"
        letterSpacing="widest" color={textTertiary} textTransform="uppercase" lineHeight="relaxed"
      >
        Victory Journal · v3<br />Your proof library
      </Text>
    </Box>
  );
}
