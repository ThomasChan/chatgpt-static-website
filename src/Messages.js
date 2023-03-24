import React from 'react';
import { GlobalOutlined } from '@ant-design/icons';
import Theme from './Theme';
import Auth from './Auth';
import History from './History';
import Question from './Question';
import Answer from './Answer';
import Interactive from './Interactive';
// import mock from './util/mock';

export default function Messages() {
  // const [list, setList] = React.useState(mock);
  const [list, setList] = React.useState([]);
  const [loadHistory, toggleLoadHistory] = React.useState(false);
  const scrollRef = React.useRef();

  React.useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [list]);

  return <div className='overflow-hidden w-full h-full relative dark:bg-[color:rgb(52,53,65)]'>
    <Theme />
    <Auth>
      <History toggleLoadHistory={toggleLoadHistory} onRetrieve={setList}>
        <main className='relative w-full transition-width flex flex-col overflow-hidden h-full items-stretch flex-1'>
          <div
            ref={scrollRef}
            className='flex flex-col items-center text-sm h-full overflow-auto'>
            {list.length
              ? null
              : <div className='text-[#d9d9d9] text-sm mt-[40vh] mx-[auto] text-center'>
                <GlobalOutlined className='block text-[#d9d9d9] text-[72px] mb-[15px]' />
                <p>Start exploring with your question</p>
                {loadHistory ? 'Retrieveing history chat...' : null}
              </div>}
            {list.map(({ createdAt, question, answer, error }) => {
              return <>
                <Question
                  createdAt={createdAt}
                  question={question} />
                <Answer answer={answer} error={error} />
              </>;
            })}
            <div className="w-full h-48 flex-shrink-0"></div>
          </div>
          <Interactive setList={setList} />
        </main>
      </History>
    </Auth>
  </div>;
}
