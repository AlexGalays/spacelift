const ts = require('typescript')
const chalk = require('chalk')
const fs = require('fs')

const tsOptions = { noImplicitAny: true, noEmit: true, strictNullChecks: true, target: ts.ScriptTarget.ES2015, moduleResolution: ts.ModuleResolutionKind.NodeJs }
const expectedErrorCount = (fs.readFileSync('test/shouldNotCompile.ts', 'utf8').match(/@shouldNotCompile/g) || []).length
const program = ts.createProgram(['test/shouldNotCompile'], tsOptions)
const diagnostics = ts.getPreEmitDiagnostics(program)

if (diagnostics.length === expectedErrorCount) {
  console.log(chalk.green(`All the expected compilation errors were found (${expectedErrorCount})`))
}
else {
  console.log(chalk.red(`${expectedErrorCount} errors were expected but ${diagnostics.length} errors were found`))
  console.error(errors(diagnostics))
}

function errors(arr) {
  return arr.map(diag => ({ messageText: diag.messageText, line: diag.file.getLineAndCharacterOfPosition(diag.start).line + 1 }))
}