require ('./hello_world/hello_world');
const {foo:helperFoo} = require ('./helpers/helper')
const readline = require('node:readline/promises');
const path = require('path');

//
const foo = async () =>{
    console.log("02.07.2025");
    helperFoo();
}
foo();

console.log("Hello from Node.js!");

// console.log(__dirname);
// console.log(__filename);
// console.log(process.cwd());

// const pathToFile = (__filename);

// console.log(pathToFile);
// console.log(path.dirname(pathToFile))
// console.log(path.extname(pathToFile))
// console.log(path.basename(pathToFile))
// console.log(path.parse(pathToFile))
// console.log(path.isAbsolute(pathToFile))
// console.log(path.isAbsolute('USER\\IdeaProjects\\node\\index.js\n'))


// Readline
//
// const rlInstance = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })
//
// const name = await rlInstance.question('Name?');
// console.log(`Your name is ${name}`);
// process.exit(0);
// }

void foo();


