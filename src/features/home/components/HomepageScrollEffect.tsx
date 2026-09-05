'use client';

import * as React from 'react';

export function HomepageScrollEffect() {
  React.useEffect(() => {
    document.documentElement.classList.add('homepage-scroll-active');
    return () => {
      document.documentElement.classList.remove('homepage-scroll-active');
    };
  }, []);

  return null;
}
