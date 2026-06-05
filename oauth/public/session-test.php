<?php
session_start();

$_SESSION['test'] = 'hello';

echo session_id();
echo "<br>";
echo $_SESSION['test']; 