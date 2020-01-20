<template>
  <q-page class="flex">
    <div class="q-pa-md full-width">
      <div class="text-center" v-show="!((contents) && (contents.length > 0))">
        메모가 없습니다.
      </div>
      <q-list bordered separator v-show="((contents) && (contents.length > 0))">
        <q-item clickable v-ripple v-for="item in contents" :key="item._id" @click="goPageDetail(item)">
          <q-item-section transition="slide-right" side top v-show="showSelection">
            <q-checkbox v-model="selection" :val="item._id" />
          </q-item-section>
          <q-item-section>{{ item.title }}</q-item-section>
          <q-item-section avatar>
            <q-avatar rounded>
              <img src="https://cdn.quasar.dev/img/mountains.jpg">
            </q-avatar>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-page-sticky position="bottom" :offset="[0, 12]">
      <q-btn round color="primary" icon="add" @click="goPageCreate"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      selection: [],
      showSelection: false,
      paging: true,
      options: {
        skip: 0,
        limit: 10,
        selector: {},
        fields: ['_id', 'title']
      },
      contents: []
    }
  },
  created () {
    const me = this
    console.log('created')
    if (!me.db) {
      me.db = new me.$pouchDB('sm-content')
    }
    me.search()
  },
  methods: {
    search () {
      const me = this
      console.log('aaa')
      me.db.find(me.options).then(result => {
        if ((result.docs) && (result.docs.length > 0)) {
          result.docs.forEach(item => {
            me.contents.push(item)
          })
        } else {
          me.paging = false
        }
      })
    },
    next () {
      const me = this
      me.options.skip += me.options.limit
      me.search()
    },
    goPageCreate () {
      const me = this
      me.$router.push({ name: 'create' })
    },
    goPageDetail (item) {
      const me = this
      console.log('abc')
      me.$router.push({ name: 'detail', params: { id: item._id } })
    },
    onLoad (index, done) {
      const me = this
      setTimeout(() => {
        if (me.paging) {
          me.next()
          done()
        }
      }, 2000)
    },
    onRight ({ reset }) {
      const me = this
      console.log(reset)
      me.finalize(reset)
    },
    finalize (reset) {
      const me = this
      me.timer = setTimeout(() => {
        reset()
      }, 1000)
    }
  }
}
</script>
