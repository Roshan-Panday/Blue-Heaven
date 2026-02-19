<?php
session_start();

// --- SECURITY CHECK ---
// If the user is NOT logged in, redirect them to the login page immediately.
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: login.php');
    exit;
}

// Load data files
$siteFile = '../data/site.json';
$roomsFile = '../data/rooms.json';

// Read JSON data
$site = json_decode(file_get_contents($siteFile), true);
$rooms = json_decode(file_get_contents($roomsFile), true);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blue Heaven Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f4f6f9; }
        .card { box-shadow: 0 4px 6px rgba(0,0,0,0.1); border:none; margin-bottom: 20px; }
        .card-header { background: #003366; color: white; font-weight: bold; }
        .package-row { background: white; border-left: 5px solid #FFC107; margin-bottom: 15px; padding: 20px; border-radius: 5px; }
        .btn-save { background: #FFC107; color: #003366; font-weight: bold; border: none; padding: 10px 40px; }
        .btn-save:hover { background: #e0a800; }
    </style>
</head>
<body>

<div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-dark fw-bold">🏕️ Admin Dashboard</h2>
        <div>
            <a href="../index.html" target="_blank" class="btn btn-outline-primary me-2">View Website</a>
            <a href="logout.php" class="btn btn-danger">Logout</a>
        </div>
    </div>

    <?php if (isset($_GET['status']) && $_GET['status'] == 'success'): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>✅ Success!</strong> Website updated successfully.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <form action="save.php" method="POST">
        
        <div class="card">
            <div class="card-header">📞 Contact Info (Updates Header/Footer)</div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label fw-bold">Primary Phone</label>
                        <input type="text" name="site[phones][primary]" class="form-control" value="<?= htmlspecialchars($site['phones']['primary']) ?>">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label fw-bold">Secondary Phone</label>
                        <input type="text" name="site[phones][secondary]" class="form-control" value="<?= htmlspecialchars($site['phones']['secondary']) ?>">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label fw-bold">WhatsApp Number</label>
                        <input type="text" name="site[whatsapp]" class="form-control" value="<?= htmlspecialchars($site['whatsapp']) ?>">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold">Email Address</label>
                        <input type="text" name="site[email]" class="form-control" value="<?= htmlspecialchars($site['email']) ?>">
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">🏷️ Packages & Pricing</div>
            <div class="card-body bg-light">
                <?php foreach ($rooms as $index => $pkg): ?>
                    <div class="package-row">
                        <div class="row">
                            <input type="hidden" name="rooms[<?= $index ?>][id]" value="<?= $pkg['id'] ?>">
                            <input type="hidden" name="rooms[<?= $index ?>][image]" value="<?= $pkg['image'] ?>">
                            <input type="hidden" name="rooms[<?= $index ?>][description]" value="<?= htmlspecialchars($pkg['description']) ?>">

                            <div class="col-md-4 mb-3">
                                <label class="small text-muted">Title</label>
                                <input type="text" name="rooms[<?= $index ?>][title]" class="form-control fw-bold" value="<?= htmlspecialchars($pkg['title']) ?>">
                            </div>
                            <div class="col-md-2 mb-3">
                                <label class="small text-muted">Category</label>
                                <select name="rooms[<?= $index ?>][category]" class="form-select">
                                    <option value="stay" <?= $pkg['category'] == 'stay' ? 'selected' : '' ?>>Stay</option>
                                    <option value="rafting" <?= $pkg['category'] == 'rafting' ? 'selected' : '' ?>>Rafting</option>
                                    <option value="adventure" <?= $pkg['category'] == 'adventure' ? 'selected' : '' ?>>Adventure</option>
                                    <option value="rental" <?= $pkg['category'] == 'rental' ? 'selected' : '' ?>>Rental</option>
                                </select>
                            </div>
                            <div class="col-md-2 mb-3">
                                <label class="small text-muted">Badge</label>
                                <input type="text" name="rooms[<?= $index ?>][badge]" class="form-control" value="<?= htmlspecialchars($pkg['badge']) ?>">
                            </div>
                            <div class="col-md-2 mb-3">
                                <label class="small text-muted text-success">Price (₹)</label>
                                <input type="number" name="rooms[<?= $index ?>][price]" class="form-control fw-bold text-success" value="<?= $pkg['price'] ?>">
                            </div>
                            <div class="col-md-2 mb-3">
                                <label class="small text-muted text-danger">MRP (₹)</label>
                                <input type="number" name="rooms[<?= $index ?>][mrp]" class="form-control text-decoration-line-through text-danger" value="<?= $pkg['mrp'] ?>">
                            </div>
                            <div class="col-md-12">
                                <label class="small text-muted">Features (Comma separated)</label>
                                <input type="text" name="rooms[<?= $index ?>][features]" class="form-control" value="<?= implode(', ', $pkg['features']) ?>">
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <div style="height: 100px;"></div> <div class="fixed-bottom bg-white border-top p-3 shadow text-end">
            <div class="container">
                <button type="submit" class="btn btn-save shadow-sm">💾 UPDATE WEBSITE</button>
            </div>
        </div>

    </form>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>