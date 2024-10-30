<template>
  <div class="home">
    主页
    <el-button type="primary" @click="handleSearch">查询</el-button>
    <el-table v-loading="loading" :data="data" style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang='ts' setup>
import useRequest from '@/hooks/useRequest'
import Apis from '@/api/apis/demo'
import { ElMessage } from 'element-plus'

const { data, loading, refetch: getList } = useRequest(Apis.list)

const { refetch: deleteRole } = useRequest(Apis.delete, {
  method: 'delete',
  onSuccess: () => {
    ElMessage.success('删除成功')
    getList()
  }
})

const handleSearch = async () => {
  await getList()
}

const handleDelete = async (row: any) => {
  await deleteRole(row.id)
}
</script>
<style lang='scss' scoped>
</style>
