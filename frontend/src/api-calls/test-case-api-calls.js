

export async function addTestCase(testCase, callback) { 
    try{
        await fetch('/api/testcase/addTestcase', {
            method: 'POST',
            body: JSON.stringify(testCase),
            headers: { 'Content-Type': 'application/json'}
        })
        
        if(callback){
            const response = await fetch('/api/testcase/' + testCase.owner_id + '/allTestcase', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json'}
            })
            const data = await response.json()
            callback(data);
        }
    }catch(err){
        console.log(err)
    }
}

export async function getTestCases(question_id, callback) {
    try{
        const response = await fetch('/api/testcase/' + question_id + '/allTestcase', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        const data = await response.json()
        callback(data);
    }catch(err){
        console.log(err)
    }
}

