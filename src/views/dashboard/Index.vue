<template>
  <el-row>
    <el-col :span="24">
      <el-card class="box-card">
        <div slot="header">
          <span>Dashboard</span>
        </div>

        <el-row>
          <el-col :span="12">
            <el-card class="box-card" shadow="never">
              <div slot="header">
                <span>编辑器</span>
              </div>
              <Quill v-model="content" style="height: 256px"/>
              <el-button @click="submit">确定</el-button>
            </el-card>
          </el-col>
        </el-row>

      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import Quill from "@/components/editor/quill/Index";
  export default {
    name: "Dashboard",
    components: {Quill},
    data() {
      return {
        content: ''
      }
    },
    methods: {
      submit(){
        alert(this.content)
      }
    }
  };
</script>

<style scoped>

</style>
