'use client';

export default function Sidebar() {

  const handleClick = () => {
    window.alert("Hi!");
  }

  return (
    <div className="sidebar top-0 left-0 h-full text-white">
      <div className="flex items-center justify-center h-16">
        <h1 className="text-xl font-bold">top</h1>
      </div>
      <div className="flex flex-col flex-grow p-4">
        <p className="chat-day">Today</p>
        <button onClick={handleClick} className="chat-button">Hi?</button>
        <button onClick={handleClick} className="chat-button">Hi?</button>
        <p className="chat-day">Yesterday</p>
        <button onClick={handleClick} className="chat-button">Hi?</button>
      </div>
    </div>
  );
}