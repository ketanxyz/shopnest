import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const footerLinks = {
  Products: ['Phones', 'Laptops', 'Gaming', 'Audio', 'Wearables', 'Accessories'],
  Support: ['Contact Us', 'FAQ', 'Shipping', 'Returns', 'Warranty'],
  Company: ['About NOVA', 'Careers', 'Press', 'Blog', 'Sustainability'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-white/[0.04]">
      <div className="section-padding py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-xl font-bold tracking-tight">
              NOVA
            </Link>
            <p className="mt-2 text-sm text-text-tertiary max-w-[200px] leading-relaxed">
              Future of Smart Living.
            </p>
            <p className="mt-6 text-xs text-text-tertiary">
              &copy; {new Date().getFullYear()} NOVA.<br />
              All rights reserved.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold tracking-wider uppercase text-text-secondary mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-sm text-text-tertiary hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {link}
                      <ArrowUpRight
                        size={10}
                        className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            All product images and trademarks are property of their respective owners.
          </p>
          <button
            onClick={scrollToTop}
            className="text-xs text-text-tertiary hover:text-white transition-colors flex items-center gap-1"
          >
            Back to top <ArrowUpRight size={11} />
          </button>
        </div>
      </div>
    </footer>
  );
};
