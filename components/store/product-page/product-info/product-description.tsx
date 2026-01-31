/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

const ProductDescription = ({ text }: { text: [string, string] }) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const sanitizedDesc1 = DOMPurify.sanitize(text[0]);
  const sanitizedDesc2 = DOMPurify.sanitize(text[1]);

  return (
    <div className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-black text-2xl font-bold">Description</h2>
      </div>
      {/* Display both descriptions */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedDesc1 }}></div>
      <div dangerouslySetInnerHTML={{ __html: sanitizedDesc2 }}></div>
    </div>
  );
};

export default ProductDescription;
