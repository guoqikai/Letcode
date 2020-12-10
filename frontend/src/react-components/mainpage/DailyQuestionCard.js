import React, {useState} from 'react'
import Card from 'react-bootstrap/Card';
import CardContent from '@material-ui/core/CardContent';
import "./cards.css"
import { Star} from '@icon-park/react'


function DailyQuestionCard(props){
    
    
    const [collection, setcollection] = useState(true)
    var changeCollection = (e) => {
        e.preventDefault()
        if (collection == false){
          setcollection(true)
        }
        else{
          setcollection(false)
        }
      }
    
    return (
        <Card>        
        <CardContent>
            <div className="row">
                <div classclassName="col" >
                <div className="block star-icon mystar">
                        <Star theme={collection ? "outline" : "filled"} size="30" fill={collection ? "#333" : "orange" } onClick={changeCollection}/></div>
                    <div className="row">
                    <div className="block question-of-the-day-topic"  onClick={()=>{console.log("this is question of the day")}}>{props.items.title}</div>
                    </div>   
                    <br></br>
                    <div className="question-description"> {props.items.description} </div>
                    <br></br>
                    <div className="row">
              <div className="block upvote-number">upvotes: </div>
              <div className="block reply-number">replies: </div>
            </div>
                </div>
                <div className="col">
                    <div className="question-of-the-day-reply">
                        replies heree
                        <br></br>
                        and here
                        <br></br>
                        and here
                        question reply
                    </div>
                </div>
            </div>
          </CardContent> 
        </Card>     
    )
}

export default DailyQuestionCard;
