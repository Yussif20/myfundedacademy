import fs from "fs";
import path from "path";
import readline from "readline";

const toPascalCase = (str: string) =>
  str
    .split(/[-_\s]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

function createModule(moduleName: string) {
  const folderName = moduleName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  const pascalName = toPascalCase(moduleName);
  const baseDir = path.join("src", "app", folderName);

  const files = [
    { name: `${folderName}.controller.ts`, type: "controller" },
    { name: `${folderName}.interface.ts`, type: "interface" },
    { name: `${folderName}.route.ts`, type: "route" },
    { name: `${folderName}.service.ts`, type: "service" },
    { name: `${folderName}.validation.ts`, type: "validation" },
  ];

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
    console.log(`📁 Created directory: ${baseDir}`);
  }

  files.forEach(({ name, type }) => {
    const filePath = path.join(baseDir, name);
    let content = "";

    switch (type) {
      case "controller":
      case "service":
        content = `import httpStatus from 'http-status';\n\nexport const ${pascalName}${capitalize(
          type,
        )} = {};\n`;
        break;
      case "validation":
        content = `import { z } from 'zod';\n\nexport const ${pascalName}${capitalize(type)} = {};\n`;
        break;
      case "route":
        content = `import express from 'express';\nconst router = express.Router();\n\nexport const ${pascalName}Routes = router;\n`;
        break;
      case "interface":
        content = `// Define ${pascalName} interfaces here\n`;
        break;
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`📄 Created file: ${filePath}`);
  });
}

function main(moduleNames: string[]) {
  moduleNames.forEach(createModule);
}

let moduleNames = process.argv.slice(2);

if (moduleNames.length === 0) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question("📦 Enter module names (comma separated): ", (answer) => {
    rl.close();
    if (!answer) {
      console.error("❌ No module names provided. Exiting...");
      process.exit(1);
    }
    moduleNames = answer
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    main(moduleNames);
  });
} else {
  main(moduleNames);
}
