<?php  
	session_start();
	// DEFINE CONSTANTS
	define('DS', DIRECTORY_SEPARATOR);
	define('CORE_PATH', '..'.DS."core".DS);
	define('API_PATH', '..'.DS."api".DS);

    // OTHER CLASSES
	require_once(API_PATH.'Auth.php');
    // INSTANCIATE THE OTHE CLASSES AND PASS THE MODEL CLASS TO THEM
	$authController = new Auth();

	// ROUTES 
	switch ($_POST['action']) {
		case 'authenticate':
			$user_details = $authController->authenticate($_POST);
        break;
		case 'confirmSession':
			echo json_encode($_SESSION);
		break;
		case 'logout':
			echo json_encode(session_destroy());
		break;
    }

?>