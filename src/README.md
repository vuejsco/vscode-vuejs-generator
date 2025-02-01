# VS Code Vue.js Generator - Command Execution Flow

## Overview

This document outlines the workflow for handling file generation requests in the **VS Code Vue.js Generator** extension. It describes how the extension processes user requests using the **Command Pattern**, ensuring a modular and maintainable architecture.

## Workflow

When a request is made through the extension, the process follows these steps:

1. **Request Handling** (`extension.ts`)
   - The request is received in `extension.ts`, which registers the commands and forwards execution to the appropriate handler.

2. **Command Invocation** (`command-invoker.controller.ts`)
   - This controller determines which command should be executed based on the received request and invokes the corresponding command.

3. **Command Execution** (`commands/` folder)
   - The invoked command (e.g., `generate-store.command.ts`) processes the request and interacts with the file generation service.

4. **File Generation** (`file-generator.service.ts`)
   - This service reads the corresponding JSON template from the `/templates` directory and generates the required file.

5. **Template Retrieval** (`/templates/` folder)
   - The service loads the correct template file (e.g., `store.json`) based on the command name and fills in the required placeholders.

## Example Execution Flow

If a user requests a **Pinia Store** file generation:

```plaintext
extension.ts → command-invoker.controller.ts → generate-store.command.ts → file-generator.service.ts → store.json
```

## Project Structure

Below is the folder structure for reference:

```plaintext
. 📦 vscode-vuejs-generator
. 📂 src
├── 📂 app/
|  ├── 📂 commands/
|  |  ├── 📄 base.command.ts
|  |  ├── 📄 generate-component.command.ts
|  |  ├── 📄 generate-composable.command.ts
|  |  ├── 📄 generate-constant.command.ts
|  |  ├── 📄 generate-custom-component.command.ts
|  |  ├── 📄 generate-directive.command.ts
|  |  ├── 📄 generate-enum.command.ts
|  |  ├── 📄 generate-hook.command.ts
|  |  ├── 📄 generate-layout.command.ts
|  |  ├── 📄 generate-middleware.command.ts
|  |  ├── 📄 generate-model.command.ts
|  |  ├── 📄 generate-page.command.ts
|  |  ├── 📄 generate-router.command.ts
|  |  ├── 📄 generate-service.command.ts
|  |  ├── 📄 generate-store.command.ts
|  |  ├── 📄 generate-test.command.ts
|  |  └── 📄 index.ts
|  ├── 📂 configs/
|  |  ├── 📄 constants.config.ts
|  |  ├── 📄 extension.config.ts
|  |  └── 📄 index.ts
|  ├── 📂 controllers/
|  |  ├── 📄 command-invoker.controller.ts
|  |  └── 📄 index.ts
|  ├── 📂 helpers/
|  |  ├── 📄 index.ts
|  |  └── 📄 inflector.helper.ts
|  ├── 📂 services/
|  |  ├── 📄 file-generator.service.ts
|  |  └── 📄 index.ts
|  └── 📂 types/
|     ├── 📄 command.type.ts
|     └── 📄 index.ts
├── 📄 extension.ts
└── 📂 templates/
   ├── 📄 component.json
   ├── 📄 composable.json
   ├── 📄 constant.json
   ├── 📄 directive.json
   ├── 📄 enum.json
   ├── 📄 hook.json
   ├── 📄 layout.json
   ├── 📄 middleware.json
   ├── 📄 model.json
   ├── 📄 page.json
   ├── 📄 router.json
   ├── 📄 service.json
   ├── 📄 store.json
   └── 📄 test.json
```


## Key Components & Responsibilities

### `extension.ts`

- Registers VS Code commands.
- Passes command execution to `command-invoker.controller.ts`.

### `command-invoker.controller.ts`

- Maps command names to their corresponding command files.
- Ensures commands follow the **Command Pattern** for modular execution.

### `commands/`

- Houses individual command files (`generate-*.command.ts`).
- Each command implements the `execute()` method to initiate file creation.

### `file-generator.service.ts`

- Responsible for creating files based on templates.
- Loads the corresponding template file (`/templates/{command}.json`).
- Replaces placeholders with the appropriate values.

### `/templates/`

- Contains JSON templates for different file types (e.g., Vue components, Pinia stores, composables, directives, etc.).

## Development Guidelines

- **Scalability:** To add a new command, create a new `generate-<name>.command.ts` file in `commands/` and register it in `command-invoker.controller.ts`.
- **Maintainability:** Keep templates modular and avoid hardcoded values.
- **Extensibility:** Developers can extend the system by adding new templates in `/templates/` and corresponding commands in `commands/`.

---

This documentation provides a clear overview of how the **Command Pattern** is used in the **VS Code Vue.js Generator** extension, ensuring that the workflow remains scalable, maintainable, and easy to extend.
