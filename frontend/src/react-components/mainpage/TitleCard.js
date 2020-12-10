import React from 'react'
// import { Star} from '@icon-park/react'
import { NavLink } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function TitleCard(props){

  const path ='/' + props.data._id + '/detail';

    return (
        <div className="card"> 
        {/* <div className="block star-icon mystar">
          <Star onClick={() => changeCollection(props.data._id)} theme={collection ? "filled" : "outline" } size="30" fill={collection ?  "orange" : "#333" }/></div>   */}
          
        <div className="card-body">
            <div className = "col">
            <div className ="row">     
              <NavLink as={Link} to={path}>{props.data.name}</NavLink>
            </div>   
            <br></br>
            <div className="question-description"> {props.data.desc} </div>
            <br></br>
            <div className="row">
              <div className="block upvote-number">upvotes: {props.data.numUpVote}</div>
              <div className="block reply-number">answers: {props.data.numAnswers}</div>
            </div>
            </div>  
          </div>       
      </div>
)
}

export default TitleCard;
