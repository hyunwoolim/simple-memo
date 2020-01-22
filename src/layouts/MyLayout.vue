<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title class="absolute-center cursor-pointer" @click="goPageIndex">
          Simple Memo
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>메뉴</q-item-label>
        <q-item clickable tag="a" target="_blank" @click="goPageIndex">
          <q-item-section avatar>
            <q-icon name="ion-ios-list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>메모 목록</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" @click="goPageSetting">
          <q-item-section avatar>
            <q-icon name="ion-ios-settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>설정</q-item-label>
            <!--<q-item-label caption></q-item-label>-->
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    goPageIndex () {
      const me = this
      me.$router.push({ name: 'index', query: { path: Math.random() } })
    },
    goPageSetting () {
      const me = this
      me.$router.push({ name: 'setting', query: { path: Math.random() } })
    }
  }
}
</script>
