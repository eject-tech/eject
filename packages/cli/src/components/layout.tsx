import { Box, Text } from "ink";
import React from "react";
import { theme } from "../theme.js";

export type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Text bold={true} color={theme.colors.crayola}>
        🔺 Eject CLI v{process.env.npm_package_version}
      </Text>
      <Box
        width="100%"
        height="100%"
        minHeight={9}
        backgroundColor={theme.colors.white}
        paddingX={2}
        paddingY={1}
        borderStyle="round"
        borderColor={theme.colors.ocean}
        alignItems="flex-start"
        justifyContent="center"
        flexDirection="column"
      >
        {children}
      </Box>
    </>
  );
};
