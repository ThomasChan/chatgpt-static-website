import React from 'react';
import axios from 'axios';
import { Input, message } from 'antd';
import SendBtn from './SendBtn';

const auth = (process.env.REACT_APP_AUTH_API || '').trim();
export const STATUS = {
  init: 'init',
  pending: 'pending',
  success: 'success',
  error: 'error',
};

export const AuthContext = React.createContext({
  auth,
  authStatus: STATUS.init,
  password: '',
});

export default function Auth({ children }) {
  const [password, setPassword] = React.useState(localStorage.getItem('password'));
  const [status, setStatus] = React.useState(STATUS.init);
  const onAuth = () => {
    const pass = password.trim();
    if (!pass) {
      return message.error('Empty password');
    }
    setStatus(STATUS.pending);
    axios.post(auth, { body: pass })
      .then(() => {
        localStorage.setItem('password', pass);
        setPassword(pass);
        setStatus(STATUS.success);
      })
      .catch(() => {
        localStorage.removeItem('password');
        setPassword('');
        setStatus(STATUS.error);
        message.error('Wrong password');
      });
  };
  React.useEffect(() => {
    if (auth && password) {
      onAuth();
    }
  }, [auth]);
  if (auth && status !== STATUS.success) {
    if (status === STATUS.pending) {
      return <div className='fixed top-0 left-0 right-0 bottom-0 m-[auto] w-[fit-content] h-[fit-content]'>initializing...</div>;
    }
    if (status === STATUS.init || status === STATUS.error) {
      return <div className='fixed top-0 left-0 right-0 bottom-0 m-[auto] w-[250px] h-[32px]'>
        <Input
          placeholder='Enter Password'
          className='dark:border-gray-900/50 dark:text-white dark:bg-gray-700 dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] rounded-none'
          onChange={e => setPassword(e.target.value)}
          onPressEnter={onAuth} />
        <SendBtn
          onSend={onAuth} />
      </div>
    }
  }
  return <AuthContext.Provider value={{ auth, password, authStatus: status }}>
    {children}
  </AuthContext.Provider>;
}
