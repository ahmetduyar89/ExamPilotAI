const fs = require('fs');
const path = require('path');

function getImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /import.*from\s+['"]([^'"]+)['"]/g;
    const imports = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    return imports;
  } catch (e) {
    return [];
  }
}

function resolvePath(basePath, importPath) {
  if (!importPath.startsWith('.')) return null;
  const dir = path.dirname(basePath);
  let resolved = path.resolve(dir, importPath);
  
  if (fs.existsSync(resolved + '.ts')) return resolved + '.ts';
  if (fs.existsSync(resolved + '.tsx')) return resolved + '.tsx';
  if (fs.existsSync(resolved + '/index.ts')) return resolved + '/index.ts';
  if (fs.existsSync(resolved + '/index.tsx')) return resolved + '/index.tsx';
  
  return null;
}

const graph = {};

function buildGraph(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      buildGraph(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const imports = getImports(fullPath);
      graph[fullPath] = imports.map(imp => resolvePath(fullPath, imp)).filter(Boolean);
    }
  }
}

buildGraph(path.resolve('./src'));

// Find cycles
const visited = new Set();
const recursionStack = new Set();
const cycles = [];

function dfs(node, pathAcc) {
  if (cycles.length > 20) {
    console.log('Found cycles:');
    cycles.forEach(c => {
      console.log(c.map(p => path.relative(process.cwd(), p)).join(' -> '));
    });
    process.exit(0);
  }

  visited.add(node);
  recursionStack.add(node);
  pathAcc.push(node);

  for (const neighbor of (graph[node] || [])) {
    if (!visited.has(neighbor)) {
      dfs(neighbor, [...pathAcc]);
    } else if (recursionStack.has(neighbor)) {
      cycles.push([...pathAcc, neighbor]);
    }
  }

  recursionStack.delete(node);
}

for (const node of Object.keys(graph)) {
  if (!visited.has(node)) {
    dfs(node, []);
  }
}

if (cycles.length > 0) {
  console.log('Found cycles:');
  cycles.slice(0, 5).forEach(c => {
    console.log(c.map(p => path.relative(process.cwd(), p)).join(' -> '));
  });
} else {
  console.log('No cycles found.');
}
