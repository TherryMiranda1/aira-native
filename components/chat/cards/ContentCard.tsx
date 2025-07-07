import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

interface ContentCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  icon?: string;
  variant?: "default" | "success" | "info" | "warning";
}

export function ContentCard({
  title,
  subtitle,
  description,
  children,
  footer,
  icon,
  variant = "default",
}: ContentCardProps) {
  const cardStyle = [
    styles.contentCard,
    variant === "success" && styles.successCard,
    variant === "info" && styles.infoCard,
    variant === "warning" && styles.warningCard,
  ];

  return (
    <View style={cardStyle}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText type="defaultSemiBold" style={styles.contentTitle}>
            {icon && `${icon} `}
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText type="small" style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>

      {description && (
        <View style={styles.descriptionContainer}>
          <ThemedText type="defaultItalic" style={styles.contentDescription}>
            {description}
          </ThemedText>
        </View>
      )}

      {children && <View style={styles.content}>{children}</View>}

      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
}

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

export function ContentSection({ title, children, icon }: ContentSectionProps) {
  return (
    <View style={styles.contentSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIndicator} />
        <ThemedText type="defaultSemiBold" style={styles.contentSectionTitle}>
          {icon && `${icon} `}
          {title}
        </ThemedText>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

interface ContentTextProps {
  children: React.ReactNode;
  style?: any;
  variant?: "default" | "step" | "highlight";
}

export function ContentText({
  children,
  style,
  variant = "default",
}: ContentTextProps) {
  const textStyle = [
    styles.contentText,
    variant === "step" && styles.stepText,
    variant === "highlight" && styles.highlightText,
    style,
  ];

  return <ThemedText style={textStyle}>{children}</ThemedText>;
}

interface ContentListProps {
  items: string[];
  type?: "bullet" | "numbered";
}

export function ContentList({ items, type = "bullet" }: ContentListProps) {
  return (
    <View style={styles.listContainer}>
      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <ThemedText style={styles.listMarker}>
            {type === "numbered" ? `${index + 1}.` : "•"}
          </ThemedText>
          <ThemedText style={styles.listText}>{item}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  contentCard: {
    marginTop: 8,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  successCard: {
    borderColor: "#22c55e",
  },
  infoCard: {
    borderColor: AiraColors.primary,
  },
  warningCard: {
    borderColor: "#f59e0b",
  },
  header: {
    padding: 16,
  },
  titleContainer: {
    gap: 4,
  },
  contentTitle: {
    fontSize: 16,
  },
  subtitle: {
    color: AiraColors.mutedForeground,
  },
  descriptionContainer: {
    padding: 12,
  },
  contentDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: AiraColors.border,
  },
  contentSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionIndicator: {
    width: 3,
    height: 16,
    backgroundColor: AiraColors.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  contentSectionTitle: {
    fontSize: 14,
  },
  sectionContent: {
    paddingLeft: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  stepText: {
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: AiraColors.primary,
  },
  highlightText: {
    padding: 8,
    borderRadius: 6,
    marginVertical: 2,
  },
  listContainer: {
    gap: 6,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 4,
  },
  listMarker: {
    fontSize: 14,
    color: AiraColors.primary,
    marginRight: 8,
    minWidth: 20,
  },
  listText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
