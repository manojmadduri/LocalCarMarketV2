import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Settings, Plus, LogOut, User, Phone } from "lucide-react";
import ScrollLink from "./scroll-link";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Buy Cars", href: "/cars" },
    { name: "Services", href: "/services" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  return (
    <nav className="bg-black shadow-2xl sticky top-0 z-50 navbar-shadow border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center group">
                  <img 
                    src="https://theintegrityautoandbody.com/wp-content/uploads/2020/02/cropped-Integritylogo1-1-367x112.png" 
                    alt="Integrity Auto and Body" 
                    className="h-16 w-auto cursor-pointer transition-all duration-300 group-hover:scale-105 filter brightness-110 drop-shadow-lg"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigation.map((item) => (
                  <ScrollLink 
                    key={item.name} 
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer rounded-md ${
                      isActive(item.href)
                        ? "text-white bg-primary/20 border-b-2 border-white shadow-sm"
                        : "text-gray-200 hover:text-white hover:bg-primary/30"
                    }`}
                  >
                    {item.name}
                  </ScrollLink>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <a href="tel:(615) 896-1080" className="bg-background hover:bg-secondary text-foreground px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2 font-medium border border-border shadow-sm">
                <Phone className="h-4 w-4" />
                <span className="font-medium">(615) 896-1080</span>
              </a>
              <Link href="/contact">
                <Button 
                  variant="default" 
                  className="bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 font-semibold shadow-md"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Sell Your Car
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-0 flex flex-col max-h-screen">
                {/* Header with Logo */}
                <div className="bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                  <img 
                    src="https://theintegrityautoandbody.com/wp-content/uploads/2020/02/cropped-Integritylogo1-1-367x112.png" 
                    alt="Integrity Auto and Body" 
                    className="h-10 w-auto"
                  />
                </div>

                {/* Scrollable Navigation Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-6">
                    {/* Main Navigation */}
                    <nav className="space-y-2">
                      {navigation.map((item) => (
                        <ScrollLink 
                          key={item.name} 
                          href={item.href}
                          className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                            isActive(item.href)
                              ? "bg-primary text-white shadow-sm"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </ScrollLink>
                      ))}
                    </nav>



                    {/* Contact Section */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                        Contact Us
                      </h3>
                      <div className="space-y-3">
                        <a 
                          href="tel:(615) 896-1080" 
                          className="flex items-center justify-center w-full bg-primary text-white px-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          (615) 896-1080
                        </a>
                        <Link href="/contact">
                          <Button 
                            variant="outline" 
                            className="w-full border-primary text-primary hover:bg-primary hover:text-white" 
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              window.scrollTo(0, 0);
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Sell Your Car
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
