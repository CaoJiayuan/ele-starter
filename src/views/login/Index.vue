<template>
  <div class="login-container">

    <div class="login-form">
      <div class="title-container">
        <h3 class="title">
          登陆
        </h3>
      </div>
      <el-form ref="loginForm" :model="loginForm" autocomplete="on" :rules="loginFormRules"
               label-position="left">
        <el-form-item prop="username">
         <span class="icon-container">
             <i class="el-icon-user"></i>
          </span>
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
          <span class="icon-container">
             <i class="el-icon-lock"></i>
          </span>
            <el-input
              :key="passwordType"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
            <i :class="passwordType === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash'"/>
          </span>
          </el-form-item>
        </el-tooltip>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                   @click.native.prevent="handleLogin">登陆
        </el-button>

      </el-form>
    </div>


  </div>
</template>

<script>
  export default {
    name      : 'Login',
    components: {},
    data() {
      return {
        loginForm      : {
          id_number: null,
          password : null
        },
        loginFormMobile: {
          mobile     : null,
          verify_code: null
        },
        passwordType   : 'password',
        capsTooltip    : false,
        loading        : false,
        redirect       : undefined,
        otherQuery     : {}
      };
    },
    computed: {
      loginFormRules() {

        return {
          username: [
            {required: true, message: '用户名不能为空', triangle: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', triangle: 'blur'}
          ]
        }
      }
    },
    watch     : {
      $route: {
        handler  : function (route) {
          const query = route.query;
          if (query) {
            this.redirect = query.redirect;
            this.otherQuery = this.getOtherQuery(query);
          }
        },
        immediate: true
      }
    },
    mounted() {
    },
    methods   : {
      checkCapslock(e) {
        const {key} = e;
        this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z');
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = '';
        } else {
          this.passwordType = 'password';
        }
        this.$nextTick(() => {
          this.$refs.password.focus();
        });
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
                this.$router.push({path: this.redirect || '/', query: this.otherQuery});
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            return false;
          }
        });
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
      }
    }
  };
</script>

<style lang="scss">
  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  /* reset element-ui css */
  .login-container {
    height: 100vh;

    .admin-login {
      position: fixed;
      padding: 20px;
      right: 0;
      color: $light_gray;
      cursor: pointer;
    }

    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #495667;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;

      .send-code {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .icon-container {
      padding: 6px 0 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      font-size: 18px;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
