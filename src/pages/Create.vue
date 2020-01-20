<template>
  <q-page>
    <div class="q-pa-md full-width">
      <div class="row q-mb-md">
        <div class="col-xs-6 text-left">
          <q-btn outline label="목록" @click="goPageIndex"></q-btn>
        </div>
        <div class="col-xs-6 text-right">
          <q-btn outline label="저장" @click="save"/>
        </div>
      </div>
      <q-input square outlined label="제목" v-model="title" class="full-width q-mb-md"/>
      <!--<vue-editor v-model="model.content" :editor-toolbar="customToolbar" :editorOptions="editorSettings" />-->
      <vue-editor class="full-width" v-model="content" :editorOptions="options"/>
      <div v-show="hasScroll" class="row q-mt-md">
        <div class="col-xs-6 text-left">
          <q-btn outline label="목록" @click="goPageIndex"></q-btn>
        </div>
        <div class="col-xs-6 text-right">
          <q-btn outline label="저장" @click="save"/>
        </div>
      </div>
    </div>
    <q-scroll-observer @scroll="onScroll" />
  </q-page>
</template>
<script>
import { VueEditor } from 'vue2-editor'
// import { VueEditor, Quill } from 'vue2-editor'
// import { ImageDrop } from 'quill-image-drop-module'
// import { ImageResize } from 'quill-image-resize-module'
// Quill.register('modules/imageDrop', ImageDrop)
// Quill.register('modules/imageResize', ImageResize)

export default {
  name: 'PageCreate',
  data () {
    return {
      db: null,
      hasScroll: false,
      title: '',
      content: '',
      options: {
        /* modules: {
          imageDrop: true,
          imageResize: {
            displaySize: true
          }
        } */
      }
    }
  },
  components: {
    VueEditor
  },
  created () {
    const me = this
    me.hasScroll = false
    if (!me.db) {
      me.db = new me.$pouchDB('sm-content')
    }
  },
  methods: {
    goPageIndex () {
      const me = this
      me.$router.push({ name: 'index' })
    },
    save () {
      const me = this
      me.db.post({
        title: ((!me.title) ? '제목없음' : me.title),
        content: me.content,
        createdDate: new Date()
      }).then(res => {
        if (res.ok) {
          me.$q.notify({
            timeout: 100,
            color: 'green',
            position: 'top-right',
            icon: 'ion-ios-done-all',
            message: '저장되었습니다.'
          })
          me.$router.push({ name: 'detail', params: { id: res.id } })
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    onScroll (info) {
      const me = this
      if (info.position > 50) {
        me.hasScroll = true
      } else {
        me.hasScroll = false
      }
    }
  }
}
</script>
