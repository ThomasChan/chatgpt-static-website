import React from 'react';
import { Input, InputNumber, Select, Switch, message } from 'antd';
import axios from 'axios';
import Mode from './Mode';
import SendBtn from './SendBtn';
import { AuthContext } from './Auth';
import htmlString from './util/htmlString';
import { getVoices, getVoice, setVoice } from './util/tts';

const chatApi = (process.env.REACT_APP_API || 'https://api.openai.com/v1/chat/completions').trim();
const imageApi = (process.env.REACT_APP_IMAGE_API || 'https://api.openai.com/v1/images/generations').trim();
const apiKey = (process.env.REACT_APP_NOT_SAFE_API_KEY || '').trim();
const continousApi = (process.env.REACT_APP_CONTINOUS_API || '').trim();

export default function Interactive({ type, onTypeChange, list, setList }) {
  const {
    auth,
    password,
  } = React.useContext(AuthContext);
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showSetting, toggleSetting] = React.useState(false);
  const [temperature, setTemperature] = React.useState(0.7);
  const [enableChat, toggleChat] = React.useState(false);
  const [collections, setCollections] = React.useState([]);
  const [continous, onContinousChange] = React.useState('');
  const [currentVoice, setCurrentVoice] = React.useState(getVoice());
  const onVoiceChange = v => {
    setCurrentVoice(v);
    setVoice(v);
  }

  const onToggleSetting = () => toggleSetting(bool => !bool);

  const doFetch = () => {
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
    const isChat = type === Mode.Chat;
    const options = {
      headers,
      body: isChat
        ? JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: text }],
          temperature,
          continous: enableChat ? continous : undefined,
          stream: false,
        })
        : JSON.stringify({
          prompt: text,
        }),
    };
    setText('');
    setList(_list => {
      _list = _list.slice();
      _list.push(isChat
        ? {
          question: text,
          answer: 'requesting...',
        }
        : {
          prompt: text,
        });
      return _list;
    });
    axios.post(isChat ? chatApi : imageApi, options)
      .then(res => {
        console.log(res);
        if (isChat) {
          message.success(`Cost ${res.data.usage.total_tokens / 1000 * 0.002} dollar`);
        }
        setList(_list => {
          _list = _list.slice();
          _list[_list.length - 1].createdAt = res.data.createdAt;
          if (isChat) {
            _list[_list.length - 1].answer = htmlString(res.data.choices[0].message.content);
          } else {
            _list[_list.length - 1].url = res.data.url;
          }
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
  };

  const onSend = event => {
    if (event?.preventDefault) {
      event.preventDefault();
    }
    if (loading) {
      return;
    }
    if (enableChat && continous && !collections.includes(continous)) {
      fetchCollections();
    }
    doFetch();
  };

  const fetchCollections = () => {
    axios
      .post(continousApi, {
        headers: { password },
      })
      .then(res => {
        setCollections(res.data);
      })
      .catch(error => {
        message.error('加载连续对话列表失败');
        setCollections([]);
        console.error(error);
      });
  };

  React.useEffect(() => {
    if (continousApi) {
      fetchCollections();
    }
  }, []);

  return <>
    <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-[color:rgb(52,53,65)]">
      <div className="flex flex-row stretch gap-3 mx-2 lg:mx-auto pt-2 lg:pt-6 lg:max-w-3xl last:mb-2 md:last:mb-6">
        <div className="relative flex-1 h-full flex flex-col">
          <Input.TextArea
            className='rounded-none !min-h-0 h-[24px] max-h-[200px] resize-none focus:ring-0 focus-visible:ring-0 !border-[color:rgba(32,33,35,.5)] bg-transparent dark:bg-transparent flex flex-col w-full py-2 pl-3 md:py-3 md:pl-4 relative )} border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]'
            style={{ resize: 'none' }}
            disabled={loading}
            value={text}
            onChange={e => setText(e.target.value)}
            onPressEnter={onSend}
            placeholder={loading
              ? 'loading'
              : type === Mode.Chat
                ? 'Ask GPT anything'
                : 'Ask GPT to generate a image'} />
          <SendBtn onSend={onSend} />
        </div>
      </div>
      <div className="text-xs text-black/50 dark:text-white/50 pt-2 pb-3 px-3 md:pt-3 md:pb-6 md:px-4 text-center">
        Developed using gpt-3.5-turbo API.
        <span
          onClick={onToggleSetting}
          className="text-[#1f75fe] cursor-pointer ml-3">
          高级设置
        </span>
      </div>
    </div>
    {showSetting
      ? <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-[color:rgb(52,53,65)] py-5 px-10">
        <h2 className="my-5" onClick={onToggleSetting}>关闭设置</h2>
        <div className="flex items-center my-5 border-t-[1px] border-slate-400 border-solid pt-5">
          <div className="flex-1 text-sm">交互模式</div>
          <Mode
            type={type}
            onToggle={onTypeChange} />
        </div>
        <div className="flex items-center my-5 border-t-[1px] border-slate-400 border-solid pt-5">
          <div className="flex-1 text-sm">
            temperature 参数
            <div className="text-black/50 text-xs max-w-[85%] mt-5">
              范围从 0 到 1<br />设置为 0 到 0.3 时，GPT 的回答更集中、连贯和保守的输出。<br />0.3 到 0.7 时回答会平衡创造力和保持连贯性。<br />0.7 到 1时回答会极富创造力和多样性，但可能不太连贯。
            </div>
          </div>
          <InputNumber
            controls
            className="h-[35px]"
            min={0}
            max={1}
            step={0.1}
            value={temperature}
            onChange={setTemperature} />
        </div>
        <div className="flex items-center my-5 border-t-[1px] border-slate-400 border-solid pt-5">
          <div className="flex-1 text-sm">
            使用连续对话
            <div className="text-black/50 text-xs max-w-[85%] mt-5">
              输入或选择连续对话标题做为标记<br />不同标题对应连接不同的连续对话内容
            </div>
          </div>
          <div className="w-[180px]">
            <div className="text-sm">
              <Switch
                className="shadow-sm mr-2"
                checked={enableChat}
                onChange={toggleChat} />
              {enableChat ? '开' : '关'}
            </div>
            <div className="mt-2">
              <div className="mb-1 text-xs">从已有连续对话中选择:</div>
              <Select
                className="w-full"
                onChange={onContinousChange}
                value={continous}>
                {collections.map(chat => <Select.Option
                  key={chat}
                  value={chat}>
                  {chat}
                </Select.Option>)}
              </Select>
            </div>
            <div className="mt-2">
              <div className="mb-1 text-xs">输入新的连续对话标记:</div>
              <Input
                className="w-full"
                value={continous}
                onChange={e => onContinousChange(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div className="mb-1 text-xs">Select Voice</div>
          <Select
            className="w-full"
            onChange={onVoiceChange}
            value={currentVoice}>
            {getVoices().map(voice => <Select.Option
              key={voice.name}
              value={voice.name}>
              {voice.name} -- {voice.lang}
            </Select.Option>)}
          </Select>
        </div>
      </div>
      : null}
  </>;
}
