import { Link, useLocation } from "wouter";
import { ReactNode } from "react";

interface ScrollLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ScrollLink({ href, children, className, onClick }: ScrollLinkProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    // Execute any custom onClick handler
    if (onClick) {
      onClick();
    }
    
    // Navigate to the new location
    setLocation(href);
    
    // Scroll to top smoothly
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  return (
    <span className={className} onClick={handleClick} style={{ cursor: 'pointer' }}>
      {children}
    </span>
  );
}