<?php
session_start();

// Security Check
if (!isset($_SESSION['loggedin'])) {
    die("Access Denied");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. Save Site Info
    if (isset($_POST['site'])) {
        $siteData = $_POST['site'];
        $currentSite = json_decode(file_get_contents('../data/site.json'), true);
        
        // Preserve other data not in form
        if(!isset($siteData['links'])) $siteData['links'] = $currentSite['links'];
        
        file_put_contents('../data/site.json', json_encode($siteData, JSON_PRETTY_PRINT));
    }

    // 2. Save Rooms
    if (isset($_POST['rooms'])) {
        $roomsData = $_POST['rooms'];
        $cleanRooms = [];
        $originalData = json_decode(file_get_contents('../data/rooms.json'), true);

        foreach ($roomsData as $room) {
            $room['price'] = (int)$room['price'];
            $room['mrp'] = (int)$room['mrp'];
            $room['rating'] = 5.0; 
            $room['reviews'] = rand(120, 800);

            // Handle Features
            if (isset($room['features']) && !is_array($room['features'])) {
                $room['features'] = array_filter(array_map('trim', explode(',', $room['features'])));
            }

            // Keep original details (Itinerary/Images)
            foreach($originalData as $orig) {
                if($orig['id'] == $room['id']) {
                    $room['details'] = $orig['details'] ?? null;
                    $room['whatsapp_msg'] = $orig['whatsapp_msg'] ?? "";
                    break;
                }
            }
            $cleanRooms[] = $room;
        }

        file_put_contents('../data/rooms.json', json_encode($cleanRooms, JSON_PRETTY_PRINT));
    }

    header("Location: index.php?status=success");
    exit;
}
?>