import fs from 'fs'
import satori from 'satori'
// import { html } from "satori-html";
import sharp from 'sharp'
// import { App } from 'vuepress'

export const ogpGeneratorPlugin = () => ({
  name: 'ogp-generator',
  async onGenerated(app) {
    const pages = app.pages
    const outDir = app.dir.dest('ogp')
    fs.mkdirSync(outDir, { recursive: true })

    // fontデータの読み取り
    const fontData = fs.readFileSync("docs/.vuepress/plugins/font/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Regular.ttf");
    
    for (const page of pages) {
      const title = page.title || 'No Title'
      console.log('page');
      console.log(page);
      // // satori-htmlで文字列をVNodeに変換
      // const vnode = html(`<div>${title}</div>`);
      const svg = await satori(
        // vnode,
        {
          type: 'div',
          props: {
            style: {
              width: '1200px',
              height: '630px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '48px',
              fontWeight: 'bold',
              background: '#fff',
              color: '#222',
            },
            children: title,
          },
        },
        { width: 1200, height: 630, fonts:[
          { name: 'Zen Kaku Gothic New',
            data: fontData,
            style: 'normal',
          },
          ],
          embedFont: true,
         }
      )
      const png = await sharp(Buffer.from(svg)).png().toBuffer()
      fs.writeFileSync(`${outDir}/${page.slug}.png`, png)
    }
  },
})

  
  // // satori-htmlで文字列をVNodeに変換
  // const vnode = html(`<div style="color: black;">hello, world</div>`);
  
  // // satoriでVNodeをSVGに変換
  // const svg = await satori(
  //   vnode,
  //   { width: 600, height: 400, fonts: [] },
  // );
  
  // sharpでSVGからPNGに変換
  // const png = await sharp(Buffer.from(svg)).png().toBuffer();
