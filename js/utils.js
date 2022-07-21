/**
 * FUNCTIONS AND VARIABLES SHARED BY ALL PAGES
 **/
// GENERAL VARIABLE NAMES
var sysData={}
// GET PAGE TITLE
const getPageTitle = () => {
	return document.title;
}
// SET PAGE TITLE
const setPageTitle = (pageTitle) => {
	document.title = pageTitle;
}
const generateOptions = (dataArray) => {
    let allOptions 
    dataArray.forEach(option => {
        allOptions += `<option>${option.name}</option>`;
    })
    return allOptions;
}

const addComma = (num) => {
    let numArr = num.split('');
    let commadNumber = '', count = 0;

    for (var i = numArr.length - 1; i >= 0; i--) {
        count++;
        commadNumber += numArr[i];
        if(count == 3){
            commadNumber += ",";
            count = 0;
        }
    }
    let commadNumberArr = commadNumber.split('');
    // REMOVE LAST COMMA
    if (commadNumberArr[commadNumberArr.length - 1] ===',') {
        commadNumberArr.pop();
    }
    commadNumber="";
    // REARRANGE THE NUMBER BACK TO NORMAL
    for (var i = commadNumberArr.length - 1; i >= 0; i--) {
        commadNumber += commadNumberArr[i];
    }
    if(commadNumber.includes('.')){
        let removeCommaBeforePoint = commadNumber.split('.');
        let pointValue = removeCommaBeforePoint[1];
        let actualValue = removeCommaBeforePoint[0];
        let actualValueArr = actualValue.split('');
        actualValueArr.pop();
        actualValue = '';
        actualValueArr.forEach(c => {
            actualValue += c;
        });
        commadNumber = actualValue + '.' + pointValue;

    }

    return commadNumber;
}
const removeComma = (num) => {
    let numArr = num.split(',');
    let nomalNumber = "";
    numArr.forEach((number) => {
        nomalNumber += number;
    });
    return nomalNumber;
}

const deliverNotification = (msg, msgtype) => {
    document.querySelector('.notification_messages').innerHTML = `${msg} <span class="material-symbols-outlined">close</span>`;

    document.querySelector('.notification_messages').classList.forEach((nclass) => {
        if(nclass !== 'notification_messages'){
            document.querySelector('.notification_messages').classList.remove(nclass);
        }
    });
    document.querySelector('.notification_messages').classList.add(msgtype);

    document.querySelector('.notification_messages span').addEventListener('click', () => {
        document.querySelector('.notification_messages').classList.remove(msgtype);
    });
    removeNotification();
}
const removeNotification = () => {
    setTimeout(function(){
        document.querySelector('.notification_messages').classList.forEach((nclass) => {
            if(nclass !== 'notification_messages'){
                document.querySelector('.notification_messages').classList.remove(nclass);
            }
        });

    }, 8000);
}

const preloader = () => {

    const preloader = document.createElement('div');
    preloader.classList.add('preloader');
    return preloader;
}

const removeElement =(element) => {
    if(document.querySelector(element) != null){
        document.querySelector(element).remove();
    }
}
// UPDATE SITE DATA
const updateSiteData = (data) => {
    localStorage.setItem('sys.hospital.MS', JSON.stringify(data));
    sysData = JSON.parse(localStorage.getItem('sys.hospital.MS'));
}
// SEND REQUEST
const dataRequest = (data, name) => {
	var ajaxRqt = $.ajax({
		url: 'http://localhost/PIMS/api/route.php',
        type: "POST",
        dataType  : 'json',
        data: data,
        success: (response) =>{
            // ADD DATA TO SYSTEM DATA
            sysData[name] = response;
        },
        complete:() =>{
        	// console.log(sysData);
        }
	});
	return ajaxRqt;
}
// CHECK LOGIN SESSION
const checkSession = () => {
	setInterval(() => {
	    let siteData = JSON.parse(localStorage.getItem('sys.hospital.MS'));
		let title = getPageTitle();
		if(title == 'Dashboard'){
			if (!siteData) {
				console.log("Session not set")
				window.location.href ='./signin.html';
			}else{
				sysData = (Object.keys(sysData).length == 0) ? siteData: sysData;
				confirmSession(sysData);
			}
		}else if(title == 'Signin'){
			if (siteData) {
				console.log("Session is set")
				window.location.href ='./dashboard.html';
			}
		}
	}, 1000);
}
// CHECK IF SESSION ON CLIENT COMPUTER MURCHES SERVER SIDE SESSION
const confirmSession = (sysData) => {
	// GET SERVER SIDE SESSION INFORMATION
	let response = dataRequest({
			'action': 'confirmSession',
			'user_id': sysData.session.user_id
		}, 'sessionConfirmation');
	response.always((data) => {
		/** IF SESSION DATA IN LOCAL STORAGE DOEN'T MUCH 
		 * WITH SESSION DATA AT THE SERVER THEN REDIRECT THE USER 
		 * TO SIGN IN PAGE AND CLEAR LOCAL SESSION STORAGE
		 **/
		if(sysData.sessionConfirmation.user_id !== sysData.session.user_id){
			window.localStorage.removeItem('sys.hospital.MS');
			window.location.href = "./signin.html";
		}
	});
}
export { getPageTitle, setPageTitle, sysData, dataRequest, checkSession, generateOptions, addComma, removeComma, deliverNotification, removeNotification, preloader, removeElement, updateSiteData }