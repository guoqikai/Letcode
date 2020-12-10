
export async function getAnswers(questionId, callback) { 
    try{
        const response = await fetch('/api/answer/' + questionId + "/getAnswers", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        const data = await response.json()
        callback(data);
        return 
    }catch(err){
        console.log(err)
    }
}
    
export async function postAnswer(questionId, code, uid, callback) { 
    console.log("enter get user collection")
    try{
        const response = await fetch(
          "/api/answer/" + questionId + "/postAnswer",
          {
            method: "POST",
            body: JSON.stringify({
              code: code,
              uid: uid,
              language: "Python",
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json()
        callback(data);
        return 
    }catch(err){
        console.log(err)
    }
}
    