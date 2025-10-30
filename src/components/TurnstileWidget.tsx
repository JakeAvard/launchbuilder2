import { useEffect, useRef } from 'react';
import { cloudflareService } from '../services/cloudflare';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
}

export default function TurnstileWidget({ onVerify, onError }: TurnstileWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cloudflareService.isConfigured()) {
      return;
    }

    cloudflareService.loadScript().then(() => {
      if (widgetRef.current && (window as any).turnstile) {
        (window as any).turnstile.render(widgetRef.current, {
          sitekey: cloudflareService.getSiteKey(),
          callback: onVerify,
          'error-callback': onError,
        });
      }
    });
  }, [onVerify, onError]);

  if (!cloudflareService.isConfigured()) {
    return null;
  }

  return <div ref={widgetRef} className="flex justify-center my-4" />;
}
