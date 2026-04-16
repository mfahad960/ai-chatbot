'use client';

import { FormEvent, useState } from "react";
import { getPrompt } from "./components/lib/actions";
import Image from "next/image";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // getPrompt(message)
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     console.error("Error sending email:", error);
    //   })
    console.log(message);
  }

  return (
    <>
      <div className="flex flex-col h-full gap-4">

        {/* Text div */}
        <div className="flex flex-col justify-center max-w-3xl mx-auto gap-6 flex-1 pt-4">
          <div className="flex flex-col gap-8 leading-relaxed text-center max-w-xl">
            <p>
              This is an open source chatbot template built with Next.js and the AI SDK by Vercel. It uses the
              <code className="rounded-md bg-gray-700 px-1 py-0.5 mx-2">streamText</code>
              function in the server and the
              <code className="rounded-md bg-gray-700 px-1 py-0.5 mx-2">useChat</code>
              hook on the client to create a seamless chat experience.
            </p>
          </div>
        </div>

        {/* Text Box */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-2 px-4">   
          <div className="relative w-full flex flex-col">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="flex block w-full rounded-lg textarea px-3 py-3 text-base" placeholder="Ask anything" />
            <button disabled={message.length === 0} type="submit" className="button inline-flex absolute end-2.5 bottom-2.5 rounded-full">
              <Image className="invert" src="/up-arrow.png" alt="up-arrow" width={15} height={15} />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bottom-line">
          <p className="">AI-generated, for reference only</p>
        </div>
      </div>
    </>
  );
}
