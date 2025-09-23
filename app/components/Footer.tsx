"use client";

import { useEffect, useRef } from "react";
import { FaInstagram, FaTiktok, FaLinkedin } from "react-icons/fa";
import gsap from "gsap";

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (footerRef.current) {
      gsap.fromTo(
        footerRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-gradient-to-r from-black via-black to-black text-gray-300 pt-12 pb-6 px-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Contact us
              </a>
            </li>
          </ul>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-white font-semibold mb-3">Product</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition">
                For creators
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                For fans
              </a>
            </li>
          </ul>
        </div>

        {/* Partners */}
        <div>
          <h4 className="text-white font-semibold mb-3">Partners</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition">
                Sponsors
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Terms of Use – All Users
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Terms of Use – Creators
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Copyright Infringement
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                DMCA Notice
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social icons */}
      <div className="mt-10 flex justify-center gap-6">
        <a
          href="https://instagram.com"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition text-xl"
        >
          <FaInstagram />
        </a>
        <a
          href="https://tiktok.com"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition text-xl"
        >
          <FaTiktok />
        </a>
        <a
          href="https://linkedin.com"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition text-xl"
        >
          <FaLinkedin />
        </a>
      </div>

      {/* Bottom bar */}
      <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>© Copyright {new Date().getFullYear()}. All rights reserved</p>
        <a href="#" className="hover:text-white transition">
          Website Accessibility Statement
        </a>
      </div>
    </footer>
  );
};

export default Footer;
