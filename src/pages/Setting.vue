<template>
  <q-page>
    <div class="q-pa-md full-width">
      <div class="text-center q-mb-md" style="font-size: 20px;">
        설정
      </div>
      <q-list bordered separator v-ripple clickable @click="confirmDestroyDB">
        <q-item>
          <q-item-section>
            데이터 초기화
          </q-item-section>
          <q-item-section side>
            <q-btn round flat icon="ion-ios-trash"></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-dialog v-model="confirmDestroy" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">데이터 초기화</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div>초기화를 위해 <b>'완전삭제'</b>를 입력해주세요.</div>
          <div>모든 데이터가 삭제됩니다.</div>
          <q-input dense ref="confirmDestroyMessage" v-model="confirmDestroyMessage" autofocus :rules="[val => (val === '완전삭제') || '삭제할 수 없습니다.']" lazy-rules/>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="취소" color="primary" v-close-popup />
          <q-btn flat label="초기화" color="primary" @click="destroyDB"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
export default {
  name: 'PageSetting',
  data () {
    return {
      confirmDestroy: false,
      confirmDestroyMessage: '',
      db: null
    }
  },
  components: {
  },
  created () {
    const me = this
    me.confirmDestroyMessage = ''
    if (!me.db) {
      me.db = new me.$pouchDB('sm-content')
    }
  },
  methods: {
    confirmDestroyDB () {
      const me = this
      me.confirmDestroy = true
    },
    destroyDB () {
      const me = this
      if (me.confirmDestroyMessage === '완전삭제') {
        if (me.db) {
          me.db.destroy().then(res => {
            me.confirmDestroy = false
          })
        } else {
          me.db = new me.$pouchDB('sm-content')
          me.db.destroy().then(res => {
            me.confirmDestroy = false
          })
        }
      }
    }
  }
}
</script>
