import React from "react";
import { Box, Flex, Text, Heading, IconButton, VStack, Badge, SimpleGrid } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lookupString, getRelativeTimelineStringRepresentation } from "../utils";

export default function Calendar({
  t, wins, currentCalendarDate,
  onPrevMonth, onNextMonth,
  onViewWin, onViewDay,
}) {
  const {
    colorMode, textPrimary, textSecondary, textTertiary,
    bgBase, cardBgSolid, cardBgHover, borderColor,
    accentBase, accentGrad, accentBg, accentBorder,
    invertText,
    cellEmptyBg, cellEmptyBorder,
    lvl1Bg, lvl1Border, lvl2Bg, lvl2Border, lvl3Bg, lvl3Border,
    calNavBg, calNavBgHover,
    bentoColors, bentoBorders,
  } = t;

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const today = new Date();

  const activityMap = {};
  wins.forEach((w) => {
    const d = new Date(w.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const k = d.getDate();
      activityMap[k] = (activityMap[k] || 0) + 1;
    }
  });

  const firstWeekDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const activeMonthWins = wins.filter((w) => {
    const d = new Date(w.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const calendarCells = [];

  lookupString("days").forEach((day, i) => (
    calendarCells.push(
      <Text key={`hdr-${i}`} textAlign="center" fontSize="xs" fontWeight="semibold" color={textTertiary} py={2} textTransform="uppercase" letterSpacing="widest">
        {day}
      </Text>
    )
  ));

  for (let e = 0; e < firstWeekDay; e++) {
    calendarCells.push(<Box key={`emp-${e}`} aspectRatio="1" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    const count = activityMap[d] || 0;

    let style = { bg: cellEmptyBg, color: textPrimary, border: `1px solid ${cellEmptyBorder}` };
    if (count === 1) style = { bg: lvl1Bg, color: accentBase, border: `1px solid ${lvl1Border}` };
    if (count === 2) style = { bg: lvl2Bg, color: textPrimary, border: `1px solid ${lvl2Border}` };
    if (count === 3) style = { bg: lvl3Bg, color: invertText, fontWeight: "bold", border: `1px solid ${lvl3Border}` };
    if (count > 3) style = { bgGradient: accentGrad, color: invertText, fontWeight: "black", boxShadow: "0 0 20px rgba(0, 230, 153, 0.3)" };

    const handleClick = () => {
      if (count === 0) return;
      const dayWins = wins.filter((w) => {
        const wd = new Date(w.date);
        return wd.getFullYear() === year && wd.getMonth() === month && wd.getDate() === d;
      });
      if (dayWins.length === 1) {
        onViewWin(dayWins[0].id, "calendar");
      } else {
        onViewDay({ year, month, day: d, dayWins });
      }
    };

    calendarCells.push(
      <Flex
        key={`day-${d}`}
        aspectRatio="1" borderRadius="xl" flexDirection="column"
        alignItems="center" justifyContent="center" position="relative"
        fontSize="sm" cursor="pointer"
        transition="all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
        _hover={{ transform: "translateY(-1px)", border: `1px solid ${lvl2Border}` }}
        _active={{ transform: "scale(0.96)" }}
        onClick={handleClick}
        {...style}
        {...(isToday ? { ring: "2", ringColor: accentBase, ringOffset: "2", ringOffsetColor: bgBase } : {})}
      >
        {count > 1 && (
          <Box
            position="absolute" top="-2px" right="-2px"
            fontSize="9px" px={1.5} bg={invertText} color={accentBase}
            borderRadius="full" border={`1px solid ${lvl1Border}`} minW="16px"
            textAlign="center"
          >
            {count}
          </Box>
        )}
        {d}
      </Flex>
    );
  }

  return (
    <Box maxW="md" mx="auto" px={6} pt={12}>
      <VStack align="stretch" spacing={1} mb={6}>
        <Text fontSize="xs" textTransform="uppercase" tracking="widest" color={textTertiary}>
          Victory Journal
        </Text>
        <Heading as="h1" fontSize="3xl" fontFamily="'Outfit', sans-serif" fontWeight="800" tracking="tight">
          Your{" "}
          <Box as="em" fontStyle="italic" fontWeight="normal" color={accentBase}>timeline.</Box>
        </Heading>
      </VStack>

      <Flex
        justify="space-between" align="center" bg={cardBgSolid}
        rounded="2xl" p={2} border={`1px solid ${borderColor}`} mb={6}
      >
        <IconButton
          size="md" variant="unstyled" borderRadius="xl" bg={calNavBg}
          display="flex" alignItems="center" justifyContent="center"
          _hover={{ bg: calNavBgHover }} _active={{ transform: "scale(0.95)" }}
          icon={<ChevronLeft size={20} color={textPrimary} />}
          onClick={onPrevMonth}
        />
        <Text fontSize="sm" fontWeight="bold" textTransform="uppercase" tracking="widest" color={accentBase} fontFamily="body">
          {lookupString("months")[month]} {year}
        </Text>
        <IconButton
          size="md" variant="unstyled" borderRadius="xl" bg={calNavBg}
          display="flex" alignItems="center" justifyContent="center"
          _hover={{ bg: calNavBgHover }} _active={{ transform: "scale(0.95)" }}
          icon={<ChevronRight size={20} color={textPrimary} />}
          onClick={onNextMonth}
        />
      </Flex>

      <SimpleGrid columns={7} spacing={2} mb={6}>
        {calendarCells}
      </SimpleGrid>

      <Text
        fontSize="xs" textTransform="uppercase" tracking="widest" color={textSecondary}
        fontWeight="bold" mb={4} borderTop={`1px solid ${borderColor}`} pt={6}
      >
        <Box as="span" color={accentBase} fontWeight="black" fontSize="sm" fontFamily="body" mr={1}>
          {activeMonthWins.length}
        </Box>
        {activeMonthWins.length === 1 ? lookupString("victory") : lookupString("victories")}{" "}
        — {lookupString("months")[month]}
      </Text>

      <VStack align="stretch" spacing={3}>
        {activeMonthWins.length ? (
          activeMonthWins.map((win, idx) => (
            <Box
              key={win.id} p={4}
              bg={bentoColors[idx % 5]}
              _hover={{ bg: cardBgHover }}
              borderRadius="24px"
              border={`1px solid ${bentoBorders[idx % 5]}`}
              boxShadow="0 4px 12px rgba(0,0,0,0.03)"
              transition="all" cursor="pointer"
              onClick={() => onViewWin(win.id, "calendar")}
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
              <Text fontSize="md" color={textPrimary} fontWeight="light" lineHeight="relaxed" fontFamily="body" fontStyle="italic">
                {win.text}
              </Text>
            </Box>
          ))
        ) : (
          <Text
            textAlign="center" py={8} fontSize="sm" color={textTertiary} fontWeight="light"
            border={`1px dashed ${borderColor}`} borderRadius="2xl"
          >
            {lookupString("no_wins_month")}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
