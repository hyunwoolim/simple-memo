<template>
  <q-page class="flex">
    <div class="q-pa-md full-width">
      <div class="text-center" v-show="!((contents) && (contents.length > 0))">
        메모가 없습니다.
      </div>
      <q-list bordered separator v-show="((contents) && (contents.length > 0))">
        <q-slide-item v-for="item in contents" :key="item._id" @right="onRight(item)" right-color="red">
          <template v-slot:right>
            <q-icon name="ion-ios-trash" />
          </template>
          <q-item>
            <q-item-section @click="goPageDetail(item)">
              <q-item-label>
                {{ item.title }}
              </q-item-label>
              <q-item-label caption class="item-caption">
                {{ item.caption }}
              </q-item-label>
            </q-item-section>
            <q-item-section side top @click="goPageDetail(item)">
              <q-item-label caption>
                {{ $moment(item.createdDate).fromNow() }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-slide-item>
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
      options: {
        selector: {},
        fields: ['_id', '_rev', 'title', 'content', 'caption', 'createdDate'],
        sort: [{ createdDate: 'desc' }]
      },
      contents: []
    }
  },
  created () {
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
    me.search()
  },
  methods: {
    search () {
      const me = this
      me.db.find(me.options).then(res => {
        me.contents = res.docs
      }).catch(e => {
      })
    },
    goPageCreate () {
      const me = this
      me.$router.push({ name: 'create' })
    },
    goPageDetail (item) {
      const me = this
      me.$router.push({ name: 'detail', params: { id: item._id }, query: { path: Math.random() } })
    },
    onRight (item) {
      const me = this
      me.deleteItem(item)
    },
    deleteItem (item) {
      const me = this
      me.db.remove(item, { force: true }).then(res => {
        if (res.ok) {
          me.$q.notify({
            timeout: 100,
            color: 'green',
            position: 'top-right',
            icon: 'ion-ios-done-all',
            message: '삭제되었습니다.'
          })
          me.search()
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .item-caption {
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    display: inline-block;
    overflow: hidden;
  }
</style>
