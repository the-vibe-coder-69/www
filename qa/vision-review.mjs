import fs from "fs";
import path from "path";

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const defaultScreenshotDir = path.join(repoRoot, "qa", "screenshots");
const defaultReportDir = path.join(repoRoot, "qa", "reports");
const googleApiKey = process.env.GOOGLE_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;
const provider = googleApiKey ? "google" : openaiApiKey ? "openai" : null;
const model =
  provider === "google"
    ? process.env.GOOGLE_MODEL || "gemini-2.5-flash"
    : process.env.OPENAI_MODEL || "gpt-4o";

const schema = {
  name: "visual_qa_report",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      page: { type: "string" },
      score: { type: "integer", minimum: 1, maximum: 10 },
      status: { type: "string", enum: ["pass", "warn", "fail"] },
      summary: { type: "string" },
      findings: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            severity: { type: "string", enum: ["low", "medium", "high"] },
            category: {
              type: "string",
              enum: [
                "contrast",
                "spacing",
                "hierarchy",
                "alignment",
                "responsiveness",
                "clarity",
                "consistency",
                "overflow",
                "accessibility",
                "other",
              ],
            },
            location: { type: "string" },
            issue: { type: "string" },
            why_it_matters: { type: "string" },
            fix: { type: "string" },
            confidence: { type: "number", minimum: 0, maximum: 1 },
          },
          required: [
            "severity",
            "category",
            "location",
            "issue",
            "why_it_matters",
            "fix",
            "confidence",
          ],
        },
      },
    },
    required: ["page", "score", "status", "summary", "findings"],
  },
};

function parseArgs(argv) {
  const options = {
    dryRun: false,
    paths: [],
  };

  for (const arg of argv) {
    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    options.paths.push(path.resolve(process.cwd(), arg));
  }

  return options;
}

function getImagePaths(inputPaths) {
  const targets = inputPaths.length > 0 ? inputPaths : [defaultScreenshotDir];
  const imagePaths = [];

  for (const target of targets) {
    if (!fs.existsSync(target)) {
      continue;
    }

    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(target)) {
        const fullPath = path.join(target, entry);
        if (/\.(png|jpe?g|webp)$/i.test(fullPath)) {
          imagePaths.push(fullPath);
        }
      }
      continue;
    }

    if (/\.(png|jpe?g|webp)$/i.test(target)) {
      imagePaths.push(target);
    }
  }

  return imagePaths.sort();
}

function toDataUrl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".webp"
        ? "image/webp"
        : "image/png";
  const base64 = fs.readFileSync(filePath).toString("base64");
  return `data:${mime};base64,${base64}`;
}

