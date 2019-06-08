import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

const getContacts = async () => {
	try {
		const data = await axios.get('/contacts');
		return data.data;
	} catch (error) {
		return [];
	}
};

const addContact = async contact => {
	try {
		const user = await axios.post('/contacts', contact);
		return user.data;
	} catch (error) {
		return {};
	}
}

export default {
	getContacts,
	addContact
};
