import textToImage from 'text-to-image';


export default async (text, fontSize = 36)=>{
  return await textToImage.generate(text,{
    maxWidth: 1000,
    fontSize: fontSize,
    fontFamily: 'sans-serif',
    customHeight: 1000/1.91,
    bgColor: 'transparent',
    textColor: 'white',
    textAlign:'center',
    verticalAlign:'center'
  });
}