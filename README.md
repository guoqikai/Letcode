## Introduction 
Our website is a platform similar to Leetcode, where the user can post their answer to different coding questions. In our project, LetCode, where the questions are no longer provided by the website developer, can be posted by individual users as well. This improved the diversity of questions, and we believe it is also beneficial for code learner/developers to come up with coding questions and its corresponding test cases. For each question, individual users also have the opportunity to post their own answer, add test cases, and upvote/downvote/comment on other people’s answers. Users can also upvote/downvote on question, and the question with most upvotes will appear on top of our mainpage, as shown as “Question of the Day”. Users can save questions they want by clicking the star icon on the top right corner of each question, and they can be accessed later from “my collections” in their personal profile. 


## Instructions for use
Our project is deployed on Heroku:  https://let-code.herokuapp.com/

Recommended browser: Firefox and Chrome (Safari is not recommended since it has shallow max stack depth)

After logging in, the user can post a new question by giving the title and description of the question and specifying the input and output type. The user also needs to add test cases for the question, the test cases can be enriched by other users as well. Posted questions are displayed on the main page, users can browse and choose questions to answer by coding in the editor in either Java, Python, C or C++. Users can run the tests when they finish coding. If all tests are passed and the user chooses to post the answer, the answer is available to everyone.


## How to test our application
For anyone new to our website, they need to create an account. An account can keep track of one’s questions posted, answered and collected. Note that one's username is unique. After an account is created, an user can either post an algorithm question, or comment on an existing one. In order to post a question, the user needs a title, description, and at least one test case. Test cases can also be added by other users. When posting an answer to a question, the answer needs to pass every existing test, then the user can post their answers as a comment to the question. 


## Key features
1. Post question: specify input / output type

The type of the question and the types of its input / output are stored in `types.ts`. The primitive types supported by our website are string, int, boolean and float. These types are stored as `Type.<type>` (eg. `Type.INT`, `Type.BOOL`). The non-primitive types supported are list/array and dictionary/map. If the user chooses these types, there will be a pop-up window asking the type inside the list or dictionary. These types can be recursively defined. For example, If a user wants the input to be a `List[Dict[int, float]]`, there will be two-layered pop-up windows, one for asking the type inside the list, one for asking the key and value inside the dictionary, and the result type will be stored as `Type.LIST(Type.DICT(Type.INT, Type.FLOAT))`. 
The entire function is also a type containing its name, array of input types and the output type, and the input / output types are wrapped in `VariableType` along with their names. For instance, the question “Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.” are stored as:
  ```
  FunctionType: {
	    name: “Two Sum”,
	    paramsType: [
    VariableType: {
      name: “nums”
      type: Type.LIST(Type.INT)
    }, 
    VariableType: {
      name: “target”
      type: Type.INT
    }],
	  returnType: VariableType: {
		  name: “return“ 
      type: Type.LIST(Type.INT)
    }
  }
  ```

2. Add test case: specify input / output value

The user can enter the value for input and output by typing the value in the form directly. In the form specified which type the variables should be. `stringToLetCodeMapper` in `letcode-mapper.ts` will parse the value and try to map to the types in the typing system. Warnings will be given for invalid values. For instance, if a variable is of type `List[Dict[float, bool]]`, a valid input can be `[{2.4: true}, {7.2: False}]` (the case of the first letter does not matter for boolean type).

3. Code editor:

We used the library codemirror to create a code editor supporting the four languages we have. The editor supports syntax highlighting, automatically matching and closing brackets, commenting code using command + ‘/’ on mac and control + ‘/’ on windows, numbering the lines, and smart indentation with tab and shift + tab. The editor also prevents the user from changing the function signature or other’s answers.

4. Run code:
  
Work flow: 

	  [user input] 

		||
		
		\/ stringToLetCodeMapper (type checking happens here) 
		
	[letCodeFormattedString]
	
		||
		
		\/ letCodeToPythonMapper
		
	  [pythonCode]
	
		||
		
		\/ pythonToLetCodeMapper
		
	[letCodeFormattedString]

When the “run test” button is hit, the functions in `code-runner-python-impl.ts` wraps the inputs and user’s code into a function, preventing adding user-defined variables into the global scope. Then the function returns a list of test case functions. The benefit of doing so is that the other testings will not be affected if a single test fails or an error occures. The code running job is sent to another thread by the library webworker to ensure the main thread is still smooth during the execution. `pythonToLetCodeCodeMapper` in `python-mapper.ts` is injected when the Python interpreter is initialized. Its job is to map the result back to formatted string. When the running is done, the user’s actual output is sent back and mapped by `PythonToLetCodeCodeMapper`, then is compared with the test cases’ expected outputs to determine weather the implementation is correct. All the existing type machings and test cases can be reuesd for running new languages, just need to implement the mapper (`letCodeToNewLangMapper` and `newLangToLetCodeCodeMapper`) for the specific language.


## Git/GitHub workflow
We used feature branches to separate different features every group member is working on to minimize conflicts. When a feature is primarily done, the branch is merged into the master branch.


## License
We decided to use the MIT license for our project. It grants people “the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software [without limitation]”. We chose this because this is one of the most permissive open source licenses available, and since our project is only a platform for code and algorithm sharing, it’s completely non-profitable. Therefore, we believe the MIT license is so far the most appropriate license for us. 
