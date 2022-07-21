import 
{ getPageTitle, setPageTitle, sysData, dataRequest, checkSession, generateOptions, addComma, removeComma, deliverNotification, removeNotification, preloader, removeElement, updateSiteData } 
from './utils.js';

// CHECK IF USER SESSION IS SET
checkSession();

// GENERAL VARIABLE NAMES
let title="";
let response = null;
document.addEventListener('DOMContentLoaded', () => {
	title = getPageTitle();
	// CHECK WHICH PAGE IS ACTIVE
	switch(title){
		case 'Signin':
			// CHECK PASSWORD/SEE PASSWORD IN PASSWORD INPUT FIELD
			let signinPasswordInput = document.querySelector('#signin-password');
			let signinUsernameInput = document.querySelector('#signin-username');
			let checkPassCodeBtn = document.querySelector('.check-pass-code');
			checkPassCodeBtn.addEventListener('click', () => {
				checkPassCodeBtn.textContent = (checkPassCodeBtn.textContent == "visibility_off") ? 'visibility' : "visibility_off";
				signinPasswordInput.type = (signinPasswordInput.type == "text") ? "password" : "text";
			});
			// REMEMBER ME
			let checkBox = document.getElementById('checkb');
			let checkBoxIcon = document.getElementById('checkBox');
			checkBox.addEventListener('click', () => {
				checkBoxIcon.textContent = (checkBoxIcon.textContent == "check_box_outline_blank") ? 'select_check_box' : 'check_box_outline_blank';
			})
			// LOGIN
			document.querySelector('#signin-form').addEventListener('submit', (e) => {
				e.preventDefault();
				response = dataRequest({
					'action': 'authenticate', 
					'username': signinUsernameInput.value, 
					'password': signinPasswordInput.value, 
					'rememberMe': (checkBoxIcon.textContent == 'check_box_outline_blank') ? 'no' : 'yes'
					}, 'session');
				response.always(() => {
					if(sysData.session != "Invalid username or password."){
						updateSiteData(sysData);
					}else{
						deliverNotification(sysData.session, 'danger');
					}

				});
			});
		break;
		case 'Dashboard':
			// CHECK IF SESSION DATA IS SET 
			// IT IS SET IN THE BACKGROUND BY SESSION CHECK (UTILS)
			let dataSet = setInterval(() => {
				if(Object.keys(sysData).length > 0){
					clearInterval(dataSet)

					// SET USER IMAGE IN THE NAVIGATION
					document.querySelector('.profile-photo img').setAttribute('src', `./images/${sysData.session.image}`);

					// LOGOUT
					document.querySelector('.logout-btn').addEventListener('click', () => {
						let user_id = sysData.session.user_id;
						// GET SERVER SIDE SESSION INFORMATION
						let response = dataRequest({
								'action': 'logout',
								'user_id': user_id
							}, 'logout');
						response.always((data) => {
							if(data){
								window.localStorage.removeItem('sys.seralie.MS');
							}
						});
					});
				}

				response = dataRequest({
					'action': 'sms',
				}, 'sms');
				response.always((data) => {
					console.log(data);
				});
			}, 1000);

		break;
	}

});
