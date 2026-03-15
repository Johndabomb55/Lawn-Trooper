import { useEffect } from "react";
import { useLocation } from "wouter";

const CHAT_SCRIPT_ID = "lt-ghl-chat-widget-script";
const BODY_HIDE_CLASS = "lt-chat-hidden";

const parseHiddenRoutes = (raw: string | undefined): string[] => {
  if (!raw) return ["/embed"];
  const routes = raw
    .split(",")
    .map((route) => route.trim())
    .filter(Boolean);
  return routes.length > 0 ? routes : ["/embed"];
};

export default function GhlChatWidget() {
  const [location] = useLocation();
  const widgetSrc = import.meta.env.VITE_GHL_CHAT_WIDGET_SRC as string | undefined;
  const hiddenRoutes = parseHiddenRoutes(import.meta.env.VITE_GHL_CHAT_HIDE_ROUTES as string | undefined);

  useEffect(() => {
    if (typeof window === "undefined" || !widgetSrc) return;
    if (document.getElementById(CHAT_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = CHAT_SCRIPT_ID;
    script.src = widgetSrc;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-chat-provider", "ghl");
    document.body.appendChild(script);
  }, [widgetSrc]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const shouldHide = hiddenRoutes.some((route) => location.startsWith(route));
    document.body.classList.toggle(BODY_HIDE_CLASS, shouldHide);
    return () => {
      document.body.classList.remove(BODY_HIDE_CLASS);
    };
  }, [hiddenRoutes, location]);

  return null;
}
