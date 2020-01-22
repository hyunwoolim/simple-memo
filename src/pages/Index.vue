<template>
  <q-page class="flex">
    <div class="q-pa-md full-width">
      <div class="text-center" v-show="!((contents) && (contents.length > 0))">
        메모가 없습니다.
      </div>
      <q-list bordered separator v-show="((contents) && (contents.length > 0))">
        <q-item clickable v-ripple v-for="item in contents" :key="item._id" @click="goPageDetail(item)">
          <q-item-section>
            <q-item-label>
              {{ item.title }}
            </q-item-label>
            <q-item-label caption>
              {{ item.caption }}
            </q-item-label>
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
      </q-list>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
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
      hasSelection: false,
      paging: true,
      options: {
        skip: 0,
        limit: 5,
        selector: {},
        fields: ['_id', 'title', 'content', 'caption', 'createdDate'],
        sort: [{ createdDate: 'desc' }]
      },
      contents: []
    }
  },
  created () {
    const me = this
    me.initDB()
    me.search()
  },
  methods: {
    initData () {
      const me = this
      me.selection = []
      me.showSelection = false
      me.paging = true
      /* skip: 0,
      limit: 5, */
      me.options = {
        selector: {},
        fields: ['_id', 'title', 'content', 'caption', 'createdDate'],
        sort: [{ createdDate: 'desc' }]
      }
      me.contents = []
    },
    initDB () {
      const me = this
      if (!me.db) {
        me.db = new me.$pouchDB('sm-content')
        me.db.createIndex({
          index: {
            fields: ['createdDate']
          }
        }).then(res => {
        }).catch(e => {
        })
      }
    },
    search () {
      const me = this
      me.db.find(me.options).then(res => {
        me.contents = res.docs
      })
    },
    goPageCreate () {
      const me = this
      me.$router.push({ name: 'create' })
    },
    goPageDetail (item) {
      const me = this
      me.$router.push({ name: 'detail', params: { id: item._id } })
    }
  }
}
</script>
