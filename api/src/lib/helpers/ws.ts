import { FastifyInstance } from 'fastify';
import fastifyWS from '@fastify/websocket';
import handleAccessToken from './handleAccessToken';


export function registerWS(app: FastifyInstance) {
  app.register(fastifyWS);

  app.addHook('preValidation', async (request, reply) => {
    const res = handleAccessToken(request.headers.authorization);
    if (!res.ok) {
      await reply.code(401).send(res.message);
    }
  });

  app.register(async function (fastify) {
    fastify.get(
      '/',
      { websocket: true },
      (connection /* SocketStream */, req /* FastifyRequest */) => {
        connection.socket.on('message', (message) => {
          // message.toString() === 'hi from client'
          connection.socket.send('hi from server');
        });
      }
    );
  });
}
