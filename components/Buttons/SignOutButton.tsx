import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { TouchableOpacity, StyleSheet } from "react-native";
import { AiraColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { AiraVariants } from "@/constants/Themes";

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut();
      Linking.openURL("aira-native://sign-in");
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.button}>
      <ThemedText type="defaultSemiBold">Cerrar Sesión</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: AiraVariants.cardRadius,
    backgroundColor: AiraColors.primary,
    alignItems: "center",
  },
});