async function reviewImage(filePath) {
  const pageName = path.basename(filePath, path.extname(filePath));
  const dataUrl = toDataUrl(filePath);

  if (provider === "google") {
    const [, meta, base64] = dataUrl.match(/^data:(.+);base64,(.+)$/) || [];
    if (!meta || !base64) {
      throw new Error(`Could not encode image for Gemini: ${filePath}`);
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
                  "You are a sharp web design QA reviewer. Review screenshots like a human design lead doing fast but accurate UI QA. Focus on visible issues only. Do not invent hidden code issues. Be strict about contrast, broken layout, hierarchy, spacing, alignment, CTA clarity, overflow, readability, and mobile/desktop visual problems. Return JSON only.",
              },
            ],
          },
          contents: [
            {
              parts: [
                {
                  text:
                    `Review this webpage screenshot for design/style quality. Page slug: ${pageName}.\n` +
                    "Return at most 8 findings.\n" +
                    "Use high severity only for obvious problems a human would likely want fixed now.\n" +
                    "If page looks solid, findings can be empty.\n" +
                    "Score meaning: 9-10 strong, 7-8 good with minor issues, 5-6 notable issues, 1-4 poor/broken.\n" +
                    "Status rules: fail if any high severity issue or score <= 4, warn if any medium issue or score <= 7, else pass.",
                },
                {
                  inlineData: {
                    mimeType: meta,
                    data: base64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseJsonSchema: schema.schema,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google API error ${response.status}: ${errorText}`);
    }

    const payload = await response.json();
    const outputText =
      payload.candidates?.[0]?.content?.parts?.find((item) => typeof item.text === "string")?.text;

    if (!outputText) {
      throw new Error(`No text returned for ${pageName}`);
    }

    return JSON.parse(outputText);
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are a sharp web design QA reviewer. Review screenshots like a human design lead doing fast but accurate UI QA. Focus on visible issues only. Do not invent hidden code issues. Be strict about contrast, broken layout, hierarchy, spacing, alignment, CTA clarity, overflow, readability, and mobile/desktop visual problems. Return JSON only.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                `Review this webpage screenshot for design/style quality. Page slug: ${pageName}.\n` +
                "Return at most 8 findings.\n" +
                "Use high severity only for obvious problems a human would likely want fixed now.\n" +
                "If page looks solid, findings can be empty.\n" +
                "Score meaning: 9-10 strong, 7-8 good with minor issues, 5-6 notable issues, 1-4 poor/broken.\n" +
                "Status rules: fail if any high severity issue or score <= 4, warn if any medium issue or score <= 7, else pass.",
            },
            {
              type: "input_image",
              image_url: dataUrl,
              detail: "high",
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: schema.name,
          strict: true,
          schema: schema.schema,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  const payload = await response.json();
  const content = payload.output?.[0]?.content ?? [];
  const outputText = content.find((item) => item.type === "output_text")?.text ?? payload.output_text;

  if (!outputText) {
    throw new Error(`No output_text returned for ${pageName}`);
  }

  return JSON.parse(outputText);
}

function summarize(allReports) {
  const findings = allReports.flatMap((report) =>
    report.findings.map((finding) => ({
      page: report.page,
      ...finding,
    })),
  );

  const counts = {
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
  };

  return {
    generated_at: new Date().toISOString(),
    model,
    page_count: allReports.length,
    pages: allReports,
    totals: counts,
    overall_status:
      counts.high > 0 ? "fail" : counts.medium > 0 ? "warn" : "pass",
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Visual QA Report");
  lines.push("");
  lines.push(`Generated: ${report.generated_at}`);
  lines.push(`Model: ${report.model}`);
  lines.push(`Overall status: ${report.overall_status}`);
  lines.push(`Pages reviewed: ${report.page_count}`);
  lines.push(
    `Findings: ${report.totals.high} high, ${report.totals.medium} medium, ${report.totals.low} low`,
  );
  lines.push("");

  for (const page of report.pages) {
    lines.push(`## ${page.page}`);
    lines.push("");
    lines.push(`- Status: ${page.status}`);
    lines.push(`- Score: ${page.score}/10`);
    lines.push(`- Summary: ${page.summary}`);

    if (page.findings.length === 0) {
      lines.push(`- Findings: none`);
      lines.push("");
      continue;
    }

    lines.push(`- Findings:`);
    for (const finding of page.findings) {
      lines.push(
        `  - [${finding.severity}] ${finding.category} at ${finding.location}: ${finding.issue} Fix: ${finding.fix}`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  const { dryRun, paths } = parseArgs(process.argv.slice(2));
  const imagePaths = getImagePaths(paths);

  if (imagePaths.length === 0) {
    throw new Error(`No screenshots found. Checked: ${paths.length ? paths.join(", ") : defaultScreenshotDir}`);
  }

  if (dryRun) {
    console.log(JSON.stringify({ dryRun: true, provider, model, images: imagePaths }, null, 2));
    return;
  }

  if (!provider) {
    throw new Error(
      "Missing API key. Set GOOGLE_API_KEY or OPENAI_API_KEY, then run `npm run qa:vision`.",
    );
  }

  fs.mkdirSync(defaultReportDir, { recursive: true });

  const reports = [];
  for (const imagePath of imagePaths) {
    console.log(`Reviewing ${path.basename(imagePath)}...`);
    reports.push(await reviewImage(imagePath));
  }

  const report = summarize(reports);
  const jsonPath = path.join(defaultReportDir, "vision-audit.json");
  const mdPath = path.join(defaultReportDir, "vision-audit.md");

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(mdPath, toMarkdown(report));

  console.log(`Saved JSON report to ${jsonPath}`);
  console.log(`Saved Markdown report to ${mdPath}`);
  console.log(`Overall status: ${report.overall_status}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
