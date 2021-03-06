import React, { Component } from 'react';
import axios from 'axios';

import { Alert, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

class RequestForm extends Component {

	constructor(props, context) {
		super(props, context);

		this.handleChange = this.handleChange.bind(this); 
		this.handleSubmit = this.handleSubmit.bind(this);
        this.sendForm = this.sendForm.bind(this);

        this.fields = [
            { "key": "name", "name": "Full Name", "type": "text", "placeholder": "Enter name" },
			{ "key": "email", "name": "Email", "type": "email", "placeholder": "Enter Email" },
            { "key": "phone", "name": "Phone Number", "type": "text", "placeholder": "Enter Phone Number" },
        ];

        //this.itemOptions = ["hygiene","essentials","clothing"];
        this.itemOptions = ["Shoes", "Socks", "Dresses and Skirts"];
        
        //initialize state with keys from fields array
        this.state = {};

        //initialize form inputs for submission
        this.inputs = {};

        this.fields.forEach(field => {
            // eslint-disable-next-line
            this.state[field.key] = ''; 
            this.inputs[field.key] = '';
        });

        this.inputs.item = '';

	}

    // Example validation of the inputs
	getValidationState(key) {
		const length = this.state[key].length;
		if (length > 10) return 'success';
		else if (length > 5) return 'warning';
		else if (length > 0) return 'error';
		return null;
  	}
	
	handleChange(e, key) {
        let newState = {};
        newState[key] = e.target.value
        this.setState(newState);
  	}

    // Display message and run callback on form submission
    handleSubmit(e) {
        e.preventDefault();
        this.setState({
            alert: 'info',
            message: 'Sending...'
        }, this.sendForm);
    }

    // Send HTTP post request
    sendForm() {
        var data = {};
        this.fields.forEach((field) => {
            data[field.key] = this.inputs[field.key].value;
        });
        data.item = this.inputs.item.value;
        console.log(data);

        // localhost shouldn't be hard-coded. how do we 
        // handle this in development if the API endpoint
        // is on a different port?
        axios.post('http://localhost:8000/api/requests/', data)
            .then((res) => {
                this.setState((oldState) => ({alert: 'success', message: 'Request received.'}));
                console.log(res);
            })
            .catch((err) => {
                this.setState((oldState) => ({alert: 'danger', message: 'Request failed.'}));
                console.log(err)
            });
    }

    getBasicFields(fields){
        return fields.map((field, index) =>
            <FormGroup controlId={field.key} key={index}
            validationState={this.getValidationState(field.key)}>
                <ControlLabel>{field.name}</ControlLabel>
                <FormControl
                    type={field.type}
                    value={this.state[field.key]}
                    placeholder={field.placeholder}
                    inputRef={(ref) => {this.inputs[field.key] = ref}}
                    onChange={event => {this.handleChange(event, field.key)}}
                />
                <FormControl.Feedback />
            </FormGroup>)
    }

    getItemOptions(items){
        return items.map((item, index) => <option key={index} value={index+1}>{item}</option>)
    }
	
    render() {
        if (this.state.alert && this.state.message) {
            var formStatus = (
                <Alert bsStyle={this.state.alert}>
                    {this.state.message}
                </Alert>
            );
        }

        return (
            <div className="RequestForm">
                <h2>Request form</h2>
                <form onSubmit={this.handleSubmit}>
                    {this.getBasicFields(this.fields)}
                    <FormGroup>
                        <ControlLabel>Select an Item</ControlLabel>
                        <FormControl
                            componentClass="select"
                            placeholder="select"
                            inputRef={(ref) => {this.inputs.item = ref}}
                        >
                            {this.getItemOptions(this.itemOptions)}
                        </FormControl>
                    </FormGroup>
                    <Button type="submit">Submit</Button>
                    {formStatus}
                </form>
            </div>
        );
    }
}

export default RequestForm;
