import { Client, LogLevel } from "@notionhq/client";
import type { Block, RichText } from "@notionhq/client/build/src/api-types";
import chalk from "chalk";
import * as dotenv from "dotenv";
import yargs from "yargs";

dotenv.config();

const parser = yargs.options({
  "api-key": { type: "string", demandOption: false, alias: "a" },
  "page-id": { type: "string", demandOption: false, alias: "id" },
});

const apiKey = parser.parseSync()["api-key"] || process.env.NOTION_API_KEY;
const pageId = parser.parseSync()["page-id"] || process.env.NOTION_PAGE_ID;

if (apiKey === undefined) {
  console.error(chalk.red.bold("Missing NOTION_API_KEY environment variable"));
  process.exit(1);
}

if (pageId === undefined) {
  console.error(chalk.red.bold("Missing NOTION_PAGE_ID environment variable"));
  process.exit(1);
}

const notion = new Client({
  auth: apiKey,
  logLevel: LogLevel.DEBUG,
});

export const getBlocks = async (blockId: string) => {
  const response = await notion.blocks.children.list({ block_id: blockId });
  return response;
};

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export const getUsers = async () => {
  const response = await notion.users.list();
  return response;
};

export const block2md = (block: Block) => {
  switch (block.type) {
    case "paragraph":
      return block.paragraph.text.reduce((pre, cur) => {
        return pre + parseRichText(cur);
      }, "");
    case "heading_1":
      return block.heading_1.text.reduce((pre, cur) => {
        return pre + parseRichText(cur);
      }, "# ");
    case "heading_2":
      return block.heading_2.text.reduce((pre, cur) => {
        return pre + parseRichText(cur);
      }, "## ");
    case "heading_3":
      return block.heading_3.text.reduce((pre, cur) => {
        return pre + parseRichText(cur);
      }, "### ");
    default:
      return "";
  }
};

export const parseRichText = (richText: RichText) => {
  const plainText = richText.plain_text;
  if (richText.annotations.bold && richText.annotations.italic) {
    return `***${plainText}***`;
  }
  if (richText.annotations.bold) {
    return `**${plainText}**`;
  }
  if (richText.annotations.underline) {
    return `<ins>${plainText}<ins>`;
  }
  if (richText.annotations.italic) {
    return `_${plainText}_`;
  }
  if (richText.annotations.strikethrough) {
    return `~~${plainText}~~`;
  }
  return plainText;
};

void (async () => {
  const response = await getBlocks(pageId);
  response.results.forEach(block => {
    console.log(block2md(block));
  });
})();
