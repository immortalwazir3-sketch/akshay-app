import React from "react";
import { Box, Flex, Text, Heading, Button, VStack, Badge } from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";
import { lookupString, getRelativeTimelineStringRepresentation } from "../utils";

export default function Day({ t, targetDayData, onBack, onViewWin }) {
  const {
    textPrimary, textSecondary, textTertiary,
    cardBgHover, borderColor,
    accentBase, accentBg, accentBorder,
    backBtnHover, bentoColors, bentoBorders,
  } = t;

  return (
    <Box maxW="md" mx="auto" px={6} pt={12}>
      <Button
        size="sm" variant="unstyled" display="inline-flex" alignItems="center"
        color={accentBase} mb={6} _hover={{ color: backBtnHover }} transition="colors"
        leftIcon={<ChevronLeft size={16} />}
        onClick={onBack}
      >
        {lookupString("back")}
      </Button>

      <VStack align="stretch" spacing={1} mb={8}>
        <Text fontSize="xs" textTransform="uppercase" tracking="widest" color={textTertiary}>
          Victory Journal
        </Text>
        <Heading as="h1" fontSize="3xl" fontFamily="body" fontWeight="light" tracking="tight" color={textPrimary}>
          {targetDayData.month !== null &&
            `${lookupString("months")[targetDayData.month]} ${targetDayData.day}`}
        </Heading>
        <Text fontSize="sm" fontFamily="body" color={accentBase} fontWeight="bold">
          {targetDayData.dayWins.length} victories
        </Text>
      </VStack>

      <VStack align="stretch" spacing={3}>
        {targetDayData.dayWins.map((win, idx) => (
          <Box
            key={win.id} p={4}
            bg={bentoColors[idx % 5]}
            _hover={{ bg: cardBgHover }}
            borderRadius="2xl"
            border={`1px solid ${bentoBorders[idx % 5]}`}
            transition="all" cursor="pointer"
            onClick={() => onViewWin(win.id, "day")}
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
        ))}
      </VStack>
    </Box>
  );
}
