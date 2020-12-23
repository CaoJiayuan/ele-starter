<template>
<el-dialog width="80%" :close-on-click-modal="false" @close="unbind" class="exception-dialog" :visible.sync="dialog">
  <div slot="title">
    <span class="exception-tag">{{ data.code }}</span>
    <span class="exception-tag">{{ data.exception }}</span>
    <p>{{ data.message }}</p>
  </div>
  <div class="exception-body">
    <span>File: <el-tag size="small" type="danger">{{ data.file }}</el-tag></span>
    <div class="exception-traces">
      <p v-for="trace in data.trace">{{trace}}</p>
    </div>
  </div>
</el-dialog>
</template>

<script>
  export default {
    name: "Exception",
    data(){
      return {
        dialog: false,
        data: {
          code: 500,
          file: 'unknown',
          message: 'Error',
          exception: 'Exception',
          trace: []
        },
      }
    },
    methods: {
      unbind(){
        this.dialog = false
        if (typeof this.destroy === 'function') {
          this.destroy();
        }
      },
      active(){
        this.dialog = true
      }
    }
  };
</script>

<style lang="scss">
  .exception-dialog {
    .el-dialog__header {
      background-color: red;
      color: white;
      padding: 12px 12px;
      p {
        width: 96%;
        overflow: hidden;
        margin-top: 8px;
      }
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: white;
        }
      }
    }
    .exception-tag {
      margin-right: 12px;
      background-color: #ef6969;
      padding: 3px 12px;
      border-radius: 8px;
      font-size: 12px;
    }
    .exception-body {
      span {
        margin-bottom: 10px;
      }
      .exception-traces {
        height: 60vh;
        overflow: scroll;
        border: 1px solid #c4c4c4;
        border-radius: 4px;
        p {
          color: #5a5e66;
          margin: 6px 4px;
        }
      }
    }
  }
</style>
