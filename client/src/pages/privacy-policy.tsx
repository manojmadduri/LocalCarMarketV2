import { Link } from "wouter";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function PrivacyPolicy() {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The Integrity Auto and Body
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our comprehensive privacy policy is currently being finalized to ensure we provide you with complete transparency about how we handle your personal information.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Need Policy Information Now?
              </h3>
              <p className="text-gray-600 mb-6">
                Please contact the business for any policy-related questions. We're happy to address your privacy concerns directly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">(555) 123-4567</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">info@integrityauto.com</span>
                </div>
              </div>
            </div>

            <Link href="/contact">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Contact Us Directly
              </Button>
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}