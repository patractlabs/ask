import { CONFIG } from "../config/compile";

let scope = CONFIG.scope;

export const eventTpl = `{{export}}class {{className}} extends ${scope}Event {
  {{#each fields}}
  private {{name}}: {{type.plainType}};
  {{/each}}

  {{{constructor .}}}

  prepare(): void {
    this.index = {{index}};
    {{#each fields}}
    {{#if decorators.isTopic}}
    this.appendTopic({{toCodec .}});
    {{/if}}
    {{/each}}

    {{#each fields}}
    this.appendData({{toCodec .}});
    {{/each}}
  }
}`;