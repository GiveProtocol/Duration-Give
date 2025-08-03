#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔍 Analyzing SonarCloud New Code Coverage Issues\n');

// Function to get git diff files
function getChangedFiles() {
  try {
    // Get files changed in the last few commits (likely what SonarCloud considers "new code")
    const gitDiff = execSync('git diff --name-only HEAD~5 HEAD', { encoding: 'utf8' });
    const files = gitDiff.trim().split('\n').filter(f => f);
    
    console.log('📝 Files changed in last 5 commits:');
    files.forEach(file => console.log(`  - ${file}`));
    console.log();
    
    return files;
  } catch (error) {
    console.log('❌ Could not get git diff, checking all source files instead');
    return [];
  }
}

// Function to find all source files
function findSourceFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, dist, build, etc.
        if (!['node_modules', 'dist', 'build', '.git', '__tests__', 'coverage'].includes(item)) {
          files = files.concat(findSourceFiles(fullPath, extensions));
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext) && !item.includes('.test.') && !item.includes('.spec.')) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error reading directory ${dir}: ${error.message}`);
  }
  
  return files;
}

// Function to check if a source file has corresponding tests
function hasTestFile(sourceFile) {
  const dir = path.dirname(sourceFile);
  const name = path.basename(sourceFile, path.extname(sourceFile));
  const ext = path.extname(sourceFile);
  
  // Common test patterns
  const testPatterns = [
    path.join(dir, `${name}.test${ext}`),
    path.join(dir, `${name}.spec${ext}`),
    path.join(dir, '__tests__', `${name}.test${ext}`),
    path.join(dir, '__tests__', `${name}.spec${ext}`),
    path.join(dir, '..', '__tests__', `${name}.test${ext}`),
    path.join(dir, '..', '__tests__', `${name}.spec${ext}`)
  ];
  
  for (const testPath of testPatterns) {
    if (fs.existsSync(testPath)) {
      return testPath;
    }
  }
  
  return null;
}

// Function to count lines in a file (excluding comments and empty lines)
function countSignificantLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let count = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*')) {
        count++;
      }
    }
    
    return count;
  } catch (error) {
    return 0;
  }
}

// Main analysis
console.log('🔍 Finding all source files...\n');

const sourceFiles = findSourceFiles('./src');
const changedFiles = getChangedFiles();

console.log(`📊 Found ${sourceFiles.length} source files total\n`);

// Analyze coverage gaps
const untestedFiles = [];
const testedFiles = [];
let totalUntestedLines = 0;
let totalTestedLines = 0;

for (const sourceFile of sourceFiles) {
  const testFile = hasTestFile(sourceFile);
  const lineCount = countSignificantLines(sourceFile);
  const relativePath = path.relative('.', sourceFile);
  
  if (testFile) {
    testedFiles.push({ file: relativePath, lines: lineCount, testFile: path.relative('.', testFile) });
    totalTestedLines += lineCount;
  } else {
    untestedFiles.push({ file: relativePath, lines: lineCount });
    totalUntestedLines += lineCount;
  }
}

// Sort by line count (largest first)
untestedFiles.sort((a, b) => b.lines - a.lines);
testedFiles.sort((a, b) => b.lines - a.lines);

console.log('❌ UNTESTED SOURCE FILES (likely causing coverage issues):');
console.log('=' .repeat(60));
untestedFiles.forEach(({ file, lines }) => {
  const isChanged = changedFiles.some(cf => cf.includes(file) || file.includes(cf));
  const marker = isChanged ? '🔥 NEW CODE' : '   ';
  console.log(`${marker} ${file} (${lines} lines)`);
});

console.log(`\n📈 Total untested lines: ${totalUntestedLines}`);
console.log(`📈 Total tested lines: ${totalTestedLines}`);
console.log(`📊 Overall coverage estimate: ${((totalTestedLines / (totalTestedLines + totalUntestedLines)) * 100).toFixed(1)}%`);

if (untestedFiles.length > 0) {
  console.log('\n🎯 RECOMMENDATIONS:');
  console.log('To improve coverage, prioritize testing these files:');
  untestedFiles.slice(0, 5).forEach(({ file, lines }, index) => {
    console.log(`${index + 1}. ${file} (${lines} lines) - High impact`);
  });
}

console.log('\n✅ TESTED FILES:');
console.log('=' .repeat(60));
testedFiles.slice(0, 10).forEach(({ file, lines, testFile }) => {
  console.log(`✓ ${file} (${lines} lines) -> ${testFile}`);
});

if (testedFiles.length > 10) {
  console.log(`... and ${testedFiles.length - 10} more tested files`);
}

console.log('\n🔍 DUPLICATION ANALYSIS:');
console.log('=' .repeat(60));
console.log('To find duplication issues, run:');
console.log('npx jscpd src/ --threshold=10 --format=console');