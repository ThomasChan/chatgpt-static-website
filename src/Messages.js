import React from 'react';
import { GlobalOutlined } from '@ant-design/icons';
import Theme from './Theme';
import Question from './Question';
import Answer from './Answer';
import Interactive from './Interactive';
// import mock from './util/mock';

export default function Messages() {
  // const [list, setList] = React.useState(mock);
  const [list, setList] = React.useState([]);

  return <div className='overflow-hidden w-full h-full relative'>
    <Theme />
    <main className='relative w-full transition-width flex flex-col overflow-hidden h-full items-stretch flex-1'>
      <div className='flex flex-col items-center text-sm h-full dark:bg-[color:rgb(52,53,65)] overflow-auto'>
        {list.length
          ? null
          : <div className='text-[#d9d9d9] text-sm mt-[40vh] mx-[auto] text-center'>
            <GlobalOutlined className='block text-[#d9d9d9] text-[72px] mb-[15px]' />
            Start exploring with your question
          </div>}
        {list.map(({ question, answer, error }) => {
          return <>
            <Question question={question} />
            <Answer answer={answer} error={error} />
          </>;
        })}
        <div className="w-full h-48 flex-shrink-0"></div>
      </div>
      <Interactive setList={setList} />
    </main>
  </div>;
}
