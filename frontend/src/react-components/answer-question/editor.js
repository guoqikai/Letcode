import React from 'react';
import { Controlled as ControlledEditor } from '../../react-codemirror2/index'
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python'
import 'codemirror/mode/clike/clike'
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/search/match-highlighter'


class Editor extends React.Component {
    
    code = ""
    getMode(selectedLang) { 
        if (selectedLang === "Python") {
            return "python";
        }
        if (selectedLang === "C") { 
            return "text/x-csrc";
        }
        if (selectedLang  === "C++") { 
            return "text/x-c++src";
        }
        if (selectedLang  === "Java") {
            return "text/x-java";
        }
        return "";
    }

    onEditorChange(editor, data, value, cancel) { 
        if (!this.props.onCodeChange || (this.props.mustInclude && !value.split("\n").includes(this.props.mustInclude))) {
            cancel();
        }
        else { 
            this.props.onCodeChange(value);
        }
    }


    render() { 
        const { code, lang, extraTheme } = this.props
        return (
            <div>
                <ControlledEditor
                    className="border border-gray"
                    onBeforeChange={this.onEditorChange.bind(this)}
                    value={code}
                    options={{
                        indentUnit: 4,
                        lineWrapping: true,
                        mode: this.getMode(lang),
                        lineNumbers: true,
                        matchBrackets: true,
                        matchhighlight: true,
                        autoCloseBrackets: true,
                        theme: "default " + (extraTheme ? extraTheme : "")
                    }}
                />
            </div>
        );
    }
}

export default Editor;