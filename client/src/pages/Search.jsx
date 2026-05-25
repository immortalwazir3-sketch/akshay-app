import React from "react";
import { Box, Flex, Text, Heading, Button, IconButton, Input, VStack, Badge } from "@chakra-ui/react";
import { Search as SearchIcon, X } from "lucide-react";
import { lookupString, getRelativeTimelineStringRepresentation } from "../utils";

export default function Search({
  t, wins, allTags,
  searchQuery, setSearchQuery,
  searchFilterTag, setSearchFilterTag,
  activeSearchFilteredWins,
  onViewWin,
}) {
  const {
    colorMode, textPrimary, textSecondary, textTertiary,
    cardBgSolid, cardBgHover, borderColor,
    accentBase, accentBg, accentBorder,
    invertText, bentoColors, bentoBorders,
  } = t;

  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    const re = new RegExp("(" + query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    return text.replace(
      re,
      `<mark style="background:${colorMode === "dark" ? "rgba(0,230,153,.2)" : "rgba(0,179,119,.3)"};color:${textPrimary};border-radius:4px;padding:0 3px">$1</mark>`,
    );
  };

  return (
    <Box maxW="md" mx="auto" px={6} pt={12}>
      <VStack align="stretch" spacing={1} mb={6}>
        <Text fontSize="xs" textTransform="uppercase" tracking="widest" color={textTertiary}>
          Victory Journal
        </Text>
        <Heading as="h1" fontSize="3xl" fontFamily="'Outfit', sans-serif" fontWeight="800" tracking="tight">
          Find a{" "}
          <Box as="em" fontStyle="italic" fontWeight="normal" color={accentBase}>win.</Box>
        </Heading>
      </VStack>

      <Flex
        align="center" bg={cardBgSolid} rounded="2xl"
        border={`1px solid ${borderColor}`} px={4} py={1} mb={4}
        _focusWithin={{ borderColor: accentBorder }} transition="all 0.2s"
      >
        <Box color={textTertiary} mr={3}><SearchIcon size={18} /></Box>
        <Input
          w="full" bg="transparent" border="none" color={textPrimary}
          _placeholder={{ color: textTertiary }} outline="none" _focus={{ boxShadow: "none" }}
          fontSize="md" fontWeight="light" py={4} px={0}
          placeholder={lookupString("search_ph")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off" spellCheck="false"
        />
        {searchQuery && (
          <IconButton
            size="sm" variant="unstyled" fontSize="lg" color={textTertiary}
            _hover={{ color: textPrimary }} ml={2} icon={<X size={18} />}
            onClick={() => setSearchQuery("")}
          />
        )}
      </Flex>

      <Flex
        gap={2} wrap={{ base: "nowrap", md: "wrap" }}
        overflowX={{ base: "auto", md: "visible" }} pb={4} mb={4}
        borderBottom={`1px solid ${borderColor}`}
        sx={{ "&::-webkit-scrollbar": { display: "none" }, msOverflowStyle: "none", scrollbarWidth: "none" }}
      >
        <Button
          size="xs" px={4} py={4} borderRadius="lg" variant="unset" border="1px solid" transition="all" flexShrink={0}
          bg={!searchFilterTag ? accentBase : cardBgSolid}
          color={!searchFilterTag ? invertText : textSecondary}
          borderColor={!searchFilterTag ? accentBase : borderColor}
          fontWeight={!searchFilterTag ? "bold" : "normal"}
          onClick={() => setSearchFilterTag(null)}
        >
          All
        </Button>
        {allTags.map((tag) => (
          <Button
            key={`search-tag-${tag}`}
            size="xs" px={4} py={4} borderRadius="lg" variant="unset" border="1px solid"
            whiteSpace="nowrap" flexShrink={0} transition="all"
            bg={searchFilterTag === tag ? accentBase : cardBgSolid}
            color={searchFilterTag === tag ? invertText : textSecondary}
            borderColor={searchFilterTag === tag ? accentBase : borderColor}
            fontWeight={searchFilterTag === tag ? "bold" : "normal"}
            onClick={() => setSearchFilterTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </Flex>

      <Text fontSize="xs" color={textSecondary} tracking="wider" mb={4} fontFamily="body">
        {searchQuery.trim()
          ? `${activeSearchFilteredWins.length} result${activeSearchFilteredWins.length !== 1 ? "s" : ""}`
          : `${activeSearchFilteredWins.length} ${activeSearchFilteredWins.length === 1 ? "victory" : "victories"}`}
      </Text>

      <VStack align="stretch" spacing={3}>
        {activeSearchFilteredWins.length ? (
          activeSearchFilteredWins.slice(0, 20).map((win, idx) => (
            <Box
              key={win.id} p={4}
              bg={bentoColors[idx % 5]}
              _hover={{ bg: cardBgHover }}
              borderRadius="24px"
              border={`1px solid ${bentoBorders[idx % 5]}`}
              boxShadow="0 4px 12px rgba(0,0,0,0.03)"
              transition="all" cursor="pointer"
              onClick={() => onViewWin(win.id, "search")}
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="10px" fontFamily="body" tracking="wider" color={textTertiary}>
                  {getRelativeTimelineStringRepresentation(win.date)}
                </Text>
                {win.tag && (
                  <Badge
                    fontSize="9px" fontFamily="body" bg={accentBg} color={accentBase}
                    px={2.5} py={0.5} borderRadius="md" border={`1px solid ${accentBorder}`}
                    textTransform="uppercase" tracking="wider" variant="unset"
                  >
                    {win.tag}
                  </Badge>
                )}
              </Flex>
              <Text
                fontSize="md" color={textPrimary} fontWeight="light" lineHeight="relaxed"
                fontFamily="body" fontStyle="italic"
                dangerouslySetInnerHTML={{ __html: highlightText(win.text, searchQuery) }}
              />
            </Box>
          ))
        ) : (
          <Text
            textAlign="center" py={12} fontSize="sm" color={textTertiary} fontWeight="light"
            border={`1px dashed ${borderColor}`} borderRadius="2xl"
          >
            {lookupString("no_wins_search")}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
