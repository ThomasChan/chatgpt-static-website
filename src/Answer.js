import React from 'react';

export default function Answer({ answer, error }) {
  return <GPTResponse>
    <div
      dangerouslySetInnerHTML={{ __html: error || answer }}
      className="markdown prose dark:prose-invert break-words light" />
  </GPTResponse>;
}

export function Image({ prompt, url }) {
  return <GPTResponse>
    {url ? <img alt={prompt} src={`data:image/png;base64,${url}`} /> : 'waiting response'}
  </GPTResponse>;
}

function GPTResponse({ children }) {
  return <div className="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]">
    <div className="text-base gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
      <div className="w-[30px] flex flex-col relative items-end">
        <GPTIcon />
      </div>
      <div className="relative lg:w-[calc(100%-115px)] w-full flex flex-col">
        <div className="min-h-[20px] whitespace-pre-wrap flex flex-col items-start gap-4">
          {children}
        </div>
      </div>
    </div>
  </div>;
}

function GPTIcon() {
  return <div
    className="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center text-[12px] bg-[color:rgb(16,163,127)]">
    GPT
  </div>;
}
