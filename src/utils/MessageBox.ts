import { createApp, defineComponent, h } from 'vue'
import MessageBox from '@/components/MessageBox/index.vue'
import WarningIcon from '@/assets/icons/warning-prompt.svg'
import InfoIcon from '@/assets/icons/info-prompt.svg'
import SuccessIcon from '@/assets/icons/success-prompt.svg'
import ErrorIcon from '@/assets/icons/error-prompt.svg'

export function messageConfirm( type: string ,title: '提示', message = '是否确认该操作'): Promise<boolean> {
  const typeList = {
    info: InfoIcon,
    warning: WarningIcon,
    success: SuccessIcon ,
    error: ErrorIcon
  }

  return new Promise((resolve) => {
    const dialog = document.createElement('div')

    const DialogComponent = defineComponent({
      render() {
        return h(MessageBox, {
          title,
          message,
          icon: typeList[type],
          onClose: (result: boolean) => {
            // 通过true 和 false 来区分用户点击了确定还是取消
            resolve(result)
            app.unmount()
            document.body.removeChild(dialog)
          }
        })
      }
    })

    const app = createApp(DialogComponent)
    app.mount(dialog)
    document.body.appendChild(dialog)
  })
}
