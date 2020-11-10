<template>
  <el-row>
    <el-col :span="24">
      <el-card class="box-card">
        <div slot="header">
          <span>用户，表格组件</span>
        </div>
        <Table api-url="/accounts" :fields="fields" :actions="actions" @view="handleView" @delete="handleDelete"/>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import Table from "@/components/table";
  import {mapGetters} from 'vuex'
  export default {
    name: "Users",
    components: {Table},
    data(){
      return {
        fields: [
          {
            prop: 'id',
            label: 'ID',
            sortable: true
          },
          {
            prop: 'name',
            label: '姓名',
            render: (name, row, h) => {
              return h('el-tag', {
                props: {
                  size: 'small'
                }
              }, [name])
            }
          },
          {
            prop: 'address',
            label: '地址',
          },
        ],
        actions: [
          {
            action: 'view',
            label: '查看',
            size: 'mini',
            type: 'primary'
          },
          {
            action: 'delete',
            label: '删除',
            size: 'mini',
            type: 'danger',
            granted: () => {
              return this.user.name === '超级管理员'
            }
          },
        ]
      }
    },
    computed: {
      ...mapGetters({
        user: 'user/profile'
      })
    },
    methods: {
      handleView(row) {
        alert(JSON.stringify(row))
      },
      handleDelete(row) {
        confirm(`是否删除"${row.name}"?`)
      }
    }
  };
</script>

<style scoped>

</style>
