"use client";

import { useState, useEffect } from "react";

export default function PremiumPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 25,
        y: (e.clientY / window.innerHeight) * 25,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubscription = () => {
    alert(
      "🚀 Redirecting to secure payment...\n\nWelcome to MeBookMeta Premium!"
    );
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  const features = [
    {
      icon: "📚",
      title: "Unlimited Uploads",
      description:
        "Upload unlimited books, music, videos, and creative content",
    },
    {
      icon: "🎬",
      title: "Pitch Alley",
      description:
        "Create compelling video pitches for your work to attract investors",
    },
    {
      icon: "🌟",
      title: "Ask The Universe",
      description:
        "Create videos asking for audience support with AI assistance",
    },
    {
      icon: "📱",
      title: "Unique QR Code",
      description: "Share your profile anywhere with a unique, custom QR code",
    },
    {
      icon: "✍️",
      title: "Social Integration",
      description:
        "Write and share posts, photos, and videos across all platforms",
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description:
        "Get personalized AI help for content creation and suggestions",
    },
  ];

  const pricingFeatures = [
    { title: "Unlimited Uploads", desc: "Upload as much as you want" },
    {
      title: "All Premium Features",
      desc: "Access every feature listed above",
    },
    { title: "Priority Support", desc: "Get help when you need it" },
    { title: "Advanced Analytics", desc: "Track your content performance" },
    { title: "AI Powered Tools", desc: "Suggestions and content generation" },
    { title: "No Ads", desc: "Enjoy an ad-free experience" },
  ];

  const testimonials = [
    {
      rating: 5,
      text: '"MeBookMeta changed how I share my music. The AI features help me create better content, and the QR code sharing is genius!"',
      author: "Sarah Chen - Musician",
    },
    {
      rating: 5,
      text: '"As an author, having unlimited uploads and the Pitch Alley feature helped me attract publishers. Highly recommended!"',
      author: "Michael Rodriguez - Author",
    },
    {
      rating: 5,
      text: '"The support team is amazing and the platform is so intuitive. Worth every penny of my subscription!"',
      author: "Emma Thompson - Video Creator",
    },
  ];

  const faqs = [
    {
      question: "Is there a free trial?",
      answer:
        "Yes! We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your full subscription amount.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Absolutely! You can cancel your subscription at any time from your dashboard. Your access continues until the end of your billing period.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processor. Your payment information is always encrypted.",
    },
    {
      question: "How much storage do I get?",
      answer:
        "Premium members get unlimited storage for uploads. You can store as many books, music files, and videos as you want without worrying about limits.",
    },
    {
      question: "Do I get customer support?",
      answer:
        "Yes! Premium members receive priority support. We respond to all inquiries within 24 hours and have a dedicated support team to help you succeed.",
    },
    {
      question: "Can I upgrade from the free plan?",
      answer:
        "Of course! You can upgrade to Premium at any time. Your free plan content will be preserved, and you'll instantly get access to all premium features.",
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient orbs */}
        <div
          className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-900 rounded-full opacity-20 blur-3xl"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute top-1/3 right-[-100px] w-80 h-80 bg-gradient-to-bl from-purple-600 to-pink-900 rounded-full opacity-15 blur-3xl"
          style={{
            transform: `translate(${-mousePos.x * 0.5}px, ${
              mousePos.y * 0.5
            }px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute bottom-[-50px] left-1/4 w-72 h-72 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full opacity-10 blur-3xl"
          style={{
            transform: `translate(${mousePos.x * 0.7}px, ${
              -mousePos.y * 0.7
            }px)`,
            transition: "transform 0.3s ease-out",
          }}
        />

        {/* Grid background */}
        <div
          className="absolute inset-0 bg-grid opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center py-16 mb-20">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight animate-fade-in-down mt-10">
            Unleash Your
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Creative Potential
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up leading-relaxed">
            Join MeBookMeta Premium and share your books, music, videos with the
            world. Get unlimited uploads, AI assistance, and more.
          </p>
        </div>

        {/* Main Content */}
        <div
          className="grid md:grid-cols-2 gap-16 items-center mb-32"
          id="features"
        >
          {/* Features Showcase */}
          <div>
            <h2 className="text-4xl font-black text-white mb-10">
              Premium Features
            </h2>
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-5 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:translate-x-3 hover:bg-white/10 cursor-pointer group"
                  style={{
                    animation: `slideInLeft 0.6s ease forwards`,
                    animationDelay: `${0.5 + idx * 0.1}s`,
                  }}
                >
                  <div className="text-4xl flex-shrink-0 group-hover:scale-110 group-hover:animate-bounce transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Card */}
          <div id="pricing" className="flex justify-center">
            <div
              className="w-full max-w-md bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 relative overflow-hidden group"
              style={{ animation: `scaleIn 0.8s ease 0.4s both` }}
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl" />

              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-50" />

              <div className="relative z-10">
                {/* Plan Badge */}
                <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/50 text-cyan-300 px-4 py-2 rounded-full text-sm font-bold mb-8 backdrop-blur-md">
                  ✨ CREATOR PRO
                </div>

                {/* Price */}
                <div className="text-center mb-10">
                  <div className="flex items-baseline justify-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-cyan-400">$</span>
                    <span className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      50
                    </span>
                    <span className="text-lg text-gray-400 font-normal">
                      /month
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">All features included</p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-10 border-t border-b border-white/10 py-8">
                  {pricingFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 group/item"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-xs group-hover/item:scale-125 transition-transform">
                        ✓
                      </div>
                      <div className="flex-1 group-hover/item:translate-x-2 transition-transform">
                        <div className="font-semibold text-white text-sm">
                          {feature.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {feature.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleSubscription}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-1 transition-all duration-300 mb-4 relative overflow-hidden group/btn border border-cyan-400/30"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    🚀 Start Creating Today
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mb-6 pt-6 border-t border-white/10">
                  <div className="text-center text-sm group/badge hover:scale-110 transition-transform">
                    <div className="text-xl mb-1 group-hover/badge:text-cyan-400 transition-colors">
                      ✓
                    </div>
                    <div className="text-gray-400 text-xs">
                      30-day
                      <br />
                      guarantee
                    </div>
                  </div>
                  <div className="text-center text-sm group/badge hover:scale-110 transition-transform">
                    <div className="text-xl mb-1 group-hover/badge:text-cyan-400 transition-colors">
                      🔒
                    </div>
                    <div className="text-gray-400 text-xs">
                      Secure
                      <br />
                      payment
                    </div>
                  </div>
                  <div className="text-center text-sm group/badge hover:scale-110 transition-transform">
                    <div className="text-xl mb-1 group-hover/badge:text-cyan-400 transition-colors">
                      ⏳
                    </div>
                    <div className="text-gray-400 text-xs">
                      Cancel
                      <br />
                      anytime
                    </div>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="text-center text-gray-400 text-xs border-t border-white/10 pt-4">
                  💳 No credit card required to create account
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div id="testimonials" className="mb-32 border-t border-white/10 pt-20">
          <h2 className="text-5xl font-black text-white text-center mb-16 animate-fade-in-down">
            Loved by{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Creators
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl p-8 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-2 group"
                style={{
                  animation: `slideUp 0.6s ease forwards`,
                  animationDelay: `${0.2 + idx * 0.2}s`,
                }}
              >
                <div className="text-cyan-400 text-lg mb-4 font-bold">
                  {"★".repeat(testimonial.rating)}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm group-hover:text-white transition-colors">
                  {testimonial.text}
                </p>
                <div className="text-white font-bold text-sm bg-gradient-to-r from-cyan-400/50 to-blue-500/50 px-4 py-2 rounded inline-block">
                  {testimonial.author}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div
          id="faq"
          className="max-w-3xl mx-auto border-t border-white/10 pt-20 pb-20"
        >
          <h2 className="text-5xl font-black text-white text-center mb-16">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 flex justify-between items-center text-white font-bold hover:bg-white/5 transition-all duration-300"
                >
                  <span className="text-left text-gray-200 group-hover:text-cyan-400 transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className={`text-cyan-400 transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 text-gray-400 border-t border-white/10 animate-fade-in leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center py-20 border-t border-white/10 mt-20">
          <h3 className="text-3xl font-black text-white mb-6">
            Ready to Join?
          </h3>
          <button
            onClick={handleSubscription}
            className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 border border-cyan-400/30"
          >
            Upgrade to Premium Now 🚀
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease;
        }

        .animate-fade-in-up {
          animation: slideUp 0.8s ease 0.2s both;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
