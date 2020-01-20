<template>
  <q-page>
    <div class="q-pa-md full-width">
      <div class="row">
        <div class="col-xs-6 text-left q-mb-md">
          <q-btn dense label="목록" @click="goPageIndex"></q-btn>
        </div>
        <div class="col-xs-6 text-right q-mb-md">
          <q-btn dense label="저장" @click="save"/>
        </div>
      </div>
      <q-input square outlined label="Title" v-model="title" class="full-width q-mb-md"/>
      <!--<vue-editor v-model="model.content" :editor-toolbar="customToolbar" :editorOptions="editorSettings" />-->
      <vue-editor class="full-width" v-model="content" :editorOptions="options"/>
      <div class="row">
        <div class="col-xs-6 text-left q-mb-md">
          <q-btn dense label="목록" @click="goPageIndex"></q-btn>
        </div>
        <div class="col-xs-6 text-right q-mb-md">
          <q-btn dense label="저장" @click="save"/>
        </div>
      </div>
    </div>
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
      title: '',
      content: '',
      db: null,
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
        title: me.title,
        content: me.content,
        createdDate: new Date()
      }).then(res => {
        console.log(res)
        if (res.ok) {
          me.$q.notify({
            position: 'bottom-right',
            icon: 'tag_faces',
            width: '10px'
          })
          me.$router.push({ name: 'detail', params: { id: res.id } })
        }
      }).catch(function (err) {
        console.log(err)
      })
    }
  }
}
</script>
