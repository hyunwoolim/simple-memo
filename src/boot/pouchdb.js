import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
export default async ({ Vue }) => {
  PouchDB.plugin(PouchDBFind)
  Vue.prototype.$pouchDB = PouchDB
}
