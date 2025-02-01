# VueJS File Generator

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/imgildev.vscode-vuejs-generator?style=for-the-badge&label=VS%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-vuejs-generator)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/imgildev.vscode-vuejs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-vuejs-generator)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/imgildev.vscode-vuejs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-vuejs-generator)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/imgildev.vscode-vuejs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-vuejs-generator&ssr=false#review-details)
[![GitHub Repo stars](https://img.shields.io/github/stars/vuejsco/vscode-vuejs-generator?style=for-the-badge&logo=github)](https://github.com/vuejsco/vscode-vuejs-generator)
[![GitHub license](https://img.shields.io/github/license/vuejsco/vscode-vuejs-generator?style=for-the-badge&logo=github)](https://github.com/vuejsco/vscode-vuejs-generator/blob/main/LICENSE)

**VueJS File Generator** is a Visual Studio Code extension designed to simplify the creation of Vue.js files. It generates boilerplate code from customizable templates, enabling you to quickly create components, services, and other project files according to your needs.

[![VueJS File Generator](https://raw.githubusercontent.com/vuejsco/vscode-vuejs-generator/main/images/demo.gif)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-vuejs-generator)

## Index

- [VueJS File Generator](#vuejs-file-generator)
  - [Index](#index)
  - [Key Features](#key-features)
  - [Supported File Templates](#supported-file-templates)
  - [Requirements](#requirements)
  - [Requirements](#requirements-1)
  - [Setup](#setup)
    - [Step 1: Open Command Palette in VS Code](#step-1-open-command-palette-in-vs-code)
    - [Step 2: Add Configuration to `settings.json`](#step-2-add-configuration-to-settingsjson)
    - [Step 3: Restart VS Code](#step-3-restart-vs-code)
  - [Configuration](#configuration)
  - [Variables Table](#variables-table)
  - [Community](#community)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [Changelog](#changelog)
  - [License](#license)

## Key Features

- **Customizable Templates**: Define TypeScript and Vue.js file templates tailored to your project.
- **Project-Level Configuration**: Configure file formatting, naming conventions, and more.
- **Open Source**: Contribute to and benefit from community-driven development.

## Supported File Templates

The extension provides predefined templates for various Vue.js file types, making it easy to generate structured and consistent files for your project.

| File Type    | Description | Example Filename |
|--------------|-------------|------------------|
| `component`  | Vue.js Component (Single File Component) | `MyComponent.vue` |
| `page`       | Vue.js Page (Common in frameworks like Nuxt) | `HomePage.vue` |
| `store`      | Pinia Store Module | `useAuthStore.ts` |
| `composable` | Vue 3 Composable (Reusable function) | `useFetch.ts` |
| `directive`  | Vue Directive | `v-focus.ts` |
| `middleware` | Middleware for Nuxt.js | `auth.ts` |
| `model`      | TypeScript Model (Interface or Type) | `UserModel.ts` |
| `layout`     | Layout Component (Nuxt.js) | `DefaultLayout.vue` |
| `service`    | API Service (For Axios or Fetch wrappers) | `AuthService.ts` |
| `test`       | Unit Test File (Jest/Vitest) | `MyComponent.spec.ts` |
| `enum`       | TypeScript Enum | `UserRoles.ts` |
| `constant`   | Constants File | `constants.ts` |
| `hook`       | Custom React Hook | `useAuth.ts` |
| `route`      | Route Configuration File | `routes.ts` |

## Requirements

- **VS Code 1.88.0** or higher.

## Requirements

- **VS Code 1.88.0** or higher.

## Setup

### Step 1: Open Command Palette in VS Code

1. Open the **Command Palette** in VS Code:
   - Windows: `CTRL + SHIFT + P`
   - macOS: `CMD + SHIFT + P`

2. Open the **Workspace Settings**:
   - Type `Preferences: Open Workspace Settings (JSON)`.

### Step 2: Add Configuration to `settings.json`

Copy the following configuration into your `.vscode/settings.json` file:

```json
{
    "vuejs.generator.enable": true,
    "vuejs.generator.files.skipFolderConfirmation": false,
    "vuejs.generator.formatting.excludeSemiColonAtEndOfLine": false,
    "vuejs.generator.formatting.endOfLine": "lf",
    "vuejs.generator.formatting.insertFinalNewline": true,
    "vuejs.generator.templates.customComponents": [
        {
            "name": "Vue Component",
            "description": "Vue component template",
            "type": "vue",
            "template": [
                "<template>",
                "  <div id=\"{{fileName}}\">",
                "    <!-- Your code here -->",
                "  </div>",
                "</template>",
                "",
                "<script lang=\"ts\">",
                "import { defineComponent } from \"vue\";",
                "",
                "export default defineComponent({",
                "  name: \"{{fileName}}\",",
                "  props: {",
                "    // Your props here",
                "  },",
                "  setup() {",
                "    // Your code here",
                "  }",
                "});",
                "</script>",
                "",
                "<style scoped>",
                "/* Your styles here */",
                "</style>"
            ]
        }
    ],
    "vuejs.generator.project.author": "Manuel Gil",
    "vuejs.generator.project.owner": "Vue JS Colombia",
    "vuejs.generator.project.maintainers": "VueJS Team",
    "vuejs.generator.project.license": "MIT",
    "vuejs.generator.project.version": "1.0.0"
}
```

### Step 3: Restart VS Code

Restart VS Code to apply the settings.

## Configuration

You can customize **VueJS File Generator** by modifying its settings in `.vscode/settings.json`. Some of the available settings are:

- `vuejs.generator.enable`: Enable or disable the extension (default: `true`).
- `vuejs.generator.files.skipFolderConfirmation`: Skip folder selection when creating files (default: `false`).
- `vuejs.generator.formatting.excludeSemiColonAtEndOfLine`: Omit semicolons (default: `false`).
- `vuejs.generator.formatting.endOfLine`: Specify end-of-line character (default: `lf`).
- `vuejs.generator.formatting.insertFinalNewline`: Add a newline at the end of the file (default: `true`).
- `vuejs.generator.templates.customComponents`: Define custom component templates. Each template should include a `name`, `description`, `type`, and `template`.
- `vuejs.generator.project.author`: Set the author name for the project.
- `vuejs.generator.project.owner`: Set the owner name for the project.
- `vuejs.generator.project.maintainers`: Set the maintainers name for the project.
- `vuejs.generator.project.license`: Set the license for the project.
- `vuejs.generator.project.version`: Set the version for the project.

The following variables can be used in the template:

For the full list of customizable variables in the template, check the [Variables Table](#variables-table).

## Variables Table

The following variables can be used in the template:

| Variable                          | Description |
|----------------------------------|-------------|
| `fileName`                       | The unmodified file name. Example: `"MyComponent"` |
| `fileNameWithExtention`          | The file name with its extension. Example: `"MyComponent.vue"` |
| `fileExtension`                   | The file extension. Example: `"vue"` |
| `fileNameCamelCase`              | The file name in **camelCase**. Example: `"myComponent"` |
| `fileNamePascalCase`             | The file name in **PascalCase**. Example: `"MyComponent"` |
| `fileNameKebabCase`              | The file name in **kebab-case**. Example: `"my-component"` |
| `fileNameSnakeCase`              | The file name in **snake_case**. Example: `"my_component"` |
| `fileNameConstantCase`           | The file name in **CONSTANT_CASE**. Example: `"MY_COMPONENT"` |
| `fileNameDotCase`                | The file name in **dot.case**. Example: `"my.component"` |
| `fileNamePathCase`               | The file name in **path/case**. Example: `"my/component"` |
| `fileNameSentenceCase`           | The file name in **Sentence case**. Example: `"My component"` |
| `fileNameLowerCase`              | The file name in **lowercase**. Example: `"my component"` |
| `fileNameTitleCase`              | The file name in **Title Case**. Example: `"My Component"` |
| `fileNamePluralCase`             | The plural form of the file name. Example: `"MyComponents"` |
| `fileNameSingularCase`           | The singular form of the file name. Example: `"MyComponent"` |
| `folderName`                     | The name of the folder where the file is created. |
| `date`                           | The current date in `YYYY-MM-DD` format. Example: `"2025-01-28"` |
| `year`                           | The current year. Example: `"2025"` |
| `time`                           | The current time in local format. Example: `"14:35:20"` |
| `timestamp`                      | The current timestamp in milliseconds. Example: `"1706402120000"` |
| `timestampISO`                   | The current timestamp in ISO format. Example: `"2025-01-28T14:35:20.000Z"` |
| `timestampUTC`                   | The current timestamp in UTC format. Example: `"Tue, 28 Jan 2025 14:35:20 GMT"` |
| `timestampLocale`                 | The current timestamp in locale string format. Example: `"1/28/2025, 2:35:20 PM"` |
| `timestampDate`                   | The current timestamp in date string format. Example: `"Tue Jan 28 2025"` |
| `timestampTime`                   | The current timestamp in time string format. Example: `"14:35:20 GMT+0000 (Coordinated Universal Time)"` |
| `timestampLocaleDate`             | The current timestamp in locale date string format. Example: `"1/28/2025"` |
| `author`                         | The author set in `project.author`. Example: `"Manuel Gil"` |
| `owner`                          | The owner set in `project.owner`. Example: `"Vue JS Colombia"` |
| `maintainers`                     | The maintainers set in `project.maintainers`. Example: `"VueJS Team"` |
| `license`                         | The license set in `project.license`. Example: `"MIT"` |
| `version`                         | The project version set in `project.version`. Example: `"1.0.0"` |

## Community

This extension is maintained by the **Vue JS Colombia Meetup Community**. Stay updated on new features and improvements:

- [GitHub](https://github.com/vuejsco)
- [Twitter (X)](https://twitter.com/vuejsco)

## Contributing

We welcome contributions from the community! To get started:

1. Fork the [GitHub repository](https://github.com/vuejsco/vscode-vuejs-generator).
2. Make your changes and submit a pull request.

For contribution guidelines, refer to the [Contribution Guide](./CONTRIBUTING.md).

## Code of Conduct

We value a welcoming and inclusive community. Please review our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating.

## Changelog

See the full list of changes in the [CHANGELOG.md](./CHANGELOG.md) file.

## License

This extension is licensed under the MIT License. See the [MIT License](https://opensource.org/licenses/MIT) for details.
