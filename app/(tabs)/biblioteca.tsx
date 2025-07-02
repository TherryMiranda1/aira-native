import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { FeedSkeleton } from "@/components/ui/FeedSkeleton";
import { BibliotecaFeed } from "@/components/ui/BibliotecaFeed";
import { AiraColors } from "@/constants/Colors";

export default function BibliotecaScreen() {
  const [showFeed, setShowFeed] = useState(false);

  const handleFeedReady = () => {
    setTimeout(() => {
      setShowFeed(true);
    }, 150);
  };

  return (
    <PageView>
      <Topbar title="Tu Biblioteca ✨" actions={<ProfileButton />} />
      <LinearGradient
        colors={[AiraColors.airaLavenderSoft, AiraColors.background]}
        style={styles.container}
      >
        {!showFeed ? (
          <FeedSkeleton sectionsCount={5} />
        ) : (
          <BibliotecaFeed onFeedReady={handleFeedReady} />
        )}
        
        {!showFeed && (
          <View style={styles.hiddenFeed}>
            <BibliotecaFeed onFeedReady={handleFeedReady} />
          </View>
        )}
      </LinearGradient>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hiddenFeed: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    opacity: 0,
  },
});
