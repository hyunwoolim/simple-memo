<template>
  <q-page class="flex">
    <div class="q-pa-md full-width">
      <div class="text-center" v-show="!((contents) && (contents.length > 0))">
        메모가 없습니다.
      </div>
      <q-list bordered separator v-show="((contents) && (contents.length > 0))">
        <q-infinite-scroll @load="onLoad" :offset="250">
          <q-item clickable v-ripple v-for="item in contents" :key="item._id" @click="goPageDetail(item)">
            <q-item-section transition="slide-right" side top v-show="showSelection">
              <q-checkbox v-model="selection" :val="item._id" />
            </q-item-section>
            <q-item-section>
              {{ item.title }}
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>
                {{ $moment(item.createdDate).fromNow() }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <template v-slot:loading>
            <div class="row justify-center q-my-md" v-show="paging">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>
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
      db: null,
      selection: [],
      showSelection: false,
      paging: true,
      options: {
        skip: 0,
        limit: 5,
        selector: {},
        fields: ['_id', 'title', 'createdDate'],
        sort: [{ createdDate: 'desc' }]
      },
      contents: []
    }
  },
  created () {
    const me = this
    console.log('created')
    if (!me.db) {
      me.db = new me.$pouchDB('sm-content')
      me.db.createIndex({
        index: {
          fields: ['createdDate']
        }
      }).then(function (result) {
      })
    }
    me.search()
  },
  methods: {
    search () {
      const me = this
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
      console.log('abbababab')
      const me = this
      setTimeout(() => {
        if (me.paging) {
          me.next()
          done()
        }
      }, 1000)
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
