import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Content, Ebook, Payment, DEFAULT_CONTENT, DEFAULT_EBOOK, DEFAULT_PAYMENT, fetchEbookContent } from "../lib/api";

interface ContentState {
  ebook: Ebook;
  payment: Payment;
  content: Content;
}

const ContentContext = createContext<ContentState>({
  ebook: DEFAULT_EBOOK,
  payment: DEFAULT_PAYMENT,
  content: DEFAULT_CONTENT
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentState>({
    ebook: DEFAULT_EBOOK,
    payment: DEFAULT_PAYMENT,
    content: DEFAULT_CONTENT
  });

  useEffect(() => {
    fetchEbookContent()
      .then(setState)
      .catch(() => {
        /* keep default fallback content if the backend isn't reachable */
      });
  }, []);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
