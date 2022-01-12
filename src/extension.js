import vscode from "vscode";
import * as prettier from "prettier";
import * as twig from "prettier-plugin-twig-melody";

import tagsHov from "./hover/tags.json";
import filtersHov from "./hover/filters.json";
import functionsHov from "./hover/functions.json";

import prettierData from "./data/prettier.json";
import extensionData from "./data/extension.json";

/**
 *
 */
async function createHover(hovInfo, type) {
  const example = "example" in hovInfo ? hovInfo.example : "";
  const description = "description" in hovInfo ? hovInfo.description : "";

  return new vscode.Hover({
    language: type,
    value: example ? description + "\n\n" + example : description,
  });
}

/**
 *
 */
async function formatDocument(document, range) {
  const config = vscode.workspace.getConfiguration("twig.format");
  const prettierConfig = vscode.workspace.getConfiguration("prettier");

  let options = { plugins: [twig], parser: "melody" };

  prettierData.formatOptions.forEach((option) => {
    options[option] = prettierConfig[option];
  });

  for (let [option, value] of Object.entries(config.rules)) {
    options[option] = value;
  }

  options.twigMelodyPlugins = [
    "node_modules/prettier-plugin-twig-enhancements",
  ];

  if (true === config.enableCraftSupport) {
    options.twigMelodyPlugins.push("node_modules/prettier-twig-craft-cms");
  }

  let output = prettier.format(document.getText(range), options);

  return [vscode.TextEdit.replace(range, output)];
}

/**
 *
 */
function activate(context) {
  const config = vscode.workspace.getConfiguration("twig");
  const active = vscode.window.activeTextEditor;
  if (!active || !active.document) return;

  const type = "twig";

  // hover
  if (config.hover === true) {
    context.subscriptions.push(
      vscode.languages.registerHoverProvider(type, {
        provideHover(document, position) {
          const range = document.getWordRangeAtPosition(position);
          const word = document.getText(range);
          const hovCollection = [filtersHov, functionsHov, tagsHov];

          for (const hovSet of hovCollection) {
            for (const hovItem in hovSet) {
              const hovItemData = hovSet[hovItem];

              if (hovItemData.prefix == word) {
                return createHover(hovItemData, type);
              }
            }
          }
        },
      })
    );
  }

  // formatting
  if (config.format.enable === true) {
    context.subscriptions.push(
      vscode.languages.registerDocumentFormattingEditProvider(type, {
        provideDocumentFormattingEdits(document) {
          let start = new vscode.Position(0, 0);
          let end = new vscode.Position(
            document.lineCount - 1,
            document.lineAt(document.lineCount - 1).text.length
          );

          return formatDocument(document, new vscode.Range(start, end));
        },
      })
    );

    // range formatting
    context.subscriptions.push(
      vscode.languages.registerDocumentRangeFormattingEditProvider(type, {
        provideDocumentRangeFormattingEdits(document, range) {
          let start = new vscode.Position(range.start.line, 0);
          let end =
            range.end.character === 0
              ? range.end.translate(-1, Number.MAX_VALUE)
              : range.end.translate(0, Number.MAX_VALUE);

          return formatDocument(document, new vscode.Range(start, end));
        },
      })
    );
  }
}

exports.activate = activate;
