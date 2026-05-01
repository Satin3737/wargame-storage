'use client';

import type {FC} from 'react';
import {ToastContainer} from 'react-toastify';

const ToastHost: FC = () => <ToastContainer position={'bottom-center'} theme={'dark'} autoClose={2500} stacked />;

export default ToastHost;
