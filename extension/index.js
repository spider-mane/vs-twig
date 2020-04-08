'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vscode = _interopDefault(require('vscode'));
var prettier = require('prettier');
var twig = require('prettier-plugin-twig-melody');

var tagsHov = {show:{prefix:"show",body:"{{ $1 }}",description:"{{ }}"},execute:{prefix:"execute",body:"{% $1 %}",description:"{% %}"},autoescape:{prefix:"autoescape",body:["{% autoescape %}","\t$1","{% endautoescape %}"],description:"Whether automatic escaping is enabled or not, you can mark a section of a template to be escaped or not by using the autoescape tag",example:"{% autoescape %}\n    Everything will be automatically escaped in this block\n    using the HTML strategy\n{% endautoescape %}\n\n{% autoescape 'html' %}\n    Everything will be automatically escaped in this block\n    using the HTML strategy\n{% endautoescape %}\n\n{% autoescape 'js' %}\n    Everything will be automatically escaped in this block\n    using the js escaping strategy\n{% endautoescape %}\n\n{% autoescape false %}\n    Everything will be outputted as is in this block\n{% endautoescape %}"},block:{prefix:"block",body:["{% block ${name} %}","\t$1","{% endblock ${name} %}"],description:"When a template uses inheritance and if you want to print a block multiple times, use the block function"},"do":{prefix:"do",body:["{% do $1 %}"],description:"The do tag works exactly like the regular variable expression ({{ ... }}) just that it doesn't print anything",example:"{% do 1 + 2 %}"},embed:{prefix:"embed",body:["{% embed \"${filename}.twig\" %}","\t$1","{% endembed  %}"],description:"The embed tag combines the behaviour of include and extends. It allows you to include another template's contents, just like include does. But it also allows you to override any block defined inside the included template, like when extending a template"},"extends":{prefix:"extends",body:"{% extends \"${filename}.twig\" %}",description:"Twig snippets"},filter:{prefix:"filter",body:["{% filter ${filter name} %}","\t$1","{% endfilter  %}"],description:"Filter sections allow you to apply regular Twig filters on a block of template data. Just wrap the code in the special filter section",example:"{% filter lower | escape %}\n    <strong>SOME TEXT</strong>\n{% endfilter %}\n\n{# outputs \"&lt;strong&gt;some text&lt;/strong&gt;\" #}"},flush:{prefix:"flush",body:["{% flush %}"],description:"The flush tag tells Twig to flush the output buffer",example:"{% flush %}"},"for":{prefix:"for",body:["{% for ${row} in ${array} %}","\t$1","{% endfor %}"],description:"Loop over each item in a sequence"},"for if":{prefix:"for if",body:["{% for ${row} in ${array} if ${condition} %}","\t$1","{% endfor %}"],description:"Loop over each item in a sequence"},"for else":{prefix:"for else",body:["{% for ${row} in ${array} %}","\t$1","{% else %}","\t$2","{% endfor %}"],description:"Loop over each item in a sequence"},"for if else":{prefix:"for if else",body:["{% for ${row} in ${array} if ${condition} %}","\t$1","{% else %}","\t$2","{% endfor %}"],description:"Loop over each item in a sequence"},loop:{prefix:"loop",body:"loop.",description:"special variables inside of a for loop block"},"if":{prefix:"if",body:["{% if ${condition} %}","\t$1","{% endif %}"],description:"The if statement in Twig is comparable with the if statements of PHP"},"if else":{prefix:"if else",body:["{% if ${condition} %}","\t$1","{% else %}","\t$2","{% endif %}"],description:"The if statement in Twig is comparable with the if statements of PHP"},"else":{prefix:"else",body:"{% else %}",description:"The if statement in Twig is comparable with the if statements of PHP"},"else if":{prefix:"else if",body:"{% elseif ${condition} %}",description:"The if statement in Twig is comparable with the if statements of PHP"},"import":{prefix:"import",body:"{% import \"${filename}.twig\" as ${alias}%}",description:"Twig supports putting often used code into macros. These macros can go into different templates and get imported from there."},_self:{prefix:"_self",body:"_self",description:"To import macros from the current file, use the special _self variable for the source"},include:{prefix:"include",body:"{% include \"${filename}.twig\" %}",description:"The include statement includes a template and returns the rendered content of that file into the current namespace"},macro:{prefix:"macro",body:["{% macro ${name}($1) %}","\t$2","{% endmacro %}"],description:"Create reusable code snippets"},sandbox:{prefix:"sandbox",body:["{% sandbox %}","\t$1","{% endsandbox %}"],description:"The sandbox tag can be used to enable the sandboxing mode for an included template, when sandboxing is not enabled globally for the Twig environment"},set:{prefix:"set",body:["{% set ${name} = ${value} %}$1"],description:"Assign values to variables"},"set block":{prefix:"set (block)",body:["{% set ${name} %}","\t$1","{% endset %}"],description:"Inside code blocks you can also assign values to variables. Assignments use the set tag and can have multiple targets"},spaceless:{prefix:"spaceless",body:["{% spaceless %}","\t$1","{% endspaceless %}"],description:"Use the spaceless tag to remove whitespace between HTML tags, not whitespace within HTML tags or whitespace in plain text"},use:{prefix:"use",body:"{% use \"${filename}.twig\" %}",description:"Twig snippets"},verbatim:{prefix:"verbatim",body:["{% verbatim %}","\t$1","{% endverbatim %}"],description:"The verbatim tag marks sections as being raw text that should not be parsed. For example to put Twig syntax as example into a template you can use this snippet"}};

