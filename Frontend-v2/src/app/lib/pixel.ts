declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

const PIXEL_ID = (import.meta as any).env?.VITE_FB_PIXEL_ID || "";

export function initPixel() {
  if (!PIXEL_ID || typeof window === "undefined") return;
  if (typeof window.fbq === "function") return; // already loaded

  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

export function fbEvent(eventName: string, params?: Record<string, any>) {
  if (!PIXEL_ID || typeof window?.fbq !== "function") return;
  window.fbq("track", eventName, params);
}

export function trackInitiateCheckout(value: number, currency = "BDT") {
  fbEvent("InitiateCheckout", {
    value,
    currency,
    content_type: "product"
  });
}

export function trackPurchase({
  orderId,
  value,
  currency = "BDT",
  productTitle,
  productId,
  quantity = 1
}: {
  orderId: string;
  value: number;
  currency?: string;
  productTitle: string;
  productId: string;
  quantity?: number;
}) {
  fbEvent("Purchase", {
    transaction_id: orderId,
    value,
    currency,
    content_type: "product",
    content_ids: [productId],
    contents: [{ id: productId, quantity, item_price: value }],
    num_items: quantity,
    content_name: productTitle
  });
}
