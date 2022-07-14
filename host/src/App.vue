<template>
  <div>
    <label>Show UI <input type="checkbox" v-model="showUI" /></label>
    <div v-if="showUI">
      <HelloWorld name="Jane Smith" @click="testme" />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import Loading from './components/Loading.vue'
import Error from './components/Error.vue'

import { defineReactComponent } from './react'

/**
 * Definition of a remotely-defined Vue.js wrapper for React component
 *
 * @param {Function} loader function like `() => import('...')`
 * @param {import('vue').ComponentOptions} options other options for the wrapper, such as props passed on to the react component
 */
function defineFederatedReactComponent({
  loader = async () => ({ default: null }),
  component = 'default',
  ...options
} = {}) {
  return defineAsyncComponent({
    // In this place we're expecting that the default export from the library
    // imported with `loader()` is the React component/function (see HelloWorld.jsx
    // and library1/webpack.config.js:34 (ModuleFederationPlugin > exposes)
    // In the event that the exported component definition is not the default export
    // but a named one, specify the export name using the `component` key, which is
    // `'default'` by default.
    loader: async () => defineReactComponent({
      component: (await loader())[component],
      ...options
    }),
    loadingComponent: Loading,
    errorComponent: Error,
    timeout: 1000,
  })
}

// Anyone?
//
// /**
//  * Definition of a remotely-defined Vue.js wrapper for Angular component
//  *
//  * @param {Function} loader function like `() => import('...')`
//  * @param {???} options other options for the wrapper, such as props passed on to the angular component
//  */
// function defineFederatedAngularComponent({
//   loader = async () => null,
//   ...options
// } = {}) {
//   ...
// }

const HelloWorld = defineFederatedReactComponent({
  loader: () => import('library1/HelloWorld'),
  props: {
    name: { type: String, default: 'unknown' },
  },
  mounted() {
    console.log('in HelloWorld.mounted()')
  }
})

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      showUI: false,
    }
  },
  methods: {
    async testme() {
      console.log('Testme!')
    }
  },
}
</script>

<style>
.h1 {
  color: red;
}
</style>
