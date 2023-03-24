import React from 'react';
import axios from 'axios';
import { AuthContext, STATUS } from './Auth';
import htmlString from './util/htmlString';

const historyApi = (process.env.REACT_APP_HISTORY_API || '').trim();

export default function History({ toggleLoadHistory, onRetrieve, children }) {
  const {
    authStatus,
    password,
  } = React.useContext(AuthContext);
  React.useEffect(() => {
    if (historyApi && authStatus === STATUS.success) {
      toggleLoadHistory(true);
      axios.post(historyApi, { headers: { password }})
        .then(res => {
          toggleLoadHistory(false);
          onRetrieve(res.data.map(msg => ({
            createdAt: msg.createdAt,
            question: msg.question,
            answer: htmlString(msg.choices[0].message.content),
          })))
        })
        .catch(error => {
          toggleLoadHistory(false);
          console.error(error);
        });
    }
  }, [authStatus]);

  return children;
}
