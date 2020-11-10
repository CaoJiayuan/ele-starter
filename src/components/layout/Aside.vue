<template>
  <el-aside width="256px" class="aside">
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          router
          active-text-color="#ffd04b">
          <template v-for="menu in menus">
            <el-submenu :key="menu.id" :index="menu.id" v-if="hasNodes(menu)">
              <template slot="title">
                <i :class="menu.icon"></i>
                <span>{{ menu.name }}</span>
              </template>
              <el-menu-item :key="node.id" :index="menu.path" v-for="node in menu.nodes">{{node.name}}</el-menu-item>
            </el-submenu>

            <el-menu-item  :key="menu.id" :index="menu.path" v-else>
              <i :class="menu.icon"></i>
              <span slot="title">{{ menu.name }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
</template>

<script>
  import {getNav} from "@/api/user";

  export default {
    name   : "Aside",
    methods: {
      hasNodes(menu) {
        return menu.nodes && menu.nodes.length > 0
      }
    },
    data() {
      return {
        menus: []
      };
    },
    mounted() {
      getNav().then(res => {
        this.menus = res.data;
      });
    }
  };
</script>

<style scoped lang="sass">
  .aside
    background-color: #545c64
    height: 100vh
    overflow-y: scroll
</style>
