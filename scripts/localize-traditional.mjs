import {readFile, readdir, writeFile} from "node:fs/promises";
import {Converter} from "opencc-js/cn2t";

const convertScript = Converter({from: "cn", to: "twp"});
const convert = (value) => convertScript(value).replaceAll("解除安裝", "卸載");
const translateValues = (value) => typeof value === "string"
  ? (/^(?:https?:\/\/|\/|#)/.test(value) ? value : convert(value))
  : Array.isArray(value) ? value.map(translateValues)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.entries(value).map(([key, text]) => [key, translateValues(text)]))
    : value;

const original = JSON.parse(await readFile("messages/zh-cn.json", "utf8"));
const previous = JSON.parse(await readFile("messages/zh-tw.json", "utf8"));
await writeFile("messages/zh-tw.json", `${JSON.stringify({...translateValues(original), pilot: previous.pilot}, null, 2)}\n`);
let count = 0;
for (const filename of await readdir("content/zh-cn/guides")) {
  if (!filename.endsWith(".mdx")) continue;
  const source = await readFile(`content/zh-cn/guides/${filename}`, "utf8");
  const localized = convert(source).replaceAll("/zh-cn/", "/zh-tw/");
  await writeFile(`content/zh-tw/guides/${filename}`, localized);
  count++;
}
console.log(`Generated ${count} Traditional Chinese guides and the complete UI dictionary. Review before publishing.`);
