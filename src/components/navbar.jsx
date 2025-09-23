"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Navbar = () => {
  return (
    <div className="my-10 fixed inset-x-0 flex justify-center z-50">
      <SlideTabs />
    </div>
  );
};

const SlideTabs = () => {
  const pathname = usePathname();
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const tabs = [
    { href: "/", label: "Home" },
    { href: "/doa", label: "Do'a" },
  ];

  // Pas awal load → set cursor di tab aktif
  useEffect(() => {
    const activeTab = document.querySelector(`[data-href="${pathname}"]`);
    if (activeTab) {
      const { offsetLeft, offsetWidth } = activeTab;
      setPosition({
        left: offsetLeft,
        width: offsetWidth,
        opacity: 1,
      });
    }
  }, [pathname]);

  return (
    <ul
      onMouseLeave={() => {
        // kalau mouse keluar → balik lagi ke tab aktif
        const activeTab = document.querySelector(`[data-href="${pathname}"]`);
        if (activeTab) {
          const { offsetLeft, offsetWidth } = activeTab;
          setPosition({
            left: offsetLeft,
            width: offsetWidth,
            opacity: 1,
          });
        }
      }}
      className="relative mx-auto flex w-fit rounded-full border-2 border-black bg-white p-1"
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.href}
          href={tab.href}
          isActive={pathname === tab.href}
          setPosition={setPosition}
        >
          {tab.label}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({ children, href, setPosition, isActive }) => {
  const ref = useRef(null);

  return (
    <motion.li
      ref={ref}
      data-href={href}
      onMouseEnter={() => {
        if (!ref?.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      animate={{
        color: isActive ? "#ffffff" : "#6b7280", // putih kalau aktif, abu-abu kalau tidak
      }}
      whileHover={{ color: "#ffffff" }} // selalu putih pas hover
      transition={{ duration: 0.3 }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase 
                 md:px-5 md:py-3 md:text-base"
    >
      <Link href={href}>{children}</Link>
    </motion.li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute z-0 h-7 rounded-full bg-black md:h-12"
    />
  );
};
