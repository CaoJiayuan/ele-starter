<template>
  <div class="navbar">

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu" style="margin-right: 20px">
      <el-menu mode="horizontal">
        <el-submenu index="1">
          <template slot="title">{{user.name}}</template>
          <el-menu-item index="1-1">修改密码</el-menu-item>
          <el-menu-item index="1-2" @click="logout">退出登陆</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/breadcrumb'


  export default {
    name: "Header",
    computed:{
      ...mapGetters({
        user: "user/profile"
      })
    },
    components: {Breadcrumb},
    mounted() {
      this.$store.dispatch('user/getInfo')
    },
    methods: {
      logout() {
        this.$store.dispatch('user/logout').then(() => {
          this.$router.push('login')
        })
      }
    }
  };
</script>

<style lang="scss">
  .right-menu {
    .el-submenu {
      height: 46px;
      .el-submenu__title {
        height: 46px;
        line-height: 46px;
      }
    }
  }

</style>

<style lang="scss" scoped>
  .navbar {
    height: 46px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    z-index: 10;
    .breadcrumb-container {
      float: left;
    }


    .right-menu {
      float: right;
      height: 100%;
      line-height: 46px;
      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>

