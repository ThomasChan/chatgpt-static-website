import React from 'react';
import ReactDOM from 'react-dom/client';
import Messages from './Messages';

import 'katex/dist/katex.min.css'
import 'highlight.js/styles/atom-one-dark.css'
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Messages />);
