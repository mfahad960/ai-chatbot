'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    window.alert("Hi!");
  };

  useEffect(() => {
    console.log(isOpen);
  }, [isOpen]);

  return (
    <>
      {isOpen ? (
        // Open Sidebar
        <div className={`sidebar top-0 left-0 h-full text-white transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}>
          <div className="flex items-center justify-center h-16">
            <h1 className="text-xl font-bold my-8">Top</h1>
            <button onClick={toggleSidebar} className="new-chat-button mx-4 px-2 py-2">Close</button>
          </div>
          <button className="new-chat-button mx-4 px-2 py-2 flex gap-2">
            <Image className="invert" src="/new-chat.png" alt="new-chat-logo" width={20} height={20} />
            New chat
          </button>
          <div className="flex flex-col flex-grow p-4">
            <p className="chat-day">Today</p>
            <button onClick={handleClick} className="chat-button">Hi?</button>
            <button onClick={handleClick} className="chat-button">Hi?</button>
            <p className="chat-day">Yesterday</p>
            <button onClick={handleClick} className="chat-button">Hi?</button>
          </div>
        </div>
      ) : (
        // Closed Sidebar
        <div className={`sidebar-closed top-0 left-0 h-full text-white transition-all duration-300 ${isOpen ? "w-16" : "w-64"}`}>
          <h1 className="text-center text-xl font-bold my-8">Top</h1>
          <button onClick={toggleSidebar} className="new-chat-button mx-4 px-2 py-2">Open</button>
        </div>
      )}
    </>
  );
}
