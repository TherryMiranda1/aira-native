import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, Stack, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { PageView } from "@/components/ui/PageView";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || isSubmitting) return;

    // Validate inputs
    if (!emailAddress.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err: any) {
      // Handle specific error messages
      if (err.errors && err.errors[0]) {
        setError(err.errors[0].message || "An error occurred during sign up");
      } else {
        setError("An error occurred during sign up");
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded || isSubmitting) return;

    if (!code.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setError("Verification failed. Please check your code and try again.");
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      // Handle specific error messages
      if (err.errors && err.errors[0]) {
        setError(err.errors[0].message || "Verification failed");
      } else {
        setError("Verification failed");
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pendingVerification) {
    return (
      <PageView>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/aira-logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.headerContainer}>
              <ThemedText type="title" style={styles.title}>
                Verificar tu correo electrónico
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Enviamos un código de verificación a {emailAddress}
              </ThemedText>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={AiraColors.destructive}
                />
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            ) : null}

            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="key-outline"
                  size={20}
                  color={AiraColors.mutedForeground}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholderTextColor={AiraColors.mutedForeground}
                  value={code}
                  placeholder="Enter verification code"
                  onChangeText={setCode}
                  keyboardType="number-pad"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.signInButton,
                  isSubmitting && styles.signInButtonDisabled,
                ]}
                onPress={onVerifyPress}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <ThemedText style={styles.signInButtonText}>
                    Verificar
                  </ThemedText>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.resendCodeButton}>
                <ThemedText style={styles.resendCodeText}>
                  Reenviar código
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </PageView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/aira-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerContainer}>
            <ThemedText type="title" style={styles.title}>
              Crear Cuenta
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Únete a Aira y comienza tu viaje de bienestar
            </ThemedText>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons
                name="alert-circle"
                size={20}
                color={AiraColors.destructive}
              />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          ) : null}

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={AiraColors.mutedForeground}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholderTextColor={AiraColors.mutedForeground}
                autoCapitalize="none"
                keyboardType="email-address"
                value={emailAddress}
                placeholder="Email address"
                onChangeText={setEmailAddress}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={AiraColors.mutedForeground}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholderTextColor={AiraColors.mutedForeground}
                value={password}
                placeholder="Contraseña (min. 8 caracteres)"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={AiraColors.mutedForeground}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.termsContainer}>
              <ThemedText style={styles.termsText}>
                By signing up, you agree to our{" "}
                <ThemedText style={styles.termsLink}>
                  Terms of Service
                </ThemedText>{" "}
                and{" "}
                <ThemedText style={styles.termsLink}>Privacy Policy</ThemedText>
              </ThemedText>
            </View>

            <TouchableOpacity
              style={[
                styles.signInButton,
                isSubmitting && styles.signInButtonDisabled,
              ]}
              onPress={onSignUpPress}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <ThemedText style={styles.signInButtonText}>
                  Crear Cuenta
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              ¿Ya tienes una cuenta?
            </ThemedText>
            <Link href="/sign-in" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.signUpLink}>
                  Iniciar sesión
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.destructiveWithOpacity(0.1),
    padding: 12,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 16,
  },
  errorText: {
    color: AiraColors.destructive,
    marginLeft: 8,
    flex: 1,
  },
  formContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: "Montserrat",
    color: AiraColors.foreground,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 8,
  },
  termsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 20,
  },
  termsLink: {
    color: AiraColors.primary,
  },
  signInButton: {
    backgroundColor: AiraColors.primary,
    height: 56,
    borderRadius: AiraVariants.cardRadius,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: AiraColors.background,
    fontSize: 16,
  },
  resendCodeButton: {
    alignSelf: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  resendCodeText: {
    color: AiraColors.primary,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 16,
  },
  footerText: {
    color: AiraColors.mutedForeground,
    marginRight: 4,
  },
  signUpLink: {
    color: AiraColors.primary,
  },
});
