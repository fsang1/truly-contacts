import React from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const formatPhoneNumber = phoneNumber => {
	const number = parsePhoneNumberFromString(phoneNumber);

	return number ? number.formatNational() : phoneNumber;
}

const Contacts = (props) => (
	<table className="table table-striped">
		<thead>
			<tr>
				<th>Name</th>
				<th>Number</th>
				<th>Context</th>
			</tr>
		</thead>
		<tbody>
			{
				props.contact.map((contact, index) => (
					<tr key={index}>
						<td>{contact.name}</td>
						<td>{formatPhoneNumber(contact.number)}</td>
						<td>{contact.context}</td>
					</tr>
				))
			}
		</tbody>
	</table>
);

export default Contacts;
