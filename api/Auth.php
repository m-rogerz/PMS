<?php  
session_start();
// CORE CLASSES
require_once('../core/Utils.php');
class Auth extends Utils {

	public function authenticate($post){
        $query = "SELECT ut.*, utt.permissions, utt.user_type, bc.branch_location, ut.user_id AS atuserid, ui.image 
            FROM user_tb ut 
            LEFT OUTER JOIN user_type_tb utt 
            ON ut.user_type_id = utt.user_type_id  
            LEFT OUTER JOIN branch_tb bc 
            ON ut.branch_id = bc.branch_id   
            LEFT OUTER JOIN user_profile_image_tb ui 
            ON ui.user_id = ut.user_id   
            WHERE ut.status_id = 3 AND ut.username = ? ";
        
        // PREPARE QUERY STATEMENT
        $stmt = $this->conn->prepare( $query );
        $stmt->bindValue(1, $post['username']);
        // RUN/EXECUTE QUERY
        $stmt->execute();
        $result = $stmt;
		// GET NUMBER OF ROWS 
		$num = $result->rowCount();
		$result =$result->fetch(PDO::FETCH_ASSOC);
		$userimage = "default.png";
		if($num > 0){
			if (password_verify($post['password'], $result['password'])) {
				$_SESSION['user_id'] = $result['user_id'];
				$session_id = $_SESSION['user_id'];
				$_SESSION['rememberMe'] = $post['rememberMe'];
				// SEVER SESION DATA
				$_SESSION["address"] = $result['address'];
				$_SESSION["created_at"] = $result['created_at'];
				$_SESSION["deleted_at"] = $result['deleted_at'];
				$_SESSION["email"] = $result['email'];
				$_SESSION["first_name"] = $result['first_name'];
				$_SESSION["last_name"] = $result['last_name'];
				$_SESSION["modified_at"] = $result['modified_at'];
				$_SESSION["permissions"] = $result['permissions'];
				$_SESSION["telephone"] = $result['telephone'];
				$_SESSION["user_type"] = $result['user_type'];
				$_SESSION["user_type_id"] = $result['user_type_id'];
				$_SESSION["username"] = $result['username'];
				$_SESSION["image"] = ($result['image'] != null) ? $result['image'] : 'default.png';
				$_SESSION["branch_id"] = $result['branch_id'];
				$_SESSION["branch"] = $result['branch_location'];
				// DATA TO SEND TO LOGING PAGE
				$userD = array(
					"address" => $result['address'],
					"created_at" => $result['created_at'],
					"deleted_at" => $result['deleted_at'],
					"email" => $result['email'],
					"first_name" => $result['first_name'],
					"last_name" => $result['last_name'],
					"modified_at" => $result['modified_at'],
					"permissions" => $result['permissions'],
					"telephone" => $result['telephone'],
					"user_id" => $result['user_id'],
					"user_type" => $result['user_type'],
					"user_type_id" => $result['user_type_id'],
					"username" => $result['username'],
					"image" => ($result['image'] != null) ? $result['image'] : 'default.png',
					"branch_id" => $result['branch_id'],
					"branch" => $result['branch_location'],
					"rememberMe" => $post['rememberMe'],
				);
				$res = $userD;
			}else{
				$res = "Invalid username or password.";
			}
		}
		else{
			$res = "Invalid username or password.";
		}
		echo json_encode($res);
	}
}
?>