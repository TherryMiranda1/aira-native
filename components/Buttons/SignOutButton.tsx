import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraVariants } from "@/constants/Themes";

export const SignOutButton = () => {
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
    padding: 16,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
  },
});
