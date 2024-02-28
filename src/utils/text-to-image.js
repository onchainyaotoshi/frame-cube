import satori from "satori";
import { html } from 'satori-html';
import fs from 'fs/promises';
import path from 'path';
import textToImage from 'text-to-image';

import { createPathContext } from '@utils/path-resolver.js';
const { resolvePath } = createPathContext(import.meta.url);

export const svgToDataUri = (svg) => {
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
};


const inter = await fs.readFile(resolvePath(path.join("..",'public','fonts','inter-all-400-normal.woff')));
const markup = (text) => html`
<div style="display: flex; align-items: center; justify-content: center; height: 100%; text-align:center; width: 100%;font-size:24px;">
  <div style="color: white;">${text}</div>
</div>
`;

export default async (text, useSatori = false)=>{

  if(!useSatori){
    return await textToImage.generate(text,{
      maxWidth: 1000,
      fontSize: 36,
      fontFamily: 'sans-serif',
      customHeight: 1000/1.91,
      bgColor: 'transparent',
      textColor: 'white',
      textAlign:'center',
      verticalAlign:'center'
    });
  }else{
    const svg = await satori(markup (text), {
        width: 1000,
        height: 1000/1.91,
        fonts: [
        {
            name: 'Inter',
            data: inter,
            weight: 400,
            style: 'normal',
        },
        ],
    });

    return svgToDataUri(svg);
  }
}