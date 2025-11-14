import Api from './Api';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { sgdeaAxios } from '.';



let url = "";
if (process.env.API) {
    url = process.env.API;
}

export default {
    async login(username: string, password: string): Promise<any> {
        try {
            ///api/v1/autenticacion/token/all/platforms
            const response = await sgdeaAxios.post('/api/v1/autenticacion/token/all/platforms', {
                username,
                password,
            }, {
                headers: {
                    'accept': "*/*",
                    "Content-Type": "application/json",

                }
            });

            return { response, username, password, error: false, message: ""}
        } catch (error: any) {
            console.error('Error logging in:', error.message);
            return {error: true, message: error.message}
        }
    },
    async refreshToken(refreshToken: string): Promise<any> {
    try {
      const response = await sgdeaAxios.post(
        "/api/v1/auth/refreshToken",
        {
          refresh_token: refreshToken,
        },
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      return { data: response.data, error: false };
    } catch (error: any) {
      console.error("Error refreshing token:", error.message);
      return { error: true, message: error.message };
    }
  },
};


