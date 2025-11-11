import fs from 'fs'
import satori from 'satori'
import { html } from "satori-html";
import sharp from 'sharp'
import { App } from 'vuepress'

export const ogpGeneratorPlugin = () => ({
  name: 'ogp-generator',
  async onGenerated(app: App) {
    const pages = app.pages
    const outDir = app.dir.dest("ogp")
    fs.mkdirSync(outDir, { recursive: true })

    // fontデータの読み取り
    const fontData = fs.readFileSync("docs/.vuepress/plugins/gemerate-ogp/font/Zen_Kaku_Gothic_New/ZenKakuGothicNew-Bold.ttf");

    // 画像ファイルの読み込み
    const imageBuffer = fs.readFileSync("docs/.vuepress/plugins/gemerate-ogp/ogp-background.jpg");
    // 画像ファイルをbase64形式にエンコード
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const imageData = `data:image/jpeg;base64,${imageBase64}`;

    for (const page of pages) {
      const title = page.title || 'No Title'
      // satori-htmlで文字列をVNodeに変換
      const vnode = html(`
 <div style="display:flex; justify-content:center; align-items:center; background-image: url(${imageData}); width:1200px; height:630px" >
  <div style="max-width: 780px; width: auto; height:340;font-size:64px; display:flex;">${title}</div>
 </div>
`);

      const svg = await satori(
        vnode,
        {
          width: 1200, height: 630,
          fonts: [
            {
              name: 'Zen Kaku Gothic New',
              data: fontData,
              style: 'normal',
            },
          ],
          embedFont: true,
        }
      )
      const jpg = await sharp(Buffer.from(svg)).jpeg().toBuffer()
      fs.writeFileSync(`${outDir}/${page.slug || 'no-title'}.jpg`, jpg)
    }
  },
})
