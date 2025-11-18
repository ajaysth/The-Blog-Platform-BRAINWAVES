"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export function ToastNotifier() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const created = searchParams.get("created");
    const status = searchParams.get("status");

    if (created === "true") {
      const toastMessage =
        status === "DRAFT"
          ? "Post successfully saved as draft!"
          : "Post successfully published!";
      toast.success(toastMessage);
      
      // Clean up the URL to prevent the toast from re-appearing on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }
  }, [searchParams]);

  return null;
}
