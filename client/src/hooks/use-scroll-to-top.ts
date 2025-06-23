import { useEffect } from "react";
import { useLocation } from "wouter";

export function useScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}