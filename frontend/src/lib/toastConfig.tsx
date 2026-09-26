import { Toaster } from "react-hot-toast";
import { SpinnerInline } from "../ui/Spinner";

export const AppToaster = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      duration: 2600,
      style: {
        background: "#ffffff",
        color: "#1e293b",
        border: "1px solid #e8ecf1",
        borderRadius: "12px",
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
        fontSize: "14px",
        padding: "12px 14px",
      },
      success: {
        iconTheme: {
          primary: "#059669",
          secondary: "#ffffff",
        },
      },
      error: {
        iconTheme: {
          primary: "#dc2626",
          secondary: "#ffffff",
        },
      },
      loading: {
        icon: <SpinnerInline size="sm" />,
      },
    }}
  />
);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const simulateRequest = (ms = 650) => delay(ms);
