

export async function getQuestion(callback, id) {
    if (id === undefined) { 
        const response = await fetch('/api/question/getAllQuestion', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await response.json()
        callback(data, true)
        return;
    }
    try {
        const response = await fetch('/api/question/' + id, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await response.json()
        callback(data, true)
    }catch (err){
        console.log(err)
        callback(null, true)
    }
}

//TODO:
export async function postQuestion(question, callback) { 
    try {
        const response = await fetch('/api/question/add_question', {
            method: 'POST',
            body: JSON.stringify({
                functionType: JSON.stringify(question.functionType),
                name: question.name,
                desc: question.desc,
                date: new Date().toString(),
                numUpVote: 0,
                numAnswers: 0
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await response.json()
        callback(data, true)
    }catch (err){
        console.log(err)
    }
}


export async function getQuestionAllInfo(id, callback) {
    try {
        const response = await fetch('/api/question/' + id + '/allInfo', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        if (response.status !== 200) { 
            callback(null, false);
            return;
        }
        const data = await response.json();
        callback(data, true)
    }catch (err){
        console.log(err)
    }
}
