import React from 'react';
import { Input } from 'antd';
import axios from 'axios';
import SendBtn from './SendBtn';
import { AuthContext } from './Auth';
import htmlString from './util/htmlString';

const api = (process.env.REACT_APP_API || 'https://api.openai.com/v1/chat/completions').trim();
const apiKey = (process.env.REACT_APP_NOT_SAFE_API_KEY || '').trim();

let _abort;

export default function Interactive({ setList }) {
  const {
    auth,
    password,
  } = React.useContext(AuthContext);
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const doFetch = () => {
    const abort = new AbortController();
    setLoading(true);
    const headers = {
      'content-type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
      'dnt': 1,
      'sec-ch-ua': `"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"`,
      'accept-language': 'en-US,en;q=0.9',
      'sec-ch-ua-platform': "macOS",
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'cache-control': 'no-cache, must-revalidate',
      'openai-model': 'gpt-3.5-turbo-0301',
      'openai-version': '2020-10-01',
      'strict-transport-security': 'max-age=15724800; includeSubDomains',
    };
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }
    if (auth) {
      headers.password = password;
    }
    const options = {
      signal: abort.signal,
      headers,
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: text }],
        temperature: 0.6,
        stream: false,
      }),
    };
    setText('');
    setList(_list => {
      _list = _list.slice();
      _list.push({
        question: text,
        answer: 'requesting...',
      });
      return _list;
    });
    axios.post(api, options)
      .then(res => {
        console.log(res);
        setList(_list => {
          _list = _list.slice();
          _list[_list.length - 1].answer = htmlString(res.data.choices[0].message.content);
          return _list;
        });
      })
      .catch(err => {
        setList(_list => {
          _list = _list.slice();
          _list[_list.length - 1].error = err.message;
          return _list;
        });
      })
      .finally(() => {
        setLoading(false);
      });
    return abort;
  };

  const onSend = event => {
    if (event?.preventDefault) {
      event.preventDefault();
    }
    _abort = doFetch();
  };
  const onStop = () => {
    _abort();
  };

  return <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-[color:rgb(52,53,65)]">
    <div className="flex flex-row stretch gap-3 mx-2 lg:mx-auto pt-2 lg:pt-6 lg:max-w-3xl last:mb-2 md:last:mb-6">
      <div className="relative flex-1 h-full flex flex-col">
        {loading ? <div className="w-full flex gap-2 justify-center mb-3">
          <button
            onClick={onStop}
            className="btn flex gap-2 justify-center btn-neutral">
            <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="w-3 h-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Stop Responding
          </button>
        </div> : null}
        <Input.TextArea
          className='rounded-none !min-h-0 h-[24px] max-h-[200px] resize-none focus:ring-0 focus-visible:ring-0 !border-[color:rgba(32,33,35,.5)] bg-transparent dark:bg-transparent flex flex-col w-full py-2 pl-3 md:py-3 md:pl-4 relative )} border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'
          style={{ resize: 'none' }}
          value={text}
          onChange={e => setText(e.target.value)}
          onPressEnter={onSend}
          placeholder={loading ? 'loading' : 'Ask GPT anything'} />
        <SendBtn onSend={onSend} />
      </div>
    </div>
    <div className="text-xs text-black/50 dark:text-white/50 pt-2 pb-3 px-3 md:pt-3 md:pb-6 md:px-4 text-center">
      Developed using gpt-3.5-turbo API.
    </div>
  </div>;
}
