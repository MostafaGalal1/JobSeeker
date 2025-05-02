import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useTheme } from "@mui/material/styles";

const AuthProvider = ({ children }) => {
  const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
  }
  const theme = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: theme.palette.mode === "dark" ? dark : undefined,
      }}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
};

export default AuthProvider;
