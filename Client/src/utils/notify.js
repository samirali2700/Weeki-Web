import { toast } from '@zerodevx/svelte-toast';



export const notifyError = (message) => {
    toast.pop()
    toast.push(message, {
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })
}

export const notifySuccess = (message) => {
    
}