var filtersHov = {abs:{text:"abs",body:"abs",description:"filter returns the absolute value"},batch:{prefix:"batch",body:"batch(${size}, ${fill})",text:"batch(size, fill)",description:"filter \"batches\" items by returning a list of lists with the given number of items. A second parameter can be provided and used to fill in missing items"},capitalize:{text:"capitalize",body:"capitalize",description:"filter capitalizes a value. The first character will be uppercase, all others lowercase"},convert_encoding:{prefix:"convert_encoding",body:"convert_encoding('${to}', '${from}')",text:"convert_encoding('to', 'from')",description:"filter converts a string from one encoding to another. The first argument is the expected output charset and the second one is the input charset"},date:{prefix:"date",body:"date(\"${m/d/Y}\")",text:"date(\"m/d/Y\")",description:"filter formats a date to a given format"},date_modify:{prefix:"date_modify",body:"date_modify(\"${+1 day}\")",text:"date_modify(\"+1 day\")",description:"filter modifies a date with a given modifier string"},"default":{prefix:"default",body:"default('${default value}')",text:"default('default value')",description:"filter returns the passed default value if the value is undefined or empty, otherwise the value of the variable"},"escape":{text:"escape",body:"escape",description:"filter escapes a string for safe insertion into the final output. It supports different escaping strategies depending on the template context"},first:{text:"first",body:"first",description:"filter returns the first \"element\" of a sequence, a mapping, or a string"},format:{prefix:"format",body:"format($1)",text:"format()",description:"filter formats a given string by replacing the placeholders (placeholders follows the sprintf notation)",example:"{% set foo = \"foo\" %}\n{{ \"I like %s and %s.\"| format(foo, \"bar\") }}\n\n{# outputs I like foo and bar #}"},join:{prefix:"join",body:"join${('optional')}",text:"join",description:"filter returns a string which is the concatenation of the items of a sequence"},json_encode:{prefix:"json_encode",body:"json_encode()",text:"json_encode()",description:"filter returns the JSON representation of a value. Internally, Twig uses the PHP json_encode function."},keys:{text:"keys",body:"keys",description:"filter returns the keys of an array. It is useful when you want to iterate over the keys of an array"},last:{text:"last",body:"last",description:"filter returns the last \"element\" of a sequence, a mapping, or a string"},length:{text:"length",body:"length",description:"filter returns the number of items of a sequence or mapping, or the length of a string"},lower:{text:"lower",body:"lower",description:"filter converts a value to lowercase"},merge:{prefix:"merge",body:"merge(${array})",text:"merge(array)",description:"filter merges an array with another array"},nl2br:{text:"nl2br",body:"nl2br",description:"filter inserts HTML line breaks before all newlines in a string"},number_format:{prefix:"number_format",body:"number_format(${0}, '${.}', '${,}')",text:"number_format",description:"filter formats numbers. It is a wrapper around PHP's number_format function"},raw:{text:"raw",body:"raw",description:"filter marks the value as being \"safe\", which means that in an environment with automatic escaping enabled this variable will not be escaped if raw is the last filter applied to it."},replace:{prefix:"replace",body:"replace('${search}' : '${replace}')",text:"replace('search' : 'replace')",description:"filter formats a given string by replacing the placeholders."},reverse:{text:"reverse",body:"reverse",description:"filter reverses a sequence, a mapping, or a string"},round:{prefix:"round",body:"${0} | round(1, '${floor}')",text:"round",description:"filter rounds a number to a given precision"},slice:{prefix:"slice",body:"slice(${start}, ${length})",text:"slice(start, length)",description:"filter extracts a slice of a sequence, a mapping, or a string"},"slice [] notation":{prefix:"slice [] notation",body:"[${start}:${length}]",description:"filter extracts a slice of a sequence, a mapping, or a string"},sort:{text:"sort",body:"sort",description:"filter sorts an array"},split:{prefix:"split",body:"split('$1')",text:"split('')",description:"filter splits a string by the given delimiter and returns a list of strings"},striptags:{text:"striptags",body:"striptags",description:"filter strips SGML/XML tags and replace adjacent whitespace by one space"},title:{text:"title",body:"title",description:"filter returns a titlecased version of the value. Words will start with uppercase letters, all remaining characters are lowercase"},trim:{text:"trim",body:"trim",description:"filter strips whitespace (or other characters) from the beginning and end of a string"},"trim()":{prefix:"trim()",body:"trim('$1')",description:"filter strips whitespace (or other characters) from the beginning and end of a string"},upper:{text:"upper",body:"upper",description:"filter converts a value to uppercase"},url_encode:{text:"url_encode",body:"url_encode",description:"filter percent encodes a given string as URL segment or an array as query string"}};

