'use client';

import { FormEvent, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(message);
    setMessage("");
  }

  return (
    <div className="flex flex-col h-dvh bg-background m-2 p-2">
      <div className="flex flex-col justify-center max-w-3xl mx-auto gap-6 flex-1 pt-4">
        <div className="rounded-xl flex flex-col gap-8 leading-relaxed text-center max-w-xl">
          <p>
              This is an open source chatbot template built with Next.js and the AI SDK by Vercel. It uses the
              <code className="rounded-md bg-gray-700 px-1 py-0.5 mx-2">streamText</code>
              function in the server and the
              <code className="rounded-md bg-gray-700 px-1 py-0.5 mx-2">useChat</code>
              hook on the client to create a seamless chat experience.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col w-full min-h-3xl max-w-3xl mx-auto pb-6 px-4">   
        <div className="relative w-full flex flex-col">
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="flex block w-full rounded-lg textarea px-3 py-2 text-base" placeholder="Send a message..." />
          <button disabled={message.length === 0} type="submit" className="inline-flex items-center justify-center absolute end-2.5 bottom-2.5 px-4 py-2 text-center text-white bg-purple-700 rounded-full text-sm disabled:bg-purple-900">Go</button>
        </div>  
      </form>
    </div>
  );
}
