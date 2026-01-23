import { SubCategoryInput } from "@/models/sub-category-model";
import Link from "next/link";
import React from "react";

const Links = ({ subs }: { subs: SubCategoryInput[] }) => {
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-5 text-sm">
      {/* sub categories */}
      <div className="space-y-4">
        <h1 className="text-lg font-bold">Find it Fast</h1>
        <ul>
          {subs &&
            subs.map((sub, i) => (
              <Link href={`/browse?sub-category=${sub.url}`} key={i}>
                <li>
                  <span>{sub.name}</span>
                </li>
              </Link>
            ))}
        </ul>
      </div>
      {/* Profile links */}
      <div className="space-y-4 md:mt-10">
        <ul className="flex flex-col gap-y-1">
          {footer_links.map((link, i) => (
            <Link key={i} href={link.link}>
              <li>
                <span>{link.title}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      {/* Customer care */}
      <div className="space-y-4">
        <h1 className="text-lg font-bold">Customer care</h1>
        <ul className="flex flex-col gap-y-1">
          {footer_links.slice(6).map((link, i) => (
            <Link key={i} href={link.link}>
              <li>
                <span>{link.title}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
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
