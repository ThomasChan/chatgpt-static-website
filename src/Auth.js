import React from 'react';
import axios from 'axios';
import { Input, message } from 'antd';
import SendBtn from './SendBtn';

const auth = (process.env.REACT_APP_AUTH_API || '').trim();
const STATUS = {
  init: 'init',
  pending: 'pending',
  success: 'success',
  error: 'error',
};

export const AuthContext = React.createContext({
  auth,
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
      return 'login...';
    }
    if (status === STATUS.init || status === STATUS.error) {
      return <div className='relative w-[250px] h-[34px] mx-[auto] mt-[30vh]'>
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
  return <AuthContext.Provider value={{ auth, password }}>
    {children}
  </AuthContext.Provider>;
}
