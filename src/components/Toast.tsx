import { Toaster, toast as hotToast } from 'react-hot-toast';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#121212',
          color: '#fff',
          borderRadius: '0',
        },
        success: {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        },
        error: {
          icon: <XCircle className="w-5 h-5 text-racing-red" />,
          duration: 7000,
        },
        loading: {
          icon: <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>,
        },
        warning: {
          icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        },
        info: {
          icon: <Info className="w-5 h-5 text-blue-500" />,
        },
      }}
    />
  );
};

export const toast = {
  success: (message: string) => hotToast.success(message),
  error: (message: string) => hotToast.error(message),
  warning: (message: string) => hotToast(message, { icon: <AlertTriangle className="w-5 h-5 text-yellow-500" /> }),
  info: (message: string) => hotToast(message, { icon: <Info className="w-5 h-5 text-blue-500" /> }),
  loading: (message: string) => hotToast.loading(message),
};