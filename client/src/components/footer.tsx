import { Link } from "wouter";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import ScrollLink from "./scroll-link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-white">The Integrity Auto and Body</h3>
            <p className="text-gray-200 mb-4 max-w-md">
              Your trusted partner for quality used cars and professional auto repair services. 
              We're committed to providing exceptional value and service to our community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <ScrollLink href="/" className="text-gray-200 hover:text-white transition-colors cursor-pointer">
                  Home
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/cars" className="text-gray-200 hover:text-white transition-colors cursor-pointer">
                  Buy Cars
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/services" className="text-gray-200 hover:text-white transition-colors cursor-pointer">
                  Services
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/careers" className="text-gray-200 hover:text-white transition-colors cursor-pointer">
                  Careers
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/contact" className="text-gray-200 hover:text-white transition-colors cursor-pointer">
                  Contact
                </ScrollLink>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/cars">
                  <span className="text-gray-200 hover:text-white transition-colors cursor-pointer">
                    Used Car Sales
                  </span>
                </Link>
              </li>
              <li>
                <ScrollLink href="/services" className="text-gray-200 hover:text-white transition-colors cursor-pointer">
                  Auto Repair
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/services" className="text-gray-200 hover:text-white transition-colors cursor-pointer">
                  Car Maintenance
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/services" className="text-gray-200 hover:text-white transition-colors cursor-pointer">
                  Vehicle Inspection
                </ScrollLink>
              </li>
              <li>
                <ScrollLink href="/contact" className="text-gray-200 hover:text-white transition-colors cursor-pointer">
                  Financing Options
                </ScrollLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-white">Address</p>
                <p className="text-gray-200 text-sm">123 Auto Center Drive, Cityville, ST 12345</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p className="text-gray-200 text-sm">(555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-white">Email</p>
                <p className="text-gray-200 text-sm">info@autohub.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-200">
            &copy; {currentYear} The Integrity Auto and Body. All rights reserved. |{' '}
            <ScrollLink href="/privacy-policy" className="text-gray-200 hover:text-white transition-colors cursor-pointer underline">
              Privacy Policy
            </ScrollLink>
            {' | '}
            <ScrollLink href="/terms-of-service" className="text-gray-200 hover:text-white transition-colors cursor-pointer underline">
              Terms of Service
            </ScrollLink>
            {localStorage.getItem('admin_access') === 'true' ? (
              <>
                {' | '}
                <Link href="/admin">
                  <span className="text-gray-500 hover:text-gray-400 transition-colors cursor-pointer text-xs">
                    Admin Panel
                  </span>
                </Link>
                {' | '}
                <span 
                  className="text-gray-500 hover:text-gray-400 transition-colors cursor-pointer text-xs"
                  onClick={() => {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/';
                  }}
                >
                  Logout
                </span>
              </>
            ) : (
              <>
                {' | '}
                <ScrollLink 
                  href="/admin-login" 
                  className="text-gray-500 hover:text-gray-400 transition-colors cursor-pointer text-xs underline"
                >
                  Staff Login
                </ScrollLink>
              </>
            )}
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Website created by{' '}
            <a 
              href="https://your-portfolio-url.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-300 transition-colors underline"
            >
              Your Name
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
