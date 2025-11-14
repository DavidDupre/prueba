import { boot } from 'quasar/wrappers';
import lazy from 'src/directives/lazy';

export default boot(({ app }) => {
  app.directive('lazy', lazy);
});
