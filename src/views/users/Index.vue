<template>
  <el-row>
    <el-col :span="24">
      <el-card class="box-card">
        <div slot="header">
          <span>用户，表格组件</span>
        </div>
        <Table api-url="/accounts" :fields="fields" :actions="actions" @view="handleView"/>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import Table from "@/components/table";
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
          },
          {
            prop: 'address',
            label: '地址',
          },
        ],
        actions: [
          {
            action: 'view',
            label: '查看'
          }
        ]
      }
    },
    methods: {
      handleView(row) {
        alert(JSON.stringify(row))
      }
    }
  };
</script>

<style scoped>

</style>
