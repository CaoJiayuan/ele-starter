import Mock from 'mockjs';
import { functions } from 'nerio-js-utils'

Mock.setup({
  timeout: '250-1000'
})

const {parseUrl} = functions

const mockToken = {
  access_token: 'test-token',
  expires_in: 3600,
  type: 'bearer'
}

const mockUser = {
  name: "超级管理员",
  avatar: ""
}

const mockNav = [
  {
    id: 1,
    path: '/',
    name: '首页',
    icon: 'el-icon-menu',
    nodes: []
  },

  {
    id: 2,
    path: '/users',
    name: '用户列表',
    icon: 'el-icon-user',
    nodes: []
  },
]

function url(url) {
  return new RegExp(`${url}(\\?.*|)`)
}

function page(template, page = 1, perPage = 10){
  let total = 100
  let last = total / perPage
  let from = (page - 1) * perPage;
  let to = (page - 1) * perPage + perPage;

  let temp = {
    meta: {
      total: total,
      per_page: perPage,
      current_page: page,
      last_page: last,
      from: from,
      to: to,
    }
  };
  temp[`data|${perPage}`] = [template]


  return Mock.mock(temp)
}


Mock.mock('/login', function (req) {
  return mockToken
});

Mock.mock(url('/accounts'), function (req) {

  let {query} = parseUrl(req.url)

  return page({
    'id': "@id",
    'name': '@cname',
    'address': '@county(true)',
  }, query.page | 1, query.per_page | 10)
});

Mock.mock('/user', function (req) {

  return mockUser
});

Mock.mock('/logout', function () {

  return {
    code: 200,
    message: 'ok'
  }
});

Mock.mock('/nav', function () {

  return mockNav
});
