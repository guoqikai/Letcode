import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { Form } from 'react-bootstrap'


class EditIntro extends Component {
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.editIntro(this.state.intro)
        this.props.changeIntro(this.state.intro)
        this.props.handleChange()
    }
    handleChange = (e) => {
        this.setState({
            intro: e.target.value
        })
    }
    render() {
        return (
            <div>
                <Form>
                    <Form.Group controlId="commentText">
                        <Form.Control as="textarea" rows={8}
                            placeholder="Please be polite!"
                            onChange={this.handleChange} />
                    </Form.Group>
                    <Button outline block variant="primary" type="submit" onClick={this.handleSubmit}>
                        Done
                </Button>
                </Form>
            </div>
        )
    }
}

export default EditIntro

