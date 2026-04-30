<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
<title>CEN Normandie</title>
<style type="text/css">
      body { text-align: center; padding: 150px; }
      h1 { font-size: 40px; }
      body { font: 20px Helvetica, sans-serif; color: #333; }
      #article { display: block; text-align: center; width: 500px; margin: 0 auto; }
      a { color: #dc8100; text-decoration: none; }
      a:hover { color: #333; text-decoration: none; }
      .classic {
      background-color:#fff;
      }
      .neon{
      color: rgba(0,0,0,0);
      text-shadow: 0 0px 2px #333;
      animation:shadow_change 10s;
      -moz-animation:shadow_change 10s infinite; /* Firefox */
      -webkit-animation:shadow_change 10s infinite; /* Safari and Chrome */
      }
      .neon_2{
      color: rgba(0,0,0,0);
      text-shadow: 0 0px 2px #333;
      animation:shadow_change_2 14s;
      -moz-animation:shadow_change_2 14s infinite; /* Firefox */
      -webkit-animation:shadow_change_2 14s infinite; /* Safari and Chrome */
      }
      .cen {
          color: #18651e
      }
      
      @-moz-keyframes shadow_change /* Firefox */
      {
      0%     {text-shadow:0 0px 0px #333}
      24%    {text-shadow:0 0px 0px #333}
      26%    {text-shadow:0 0px 2px #333}
      28%    {text-shadow:0 0px 1px #333}
      50%    {text-shadow:0 0px 0px #333}
      52%    {text-shadow:0 0px 1px #333}
      54%    {text-shadow:0 0px 1px #333}
      55%    {text-shadow:0 0px 2px #333}
      65%    {text-shadow:0 0px 1px #333}
      80%    {text-shadow:0 0px 2px #333}
      100%   {text-shadow:0 0px 3px #333}
      }
      @-moz-keyframes shadow_change_2 /* Firefox */
      {
      0%     {text-shadow:0 0px 0px #333}
      20%    {text-shadow:0 0px 0px #333}
      22%    {text-shadow:0 0px 2px #333}
      24%    {text-shadow:0 0px 1px #333}
      48%    {text-shadow:0 0px 0px #333}
      50%    {text-shadow:0 0px 1px #333}
      52%    {text-shadow:0 0px 1px #333}
      55%    {text-shadow:0 0px 3px #333}
      65%    {text-shadow:0 0px 0px #333}
      80%    {text-shadow:0 0px 2px #333}
      100%   {text-shadow:0 0px 2px #333}
      }
    </style>
</head>
<?php
$str = '';
if(isset($_GET['erreur'])) {
    switch($_GET['erreur'])
    {
    case '400':
    $str =  'Échec de l\'analyse HTTP.';
    break;
    case '401':
    $str =  'Le pseudo ou le mot de passe n\'est pas correct !';
    break;
    case '402':
    $str =  'Le client doit reformuler sa demande avec les bonnes données de paiement.';
    break;
    case '403':
    $str =  'Requête interdite !';
    break;
    case '404':
    $str =  'La page demandée ne peut être trouvée...';
    break;
    case '405':
    $str =  'Méthode non autorisée.';
    break;
    case '500':
    $str =  'Erreur interne au serveur ou serveur saturé.';
    break;
    case '501':
    $str =  'Le serveur ne supporte pas le service demandé.';
    break;
    case '502':
    $str =  'Mauvaise passerelle.';
    break;
    case '503':
    $str =  ' Service indisponible.';
    break;
    case '504':
    $str =  'Trop de temps à la réponse.';
    break;
    case '505':
    $str =  'Version HTTP non supportée.';
    break;
    default:
    $str =  'Erreur !';
    }
}
?>
<body>

<div id="article">
<h2 class="neon_2">OUPS!</h2>
<h4><span class="neon">Le </span><span class="cen">CEN Normandie</span><span class="neon"> est désolé c'est une erreur <?php echo $_GET['erreur'] ;?></span></h4>
<h4 class="neon"><?php echo $str; ?></h4>
<h2>-_-</h2>
</div>
</html>