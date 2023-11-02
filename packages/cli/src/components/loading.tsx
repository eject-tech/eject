import { Text } from "ink";
import React from "react";

export type LoadingProps = {
  children?: string;
};

export const Loading = ({ children = "🔺 Loading" }) => {
  const [loaderEllipsis, setLoaderEllipsis] = React.useState<string>("");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoaderEllipsis((loaderEllipsis) => {
        if (loaderEllipsis.length === 3) {
          return "";
        }

        return loaderEllipsis + ".";
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Text>
        {children}
        {loaderEllipsis}
      </Text>
    </>
  );
};
