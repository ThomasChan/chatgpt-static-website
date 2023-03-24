import React from 'react';
import { GlobalOutlined } from '@ant-design/icons';
import Theme from './Theme';
import Auth from './Auth';
import History from './History';
import Question from './Question';
import Answer from './Answer';
import Interactive from './Interactive';
// import mock from './util/mock';

function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function Messages() {
  // const [list, setList] = React.useState(mock);
  const [list, setList] = React.useState([]);
  const [loadHistory, toggleLoadHistory] = React.useState(false);
  const scrollRef = React.useRef();
  const previousFirstItem = usePrevious(list[0]);

  React.useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.parentElement.parentElement.scrollTop = (previousFirstItem
        && (+new Date(previousFirstItem.createdAt) < +new Date(list[0].createdAt))) || !previousFirstItem
        ? 0
        : scrollRef.current.parentElement.parentElement.scrollHeight;
    }
  }, [previousFirstItem, list]);

  return <div className='overflow-hidden w-full h-full relative dark:bg-[color:rgb(52,53,65)]'>
    <Theme />
    <Auth>
      <History
        from={list[0]?.createdAt}
        toggleLoadHistory={toggleLoadHistory}
        onRetrieve={setList}>
        <div
          ref={scrollRef}
          className='flex flex-col items-center text-sm'>
          {list.length
            ? null
            : <div className='text-[#d9d9d9] text-sm mt-[40vh] mx-[auto] text-center'>
              <GlobalOutlined className='block text-[#d9d9d9] text-[72px] mb-[15px]' />
              <p>Start exploring with your question</p>
              {loadHistory ? 'Retrieveing history chat...' : null}
            </div>}
          {list.map(({ createdAt, question, answer, error }) => {
            return <React.Fragment key={createdAt}>
              <Question
                createdAt={createdAt}
                question={question} />
              <Answer answer={answer} error={error} />
            </React.Fragment>;
          })}
          <div className="w-full h-48 flex-shrink-0"></div>
        </div>
      </History>
      <Interactive setList={setList} />
    </Auth>
  </div>;
}
