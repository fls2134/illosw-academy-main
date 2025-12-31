import React from "react";

function LoadingPage() {
  return (
    <div className="p-2 md:p-4 min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-green-500 mb-4"></div>
        <p className="text-white text-lg">로딩 중...</p>
      </div>
    </div>
  );
}

export default LoadingPage;

