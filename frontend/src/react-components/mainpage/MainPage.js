import React, { Component } from 'react'
import SearchBar from './SearchBar';
import Sortby from './Sortby.js';
import TitleCard from './TitleCard';
import DailyQuestionCard from './DailyQuestionCard';
import { getQuestion } from '../../api-calls/question-api-calls'
import FetchWrapper from "../fetchWrapper"
import "./MainPage.css";
import { Search } from '@icon-park/react';

class MainPage extends Component {
    state = {
        questions: this.props.data,
        searchKey: ''
    }

    handleClickSortByPopular = () => {
        const sortByPopular = this.state.questions.sort(function(a, b){return b.numUpVote - a.numUpVote});
        this.setState({
            questions: sortByPopular
        })
    }

    handleClickSortByRecentPost = () => {
        const sortByRecentPost= this.state.questions.sort(function(a, b){return new Date(b.date) - new Date(a.date)});
        this.setState({
            questions: sortByRecentPost
        })
    }

    handleOnChange = () =>{
        
    }
    

    render() {
        return (
            <div>
                {/* <h1 className="question-of-the-day-title">Question of the DAYYY</h1>
                <div className="question-of-the-day-card">
                    <DailyQuestionCard items={{ "id": 2, "title": "Longest Substring Without Repeating Characters", "description": "Given a string s, find the length of the longest substring without repeating characters." }} className="card" />
                </div> */}
                <div className="search-bar"><SearchBar></SearchBar></div>
                <div className="row filter-rows">
                <div className="block sortby-filter"><Sortby handleClickSortByPopular={this.handleClickSortByPopular} handleClickSortByRecentPost={this.handleClickSortByRecentPost}></Sortby></div>
                </div>

                {this.props.data.map((obj, ind) => <div className="question-card" key={ind}><TitleCard data={obj} className="card"/></div>)}
            </div>
        
        )
    }
}


function wrappedMainPage() {
    return <FetchWrapper fetchData={getQuestion}><MainPage/></FetchWrapper>;
}


export default wrappedMainPage;