<template>
<div>
  <input type="text"  name="username" style="visibility:hidden;" autocomplete="off"/>
  <input type="password" name="password" style="visibility:hidden;" autocomplete="off"/>
</div>
</template>

<script>
  //解决自动填充问题
  export default {
    name: "fake-account"
  };
</script>

<style scoped>

</style>
