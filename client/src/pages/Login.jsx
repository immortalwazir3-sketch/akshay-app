import React, { useState } from "react";
import {
  Box, Flex, Text, Heading, Button, VStack,
  Input, FormControl, FormLabel, FormErrorMessage,
} from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { Sparkles, Eye, EyeOff } from "lucide-react";

const API = "/api";

// Google "G" logo SVG
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.805.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login({ t, onLoginSuccess }) {
  const {
    accentBase, accentBg, accentBorder, accentGrad, accentGradHover,
    invertText, textSecondary, textPrimary, borderColor, colorMode,
  } = t;

  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const inputBg = colorMode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)";
  const inputBorder = colorMode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const dividerColor = colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  // Google OAuth — popup flow
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      // We use the credential (ID token) flow instead via useGoogleLogin with flow="auth-code"
      // but since we're using implicit flow here, we need the userinfo endpoint.
      // Better: use GoogleLogin component for ID token. Let's exchange via backend.
      setGoogleLoading(true);
      setError("");
      try {
        // Get user info from Google with the access token
        const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const profile = await profileRes.json();

        // Send to our backend — we pass the sub+email+name+picture directly
        const res = await fetch(`${API}/auth/google-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Google sign-in failed."); return; }
        onLoginSuccess(data);
      } catch {
        setError("Google sign-in failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setError("Google sign-in was cancelled or failed."),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/${tab === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      onLoginSuccess(data);
    } catch {
      setError("Cannot reach the server. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => { setTab(t); setError(""); };

  const tabStyle = (active) => ({
    flex: 1, py: 2, fontSize: "sm",
    fontWeight: active ? "bold" : "normal",
    color: active ? accentBase : textSecondary,
    bg: active ? accentBg : "transparent",
    border: "1px solid", borderColor: active ? accentBorder : "transparent",
    borderRadius: "full", cursor: "pointer", transition: "all 0.2s", textAlign: "center",
  });

  return (
    <Flex maxW="md" mx="auto" px={6} pt="80px" pb="40px" minH="100vh" flexDirection="column" justifyContent="space-between">
      <VStack align="stretch" spacing={8} my="auto">
        {/* Header */}
        <VStack align="flex-start" spacing={3}>
          <Text
            fontSize="xs" fontWeight="bold" textTransform="uppercase"
            letterSpacing="widest" color={accentBase} bg={accentBg}
            px={3.5} py={1} borderRadius="full" border={`1px solid ${accentBorder}`}
          >
            Victory Journal
          </Text>
          <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }}
            fontFamily="'Outfit', sans-serif" fontWeight="800" lineHeight="tight">
            {tab === "login" ? <>Welcome <Box as="span" color={accentBase}>back ✦</Box></> : <>Start your <Box as="span" color={accentBase}>journey ✦</Box></>}
          </Heading>
          <Text color={textSecondary} fontSize="sm">
            {tab === "login" ? "Sign in to access your victories." : "Create a free account to start tracking your wins."}
          </Text>
        </VStack>

        {/* Tab switcher */}
        <Flex gap={1} p={1}
          bg={colorMode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}
          borderRadius="full" border={`1px solid ${borderColor}`}>
          <Box {...tabStyle(tab === "login")} onClick={() => switchTab("login")}>Sign In</Box>
          <Box {...tabStyle(tab === "register")} onClick={() => switchTab("register")}>Create Account</Box>
        </Flex>

        {/* Google button */}
        <Button
          w="full" py={6}
          bg={colorMode === "dark" ? "rgba(255,255,255,0.06)" : "white"}
          border="1px solid" borderColor={dividerColor}
          color={textPrimary} fontWeight="medium" fontSize="sm"
          borderRadius="16px"
          _hover={{ bg: colorMode === "dark" ? "rgba(255,255,255,0.1)" : "gray.50", borderColor: accentBorder }}
          leftIcon={<GoogleIcon />}
          onClick={() => googleLogin()}
          isLoading={googleLoading}
          loadingText="Connecting…"
          transition="all 0.2s"
        >
          Continue with Google
        </Button>

        {/* Divider */}
        <Flex align="center" gap={3}>
          <Box flex={1} h="1px" bg={dividerColor} />
          <Text fontSize="xs" color={textSecondary}>or</Text>
          <Box flex={1} h="1px" bg={dividerColor} />
        </Flex>

        {/* Email/password form */}
        <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
          <FormControl isInvalid={!!error}>
            <FormLabel fontSize="sm" fontWeight="medium" color={textPrimary} mb={1}>Email</FormLabel>
            <Input
              type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              bg={inputBg} border="1px solid" borderColor={inputBorder}
              borderRadius="16px" px={4} py={6} fontSize="md" color={textPrimary}
              _placeholder={{ color: textSecondary }}
              _focus={{ borderColor: accentBase, boxShadow: `0 0 0 1px ${accentBase}`, outline: "none" }}
              autoComplete="email"
            />
          </FormControl>

          <FormControl isInvalid={!!error}>
            <FormLabel fontSize="sm" fontWeight="medium" color={textPrimary} mb={1}>Password</FormLabel>
            <Box position="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={tab === "register" ? "At least 6 characters" : "Your password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                bg={inputBg} border="1px solid" borderColor={inputBorder}
                borderRadius="16px" px={4} py={6} pr={12} fontSize="md" color={textPrimary}
                _placeholder={{ color: textSecondary }}
                _focus={{ borderColor: accentBase, boxShadow: `0 0 0 1px ${accentBase}`, outline: "none" }}
                autoComplete={tab === "login" ? "current-password" : "new-password"}
              />
              <Box position="absolute" right={4} top="50%" transform="translateY(-50%)"
                cursor="pointer" color={textSecondary} onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Box>
            </Box>
            {error && <FormErrorMessage fontSize="sm" mt={2}>{error}</FormErrorMessage>}
          </FormControl>

          <Button
            type="submit" w="full" py={7} mt={1}
            bgGradient={accentGrad}
            _hover={{ bgGradient: accentGradHover, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" }}
            color={invertText} fontWeight="bold" borderRadius="24px" fontSize="16px"
            transition="all 0.3s" boxShadow="0 12px 24px rgba(0,0,0,0.12)"
            _active={{ transform: "scale(0.98)" }}
            isLoading={loading}
            loadingText={tab === "login" ? "Signing in…" : "Creating account…"}
          >
            {tab === "login" ? "Sign In →" : "Create Account →"}
          </Button>
        </VStack>
      </VStack>

      {/* Footer */}
      <VStack pt={8} spacing={4}>
        <Text fontSize="xs" color={textSecondary} textAlign="center">
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <Box as="span" color={accentBase} cursor="pointer" fontWeight="medium"
            onClick={() => switchTab(tab === "login" ? "register" : "login")}>
            {tab === "login" ? "Create one →" : "Sign in →"}
          </Box>
        </Text>
        <Box color={accentBorder}><Sparkles size={20} /></Box>
      </VStack>
    </Flex>
  );
}
