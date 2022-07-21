<?php  
session_start();
require_once('../config/DbConnection.php');
class Utils{
    public $conn;
    public function __construct(){
        $db = new DbConnection();
        $this->conn = $db->getConnection();
        return $this->conn;
    }
	public function fetchAll($table){
		$query = "SELECT *
            FROM " . $table;
 
        // PREPARE QUERY STATEMENT
        $stmt = $this->conn->prepare( $query );
          
        // RUN/EXECUTE QUERY
        $stmt->execute();
     
        // RETURN RESULTS
        return $stmt;
	}
    public function Save($table, $fields = array()){
        $set = '';
        $x = 1;

        foreach ($fields as $name => $value) {
            $set .= "{$name} = ?";
            if ($x < count($fields)) {
                $set .= ', ';
            }
            $x++;
        }

        $sql = "INSERT INTO {$table} SET {$set}";

        // prepare query statement
        if($stmt = $this->conn->prepare($sql)){
            $x = 1;
            if (count($fields)) {
                foreach ($fields as $field) {
                    $stmt->bindValue($x, $field);
                    $x++;
                }
            }

            if($stmt->execute()){
                return $this->conn->lastInsertId();
            }
            printf('Error: %s', $stmt->error);
            return false;
        }
    }
    public function getDetails($query,  $fields= array()){
        if($stmt = $this->conn->prepare( $query )){
          $x = 1;
            if (count($fields)) {
                foreach ($fields as $field) {
                    $stmt->bindValue($x, $field);
                    $x++;
                }
            }
        }
        // return $stmt;
        if($stmt->execute()){
            return $stmt;
        }
        printf('Error: %s', $stmt->error);
        return false;
    }
    
    function updateDetails($table, $fieldname, $fieldvalue, $fields = array()){
        $set = '';
        $x = 1;

        foreach ($fields as $name => $value) {
            $set .= "{$name} = ?";
            if ($x < count($fields)) {
                $set .= ', ';
            }
            $x++;
        }

        $sql = "UPDATE {$table} SET {$set} WHERE {$fieldname} = {$fieldvalue}";

        // prepare query statement
        if($stmt = $this->conn->prepare($sql)){
            $x = 1;
            if (count($fields)) {
                foreach ($fields as $field) {
                    $stmt->bindValue($x, $field);
                    $x++;
                }
            }

            if($stmt->execute()){
                return true;
            }
            return false;
        }
    }
        
    public function delete($table, $fieldvalue ,$id){
        $query = "DELETE FROM ${table} WHERE ${fieldvalue} = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        
        if($stmt->execute()){
            return true;
        }
        return false;
    }


}
?>