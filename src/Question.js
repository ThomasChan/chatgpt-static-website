import React from 'react';

export default function Question({ createdAt, question }) {
  const date = createdAt ? new Date(createdAt) : false;
  let history = null;
  if (question.indexOf('_wrap_') >= 0) {
    const prompts = question.split('_wrap_');
    question = prompts.pop();
    const _summary = prompts.shift();
    if (prompts.length) {
      history = <details>
        <summary>{_summary}</summary>
        {prompts.map(prompt => <i className='mb-[15px] text-gray-400'>{prompt}</i>)}
      </details>;
    } else {
      question = <>
        <i className='mb-[15px] text-gray-400'>{_summary}</i>
        <p className='mb-[15px]'>{question}</p>
      </>;
    }
  }
  return <div className="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-[color:rgb(52,53,65)]">
    <div className="gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 justify-end">
      <div className="relative lg:w-[calc(100%-115px)] w-full flex flex-col items-end">
        <div className="min-h-[20px] whitespace-pre-wrap flex flex-col items-end gap-4 pt-[5px]">
          {history}
          {question}
        </div>
        {date
          ? <div className='text-[12px] text-gray-400'>
            {date.toLocaleDateString()}&nbsp;{date.toLocaleTimeString()}
          </div>
          : null}
      </div>
      <div className="w-[30px] flex flex-col relative items-end">
        <div className="bg-[#5436DA] rounded-sm text-white flex justify-center items-center relative text-xs w-8 h-8">
          You
        </div>
      </div>
    </div>
  </div>;
}
