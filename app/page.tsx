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
    <div className="flex flex-col h-dvh m-2 p-2">
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
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="flex block w-full rounded-lg textarea px-3 py-2 text-base" placeholder="Ask anything" />
          {/* <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 16c-.595 0-1.077-.462-1.077-1.032V1.032C5.923.462 6.405 0 7 0s1.077.462 1.077 1.032v13.936C8.077 15.538 7.595 16 7 16z" fill="currentColor"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M.315 7.44a1.002 1.002 0 0 1 0-1.46L6.238.302a1.11 1.11 0 0 1 1.523 0c.421.403.421 1.057 0 1.46L1.838 7.44a1.11 1.11 0 0 1-1.523 0z" fill="currentColor"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.685 7.44a1.11 1.11 0 0 1-1.523 0L6.238 1.762a1.002 1.002 0 0 1 0-1.46 1.11 1.11 0 0 1 1.523 0l5.924 5.678c.42.403.42 1.056 0 1.46z" fill="currentColor"></path>
          </svg> */}
          <button disabled={message.length === 0} type="submit" className="button inline-flex items-center justify-center absolute end-2.5 bottom-2.5 px-4 py-2 text-center rounded-full text-sm">Go</button>
        </div>  
      </form>
    </div>
  );
}
