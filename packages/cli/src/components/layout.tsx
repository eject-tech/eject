import { Box, Text } from "ink";
import React, { useEffect, useState } from "react";
import { theme } from "../theme.js";

export type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const [size, setSize] = useState({
    columns: process.stdout.columns,
    rows: process.stdout.rows,
  });

  useEffect(() => {
    function onResize() {
      setSize({
        columns: process.stdout.columns,
        rows: process.stdout.rows,
      });
    }

    process.stdout.on("resize", onResize);
    process.stdout.write("\x1b[?1049h");
    return () => {
      process.stdout.off("resize", onResize);
      process.stdout.write("\x1b[?1049l");
    };
  }, []);

  return (
    <Box
      width="100%"
      minHeight={size.rows}
      paddingY={size.rows > 8 ? 1 : 0}
      flexDirection="column"
      flexGrow={1}
    >
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
    </Box>
  );
};
