import { Client } from "@notionhq/client";
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
  auth: process.env.NOTION_TOKEN,
});

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

console.log(`Running test on ${pageId}`);

export {};
