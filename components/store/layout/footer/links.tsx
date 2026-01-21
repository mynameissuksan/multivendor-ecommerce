import React from "react";

const Links = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-5 text-sm">
      {/* sub categories */}
      {/* Profile links */}
      <div className="space-y-4"></div>
      {/* Customer care */}
    </div>
  );
};

export default Links;

const footer_links = [
  {
    title: "About",
    link: "/about",
  },
  {
    title: "Contact",
    link: "/contact",
  },
  {
    title: "Wishlist",
    link: "/profile/wishlist",
  },
  {
    title: "Compare",
    link: "/compare",
  },
  {
    title: "FAQ",
    link: "/faq",
  },
  {
    title: "Store Directory",
    link: "/profile",
  },
  {
    title: "My Account",
    link: "/profile",
  },
  {
    title: "Track your Order",
    link: "/track-order",
  },
  {
    title: "Customer Service",
    link: "/customer-service",
  },
  {
    title: "Returns/Exchange",
    link: "/returns-exchange",
  },
  {
    title: "FAQs",
    link: "/faqs",
  },
  {
    title: "Product Support",
    link: "/product-support",
  },
];
