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
        },
      );
    }
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-gray-100 dark:bg-black text-gray-600 dark:text-gray-300 pt-12 pb-6 px-5 sm:px-6 max-md:px-4 max-md:pt-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8 sm:gap-8 text-sm sm:text-base break-words max-md:gap-x-4 max-md:gap-y-6">
        {/* Company */}
        <div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-3">
            Company
          </h4>
          <ul className="space-y-2 max-md:space-y-0">
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition max-md:inline-flex max-md:min-h-10 max-md:items-center"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition max-md:inline-flex max-md:min-h-10 max-md:items-center"
              >
                Contact us
              </a>
            </li>
          </ul>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-3">
            Product
          </h4>
          <ul className="space-y-2 max-md:space-y-0">
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition max-md:inline-flex max-md:min-h-10 max-md:items-center"
              >
                For creators
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition max-md:inline-flex max-md:min-h-10 max-md:items-center"
              >
                For fans
              </a>
            </li>
          </ul>
        </div>

        {/* Partners */}
        <div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-3">
            Partners
          </h4>
          <ul className="space-y-2 max-md:space-y-0">
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition max-md:inline-flex max-md:min-h-10 max-md:items-center"
              >
                Sponsors
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-3">
            Legal
          </h4>
          <ul className="space-y-2 max-md:space-y-0">
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition max-md:inline-flex max-md:min-h-10 max-md:items-center"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition max-md:inline-flex max-md:min-h-10 max-md:items-center"
              >
                Terms of Use – All Users
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition max-md:inline-flex max-md:min-h-10 max-md:items-center"
              >
                Terms of Use – Creators
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition max-md:inline-flex max-md:min-h-10 max-md:items-center"
              >
                Copyright Infringement
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-900 dark:hover:text-white transition max-md:inline-flex max-md:min-h-10 max-md:items-center"
              >
                DMCA Notice
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social icons */}
      <div className="mt-10 flex flex-wrap justify-center gap-6">
        <a
          href="https://instagram.com"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition text-xl text-gray-700 dark:text-white"
        >
          <FaInstagram />
        </a>
        <a
          href="https://tiktok.com"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition text-xl text-gray-700 dark:text-white"
        >
          <FaTiktok />
        </a>
        <a
          href="https://linkedin.com"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition text-xl text-gray-700 dark:text-white"
        >
          <FaLinkedin />
        </a>
      </div>

      {/* Bottom bar */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col md:flex-row gap-2 justify-between items-center text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© Copyright {new Date().getFullYear()}. All rights reserved</p>
        <a
          href="#"
          className="hover:text-gray-900 dark:hover:text-white transition max-md:inline-flex max-md:min-h-10 max-md:items-center"
        >
          Website Accessibility Statement
        </a>
      </div>
    </footer>
  );
};

export default Footer;
