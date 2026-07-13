import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import GamifiedDashboard from "@/components/home/GamifiedDashboard";
import InteractiveTrick from "@/components/home/InteractiveTrick";
import LearningPath from "@/components/home/LearningPath";
import Courses from "@/components/home/Courses";
import About from "@/components/home/About";
import ClassGallery from "@/components/home/ClassGallery";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import BlogPreview from "@/components/home/BlogPreview";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import ContactForm from "@/components/home/ContactForm";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ExitIntentModal from "@/components/home/ExitIntentModal";

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* Student Progress Hub */}
        <GamifiedDashboard />
        
        {/* Vedic Speed calculation widgets */}
        <InteractiveTrick />
        
        {/* Visual Learning Path Map */}
        <LearningPath />
        
        {/* Structured Courses */}
        <Courses />
        
        {/* About Ma'am & G.R.A.F Framework */}
        <About />
        
        {/* Learning Environment Gallery */}
        <ClassGallery />
        
        {/* Why Choose Us */}
        <WhyChooseUs />
        
        {/* Recent Articles & Guides */}
        <BlogPreview />
        
        {/* Testimonials & Results */}
        <Testimonials />
        
        {/* Contact Form Section */}
        <section id="contact" className="py-24 bg-slate-900 border-y border-slate-200/60 relative">
          <div className="absolute top-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ContactForm />
          </div>
        </section>
        
        {/* FAQs */}
        <Faq />
      </main>

      <Footer />
      
      {/* Floating Utilities */}
      <WhatsAppButton />
      <ExitIntentModal />
    </>
  );
}
