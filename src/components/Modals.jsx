import React from "react";
import {
  Box, Button, Image, Modal, ModalBody, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Text,
} from "@chakra-ui/react";
import { lookupString } from "../utils";

export default function Modals({
  t,
  activeOverlays, onClose,
  onDelete, onClearAll,
  shareCanvasPreviewUrl,
  onDownloadImage, onNativeShare,
  colorMode,
}) {
  const {
    bgBase, textPrimary, textSecondary, borderColor,
    cardBgSolid, cardBgHover,
    accentBase, accentGrad, accentGradHover,
    invertText, modalOverlayBg, modalContentGlassBg,
  } = t;

  return (
    <>
      {/* Delete modal */}
      <Modal isOpen={activeOverlays.delete} onClose={() => onClose("delete")} isCentered size="xs">
        <ModalOverlay backdropFilter="blur(5px)" bg={modalOverlayBg} />
        <ModalContent bg={bgBase} border={`1px solid ${borderColor}`} borderRadius="2xl" color={textPrimary}>
          <ModalHeader fontSize="xl" fontFamily="'Outfit', sans-serif" fontWeight="800">
            Delete this{" "}
            <Box as="em" fontStyle="italic" fontWeight="normal" color={accentBase}>victory?</Box>
          </ModalHeader>
          <ModalBody fontSize="sm" color={textSecondary} fontWeight="light" lineHeight="relaxed">
            {lookupString("del_body")}
          </ModalBody>
          <ModalFooter display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
            <Button py={5} bg={cardBgSolid} _hover={{ bg: cardBgHover }} borderRadius="xl" fontSize="sm" fontWeight="medium" onClick={() => onClose("delete")}>
              {lookupString("del_keep")}
            </Button>
            <Button py={5} bg="red.500" _hover={{ bg: "red.600" }} color="white" fontWeight="bold" borderRadius="xl" fontSize="sm" shadow="lg" onClick={onDelete}>
              {lookupString("del_remove")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Clear all modal */}
      <Modal isOpen={activeOverlays.clearAll} onClose={() => onClose("clearAll")} isCentered size="xs">
        <ModalOverlay backdropFilter="blur(5px)" bg={modalOverlayBg} />
        <ModalContent bg={bgBase} border={`1px solid ${borderColor}`} borderRadius="2xl" color={textPrimary}>
          <ModalHeader fontSize="xl" fontFamily="'Outfit', sans-serif" fontWeight="800">
            Clear{" "}
            <Box as="em" fontStyle="italic" fontWeight="normal" color="red.500">everything?</Box>
          </ModalHeader>
          <ModalBody fontSize="sm" color={textSecondary} fontWeight="light" lineHeight="relaxed">
            {lookupString("clr_body")}
          </ModalBody>
          <ModalFooter display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
            <Button py={5} bg={cardBgSolid} _hover={{ bg: cardBgHover }} borderRadius="xl" fontSize="sm" fontWeight="medium" onClick={() => onClose("clearAll")}>
              {lookupString("clr_cancel")}
            </Button>
            <Button py={5} bg="red.500" _hover={{ bg: "red.600" }} color="white" fontWeight="bold" borderRadius="xl" fontSize="sm" shadow="lg" onClick={onClearAll}>
              {lookupString("clr_yes")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Share modal */}
      <Modal isOpen={activeOverlays.share} onClose={() => onClose("share")} isCentered size="xs">
        <ModalOverlay backdropFilter="blur(10px)" bg={modalOverlayBg} />
        <ModalContent bg={modalContentGlassBg} border={`1px solid ${borderColor}`} borderRadius="3xl" p={2} backdropFilter="blur(24px)" shadow="2xl" color={textPrimary}>
          <ModalHeader fontSize="lg" fontFamily="body" fontWeight="light" textAlign="center">
            Share your{" "}
            <Box as="em" fontStyle="italic" fontWeight="normal" color={accentBase}>win.</Box>
          </ModalHeader>
          <ModalBody p={4}>
            <Box overflow="hidden" border={`1px solid ${borderColor}`} borderRadius="2xl" bg={colorMode === "dark" ? "#08090A" : "#F7F9FC"}>
              {shareCanvasPreviewUrl && (
                <Image src={shareCanvasPreviewUrl} alt="Victory Preview Poster" w="full" h="auto" display="block" />
              )}
            </Box>
          </ModalBody>
          <ModalFooter display="flex" flexDirection="column" width="full" gap={2} p={4}>
            <Button w="full" py={6} bgGradient={accentGrad} _hover={{ bgGradient: accentGradHover }} color={invertText} fontWeight="bold" fontSize="sm" borderRadius="xl" shadow="md" onClick={onDownloadImage}>
              Download image
            </Button>
            {navigator.share && (
              <Button w="full" py={6} bg={cardBgSolid} _hover={{ bg: cardBgHover }} border={`1px solid ${borderColor}`} fontSize="sm" fontWeight="medium" borderRadius="xl" onClick={onNativeShare}>
                Share via…
              </Button>
            )}
            <Button variant="unstyled" w="full" py={1} fontSize="xs" fontFamily="body" color={textSecondary} _hover={{ color: textPrimary }} transition="colors" onClick={() => onClose("share")}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Install modal */}
      <Modal isOpen={activeOverlays.install} onClose={() => onClose("install")} isCentered size="xs">
        <ModalOverlay backdropFilter="blur(10px)" bg={modalOverlayBg} />
        <ModalContent bg={modalContentGlassBg} border={`1px solid ${borderColor}`} borderRadius="3xl" p={3} backdropFilter="blur(24px)" shadow="2xl" color={textPrimary} textAlign="center">
          <ModalHeader fontSize="lg" fontFamily="'Outfit', sans-serif" fontWeight="800">
            Install the{" "}
            <Box as="em" fontStyle="italic" fontWeight="normal" color={accentBase}>app.</Box>
          </ModalHeader>
          <ModalBody
            fontSize="sm" color={textSecondary} fontWeight="light" lineHeight="relaxed"
            borderTop={`1px solid ${borderColor}`} borderBottom={`1px solid ${borderColor}`} py={5}
            dangerouslySetInnerHTML={{
              __html: /iPhone|iPad/.test(navigator.userAgent)
                ? `In Safari: tap the <strong style="color: ${colorMode === "dark" ? "#EDE8E0" : "#1A202C"}; font-weight: 500;">Share button</strong> at the bottom, then <strong style="color: ${colorMode === "dark" ? "#00E699" : "#00B377"}; font-weight: 500;">"Add to Home Screen"</strong>.`
                : /Android/.test(navigator.userAgent)
                  ? `In Chrome: tap the <strong style="color: ${colorMode === "dark" ? "#EDE8E0" : "#1A202C"}; font-weight: 500;">three-dot menu</strong>, then <strong style="color: ${colorMode === "dark" ? "#00E699" : "#00B377"}; font-weight: 500;">"Add to Home screen"</strong>.`
                  : `In Chrome or Edge: look for the <strong style="color: ${colorMode === "dark" ? "#00E699" : "#00B377"}; font-weight: 500;">install icon (⊕)</strong> in the address bar.`,
            }}
          />
          <ModalFooter p={3}>
            <Button w="full" py={6} bg={textPrimary} _hover={{ opacity: 0.9 }} color={bgBase} fontWeight="bold" fontSize="sm" borderRadius="xl" onClick={() => onClose("install")}>
              Got it
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
