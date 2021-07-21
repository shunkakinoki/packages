import { Client } from "@notionhq/client";
import yargs from "yargs";

const parser = yargs.options({
  api: { type: "string", demandOption: true, alias: "a" },
});

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

console.log(`Running test on ${parser.parseSync().api}`);

export {};
