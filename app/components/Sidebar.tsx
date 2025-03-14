'use client';

export default function Sidebar() {
  return (
    <div className="sidebar fixed top-0 left-0 h-full w-64 text-white">
      <div className="flex items-center justify-center h-16">
        <h1 className="text-xl font-bold">top</h1>
      </div>
      <div className="flex flex-col flex-grow p-4">
        <p className="text-sm chat-day">Yesterday</p>
        <button className="chat-button">Hi?</button>
        <button className="chat-button">Hi?</button>
        <button className="chat-button">Hi?</button>
      </div>
    </div>
  );
}