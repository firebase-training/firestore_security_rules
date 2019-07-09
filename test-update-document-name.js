const firebase = require('@firebase/testing');
const projectId = 'my-project'
const testApp = firebase.initializeTestApp({
	projectId: projectId,
	auth: { uid: 'mary', email: 'joe@gmail.com' }
});
const testDb = testApp.firestore();

const adminApp = firebase.initializeAdminApp({projectId: projectId});
const adminDb = adminApp.firestore();

async function runTests() {
	try {
		createUser('mary', 'Zurich');

		await sleep(1000);

		await firebase.assertSucceeds(testDb
			.collection('users')
			.doc('mary')
			.update({
				city: 'Bern'
			})
		);

		await firebase.assertFails(testDb
			.collection('users')
			.doc('mary')
			.update({
				name: 'alice'
			})
		);
	} catch(exception) {
		console.error(exception)
	} finally {
		testApp.delete();
		adminApp.delete();
	}
}

async function createUser(name, city) {
	await adminDb.collection('users').doc(name).set({name: name, city: city});
}

function sleep(ms){
    return new Promise(function(resolve) {
        setTimeout(resolve,ms)
    });
}

runTests();

