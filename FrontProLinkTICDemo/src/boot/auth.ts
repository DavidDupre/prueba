import {Notify} from "quasar";
import { boot } from 'quasar/wrappers';
const notifyAuthenticationError = (message) => Notify.create({
  color: 'negative',
  position: 'top',
  icon: 'report_problem',
  message: `Error de autentificación: ${message || 'Por favor revisa tus permisos'}`
})

function validateRouteAuthorization (to: any, from: any, next: any) {
  const requiresAuthorization = to.matched.some(route => route.meta.allowedRoles)
  const auth = JSON.parse(localStorage.getItem('auth'))
  const user = auth ? auth.userInfo : null

  // this route requires plugins
  if (requiresAuthorization) {
    for (var i = 0; i < to.matched.length; i++) {
      const route = to.matched[i];

      if (route.meta.allowedRoles) {
        const userHasValidRole = route.meta.allowedRoles.some(
          allowedRole => user.relations.some(
            userRelation => userRelation.rol.toLowerCase() === allowedRole.toLowerCase()
          )
        );
        if (userHasValidRole) {
          return next()
        } else {
          const redirect = {
            path: '/',
          }

          notifyAuthenticationError('No autorizado')
          return next(redirect)
        }
      }
    }
  }

  return next()
}

export default boot(({ app, router }) => {
  router.beforeEach(validateRouteAuthorization)
})
