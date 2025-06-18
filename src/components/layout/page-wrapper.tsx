import React from "react";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-4 sm:px-16 py-8 space-y-8 max-w-7xl mx-auto">{children}</div>
  );
};

export default PageWrapper;
