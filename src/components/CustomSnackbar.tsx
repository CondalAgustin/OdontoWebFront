// src/components/CustomSnackbar.tsx
import { Snackbar, Alert } from '@mui/material'
import type { FC } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  message: string
  severity?: 'success' | 'error' | 'info' | 'warning'
}

const CustomSnackbar: FC<Props> = ({ open, onClose, message, severity = 'success' }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={8000} // <- más tiempo
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default CustomSnackbar
