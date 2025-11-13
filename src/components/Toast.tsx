import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme, Icon } from "react-native-paper";

const PaperToast = ({ text1, text2, props }: any) => {
  const { colors } = useTheme();

  let backgroundColor = colors.surfaceVariant;
  let iconColor = colors.onSurfaceVariant;
  let icon = "information-outline";

  if (props.type === "success") {
    backgroundColor = colors.tertiaryContainer;
    iconColor = colors.onTertiaryContainer;
    icon = "check-circle-outline";
  } else if (props.type === "error") {
    backgroundColor = colors.errorContainer;
    iconColor = colors.onErrorContainer;
    icon = "alert-circle-outline";
  }

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: backgroundColor,
          borderColor: colors.outlineVariant,
        },
      ]}
    >
      <Icon source={icon} color={iconColor} size={24} />

      <View style={styles.textContainer}>
        {text1 && (
          <Text variant="titleMedium" style={{ color: colors.onSurface }}>
            {text1}
          </Text>
        )}
        {text2 && (
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            {text2}
          </Text>
        )}
      </View>
    </View>
  );
};

export const toastConfig = {
  success: (props: any) => (
    <PaperToast text1={props.text1} text2={props.text2} props={props} />
  ),
  error: (props: any) => (
    <PaperToast text1={props.text1} text2={props.text2} props={props} />
  ),
  info: (props: any) => (
    <PaperToast text1={props.text1} text2={props.text2} props={props} />
  ),
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    width: "90%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    elevation: 4,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
});
