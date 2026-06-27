import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Content, Ebook, Payment, Product, DEFAULT_CONTENT, DEFAULT_EBOOK, DEFAULT_PAYMENT, fetchEbookContent, fetchProducts } from "../lib/api";

interface ContentState {
  ebook: Ebook;
  payment: Payment;
  content: Content;
  products: Product[];
}

const ContentContext = createContext<ContentState>({
  ebook: DEFAULT_EBOOK,
  payment: DEFAULT_PAYMENT,
  content: DEFAULT_CONTENT,
  products: []
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContentState>({
    ebook: DEFAULT_EBOOK,
    payment: DEFAULT_PAYMENT,
    content: DEFAULT_CONTENT,
    products: []
  });

  useEffect(() => {
    Promise.all([fetchEbookContent(), fetchProducts()])
      .then(([ebookData, products]) => setState({ ...ebookData, products }))
      .catch(() => {});
  }, []);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
