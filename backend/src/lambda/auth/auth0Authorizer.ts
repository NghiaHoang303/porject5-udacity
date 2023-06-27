import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { verify, decode, Algorithm } from 'jsonwebtoken'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import Axios from 'axios'
import 'source-map-support/register'
import getSigninKeys from './getSigninKeys'

const ALGORITHMS: Algorithm[] = ['RS256']
const logger = createLogger('auth')
const jwksUrl = 'https://dev-i8q3p41zvqi3fbyq.us.auth0.com/.well-known/jwks.json'

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const valueToken = getToken(authHeader);
  //decode JWT
  const jwt: Jwt = decode(valueToken, { complete: true }) as Jwt;

  const kid: string = jwt.header.kid;
  let res = await Axios.get(jwksUrl);
  const publicKey: string = await getSigninKeys(res.data.keys,kid);

  return verify(valueToken, publicKey, { algorithms: ALGORITHMS}) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header');

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header');

  const split = authHeader.split(' ');
  const valueToken = split[1];

  return valueToken;
}

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorize a user', event.authorizationToken);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info('jwtToken: ', jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    };
  } catch (error) {
    logger.error('Error authorized', { error: error.message });

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    };
  }
}

