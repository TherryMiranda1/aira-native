import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

interface ContentCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function ContentCard({ title, description, children, footer }: ContentCardProps) {
  return (
    <View style={styles.contentCard}>
      <ThemedText style={styles.contentTitle}>
        {title}
      </ThemedText>
      
      {description && (
        <ThemedText style={styles.contentDescription}>
          {description}
        </ThemedText>
      )}
      
      {children}
      
      {footer}
    </View>
  );
}

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ContentSection({ title, children }: ContentSectionProps) {
  return (
    <View style={styles.contentSection}>
      <ThemedText style={styles.contentSectionTitle}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

interface ContentTextProps {
  children: React.ReactNode;
  style?: any;
}

export function ContentText({ children, style }: ContentTextProps) {
  return (
    <ThemedText style={[styles.contentText, style]}>
      {children}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  contentCard: {
    marginTop: 8,
    padding: 12,
    backgroundColor: AiraColors.secondary,
    borderRadius: AiraVariants.cardRadius,
  },
  contentTitle: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  contentDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
    fontStyle: "italic",
  },
  contentSection: {
    marginBottom: 8,
  },
  contentSectionTitle: {
    fontSize: 14,
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  contentText: {
    fontSize: 13,
    color: AiraColors.foreground,
    lineHeight: 18,
  },
}); 