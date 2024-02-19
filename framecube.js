import ngrok from '@ngrok/ngrok';
import app from './app.js';
const port = process.env.PORT || 3000;

const server = await new Promise((resolve, reject) => {
  try{
    const _server = app.listen(port, () => {
      console.log('Express listening at ', _server.address().port);
      resolve(_server);
    });
  }catch(err){
    reject(err)
  }
});

const listener = await ngrok.connect({
  proto: 'http',
  addr: port,
  authtoken_from_env: true,
  domain: process.env.NGROK_DOMAIN
});

console.log(listener.url());