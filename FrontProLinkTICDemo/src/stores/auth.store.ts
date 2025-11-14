import { defineStore } from "pinia";
import service from "src/services/LoginService";

interface UserInfo {
  userid: string | number;
  username: string;
  role: string;
  name: string;
  bonitaId: string;
  oficina: number;
  dependencia: number;
  relations: Relations[];
  puntoRadicacion: number;
  mensajeAcceso?: string
}

interface Relations {
  idOficina?: number;
  oficina?: string;
  idDependencia: number;
  dependencia: string;
  puntoRadicacion: number;
  idRol: number;
  rol: string;
  modulo: string;
}

let refreshTimeoutId: number | undefined;

// @ts-ignore
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    refreshToken: null,
    expire: null,
    relations: [] as {
      idDependencia: number;
      idRol: number;
      idOficina: number;
      dependencia: string;
      puntoRadicacion: number;
      rol: string;
      oficina: string;
    }[],
    userInfo: {
      
      userid: null,
      username: null,
      mensajeAcceso: null,
      role: null,
      name: null,
      bonitaId: null,
      oficina: null,
      dependencia: null,
      relations: [],
      puntoRadicacion: null,
      isCertificado: false,
    },
    initialUserInfo: {
      userid: null,
      username: null,
      mensajeAcceso: null,
      role: null,
      name: null,
      bonitaId: null,
      oficina: null,
      dependencia: null,
      relations: [],
      puntoRadicacion: null,
    },
    hasManyRels: false,
    isLogged: false,
    errorLogin: false,
    bonitaToken: null,
    tokenBpm: null,
    tokenJSession: null,
  }),
  actions: {
    async login(username: string, password: string) {
      const { response, error } = (await service.login(
        username,
        password
      )) as any;
      if (error) {
        this.isLogged = false;
        this.errorLogin = true;
      } else if (response.status == 200 || response.status == 201) {
        this.tokenBpm = response.data.tokenBpm;
        this.token = response.data.tokenIDP.accessToken;
        this.refreshToken = response.data.tokenIDP.refreshToken;
        this.tokenJSession = response.data.jsessionid;
        this.relations = response.data.relaciones.map((rel: Relations) => ({
          ...rel,
          rol: rel.rol,
        }));
        this.hasManyRels = this.relations.length > 1;

        this.setToken(
          response.data.tokenIDP.accessToken,
          response.data.tokenIDP.refreshToken,
          response.data.tokenIDP.expiresIn
        );

        this.userInfo = {
          userid: response.data.userId,
          username: response.data.username,
          mensajeAcceso:response.data.mensajeAcceso,
          role: this.relations.length > 1 ? "" : this.relations[0].rol,
          name: response.data.userFullName,
          bonitaId: response.data.bonitaUserId,
          oficina: this.relations[0].idOficina,
          dependencia: this.relations[0].idDependencia,
          puntoRadicacion: this.relations[0].idPuntoRadicacion,
          relations: this.relations,
          email: response.data.email,
          modulo: response.data.modulo,
          isCertificado: response.data.isCertificado || false,
        };
        this.isLogged = true;
      }
    },

    setToken(accessToken: string, refreshToken: string, expiresIn: number) {
      this.token = accessToken;
      this.refreshToken = refreshToken;
      // Convierte los segundos a fecha absoluta
      const now = Math.floor(Date.now() / 1000);
      this.expire = now + expiresIn;
      this.scheduleTokenRefresh();
    },

    async refreshTokenAction() {
      try {
        const { data, error } = await service.refreshToken(this.refreshToken!);
        if (error) throw new Error();
        this.setToken(data.accessToken, data.refreshToken, data.expiresIn);
        return true;
      } catch {
        this.logOut();
        return false;
      }
    },
    scheduleTokenRefresh() {
      if (!this.token || !this.expire) return;
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = this.expire - now;
      const refreshBefore = 60;

      if (refreshTimeoutId) clearTimeout(refreshTimeoutId);

      if (secondsLeft <= refreshBefore) {
        // Token casi expirado, refresca ahora
        this.refreshTokenAction();
        return;
      }
      refreshTimeoutId = window.setTimeout(() => {
        this.refreshTokenAction().then(() => this.scheduleTokenRefresh());
      }, (secondsLeft - refreshBefore) * 1000);
    },

    async cleanInfo() {
      this.token = null;
      this.refreshToken = null;
      this.expire = null;
      this.isLogged = false;
      this.userInfo = this.initialUserInfo;
      this.relations = [];
      this.hasManyRels = false;
      this.errorLogin = false;
      this.email = false;
    },
    async logOut() {
      this.token = null;
      this.refreshToken = null;
      this.expire = null;
      if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
      this.tokenBpm = null;
      this.tokenJSession = null;
      this.isLogged = false;
      this.userInfo = this.initialUserInfo;
      this.userRoles = [];
      this.hasManyRoles = false;
      this.email = null;

      this.$reset();
      localStorage.removeItem("auth");
    },

    getUserInfo(): UserInfo {
      return this.userInfo;
    },

    async setRelationByRole(role: number) {
      const relation = this.relations.find(
        (rel: Relations) => rel.idRol === role
      );
      if (relation) {
        this.userInfo.role = relation.rol;
        this.userInfo.dependencia = relation.idDependencia;
        this.userInfo.oficina = relation.idOficina;
        this.userInfo.puntoRadicacion = relation.idPuntoRadicacion;
      }
    },

    async setRelationByRoleAndUbicacion(
      idRol: number,
      oficinaOdependenciaId: number
    ) {
      const relation = this.relations.find(
        (rel: Relations) =>
          rel.idRol === idRol &&
          (rel.idOficina === oficinaOdependenciaId ||
            rel.idDependencia === oficinaOdependenciaId)
      );

      if (relation) {
        this.userInfo.role = relation.rol;
        this.userInfo.dependencia = relation.idDependencia;
        this.userInfo.oficina = relation.idOficina;
        this.userInfo.puntoRadicacion = relation.idPuntoRadicacion;
      } else {
        console.warn("No se encontró una relación con ese rol y esa ubicación");
      }
    },
    async setRelationByRelationIndex(index: number) {
      const relation = this.relations[index];
      if (!relation) {
        console.warn("No existe la relación en esa posición");
        return;
      }

      this.userInfo.role = relation.rol;
      this.userInfo.dependencia = relation.idDependencia;
      this.userInfo.oficina = relation.idOficina;
      this.userInfo.puntoRadicacion = relation.idPuntoRadicacion;
    },
    async getRelations() {
      return { roles: this.relations, many: this.hasManyRels };
    },
  },
  persist: true,
});
