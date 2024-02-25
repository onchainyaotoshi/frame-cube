import ngrok from '@ngrok/ngrok';
import app, {isLive} from '@root/app.js';
import {initialize as initializeDB} from '@root/utils/db.js';

const port = process.env.PORT || 3000;

await new Promise((resolve, reject) => {
  try{
    const _server = app.listen(port, () => {
      console.log('Express listening at ', _server.address().port);
      resolve(_server);
    });
  }catch(err){
    reject(err)
  }
});

await initializeDB();

if(!isLive()){
  const listener = await ngrok.connect({
    proto: 'http',
    addr: port,
    authtoken_from_env: true,
    domain: process.env.FC_DOMAIN.replace("https://","")
  });
  
  console.log(listener.url());
}