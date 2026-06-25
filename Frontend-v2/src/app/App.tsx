import { Header } from "./components/landing/Header";
import { Hero } from "./components/landing/Hero";
import { PainPoints } from "./components/landing/PainPoints";
import { Benefits } from "./components/landing/Benefits";
import { CtaBanner } from "./components/landing/CtaBanner";
import { Author } from "./components/landing/Author";
import { InsideBook } from "./components/landing/InsideBook";
import { Testimonials } from "./components/landing/Testimonials";
import { Pricing } from "./components/landing/Pricing";
import { Faq } from "./components/landing/Faq";
import { FinalCta } from "./components/landing/FinalCta";
import { Footer } from "./components/landing/Footer";
import { StickyCta } from "./components/landing/StickyCta";
import { ContentProvider, useContent } from "./context/ContentContext";
import { AdminApp } from "./admin/AdminApp";

function LandingContent() {
  const { content } = useContent();
  const ctaBanners = content.v2.ctaBanners;

  return (
    <div className="min-h-screen w-full bg-white pb-20 md:pb-0">
      <Header />
      <Hero />
      <PainPoints />
      <Benefits />
      {ctaBanners[0] && (
        <CtaBanner
          title={ctaBanners[0].title}
          subtitle={ctaBanners[0].subtitle}
          variant={ctaBanners[0].variant}
          buttonText={ctaBanners[0].buttonText}
        />
      )}
      <Author />
      <InsideBook />
      {ctaBanners[1] && (
        <CtaBanner
          title={ctaBanners[1].title}
          subtitle={ctaBanners[1].subtitle}
          variant={ctaBanners[1].variant}
          buttonText={ctaBanners[1].buttonText}
        />
      )}
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
      <StickyCta />
    </div>
  );
}

export default function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin") || window.location.hash.startsWith("#/admin");

  if (isAdminRoute) {
    return <AdminApp />;
  }

  return (
    <ContentProvider>
      <LandingContent />
    </ContentProvider>
  );
}
