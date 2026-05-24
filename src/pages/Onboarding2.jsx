import React from "react";
import { Box, Flex, Text, Heading, Button, Input, VStack } from "@chakra-ui/react";

export default function Onboarding2({ t, nameInput, setNameInput, onComplete }) {
  const {
    accentBase, accentBg, accentBorder, accentGrad, accentGradHover,
    invertText, textPrimary, textSecondary, textTertiary,
    cardBg, cardBgHover, borderColor,
  } = t;

  return (
    <Flex
      maxW="md"
      mx="auto"
      px={6}
      pt="80px"
      pb="40px"
      minH="100vh"
      flexDirection="column"
      justifyContent="space-between"
      position="relative"
    >
      <VStack align="stretch" spacing={8} my="auto" w="full">
        <Text
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          tracking="widest"
          color={accentBase}
          bg={accentBg}
          alignSelf="flex-start"
          px={3.5}
          py={1}
          borderRadius="full"
          border={`1px solid ${accentBorder}`}
        >
          Victory Journal
        </Text>
        <Heading
          as="h2"
          fontSize="3xl"
          fontFamily="'Outfit', sans-serif"
          fontWeight="800"
          tracking="tight"
        >
          What should
          <br />
          we call you?
        </Heading>
        <Text color={textSecondary} fontSize="sm" fontWeight="light">
          Your journal knows your name.
        </Text>
        <Input
          w="full"
          bg={cardBg}
          border={`1px solid ${borderColor}`}
          _focus={{
            borderColor: accentBorder,
            boxShadow: "0 0 12px rgba(0, 230, 153, 0.15)",
            bg: cardBgHover,
          }}
          borderRadius="2xl"
          px={5}
          py={7}
          color={textPrimary}
          placeholder="Your name…"
          _placeholder={{ color: textTertiary }}
          outline="none"
          transition="all 0.3s"
          maxLength={32}
          autoComplete="off"
          spellCheck="false"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onComplete()}
        />
      </VStack>
      <VStack pt={10} spacing={4} w="full">
        <Button
          w="full"
          py={7}
          bgGradient={accentGrad}
          _hover={{
            bgGradient: accentGradHover,
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          }}
          color={invertText}
          fontWeight="bold"
          borderRadius="24px"
          fontSize="16px"
          boxShadow="0 12px 24px rgba(0,0,0,0.12)"
          transition="all 0.3s"
          _active={{ transform: "scale(0.98)" }}
          onClick={onComplete}
        >
          Open my journal &nbsp;✦
        </Button>
        <Button
          variant="unstyled"
          fontSize="xs"
          color={textTertiary}
          _hover={{ color: textSecondary }}
          py={2}
          textTransform="uppercase"
          tracking="widest"
          transition="colors"
          onClick={onComplete}
        >
          Skip
        </Button>
      </VStack>
    </Flex>
  );
}
