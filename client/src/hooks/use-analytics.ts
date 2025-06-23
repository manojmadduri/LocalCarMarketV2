import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

interface UseAnalyticsOptions {
  carId: number;
  sessionId?: string;
}

interface TrackingData {
  sessionId: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
}

const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export function useAnalytics({ carId }: UseAnalyticsOptions) {
  const sessionId = useRef<string>(generateSessionId());
  const startTime = useRef<number>(Date.now());
  const hasTrackedView = useRef<boolean>(false);

  // Track view mutation
  const trackViewMutation = useMutation({
    mutationFn: async (data: TrackingData) => {
      const response = await fetch(`/api/analytics/view/${carId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to track view');
      return response.json();
    },
  });

  // Track contact mutation
  const trackContactMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/analytics/contact/${carId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to track contact');
      return response.json();
    },
  });

  // Track phone click mutation
  const trackPhoneMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/analytics/phone/${carId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to track phone click');
      return response.json();
    },
  });

  // Track share mutation
  const trackShareMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/analytics/share/${carId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to track share');
      return response.json();
    },
  });

  // Update time spent mutation
  const updateTimeSpentMutation = useMutation({
    mutationFn: async (timeSpent: number) => {
      const response = await fetch(`/api/analytics/time/${carId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId.current,
          timeSpent: Math.floor(timeSpent / 1000), // Convert to seconds
        }),
      });
      if (!response.ok) throw new Error('Failed to update time spent');
      return response.json();
    },
  });

  // Track initial page view
  useEffect(() => {
    if (hasTrackedView.current) return;

    const trackingData: TrackingData = {
      sessionId: sessionId.current,
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
    };

    trackViewMutation.mutate(trackingData);
    hasTrackedView.current = true;
  }, [carId, trackViewMutation]);

  // Track time spent on page when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime.current;
      if (timeSpent > 5000) { // Only track if user spent more than 5 seconds
        // Use sendBeacon for reliable tracking on page unload
        navigator.sendBeacon(
          `/api/analytics/time/${carId}`,
          JSON.stringify({
            sessionId: sessionId.current,
            timeSpent: Math.floor(timeSpent / 1000),
          })
        );
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const timeSpent = Date.now() - startTime.current;
        if (timeSpent > 5000) {
          updateTimeSpentMutation.mutate(timeSpent);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [carId, updateTimeSpentMutation]);

  return {
    trackContact: () => trackContactMutation.mutate(),
    trackPhone: () => trackPhoneMutation.mutate(),
    trackShare: () => trackShareMutation.mutate(),
    sessionId: sessionId.current,
  };
}