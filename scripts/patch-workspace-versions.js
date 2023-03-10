// loop over packages, get versions and names
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
const { execSync } = require("child_process");

const foundPackages = JSON.parse(
  execSync("pnpm m ls --json --depth=-1").toString()
);

const packages = {};

// Create a version map
let versionMap = Object.assign(
  {},
  ...foundPackages.map(({ path }) => {
    const packageInfo = JSON.parse(
      fs.readFileSync(`${path}/package.json`, "utf8")
    );

    packages[path] = packageInfo;
    return { [packageInfo.name]: packageInfo.version };
  })
);

// Loop over and patch versions
Object.entries(packages).forEach(([packageDir, packageInfo]) => {
  if (packageInfo.dependencies) {
    packageInfo.dependencies = Object.assign(
      packageInfo.dependencies,
      ...Object.entries(packageInfo.dependencies).map(([name, version]) => ({
        [name]: versionMap[name] ? `workspace:*` : version,
      }))
    );
  }

  if (packageInfo.devDependencies) {
    packageInfo.devDependencies = Object.assign(
      packageInfo.devDependencies,
      ...Object.entries(packageInfo.devDependencies).map(([name, version]) => ({
        [name]: versionMap[name] ? `workspace:*` : version,
      }))
    );
  }

  fs.writeFileSync(
    `${packageDir}/package.json`,
    JSON.stringify(packageInfo, undefined, 2) + "\n"
  );
});