var functionsHov = {attribute:{prefix:"attribute",body:"{{ attribute($1) }}$2",description:"The attribute function can be used to access a \"dynamic\" attribute of a variable",example:""},block:{prefix:"block",body:"{{ block('${block name}') }}$1",description:"When a template uses inheritance and if you want to print a block multiple times, use the block function",example:""},constant:{prefix:"constant",body:"{{ constant('${const name}') }}$1",description:"constant returns the constant value for a given string",example:"{{ some_date | date(constant('DATE_W3C')) }}\n{{ constant('Namespace\\Classname::CONSTANT_NAME') }}"},cycle:{prefix:"cycle",body:"{{ cycle(${array}, ${position}) }}$1",description:"The cycle function cycles on an array of values",example:""},date:{prefix:"date",body:"{% set ${currentDate} = date($1) %}$2",description:"Converts an argument to a date to allow date comparison",example:"{% date() %}\n{% date('-2days') %}\n{% date('-2days', 'Europe/Paris') %}"},dump:{prefix:"dump",body:"{{ dump(${array}) }}$1",description:"(function) dumps information about a template variable. This is mostly useful to debug a template that does not behave as expected by introspecting its variables",example:""},include:{prefix:"include function",body:"{{ include('${filename}.twig') }}$1",description:"(function) returns the rendered content of a template",example:""},max:{prefix:"max",body:"{% set ${result} = max(${array}) %}$1",description:"(function) returns the biggest value of a sequence or a set of values",example:"{{ max(1, 3, 2) }}\n{# returns \"3\" #}\n\n{{ max({2: \"e\", 3: \"a\", 1: \"b\", 5: \"d\", 4: \"c\"}) }}\n{# returns \"e\" #}"},min:{prefix:"min",body:"{% set ${result} = min(${array}) %}$1",description:"(function) returns the lowest value of a sequence or a set of values",example:"{{ min(1, 3, 2) }}\n{# returns \"1\" #}\n\n{{ min({2: \"e\", 3: \"a\", 1: \"b\", 5: \"d\", 4: \"c\"}) }}\n{# returns \"a\" #}"},parent:{prefix:"parent",body:"{{ parent() }}",description:"(function) return the content of the block as defined in the base template",example:"{% extends \"base.html\" %}\n\n{% block sidebar %}\n\t<h3>Table Of Contents</h3>\n\t...\n\t{{ parent() }}\n{% endblock %}"},random:{prefix:"random",body:"{% set ${result} = random($1) %}$2",description:"(function) returns a random value depending on the supplied parameter type",example:"{{ random(['apple', 'orange', 'citrus']) }}\n{# example output: orange #}\n\n{{ random('ABC') }}\n{# example output: C #}\n\n{{ random() }}\n{# example output: 15386094 (works as the native PHP mt_rand function) #}\n\n{{ random(5) }}\n{# example output: 3 #}"},"range set":{prefix:"range set",body:"{% set ${result} = range(${low}, ${high}, ${step}) %}$1",description:"(function) Returns an array of elements from low to high, inclusive",example:"{% set result = range(0, 6, 2) %}\n{% dump(result) %}\n{# output: array(0, 2, 4, 6) #}"},range:{prefix:"range",body:"range(${low}, ${high}, ${step})",description:"(function) Returns an array of elements from low to high, inclusive",example:"{% set result = range(0, 6, 2) %}\n{% dump(result) %}\n{# output: array(0, 2, 4, 6) #}"},source:{prefix:"source",body:"{{ source('${template}.twig') }}$1",description:"(function) returns the content of a template without rendering it",example:""},template_from_string:{prefix:"template_from_string",body:"{{ include(template_from_string(\"$1\")) }}$2",description:"(function) loads a template from a string",example:"{{ include(template_from_string(\"Hello {{ name }}\")) }}"}};

var prettierData = {formatOptions:["printWidth","tabWidth","useTabs","semi","singleQuote","quoteProps","jsxSingleQuote","trailingComma","bracketSpacing","jsxBracketSameLine","arrowParens","rangeStart","rangeEnd","requirePragma","insertPragma","proseWrap","htmlWhitespaceSensitivity","endOfLine"]};

const config = vscode.workspace.getConfiguration("vs-twig");

/**
 *
 */
function createHover(hovInfo, type) {
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
function formatDocument(document, range) {
  const prettierConfig = vscode.workspace.getConfiguration("prettier");

  let formatOptions = config.format;
  let options = { plugins: [twig], parser: "melody" };

  prettierData.formatOptions.forEach((option) => {
    options[option] = prettierConfig[option];
  });

  for (let [option, value] of Object.entries(formatOptions)) {
    options[option] = value;
  }

  let output = prettier.format(document.getText(range), options);

  return [vscode.TextEdit.replace(range, output)];
}

/**
 *
 */
function activate(context) {
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
  if (config.enableFormatting === true) {
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
