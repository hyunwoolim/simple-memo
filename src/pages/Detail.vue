<template>
  <q-page>
    <div class="q-pa-md full-width">
      <div class="row">
        <div class="col-xs-4 text-left q-mb-md">
          <q-btn dense label="목록" @click="goPageIndex"></q-btn>
        </div>
        <div class="col-xs-8 text-right q-mb-md">
          <q-btn class="q-mr-md" v-show="!editMode" dense label="수정" @click="edit"/>
          <q-btn v-show="!editMode" dense label="삭제" @click="deleteItem(model)"/>
          <q-btn class="q-mr-md" v-show="editMode" dense label="저장하지 않기" @click="cancelEdit"/>
          <q-btn v-show="editMode" dense label="저장" @click="save"/>
        </div>
      </div>
      <q-input square outlined label="제목" v-model="model.title" v-show="editMode" class="full-width q-mb-md" style="overflow: hidden; word-break: keep-all;"/>
      <div v-show="!editMode" class="text-center q-mt-xl q-mb-xl">
        <h5>{{ model.title }}</h5>
      </div>
      <!--<vue-editor v-model="model.content" :editor-toolbar="customToolbar" :editorOptions="editorSettings" />-->
      <vue-editor class="full-width" v-show="editMode" v-model="model.content" :editorOptions="options"/>
      <div class="quillWrapper" v-show="!editMode">
        <div class="ql-container ql-snow" style="border: none;">
          <div class="ql-editor" v-html="model.content" style="padding: 0;"></div>
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
  props: [
    'id'
  ],
  data () {
    return {
      editMode: false,
      db: null,
      model: {
        title: '',
        content: ''
      },
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
    me.db = new me.$pouchDB('sm-content')
    me.search()
  },
  methods: {
    search () {
      const me = this
      me.db.get(me.id).then((result) => {
        me.model = result
      })
    },
    edit () {
      const me = this
      me.editMode = !me.editMode
    },
    cancelEdit () {
      const me = this
      me.editMode = false
      me.search()
    },
    deleteItem (item) {
      const me = this
      me.db.remove(me.model, { force: true }).then(res => {
        me.$router.push({ name: 'index' })
      })
    },
    save () {
      const me = this
      me.db.put(me.model, { force: true }).then(function (response) {
        me.editMode = false
      }).catch(function (err) {
        console.log(err)
      })
    },
    goPageIndex () {
      const me = this
      me.$router.push({ name: 'index' })
    }
  }
}
</script>
