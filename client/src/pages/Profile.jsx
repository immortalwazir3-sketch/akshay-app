import React, { useState } from "react";
import {
  Box, Flex, Text, Heading, Button, VStack,
  Input, FormControl, FormLabel, Avatar,
} from "@chakra-ui/react";
import { ChevronLeft, LogOut, Edit2, Check, X } from "lucide-react";
import { apiUrl } from "../lib/api";

export default function Profile({ t, user, wins, onBack, onLogout, onUpdateUser }) {
  const {
    colorMode, textPrimary, textSecondary, textTertiary,
    cardBgSolid, borderColor, accentBase, accentBg, accentBorder,
    accentGrad, accentGradHover, invertText, dangerBg, dangerBorder,
    dangerHover, backBtnHover, bgBase,
  } = t;

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputBg = colorMode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)";
  const inputBorder = colorMode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";

  const isGoogleUser = !!user?.picture;
  const initials = (user?.name || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  // Stats derived from wins
  const totalWins = wins.length;
  const thisWeek = wins.filter((w) => {
    const d = new Date(w.date);
    const week = new Date();
    week.setDate(week.getDate() - 7);
    return d >= week;
  }).length;
  const thisMonth = wins.filter((w) => {
    const d = new Date(w.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const saveName = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/auth/profile"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: nameInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save."); return; }
      onUpdateUser(data);
      setEditingName(false);
    } catch {
      setError("Cannot reach server.");
    } finally {
      setSaving(false);
    }
  };

  const statCard = (label, value) => (
    <Box
      flex={1} textAlign="center" py={4} px={2}
      bg={colorMode === "dark" ? "rgba(255,255,255,0.02)" : cardBgSolid}
      border="1px solid" borderColor={borderColor}
      borderRadius="20px"
    >
      <Text fontSize="2xl" fontWeight="800" color={accentBase}>{value}</Text>
      <Text fontSize="xs" color={textTertiary} mt={0.5}>{label}</Text>
    </Box>
  );

  return (
    <Box maxW="md" mx="auto" px={6} pt={12} pb="140px">
      <Button
        size="sm" variant="unstyled" display="inline-flex" color={accentBase}
        mb={6} _hover={{ color: backBtnHover }} transition="colors"
        leftIcon={<ChevronLeft size={16} />}
        onClick={onBack}
      >
        Back
      </Button>

      <Heading as="h1" fontSize="3xl" fontFamily="'Outfit', sans-serif" fontWeight="800" mb={8}>
        Profile.
      </Heading>

      <VStack align="stretch" spacing={6}>
        {/* Avatar + identity */}
        <Flex
          p={5} gap={4} align="center"
          bg={colorMode === "dark" ? "rgba(0,230,153,0.04)" : cardBgSolid}
          border="1px solid" borderColor={colorMode === "dark" ? "rgba(0,230,153,0.12)" : borderColor}
          borderRadius="24px"
        >
          <Avatar
            size="lg"
            name={user?.name || user?.email}
            src={user?.picture || undefined}
            bg={accentBase}
            color={colorMode === "dark" ? "#08090A" : "white"}
            fontWeight="bold"
          />
          <Box flex={1} minW={0}>
            <Text fontWeight="700" fontSize="lg" color={textPrimary} noOfLines={1}>
              {user?.name || "Victory Tracker"}
            </Text>
            <Text fontSize="sm" color={textSecondary} noOfLines={1}>{user?.email}</Text>
            {isGoogleUser && (
              <Flex align="center" gap={1.5} mt={1}>
                <Box w="6px" h="6px" borderRadius="full" bg="#4285F4" />
                <Text fontSize="xs" color={textTertiary}>Signed in with Google</Text>
              </Flex>
            )}
          </Box>
        </Flex>

        {/* Stats row */}
        <Box>
          <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest"
            color={textTertiary} fontWeight="bold" mb={3}>
            Your Victories
          </Text>
          <Flex gap={3}>
            {statCard("Total", totalWins)}
            {statCard("This month", thisMonth)}
            {statCard("This week", thisWeek)}
          </Flex>
        </Box>

        {/* Name editor */}
        <Box
          p={4}
          bg={colorMode === "dark" ? "rgba(255,255,255,0.02)" : cardBgSolid}
          border="1px solid" borderColor={borderColor}
          borderRadius="20px"
        >
          <Flex align="center" justify="space-between" mb={editingName ? 3 : 0}>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color={textPrimary}>Display name</Text>
              {!editingName && (
                <Text fontSize="sm" color={textSecondary} mt={0.5}>
                  {user?.name || <Box as="span" fontStyle="italic">Not set</Box>}
                </Text>
              )}
            </Box>
            {!editingName && (
              <Button size="xs" variant="ghost" color={accentBase}
                leftIcon={<Edit2 size={12} />}
                onClick={() => { setNameInput(user?.name || ""); setEditingName(true); setError(""); }}
                _hover={{ bg: accentBg }}>
                Edit
              </Button>
            )}
          </Flex>
          {editingName && (
            <VStack align="stretch" spacing={2}>
              <Input
                value={nameInput} onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name" autoFocus
                bg={inputBg} border="1px solid" borderColor={inputBorder}
                borderRadius="12px" px={4} py={5} fontSize="sm" color={textPrimary}
                _placeholder={{ color: textSecondary }}
                _focus={{ borderColor: accentBase, boxShadow: `0 0 0 1px ${accentBase}`, outline: "none" }}
                onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }}
              />
              {error && <Text fontSize="xs" color="red.400">{error}</Text>}
              <Flex gap={2}>
                <Button flex={1} size="sm" borderRadius="10px"
                  bgGradient={accentGrad} color={invertText} fontWeight="bold"
                  _hover={{ bgGradient: accentGradHover }}
                  onClick={saveName} isLoading={saving} leftIcon={<Check size={14} />}>
                  Save
                </Button>
                <Button flex={1} size="sm" borderRadius="10px" variant="ghost"
                  color={textSecondary} onClick={() => setEditingName(false)} leftIcon={<X size={14} />}>
                  Cancel
                </Button>
              </Flex>
            </VStack>
          )}
        </Box>

        {/* Account info */}
        {joinDate && (
          <Flex align="center" justify="space-between" px={1}>
            <Text fontSize="xs" color={textTertiary}>Member since</Text>
            <Text fontSize="xs" color={textSecondary} fontWeight="medium">{joinDate}</Text>
          </Flex>
        )}

        {/* Sign out */}
        <Button
          w="full" py={6}
          bg={dangerBg}
          border="1px solid" borderColor={dangerBorder}
          color="red.400" fontWeight="medium" fontSize="sm"
          borderRadius="16px"
          _hover={{ bg: dangerHover }}
          leftIcon={<LogOut size={16} />}
          onClick={onLogout}
          transition="all 0.2s"
        >
          Sign Out
        </Button>
      </VStack>
    </Box>
  );
}
