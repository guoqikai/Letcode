// Code for interpretor thread

//high jet console and send to main thread
let curTestStdOut = []
console.log = (e) => {
    curTestStdOut.push(e);
    postMessage({ type: "stdout", value: e })
}


/* eslint-disable no-restricted-globals */
self.importScripts("https://cdn.jsdelivr.net/pyodide/v0.15.0/full/pyodide.js")
const pyodide = self.pyodide
/* eslint-enable no-restricted-globals */

const testListName = "____letcode_test_list____"

let state = {
    numTest: 0,
    testCompleted: 0,
    varsDeclared: [],
}



function runTestCases() { 
    if (state.numTest <= state.testCompleted) { 
        pyodide.runPython(`
        ${state.varsDeclared.map(
            x =>
                `
    del ${x}
                `
        ).join("\n")}
    gc.collect() 
        `)
        state = {
            numTest: 0,
            testCompleted: 0,
            varsDeclared: []
        }
        postMessage({type: "testingCompeleted"})
        return;
    }
    postMessage({ type: "stdout", value: "Running Test " + state.testCompleted })
    curTestStdOut = [];
    pyodide
        .runPythonAsync(`${testListName}[${state.testCompleted}]()`)
        .then(result => { 
            postMessage({
                type: "testCaseResult",
                result: result,
                error: false,
                testCaseNum: state.testCompleted,
                stdOut: curTestStdOut
            });
            state.testCompleted += 1;
            runTestCases();
        })
        .catch(err => { 
            postMessage({
                type: "testCaseResult",
                error: true,
                result: err.message,
                testCaseNum: state.testCompleted
            });
            state.testCompleted += 1;
            runTestCases();
        })

}

/*global languagePluginLoader*/
languagePluginLoader.then(() => {
    postMessage("Ready!");
});

onmessage = (msg) => { 
    if (msg.data) { 
        if (msg.data.type === "run")
            postMessage({ type:"runCompleted", value: pyodide.runPython(msg.data.code) });
        else if (msg.data.type === "runTest") {
            try { 
                pyodide.runPython(msg.data.code);
                state.numTest = msg.data.numTest;
                pyodide.runPython(`${testListName} = ${msg.data.testWarperName}()`);
                state.varsDeclared.push(msg.data.testWarperName);
                state.varsDeclared.push(testListName);
                postMessage({ type: "compilationSuccess" })
                runTestCases();
            }
            catch (e) {
                postMessage({ type: "compilationError", value: e.message });
            }
            
        }
        else if (msg.data.type === "stop") { 
            state = {
                numTest: 0,
                testCompleted: 0,
                varsDeclared: []
            }
        }
    }
}


