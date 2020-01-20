
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { name: 'index', path: '', component: () => import('pages/Index.vue') },
      { name: 'create', path: '/create', component: () => import('pages/Create.vue') },
      { name: 'detail', path: '/data/:id', component: () => import('pages/Detail.vue'), props: true },
      { name: 'setting', path: '/setting', component: () => import('pages/Setting.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
