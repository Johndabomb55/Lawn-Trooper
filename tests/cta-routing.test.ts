import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as ts from "typescript";

const ROOT = resolve(__dirname, "..");

const BUILDER_HREF = "/#builder";

type ExpectedCta = {
  label: string;
  expectedHref?: string;
};

const EXPECTED_CTAS: Record<string, ExpectedCta[]> = {
  "client/src/components/SiteHeader.tsx": [
    { label: "Plan builder" },
    { label: "Plan builder" },
  ],
  "client/src/pages/home.tsx": [
    { label: "{CALL_FUNNEL_COPY.builderCta}" },
  ],
  "client/src/pages/promotions.tsx": [
    { label: "Reserve My Plan" },
  ],
  "client/src/pages/services.tsx": [
    { label: "Get Your Instant Quote" },
    { label: "Schedule Your Walkthrough" },
  ],
  "client/src/pages/service-area.tsx": [
    { label: "Check Availability" },
  ],
  "client/src/pages/dream-yard-recon.tsx": [
    { label: "Unlock Your Dream Yard" },
    { label: "Reserve My Plan" },
  ],
  "client/src/pages/hoa-partnerships.tsx": [
    { label: "Start Residential Plan Builder" },
  ],
  "client/src/pages/call-first.tsx": [
    { label: "{b.primaryButton}" },
    { label: "{CALL_NAV_BUILDER_SHORT}" },
  ],
};

const BUILDER_HOST_FILE = "client/src/pages/home-v2.tsx";

type FoundCta = {
  file: string;
  href: string | null;
  label: string;
  line: number;
};

function getJsxTagName(node: ts.JsxElement | ts.JsxSelfClosingElement): string {
  const tag =
    node.kind === ts.SyntaxKind.JsxElement
      ? node.openingElement.tagName
      : node.tagName;
  return tag.getText();
}

function getJsxAttributes(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
): ts.NodeArray<ts.JsxAttributeLike> {
  return node.kind === ts.SyntaxKind.JsxElement
    ? node.openingElement.attributes.properties
    : node.attributes.properties;
}

function getStringAttribute(
  node: ts.JsxElement | ts.JsxSelfClosingElement,
  name: string,
): string | null {
  for (const attr of getJsxAttributes(node)) {
    if (!ts.isJsxAttribute(attr)) continue;
    if (attr.name.getText() !== name) continue;
    const init = attr.initializer;
    if (!init) return "";
    if (ts.isStringLiteral(init)) return init.text;
    if (ts.isJsxExpression(init) && init.expression) {
      if (
        ts.isStringLiteral(init.expression) ||
        ts.isNoSubstitutionTemplateLiteral(init.expression)
      ) {
        return init.expression.text;
      }
      // dynamic expression — represent as raw text in braces
      return `{${init.expression.getText()}}`;
    }
  }
  return null;
}

