<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Content-Type:application/json');
$_POST =json_decode(file_get_contents('php://input'), true);

$email=$_POST['email'];
$amount=$_POST['fromAmount'];
$convertVal=$_POST['convertTo'];
$result=$_POST['result'];

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/PHPMailer.php';


$mail = new PHPMailer(true);
try {
    //Server settings       
    $mail->setLanguage('ru', 'PHPMailer/language/phpmailer.lang-ru.php');           
    $mail->CharSet = 'UTF-8';


    $mail->SMTPDebug = 2;                    
    $mail->isSMTP();                                           
    $mail->Host       = 'smtp.yandex.ru';                     
    $mail->SMTPAuth   = true;                                  
    $mail->Username   = 'testcodeeeee@yandex.ru';                    
    $mail->Password   = 'ijpedpbjthxdywyh';                               
    $mail->SMTPSecure = 'tls';            
    $mail->Port       = 587;                                   


   //Recipients
    $mail->setFrom('testcodeeeee@yandex.ru');
    $mail->addAddress($email);   
 
    //Content
    $mail->isHTML(true);  
    $mail->Subject = 'Перевод валюты';


    if(trim(!empty($_POST['fromAmount']))){
        $body.='Сумма рублей: ' .$_POST['fromAmount'];
    }

    if(trim(!empty($_POST['convertTo']))){
        $body.=' Валюта для конвертации: ' .$_POST['convertTo'];
    }

    if(trim(!empty($_POST['result']))){
        $body.=' Сумма в валюте: '.$_POST['result'];
    }

    $mail->Body= $body;


    $mail->send();
    echo 'Message has been sent';

} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
