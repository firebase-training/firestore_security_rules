const firebase = require('@firebase/testing');
const projectId = 'my-project'
const testApp = firebase.initializeTestApp({
	projectId: projectId,
	auth: { uid: 'joe', email: 'joe@gmail.com' }
});
const testDb = testApp.firestore();

const adminApp = firebase.initializeAdminApp({projectId: projectId});
const adminDb = adminApp.firestore();

async function runTests() {
	try {
		createUser('mary', 'Zurich');
		createUser('yves', 'Bern');

		await sleep(1000);

		await firebase.assertSucceeds(testDb
			.collection('users')
			.doc('yves')
			.get()
		);

		await firebase.assertFails(testDb
			.collection('users')
			.doc('mary')
			.get()
		);

		

	} catch(exception) {
		console.error(exception)
	} finally {
		testApp.delete();
		adminApp.delete();
	}
}

function sleep(ms){
    return new Promise(function(resolve) {
        setTimeout(resolve,ms)
    });
}

async function createUser(name, city) {
	await adminDb.collection('users').doc(name).set({name: name, city: city});
}

runTests();

