
<?php
include '../properties.php';
//connexion a la BD
$dbconn = pg_connect("hostaddr=$DBHOST_cad port=$PORT_cad dbname=$DBNAME_cad user=$LOGIN_cad password=$PASS_cad")
or die ('Connexion impossible :'. pg_last_error());

try {
  // Récupère le paramètre
  $terms = isset($_POST['terms']) ? trim($_POST['terms']) : '';
  if (strlen($terms) < 3) {
    echo json_encode([]); exit;
  }

$select = pg_prepare($dbconn, "sql", "
SELECT row_to_json(fc)
FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
FROM (SELECT 'Feature' As type
   , ST_AsGeoJSON( st_transform(lg.l_geom,4326) )::json As geometry
   , row_to_json(lp) As properties
  FROM $l_admins As lg 
        INNER JOIN (SELECT l_id, l_nom, l_table_name FROM $l_admins WHERE l_nom ~* $1 or l_id ~* $1 ORDER BY l_nom ASC LIMIT 20  ) As lp 
      ON lg.l_id = lp.l_id  ) As f )  As fc

  ");
$admin = pg_execute($dbconn, "sql",array($terms)) or die ( pg_last_error());
while($row = pg_fetch_row($admin))
{
  echo json_encode($row[0]);
}
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Erreur serveur', 'detail' => $e->getMessage()]);
}
//ferme la connexion a la BD
pg_close($dbconn);
