import React from 'react';
import { AsYouType } from 'libphonenumber-js'
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Contacts from './components/Contacts';
import contactService from './services/contact-service';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			contacts: [],
			filteredContacts: [],
			firstName: '',
			lastName: '',
			phoneNumber: '',
			context: '',
			countryCode: '',
			countryCodeError: false,
			showContactAddedSuccess: false
		}
	}
	async componentWillMount() {
		this.loadContacts();
	}

	async loadContacts() {
		const data = await contactService.getContacts();
		this.setState({
			contacts: data,
			filteredContacts: data
		});
	}

	filter = event => {
		const val = event.target.value;
		// check to make sure there is value
		// if val exist filter results on user input
		// otherwise show full contact list
		if (val) {
			const filteredContacts = this.state.contacts.filter(contact => {
				return (val)
					? contact.name.toLowerCase().indexOf(val.toLowerCase()) > -1
					: true;
			});

			this.setState({
				filteredContacts
			});
		} else {
			this.setState({
				filteredContacts: this.state.contacts
			});
		}
	}

	 generateId = () => {
		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (dt + Math.random()*16)%16 | 0;
				dt = Math.floor(dt/16);
				// eslint-disable-next-line no-mixed-operators
				return (c==='x' ? r :(r&0x3|0x8)).toString(16);
		});
		return uuid;
	}

	handleFirstName = event => {
		this.setState({
			firstName: event.target.value
		});
	}

	handleLastName = event => {
		this.setState({
			lastName: event.target.value
		});
	}

	handleCountryCode = event => {
		this.setState({
			countryCode: event.target.value
		});
	}

	handlePhoneNumber = event => {
		this.setState({
			phoneNumber: event.target.value
		});
	}

	handleContext = event => {
		this.setState({
			context: event.target.value
		});
	}

	resetContactInputs = () => {
		// reset state back to default values
		this.setState({
			firstName: '',
			lastName: '',
			phoneNumber: '',
			context: '',
			countryCode: '',
			countryCodeError: false
		});
	}

	handleAddContact = async event => {
		// stop default form event so we can handle the submit through ajax
		event.preventDefault();

		const asYouType = new AsYouType(this.state.countryCode.toUpperCase());
		asYouType.input(this.state.phoneNumber);
		const convertedPhoneNumber = asYouType.getNumber();

		// if the country code isn't valid show error message and don't submit
		if (!convertedPhoneNumber) {
			this.setState({
				countryCodeError: true
			});
			return;
		}

		const addContact = await contactService.addContact({
			id: this.generateId(),
			name: `${this.state.firstName} ${this.state.lastName}`,
			number: convertedPhoneNumber.number,
			context: this.state.context
		});

		// first check if the contact has been added before reloading the data.
		if (Object.keys(addContact).length) {
			this.loadContacts();
			this.resetContactInputs();
			this.setState({ showContactAddedSuccess: true })
		} else {
			console.log('error adding contact');
		}
	}

	renderCountryCodeErrorMessage = () => {
		if (this.state.countryCodeError) {
			return (
				<p className="text-danger">
					Please enter a valid 2 digit Country ISO Code. The list of valid codes can be viewed&nbsp;
					<a href="https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes">here</a>.
				</p>
			);
		}

		return null;
	}

	renderContactSuccess = () => {
		if (this.state.showContactAddedSuccess) {
			return (
				<div class="alert alert-success alert-dismissible fade show" role="alert">
					New Contact has been added.
					<button
						onClick={() => this.setState({ showContactAddedSuccess: false })}
						type="button"
						class="close"
						data-dismiss="alert"
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
			);
		}

		return null;
	}

	render() {
		return (
			<div className="App container">
				<h1>Truly Contact Information</h1>
				<div className="row">
					<div className="col-md-3">
						<div className="card">
							<div className="card-body">
								<h2 className="h4">Add Contact</h2>
								<form onSubmit={this.handleAddContact}>
									<div className="form-group">
									<label htmlFor="first-name">First Name</label>
									<input
										type="text"
										value={this.state.firstName}
										onChange={this.handleFirstName}
										className="form-control"
										id="first-name" />
								</div>
								<div className="form-group">
									<label htmlFor="last-name">Last Name</label>
									<input
										type="text"
										value={this.state.lastName}
										onChange={this.handleLastName}
										className="form-control"
										id="last-name" />
								</div>
								<div className="form-group">
									<label htmlFor="country-code">Country Code</label>
									<input
										type="text"
										value={this.state.countryCode}
										onChange={this.handleCountryCode}
										className="form-control"
										maxLength="2"
										id="country-code" />
										{this.renderCountryCodeErrorMessage()}
								</div>
								<div className="form-group">
									<label htmlFor="phone">Phone Number</label>
									<input
										type="tel"
										value={this.state.phoneNumber}
										onChange={this.handlePhoneNumber}
										className="form-control"
										id="phone" />
								</div>
								<div className="form-group">
									<label htmlFor="context">Context</label>
									<input
										type="text"
										value={this.state.context}
										onChange={this.handleContext}
										className="form-control"
										id="context" />
								</div>
									<button type="submit" className="btn btn-primary mb-2">Submit</button>
								</form>
							</div>
						</div>
					</div>
					<div className="col-md-8 offset-md-1">
						<div className="card">
							<div className="card-body">
								<h2 className="h4">View and Search Contacts</h2>
								<div className="filters">
									<div className="form-group">
										<input
											type="text"
											className="form-control"
											id="contact-filter"
											placeholder="Contact Search"
											onKeyUp={this.filter} />
									</div>
								</div>
								<div>
									{this.renderContactSuccess()}
									<Contacts contact={this.state.filteredContacts}></Contacts>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