function extractTextLabel(node: ts.Node): string {
  const parts: string[] = [];
  function walk(n: ts.Node) {
    if (ts.isJsxText(n)) {
      const t = n.text.trim();
      if (t) parts.push(t);
      return;
    }
    if (ts.isJsxExpression(n)) {
      if (n.expression) {
        if (
          ts.isStringLiteral(n.expression) ||
          ts.isNoSubstitutionTemplateLiteral(n.expression)
        ) {
          parts.push(n.expression.text);
        } else {
          parts.push(`{${n.expression.getText()}}`);
        }
      }
      return;
    }
    if (ts.isJsxElement(n)) {
      n.children.forEach(walk);
      return;
    }
    if (ts.isJsxFragment(n)) {
      n.children.forEach(walk);
      return;
    }
    if (ts.isJsxSelfClosingElement(n)) {
      // self-closing, no text children
      return;
    }
    n.forEachChild(walk);
  }
  if (ts.isJsxElement(node)) {
    node.children.forEach(walk);
  } else {
    walk(node);
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function isLinkLikeTag(name: string): boolean {
  return name === "a" || name === "Link";
}

function isButtonLikeTag(name: string): boolean {
  return name === "Button" || name === "CTAButton";
}

function findCtaLinks(file: string): FoundCta[] {
  const fullPath = resolve(ROOT, file);
  const source = readFileSync(fullPath, "utf-8");
  const sf = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const found: FoundCta[] = [];

  function visit(node: ts.Node) {
    if (ts.isJsxElement(node)) {
      const tag = getJsxTagName(node);
      if (isLinkLikeTag(tag)) {
        // Look for a button-like child JSX element inside this link.
        let buttonChild: ts.JsxElement | ts.JsxSelfClosingElement | null = null;
        function findButton(n: ts.Node) {
          if (buttonChild) return;
          if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
            const childTag = getJsxTagName(n);
            if (isButtonLikeTag(childTag)) {
              buttonChild = n;
              return;
            }
          }
          n.forEachChild(findButton);
        }
        node.children.forEach(findButton);

        if (buttonChild) {
          const href = getStringAttribute(node, "href");
          const label =
            buttonChild.kind === ts.SyntaxKind.JsxElement
              ? extractTextLabel(buttonChild)
              : "";
          const { line } = sf.getLineAndCharacterOfPosition(node.getStart());
          found.push({ file, href, label, line: line + 1 });
        }
      }
    }
    node.forEachChild(visit);
  }

  visit(sf);
  return found;
}

describe("Builder CTA routing", () => {
  for (const [file, expectedCtas] of Object.entries(EXPECTED_CTAS)) {
    describe(file, () => {
      const links = findCtaLinks(file);

      it("finds at least one CTA link", () => {
        expect(
          links.length,
          `Expected to find at least one <a>/<Link> wrapping a Button in ${file}, but found none. ` +
            `Did the file structure change?`,
        ).toBeGreaterThan(0);
      });

      for (const expected of expectedCtas) {
        it(`CTA "${expected.label}" routes to ${expected.expectedHref ?? BUILDER_HREF}`, () => {
          const target = expected.expectedHref ?? BUILDER_HREF;
          const matches = links.filter((l) => l.label === expected.label);
          expect(
            matches.length,
            `Could not find a CTA with label "${expected.label}" in ${file}. ` +
              `Available CTAs:\n` +
              links
                .map((l) => `  line ${l.line}: label="${l.label}" href="${l.href}"`)
                .join("\n"),
          ).toBeGreaterThan(0);

          for (const match of matches) {
            expect(
              match.href,
              `CTA "${expected.label}" in ${file} (line ${match.line}) ` +
                `should route to "${target}" but its href is "${match.href}". ` +
                `If you intentionally moved this CTA, update tests/cta-routing.test.ts.`,
            ).toBe(target);
          }
        });
      }

      it(`every link to ${BUILDER_HREF} is registered as a known builder CTA`, () => {
        const builderLinks = links.filter((l) => l.href === BUILDER_HREF);
        const expectedLabels = new Set(expectedCtas.map((c) => c.label));
        const orphans = builderLinks.filter((l) => !expectedLabels.has(l.label));
        expect(
          orphans,
          `Found <a>/<Link href="${BUILDER_HREF}"> wrapping a Button in ${file} ` +
            `that is not registered in tests/cta-routing.test.ts. Add it to the ` +
            `registry so future edits are protected:\n` +
            orphans
              .map((l) => `  line ${l.line}: label="${l.label}"`)
              .join("\n"),
        ).toEqual([]);
      });
    });
  }

  describe(BUILDER_HOST_FILE, () => {
    it(`exposes a section with id="builder" so /#builder lands on the homepage builder`, () => {
      const source = readFileSync(resolve(ROOT, BUILDER_HOST_FILE), "utf-8");
      expect(
        source,
        `${BUILDER_HOST_FILE} must contain a section with id="builder" so all ` +
          `/#builder CTAs land on the homepage builder.`,
      ).toMatch(/id=["']builder["']/);
    });
  });
});
