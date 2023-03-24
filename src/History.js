import React from 'react';
import axios from 'axios';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { AuthContext, STATUS } from './Auth';
import htmlString from './util/htmlString';

const historyApi = (process.env.REACT_APP_HISTORY_API || '').trim();

export default function History({ from, toggleLoadHistory, onRetrieve, children }) {
  const {
    authStatus,
    password,
  } = React.useContext(AuthContext);

  const [noMore, setNoMore] = React.useState(false);

  const doFetch = async () => {
    toggleLoadHistory(true);
    axios
      .post(historyApi, {
        headers: { password },
        params: {
          from: from ? new Date(from).toISOString() : undefined,
        },
      })
      .then(res => {
        toggleLoadHistory(false);
        if (res.data.noMore) {
          setNoMore(true);
        }
        onRetrieve(_list => {
          _list = _list.slice();
          _list.unshift(...res.data.records.map(msg => ({
            createdAt: msg.createdAt,
            question: msg.question,
            answer: htmlString(msg.choices[0].message.content),
          })));
          return _list;
        });
      })
      .catch(error => {
        toggleLoadHistory(false);
        console.error(error);
      });
  }

  React.useEffect(() => {
    if (historyApi && authStatus === STATUS.success) {
      doFetch();
    }
  }, [authStatus]);

  return <PullToRefresh
    isPullable={!noMore}
    onRefresh={doFetch}
    className='relative w-full transition-width flex flex-col overflow-scroll h-full items-stretch flex-1'>
    {children}
  </PullToRefresh>;
}
