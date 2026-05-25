import React from "react";
import { Box, Flex, Text, Heading, Button, VStack } from "@chakra-ui/react";
import { Sparkles } from "lucide-react";

export default function Onboarding1({ t, onNext }) {
  const { accentBase, accentBg, accentBorder, accentGrad, accentGradHover, invertText, textSecondary, textPrimary } = t;
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
    >
      <VStack align="stretch" spacing={10} my="auto">
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
          as="h1"
          fontSize={{ base: "4xl", md: "5xl" }}
          fontFamily="'Outfit', sans-serif"
          fontWeight="800"
          tracking="tight"
          lineHeight="tight"
        >
          Your Victories,
          <br />
          <Box as="span" color={accentBase}>
            Remembered.
          </Box>
        </Heading>
        <Text
          color={textSecondary}
          fontSize="md"
          lineHeight="relaxed"
          fontWeight="light"
        >
          Every time something works — big or small — you record it.
          <br />
          <br />
          Over time, you build{" "}
          <strong style={{ fontWeight: 500, color: textPrimary }}>
            your own proof
          </strong>{" "}
          that you're capable. When doubt arrives, you read your own record — not
          a stranger's story.
        </Text>
      </VStack>
      <VStack pt={10} spacing={6}>
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
          transition="all 0.3s"
          boxShadow="0 12px 24px rgba(0,0,0,0.12)"
          _active={{ transform: "scale(0.98)" }}
          onClick={onNext}
        >
          Open my book &nbsp;→
        </Button>
        <Box fontSize="2xl" color={accentBorder}>
          <Sparkles size={20} />
        </Box>
      </VStack>
    </Flex>
  );
}
