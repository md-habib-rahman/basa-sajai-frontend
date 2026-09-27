import { toast } from "react-toastify";

export const notify = {
  success: (message) =>
    toast.success(message, {
      style: { borderRadius: "12px", fontSize: "13px" },
    }),

  error: (message) =>
    toast.error(message || "An error occurred. Please try again.", {
      style: { borderRadius: "12px", fontSize: "13px" },
    }),

  info: (message) =>
    toast.info(message, {
      style: { borderRadius: "12px", fontSize: "13px" },
    }),

  warning: (message) =>
    toast.warn(message, {
      style: { borderRadius: "12px", fontSize: "13px" },
    }),
};