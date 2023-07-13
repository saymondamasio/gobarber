import React from 'react'
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi'
import { ToastMessage } from '../../contexts/ToastContext'
import { Container } from './styles'

interface ToastProps {
  message: ToastMessage
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <Container type={message.type} hasdescription={message.description ? 1 : 0}>
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  )
}
