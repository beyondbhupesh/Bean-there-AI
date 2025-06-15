
import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center">
          <span className="font-bold">Bean There</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
