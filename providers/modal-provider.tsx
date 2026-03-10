/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UserModel } from "@/models/user-model";
// React, Next.js
import { createContext, useContext, useEffect, useState } from "react";

interface ModalProviderProps {
  children: React.ReactNode;
}

export type ModalData = {
  user?: UserModel;
};
type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>,
  ) => {
    if (modal) {
      if (fetchData) {
        // setData({ ...data, ...(await fetchData()) } || {});
      }
      setShowingModal(modal);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  if (!isMounted) return null;

  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within the modal provider");
  }
  return context;
};

export default ModalProvider;

export function useOnClickOutside(ref: any, handler: any) {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // If the ref exists and the clicked element is not inside the target element, call the handler.
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    // Add event listener for 'mousedown' or 'click' to the window/document
    document.addEventListener("mousedown", handleClickOutside);
    // Optional: Add 'touchend' listener for mobile compatibility
    document.addEventListener("touchend", handleClickOutside);

    // Clean up the event listener when the component unmounts or the ref/handler changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [ref, handler]); // Re-run effect if ref or handler changes
}
