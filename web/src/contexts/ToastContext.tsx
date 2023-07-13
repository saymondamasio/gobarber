import { createContext, useCallback } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Toast as ToastApp } from '../components/Toast'
export interface ToastMessage {
  type?: 'success' | 'error' | 'info'
  title: string
  description?: string
}

interface ToastContextData {
  addToast(message: ToastMessage): void
}

export const ToastContext = createContext<ToastContextData>(
  {} as ToastContextData
)

export const ToastProvider: React.FC = ({ children }) => {
  const addToast = useCallback(({ type, title, description }: ToastMessage) => {
    const message = {
      type,
      title,
      description,
    }

    toast(<ToastApp message={message} />, {
      autoClose: 10000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      rtl: false,
      closeButton: false,
      style: {
        padding: 0,
      },
      bodyStyle: {
        padding: 0,
      },
    })
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}
