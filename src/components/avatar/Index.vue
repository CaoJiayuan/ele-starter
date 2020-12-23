<template>
  <div class="avatar" :style="{backgroundColor: bgColor, width: this.boxSize, height: this.boxSize}">
    <img :src="src" alt="" v-if="src">
    <slot v-else></slot>
  </div>
</template>

<script>
  const sizes = {
    mini  : '16px',
    small : '24px',
    middle: '48px',
    large : '96px'
  };

  export default {
    name    : "Avatar",
    props   : {
      size: String,
      src : String,
      color: String
    },
    computed: {
      boxSize() {
        let size = this.size || 'middle';

        let s = sizes[size];
        if (s) {
          return s;
        }

        return this.size;
      },
      bgColor() {
        if (this.src) {
          return undefined
        }
        return this.Color || '#409EFF'
      }
    }
  };
</script>

<style scoped lang="scss">
.avatar {
  align-items: center;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  img {
    border-radius: inherit;
    display: inline-flex;
    height: inherit;
    width: inherit;
  }
}
</style>
