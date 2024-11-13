type Mode = 'add' | 'view' | 'edit'

const useModel = () => {
  const visible = ref(false)
  const mode = ref<Mode>('add')
  const currentRow = ref(null)

  // 打开弹窗
  const handleOpen = () => {
    visible.value = true
    mode.value = 'add'
    currentRow.value = null
  }

  // 打开查看弹窗
  const handleView = (row) => {
    if(!row) return

    visible.value = true
    mode.value = 'view'
    currentRow.value = row
  }

  // 打开编辑弹窗
  const handleEdit = (row) => {
    if(!row) return

    visible.value = true
    mode.value = 'edit'
    currentRow.value = row
  }

  // 关闭弹窗
  const handleClose = () => {
    visible.value = false
    mode.value = 'add'
    currentRow.value = null
  }

  return {
    visible,
    mode,
    currentRow,
    handleOpen,
    handleEdit,
    handleView,
    handleClose
  }
}

export default useModel
