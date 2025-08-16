import { readFileSync, writeFileSync } from "node:fs";
import Parser from "rss-parser";

const readmePath = "README.md";
let readmeContent = readFileSync(readmePath, "utf8");

const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});

(async () => {
  try {
    console.log("🚀 README 업데이트 시작...");
    const feed = await parser.parseURL("https://kimsangjunzzang.tistory.com/rss");

    let latestPosts = "### Latest Blog Posts\n\n";
    for (let i = 0; i < 5 && i < feed.items.length; i++) {
      const { title, link } = feed.items[i];
      latestPosts += `- [${title}](${link})\n`;
    }

    const newReadmeContent = readmeContent.includes("### Latest Blog Posts")
      ? readmeContent.replace(
          /### Latest Blog Posts[\s\S]*?(?=\n\n## |\n$)/,
          latestPosts
        )
      : readmeContent + latestPosts;

    if (newReadmeContent !== readmeContent) {
      writeFileSync(readmePath, newReadmeContent, "utf8");
      console.log("✅ README.md 업데이트 완료!");
    } else {
      console.log("ℹ️ 새로운 블로그 포스트가 없습니다.");
    }
  } catch (error) {
    console.error("❌ 에러 발생:", error);
  }
})();
