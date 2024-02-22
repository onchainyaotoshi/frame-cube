import satori from "satori";
import { html } from 'satori-html';
export const svgToDataUri = (svg) => {
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
};

export const fetch = async (...args) => (await import('node-fetch')).default(...args);

const inter = fetch(
  'https://og-playground.vercel.app/inter-latin-ext-400-normal.woff'
).then((res) => res.arrayBuffer());

const FONT_ARRAY_BUFFER = await inter;

const markup = (text) => html`
<div style="display: flex; align-items: center; justify-content: center; height: 100%; text-align:center; width: 100%;font-size:36px;">
  <div style="color: white;">${text}</div>
</div>
`;

const getDataUriFromText = async (text)=>{
    const svg = await satori(markup (text), {
        width: 1000,
        height: 1000/1.91,
        fonts: [
        {
            name: 'Inter',
            data: FONT_ARRAY_BUFFER,
            weight: 400,
            style: 'normal',
        },
        ],
    });

    return svgToDataUri(svg);
}


export default (req, res, next) => {
    // Attach the utility function to the request object
    req.textToDataUri = getDataUriFromText;

    next(); // Move to the next middleware or route handler
}