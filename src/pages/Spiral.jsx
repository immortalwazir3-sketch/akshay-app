import React from "react";
import { Box, Flex, Text, Heading, Button, VStack } from "@chakra-ui/react";
import { lookupString } from "../utils";

export default function Spiral({ t, spiralWin, onNext, onBack }) {
  const {
    textPrimary, textSecondary, textTertiary,
    cardBgSolid, cardBgHover, borderColor,
    accentBase,
    spiralEvidenceBg, spiralEvidenceBorder,
  } = t;

  return (
    <Flex maxW="md" mx="auto" px={6} pt={12} minH="100vh" flexDirection="column" justifyContent="space-between">
      <VStack align="stretch" spacing={8} my="auto" w="full">
        <Box>
          <Text fontSize="xs" textTransform="uppercase" tracking="widest" color={accentBase} fontWeight="bold" mb={1}>
            Evidence
          </Text>
          <Heading as="h1" fontSize="3xl" fontFamily="'Outfit', sans-serif" fontWeight="800" tracking="tight" color={textPrimary}>
            You've done
            <br />
            <Box as="em" fontStyle="italic" fontWeight="normal" color={accentBase}>hard things.</Box>
          </Heading>
          <Text color={textTertiary} fontSize="xs" mt={2} fontWeight="light">
            From your own record. Read it slowly.
          </Text>
        </Box>

        <VStack
          p={6} bgGradient={spiralEvidenceBg} rounded="3xl"
          border="1px solid" borderColor={spiralEvidenceBorder}
          shadow="2xl" minH="140px" justify="center" align="stretch"
        >
          <Text
            fontSize="xl" fontFamily="body" fontWeight="light" fontStyle="italic"
            lineHeight="relaxed" color={textPrimary} textAlign="center" mb={4}
          >
            "{spiralWin.text}"
          </Text>
          <Text
            textAlign="center" fontSize="10px" fontFamily="body" textTransform="uppercase"
            tracking="widest" color={accentBase} fontWeight="bold"
          >
            {spiralWin.details}
          </Text>
        </VStack>

        <VStack
          align="stretch" p={5} bg={cardBgSolid} rounded="2xl"
          border={`1px solid ${borderColor}`} spacing={2}
        >
          <Text fontSize="10px" textTransform="uppercase" tracking="widest" color={accentBase} fontWeight="bold">
            Reflect
          </Text>
          <Text fontSize="sm" fontWeight="light" color={textSecondary} lineHeight="relaxed" fontFamily="body" fontStyle="italic">
            {spiralWin.anchor}
          </Text>
        </VStack>
      </VStack>

      <VStack pt={10} spacing={3} w="full">
        <Button
          w="full" py={7} bg={cardBgSolid} _hover={{ bg: cardBgHover }}
          border={`1px solid ${borderColor}`} rounded="2xl"
          fontSize="sm" fontWeight="medium" transition="all"
          onClick={onNext}
        >
          Show me another →
        </Button>
        <Button
          variant="unstyled" w="full" py={3} fontSize="xs" textTransform="uppercase"
          tracking="widest" fontFamily="body" color={textTertiary}
          _hover={{ color: textSecondary }} transition="colors"
          onClick={onBack}
        >
          I'm grounded — take me back
        </Button>
      </VStack>
    </Flex>
  );
}
