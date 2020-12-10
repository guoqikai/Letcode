import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from "@material-ui/core/styles";
import {Search, search} from '@icon-park/react'
import './cards.css'


class SearchBar extends Component {
    render() {
        return (
            <Card className="shadow p-2 bg-white" className="search-bar-background"> 
            <InputBase className="search-input"
                placeholder="Search Question"/>
            <Search className="search-icon" theme="outline" size="30" fill="#333" onClick={()=>{console.log("search")}}></Search>

            </Card>        
        )
    }
}
export default SearchBar;