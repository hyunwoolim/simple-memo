<template>
  <q-page>
    <div class="q-pa-md full-width">
      <q-input square outlined label="제목" v-model="model.title" class="full-width q-mb-md"/>
      <div id="toolbar" ref="toolbar">
        <span class="ql-formats">
          <select class="ql-align"></select>
        </span>
        <span class="ql-formats">
          <select class="ql-size">
            <option value="huge">매우 크게</option>
            <option value="large">크게</option>
            <option selected>보통</option>
            <option value="small">작게</option>
          </select>
        </span>
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
          <button class="ql-strike"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-blockquote"></button>
          <button class="ql-code-block"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>
        </span>
        <span class="ql-formats">
          <select class="ql-color"></select>
          <select class="ql-background"></select>
        </span>
        <span class="ql-formats">
          <button class="ql-link"></button>
          <button class="ql-image"></button>
          <button class="ql-video"></button>
          <button class="ql-formula"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-clean"></button>
        </span>
      </div>
    </div>
    <div ref="editor"></div>
    <div class="q-pl-md q-pr-md q-pb-xl q-mb-xl full-width">
      <div style="border-top: 1px solid rgba(0, 0, 0, 0.24);"></div>
    </div>
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <q-btn round color="primary" icon="ion-ios-list" @click="goPageIndex"/>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="green" icon="ion-ios-save" @click="save"/>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[72, 18]">
      <q-btn round color="grey" icon="ion-ios-trash" @click="confirmDelete = true"/>
    </q-page-sticky>
    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-bar>
          <q-icon name="ion-ios-trash" />
          <div>메모 삭제</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>닫기</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div>이 메모를 삭제하시겠습니까?</div>
          <div>삭제된 메모는 복구할 수 없습니다.</div>
        </q-card-section>
        <q-card-section class="q-pt-none text-right">
          <q-btn flat label="삭제" color="primary" @click="deleteItem(model)" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-scroll-observer @scroll="onScroll" />
  </q-page>
</template>
<script>
import Quill from 'quill/dist/quill.min'
import 'quill/dist/quill.snow.css'
export default {
  name: 'PageDetail',
  props: [
    'id'
  ],
  data () {
    return {
      db: null,
      quill: null,
      editor: null,
      readonly: false,
      hasScroll: false,
      editMode: false,
      confirmDelete: false,
      model: {
        title: '',
        content: '',
        caption: '',
        createdDate: null
      },
      options: {
        modules: {
          toolbar: '#toolbar'
        },
        placeholder: '터치하여 입력하세요.',
        theme: 'snow'
      }
    }
  },
  created () {
    const me = this
    me.hasScroll = false
    if (!me.db) {
      me.db = new me.$pouchDB('sm-content')
    }
  },
  mounted () {
    const me = this
    let container = me.$refs.editor
    let editor = new Quill(container, me.options)
    me.editor = editor
    me.search()
  },
  methods: {
    goPageIndex () {
      const me = this
      me.$router.push({ name: 'index' })
    },
    search () {
      const me = this
      me.db.get(me.id).then((result) => {
        me.model = result
        me.$refs.editor.__quill.root.innerHTML = me.model.content
      })
    },
    save () {
      const me = this
      me.db.put({
        _id: me.model._id,
        _rev: me.model._rev,
        title: ((!me.model.title) ? '제목없음' : me.model.title),
        content: me.$refs.editor.__quill.root.innerHTML,
        caption: me.$refs.editor.textContent.trim().substr(0, 10),
        createdDate: new Date()
      }, { force: true }).then(res => {
        if (res.ok) {
          me.$q.notify({
            timeout: 100,
            color: 'green',
            position: 'top-right',
            icon: 'ion-ios-done-all',
            message: '저장되었습니다.'
          })
          me.$router.push({ name: 'detail', params: { id: res.id }, query: { path: Math.random() } })
        }
      }).catch(e => {
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
<style scoped lang="scss">
  .ql-tooltip {
    z-index: 9999 !important;
  }
  .ql-container.ql-snow {
    border: none;
  }
  .ql-toolbar.ql-snow {
  }
</style>
