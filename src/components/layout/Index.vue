<template>
  <el-container>
    <Aside/>
    <Main/>
  </el-container>
</template>

<script>
  import Aside from "./Aside";
  import Main from "./Main";
  export default {
    name: "Layout",
    components: {Main, Aside}
  };
</script>

<style scoped>

</style>
