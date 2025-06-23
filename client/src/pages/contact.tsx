import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { InsertContactMessage } from "@shared/schema";

export default function Contact() {
  useScrollToTop(); // Scroll to top when navigating to this page
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (messageData: InsertContactMessage) => {
      const response = await apiRequest("POST", "/api/contact-messages", messageData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible.",
      });
      setContactForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Message Failed",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.firstName || !contactForm.lastName || !contactForm.email || 
        !contactForm.interest || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate({
      name: `${contactForm.firstName} ${contactForm.lastName}`,
      email: contactForm.email,
      phone: contactForm.phone || null,
      subject: contactForm.interest,
      message: contactForm.message,
    });
  };

  return (
    <div className="min-h-screen bg-clean">
      {/* Hero Section */}
      <div className="contact-hero py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl mb-6 text-high-contrast">
            Get In Touch
          </h1>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Ready to find your next car or schedule a service? We're here to help you every step of the way.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="contact-card">
              <h2 className="section-title mb-8 text-high-contrast">Contact Information</h2>
              <div className="space-y-6">
                <div className="contact-info-item">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="card-title text-high-contrast mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      123 Auto Center Drive<br />
                      Austin, TX 78701
                    </p>
                  </div>
                </div>
                
                <div className="contact-info-item">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="card-title text-high-contrast mb-1">Phone</h3>
                    <p className="text-high-contrast font-medium">(555) 123-4567</p>
                    <p className="text-sm text-muted-foreground">Call or text us anytime</p>
                  </div>
                </div>
                
                <div className="contact-info-item">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="card-title text-high-contrast mb-1">Email</h3>
                    <p className="text-high-contrast font-medium">info@integrityautobody.com</p>
                    <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
                  </div>
                </div>
                
                <div className="contact-info-item">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="card-title text-high-contrast mb-1">Business Hours</h3>
                    <div className="text-high-contrast space-y-1">
                      <p className="font-medium">Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p className="font-medium">Saturday: 9:00 AM - 5:00 PM</p>
                      <p className="font-medium">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="contact-card">
              <h3 className="card-title text-high-contrast mb-4">Visit Our Location</h3>
              <div className="aspect-video rounded-lg overflow-hidden shadow-elegant">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4358!2d-97.7431!3d30.2672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644b599a0cc032f%3A0x5d9b464bd7131994!2sAustin%20Auto%20Center!5e0!3m2!1sen!2sus!4v1635959999999!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Integrity Auto and Body Location"
                ></iframe>
              </div>
              <div className="mt-4 p-4 bg-accent rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-high-contrast">123 Auto Center Drive, Austin, TX 78701</span>
                  </div>
                  <a
                    href="https://maps.google.com/maps?daddr=123%20Auto%20Center%20Drive,%20Austin,%20TX%2078701"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary-hover font-medium transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            <h2 className="section-title mb-8 text-high-contrast">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <Label htmlFor="firstName" className="form-label">First Name *</Label>
                  <Input
                    id="firstName"
                    value={contactForm.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter your first name"
                    className="input-modern"
                    required
                  />
                </div>
                <div className="form-group">
                  <Label htmlFor="lastName" className="form-label">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={contactForm.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter your last name"
                    className="input-modern"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <Label htmlFor="email" className="form-label">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  className="input-modern"
                  required
                />
              </div>
              
              <div className="form-group">
                <Label htmlFor="phone" className="form-label">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className="input-modern"
                />
              </div>
              
              <div className="form-group">
                <Label htmlFor="interest" className="form-label">I'm interested in... *</Label>
                <Select 
                  value={contactForm.interest} 
                  onValueChange={(value) => handleInputChange("interest", value)}
                >
                  <SelectTrigger className="input-modern">
                    <SelectValue placeholder="Select your interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buying-a-car">Buying a car</SelectItem>
                    <SelectItem value="selling-my-car">Selling my car</SelectItem>
                    <SelectItem value="auto-repair-services">Auto repair services</SelectItem>
                    <SelectItem value="financing-options">Financing options</SelectItem>
                    <SelectItem value="general-inquiry">General inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="form-group">
                <Label htmlFor="message" className="form-label">Your Message *</Label>
                <Textarea
                  id="message"
                  value={contactForm.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className="input-modern resize-none"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full btn-primary mobile-button-enhanced"
                disabled={contactMutation.isPending}
              >
                <Send className="mr-2 h-4 w-4" />
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 contact-card">
          <h2 className="section-title text-center mb-12 text-high-contrast">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="card-title text-high-contrast">Do you offer financing?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes, we work with multiple lenders to provide competitive financing options for qualified buyers. Our finance team will help you find the best rates and terms.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="card-title text-high-contrast">Do you accept trade-ins?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Absolutely! We accept trade-ins and can provide competitive valuations for your current vehicle. Get an instant quote when you visit our showroom.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="card-title text-high-contrast">What warranty do you offer?</h3>
              <p className="text-muted-foreground leading-relaxed">
                All our used cars come with a comprehensive warranty for your peace of mind. Extended warranty options are also available for additional coverage.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="card-title text-high-contrast">Can I schedule a test drive?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes! Contact us to schedule a test drive for any vehicle in our inventory. We're available during business hours and by appointment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
