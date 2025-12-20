import React, { useEffect, useState } from 'react';

export default function DiscountBanner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/banners')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        }
      })
      .catch(() => {});
  }, []);

  // Rotate banners every 5 seconds if there are multiple
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (dismissed || banners.length === 0) return null;

  const banner = banners[currentIndex];

  return (
    <div
      className="relative w-full py-2 px-4 text-center text-sm font-medium transition-all duration-300"
      style={{
        backgroundColor: banner.bgColor || '#4F46E5',
        color: banner.textColor || '#FFFFFF',
      }}
    >
      {banner.link ? (
        <a
          href={banner.link}
          className="underline decoration-dotted underline-offset-4 hover:decoration-solid"
          style={{ color: banner.textColor || '#FFFFFF' }}
        >
          {banner.text}
        </a>
      ) : (
        <span>{banner.text}</span>
      )}

      {banners.length > 1 && (
        <span className="ml-2 opacity-60 text-xs">
          {currentIndex + 1}/{banners.length}
        </span>
      )}

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss banner"
        style={{ color: banner.textColor || '#FFFFFF' }}
      >
        ✕
      </button>
    </div>
  );
}
