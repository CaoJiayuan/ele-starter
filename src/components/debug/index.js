import Vue from 'vue'
import Exception from "./Exception";
import { functions } from 'nerio-js-utils'

let opened = false
let {fastRandom} = functions
export function renderException(data) {
  if (opened) {
    return
  }

  const Component = Vue.extend(Exception)

  let container = document.createElement('div')
  container.id = 'exception-' + fastRandom(16)
  document.body.insertBefore(container, document.body.firstChild)
  let body = document.createElement('div')
  container.appendChild(body)
  const destroy = () => setTimeout(() => {
    document.body.removeChild(container)
    opened = false
  }, 600);
  let com = new Component({
    data: {
      data,
      destroy
    }
  }).$mount(body)

  com.active()
  opened = true
}
