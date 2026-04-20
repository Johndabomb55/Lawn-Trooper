import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { X } from "lucide-react";

const CHAT_SCRIPT_ID = "lt-ghl-chat-widget-script";
const BODY_HIDE_CLASS = "lt-chat-hidden";
const DISMISS_CLASS = "lt-chat-dismissed";
const DISMISS_KEY = "ghl_chat_dismissed";

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
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

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

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle(DISMISS_CLASS, dismissed);
  }, [dismissed]);

  // Inject style tag once: ensures dismissed state hides any auto-popup chrome
  // from the GHL widget (popup, bubble, greeting) but keeps the launcher button.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const STYLE_ID = "lt-chat-dismiss-style";
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      body.${BODY_HIDE_CLASS} #leadconnector-chat-widget,
      body.${BODY_HIDE_CLASS} [data-chat-provider="ghl"] { display: none !important; }
      body.${DISMISS_CLASS} .lc-chat-popup,
      body.${DISMISS_CLASS} .lc_text_widget__popup,
      body.${DISMISS_CLASS} [class*="popup-message"],
      body.${DISMISS_CLASS} [class*="ChatPopup"],
      body.${DISMISS_CLASS} [class*="prechat"] { display: none !important; }
    `;
    document.head.appendChild(style);
  }, []);

  const onHiddenRoute = hiddenRoutes.some((route) => location.startsWith(route));
  // Only render the close control when the widget is actually eligible to display
  // (script configured, route not in hidden list, and user hasn't dismissed).
  if (dismissed || !widgetSrc || onHiddenRoute) return null;

  const onClose = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    setDismissed(true);
  };

  // Render a guaranteed-visible 44x44 close button on mobile (and desktop).
  // It floats above the GHL widget and dismisses any auto-popup for the session.
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      data-testid="button-chat-close"
      className="fixed z-[2147483647] right-3 bottom-[88px] sm:bottom-[96px] flex h-11 w-11 items-center justify-center rounded-full bg-foreground/85 text-background shadow-lg backdrop-blur transition active:scale-95 hover:bg-foreground"
      style={{ minHeight: 44, minWidth: 44 }}
    >
      <X className="h-5 w-5" />
    </button>
  );
}
