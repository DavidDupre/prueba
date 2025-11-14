import { KJUR } from 'jsrsasign';

export const url='http://34.74.3.31:8080'


export const generateToken = () => {
  const oHeader = { alg: 'HS256', typ: 'JWT' };
  const METABASE_SECRET_KEY='6c6ef8eede20bb0b4566ff9d004af57eeecc21824dc565da83c7d2b6ac1d7aad'
  const payload = {
    resource: { dashboard: 6 },
    params: {},
    exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
  };
  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(payload);
  const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, { utf8: METABASE_SECRET_KEY });

  return sJWT;
};


