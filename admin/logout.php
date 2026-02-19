<?php
// 1. Start the session to access current data
session_start();

// 2. Unset all session variables
$_SESSION = array();

// 3. Destroy the session completely
session_destroy();

// 4. Redirect to the Login Page
header("Location: login.php");
exit;
?>