// src/lib/toast.ts
import { toast } from "react-toastify";

export const toastPopup = (
  message: string,
  type: "success" | "error" | "warning" | "info" | "default" = "error"
) => {
  return toast(message, {
    autoClose: false,
    position: "top-center",
    type,
  });
};
