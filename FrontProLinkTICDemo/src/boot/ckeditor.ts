import { boot } from 'quasar/wrappers';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';

export default boot(({ app }) => {
  app.component('ckeditor', Ckeditor);
});