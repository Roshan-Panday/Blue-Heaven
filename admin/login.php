<?php
session_start();

$valid_user = "BLUE Heavens";
$valid_pass = "Heavens@2026!!";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_POST['username'] === $valid_user && $_POST['password'] === $valid_pass) {
        $_SESSION['loggedin'] = true;
        header('Location: index.php');
        exit;
    } else {
        $error = "Incorrect Username or Password";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-4 shadow" style="width: 350px;">
        <h4 class="text-center mb-4">🔐 Admin Login</h4>
        <?php if(isset($error)): ?><div class="alert alert-danger"><?= $error ?></div><?php endif; ?>
        <form method="POST">
            <input type="text" name="username" class="form-control mb-3" placeholder="Username" required>
            <input type="password" name="password" class="form-control mb-3" placeholder="Password" required>
            <button class="btn btn-primary w-100">Login</button>
        </form>
    </div>
</body>
</html>