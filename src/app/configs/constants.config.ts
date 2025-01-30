/**
 * EXTENSION_ID: The unique identifier of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_ID);
 *
 * @returns {string} - The unique identifier of the extension
 */
export const EXTENSION_ID: string = 'vuejs.generator';

/**
 * EXTENSION_NAME: The repository ID of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_NAME);
 *
 * @returns {string} - The repository ID of the extension
 */
export const EXTENSION_NAME: string = 'vscode-vuejs-generator';

/**
 * EXTENSION_DISPLAY_NAME: The name of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(EXTENSION_DISPLAY_NAME);
 *
 * @returns {string} - The name of the extension
 */
export const EXTENSION_DISPLAY_NAME: string = 'VueJS File Generator';

/**
 * USER_NAME: The vuejsco of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(USER_NAME);
 *
 * @returns {string} - The vuejsco of the extension
 */
export const USER_NAME: string = 'vuejsco';

/**
 * USER_PUBLISHER: The publisher of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(USER_PUBLISHER);
 *
 * @returns {string} - The publisher of the extension
 */
export const USER_PUBLISHER: string = 'imgildev';

/**
 * REPOSITORY_URL: The documentation URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(REPOSITORY_URL);
 *
 * @returns {string} - The documentation URL of the extension
 */
export const REPOSITORY_URL: string = `https://github.com/${USER_NAME}/${EXTENSION_NAME}`;

/**
 * MARKETPLACE_URL: The marketplace URL of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(MARKETPLACE_URL);
 *
 * @returns {string} - The marketplace URL of the extension
 */
export const MARKETPLACE_URL: string = `https://marketplace.visualstudio.com/items?itemName=${USER_PUBLISHER}.${EXTENSION_NAME}`;

/**
 * DEFAULT_ENABLE: The default enable of the extension.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_ENABLE);
 *
 * @returns {boolean} - The default enable of the extension
 */
export const DEFAULT_ENABLE: boolean = true;

/**
 * DEFAULT_SKIP_FOLDER_CONFIRMATION: The default skip folder confirmation of the extension.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_SKIP_FOLDER_CONFIRMATION);
 *
 * @returns {boolean} - The default skip folder confirmation of the extension
 */
export const DEFAULT_SKIP_FOLDER_CONFIRMATION: boolean = false;

/**
 * DEFAULT_EXCLUDE_SEMI_COLON_AT_END_OF_LINE: The default exclude semicolon at end of line of the extension.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_EXCLUDE_SEMI_COLON_AT_END_OF_LINE);
 *
 * @returns {boolean} - The default exclude semicolon at end of line of the extension
 */
export const DEFAULT_EXCLUDE_SEMI_COLON_AT_END_OF_LINE: boolean = false;

/**
 * DEFAULT_END_OF_LINE: The default end of line of the extension.
 * @type {'crlf' | 'lf'}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_END_OF_LINE);
 *
 * @returns {'crlf' | 'lf'} - The default end of line of the extension
 */
export const DEFAULT_END_OF_LINE: 'crlf' | 'lf' = 'lf';

/**
 * DEFAULT_HEADER_COMMENT_TEMPLATE: The default header comment template of the extension.
 * @type {string[]}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_HEADER_COMMENT_TEMPLATE);
 *
 * @returns {string[]} - The default header comment template of the extension
 */
export const DEFAULT_HEADER_COMMENT_TEMPLATE: string[] = [];

/**
 * DEFAULT_INSERT_FINAL_NEWLINE: The default insert final newline of the extension.
 * @type {boolean}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_INSERT_FINAL_NEWLINE);
 *
 * @returns {boolean} - The default insert final newline of the extension
 */
export const DEFAULT_INSERT_FINAL_NEWLINE: boolean = true;

/**
 * ContentTemplate: The custom component template.
 * @interface
 * @public
 * @memberof Constants
 * @property {string} name - The name of the template
 * @property {string} description - The description of the template
 * @property {string} extension - The extension of the template
 * @property {string[]} template - The template to generate
 */
export interface ContentTemplate {
  name: string;
  description: string;
  type: 'vue' | 'ts' | 'js' | 'html' | 'css' | 'scss' | 'less' | 'stylus';
  template: string[];
}

/**
 * CUSTOM_COMPONENTS: The custom components to generate.
 * @type {ContentTemplate[]}
 * @public
 * @memberof Constants
 * @example
 * console.log(CUSTOM_COMPONENTS);
 *
 * @returns {ContentTemplate[]} - The custom components to generate
 */
export const DEFAULT_CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    name: 'Vue Component',
    description: 'The Vue component',
    type: 'vue',
    template: [
      '<template>',
      '  <div>',
      '    <!-- Your code here -->',
      '  </div>',
      '</template>',
      '',
      '<script lang="ts">',
      'import { defineComponent } from "vue";',
      '',
      'export default defineComponent({',
      '  name: "ComponentName",',
      '  props: {',
      '    // Your props here',
      '  },',
      '  setup() {',
      '    // Your code here',
      '  }',
      '});',
      '</script>',
      '',
      '<style scoped>',
      '/* Your styles here */',
      '</style>',
    ],
  },
];

/**
 * DEFAULT_AUTHOR: The default author of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_AUTHOR);
 *
 * @returns {string} - The default author of the extension
 */
export const DEFAULT_AUTHOR: string = '';

/**
 * DEFAULT_OWNER: The default owner of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_OWNER);
 *
 * @returns {string} - The default owner of the extension
 */
export const DEFAULT_OWNER: string = '';

/**
 * DEFAULT_MAINTAINER: The default maintainer of the extension.
 * @type {string}
 * @public
 * @memberof Constants
 * @example
 * console.log(DEFAULT_MAINTAINER);
 *
 * @returns {string} - The default maintainer of the extension
 */
export const DEFAULT_MAINTAINER: string = '';
