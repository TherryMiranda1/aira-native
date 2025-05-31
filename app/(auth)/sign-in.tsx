import { useSignIn } from "@clerk/clerk-expo";
import { Link, Stack, useRouter } from "expo-router";
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
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleAuthButton from "@/components/Buttons/GoogleAuthButton";
import { PageView } from "@/components/ui/PageView";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
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

    setIsSubmitting(true);
    setError("");

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        setError("Unable to sign in. Please check your credentials.");
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // Handle specific error messages
      if (err.errors && err.errors[0]) {
        setError(err.errors[0].message || "An error occurred during sign in");
      } else {
        setError("An error occurred during sign in");
      }
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Bienvenida!
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Inicia sesión para continuar tu viaje de bienestar
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
                placeholder="Correo electrónico"
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
                placeholder="Contraseña"
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

            <TouchableOpacity style={styles.forgotPasswordLink}>
              <ThemedText style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.signInButton,
                isSubmitting && styles.signInButtonDisabled,
              ]}
              onPress={onSignInPress}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <ThemedText style={styles.signInButtonText}>
                  Iniciar sesión
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
          <GoogleAuthButton />
          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              ¿No tienes una cuenta?
            </ThemedText>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <ThemedText style={styles.signUpLink}>Registrarse</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PageView>
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
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
  },
  headerContainer: {
    marginBottom: 24,
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
  forgotPasswordLink: {
    alignSelf: "flex-end",
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: AiraColors.primary,
    fontSize: 14,
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
