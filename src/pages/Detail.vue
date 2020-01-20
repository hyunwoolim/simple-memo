<template>
  <q-page>
    <div class="q-pa-md full-width">
      <div class="row">
        <div class="col-xs-4 text-left q-mb-md">
          <q-btn outline label="목록" @click="goPageIndex"></q-btn>
        </div>
        <div class="col-xs-8 text-right q-mb-md">
          <q-btn class="q-mr-md" v-show="!editMode" outline label="수정" @click="edit"/>
          <q-btn v-show="!editMode" outline label="삭제" @click="confirmDeleteItem(model)"/>
          <q-btn class="q-mr-md" v-show="editMode" outline label="저장하지 않기" @click="cancelEdit"/>
          <q-btn v-show="editMode" outline label="저장" @click="save"/>
        </div>
      </div>
      <q-input square outlined label="제목" v-model="model.title" v-show="editMode" class="full-width q-mb-md" style="overflow: hidden; word-break: keep-all;"/>
      <div v-show="!editMode" class="text-center q-mt-xl q-mb-xl">
        <h5>{{ model.title }}</h5>
        <div class="text-right">{{$moment(model.createdDate).format('LLLL')}}</div>
      </div>
      <!--<vue-editor v-model="model.content" :editor-toolbar="customToolbar" :editorOptions="editorSettings" />-->
      <vue-editor class="full-width" v-show="editMode" v-model="model.content" :editorOptions="options"/>
      <div class="quillWrapper" v-show="!editMode">
        <div class="ql-container ql-snow" style="border: none;">
          <div class="ql-editor" v-html="model.content" style="padding: 0;"></div>
        </div>
      </div>
      <div v-show="hasScroll" class="row q-mt-md">
        <div class="col-xs-4 text-left">
          <q-btn outline label="목록" @click="goPageIndex"></q-btn>
        </div>
        <div class="col-xs-8 text-right">
          <q-btn class="q-mr-md" v-show="!editMode" outline label="수정" @click="edit"/>
          <q-btn v-show="!editMode" outline label="삭제" @click="confirmDeleteItem(model)"/>
          <q-btn class="q-mr-md" v-show="editMode" outline label="저장하지 않기" @click="cancelEdit"/>
          <q-btn v-show="editMode" outline label="저장" @click="save"/>
        </div>
      </div>
    </div>
    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">메모 삭제</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div>이 메모를 삭제하시겠습니까?</div>
          <div>삭제된 메모는 복구할 수 없습니다.</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="취소" color="primary" v-close-popup />
          <q-btn flat label="삭제" color="primary" @click="deleteItem(model)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  props: [
    'id'
  ],
  data () {
    return {
      db: null,
      hasScroll: false,
      editMode: false,
      confirmDelete: false,
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
    me.hasScroll = false
    if (!me.db) {
      me.db = new me.$pouchDB('sm-content')
    }
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
        if (res.ok) {
          me.$q.notify({
            timeout: 100,
            color: 'green',
            position: 'top-right',
            icon: 'ion-ios-done-all',
            message: '삭제되었습니다.'
          })
          me.$router.push({ name: 'index' })
        }
      })
    },
    confirmDeleteItem (item) {
      const me = this
      me.confirmDelete = true
    },
    save () {
      const me = this
      me.db.put(me.model, { force: true }).then(res => {
        if (res.ok) {
          me.$q.notify({
            timeout: 100,
            color: 'green',
            position: 'top-right',
            icon: 'ion-ios-done-all',
            message: '저장되었습니다.'
          })
        }
        me.editMode = false
      }).catch(function (err) {
        console.log(err)
      })
    },
    goPageIndex () {
      const me = this
      me.$router.push({ name: 'index' })
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
