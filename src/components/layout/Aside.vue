<template>
  <el-aside :width="width" class="aside">
    <el-row class="tac">
      <el-button icon="el-icon-s-fold" type="text" class="aside-fold" @click="mini = !mini"></el-button>
      <el-col :span="24">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          router
          :collapse="mini"
          :collapse-transition="false"
          :default-active="activeIndex"
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
  import {mapGetters} from 'vuex'

  export default {
    name   : "Aside",
    methods: {
      hasNodes(menu) {
        return menu.nodes && menu.nodes.length > 0
      }
    },
    data() {
      return {
        menus: [],
      };
    },
    computed: {
      width(){
        return this.mini ? '64px' : '256px'
      },
      ...mapGetters({
        'collapse' : 'nav/collapse'
      }),
      mini: {
        get() {
          return this.collapse
        },
        set(v) {
          this.$store.dispatch('nav/collapseNav', v)
        }
      },
      activeIndex() {
        return this.$route.path
      }
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
    transition: width
    transition-duration: 0.3s
    .el-menu
      border: none
    .aside-fold
      width: 100%
      padding: 6px 0
      &:hover
        background-color: #737373
</style>
