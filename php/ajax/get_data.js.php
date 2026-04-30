<?php
include '../properties.php';

//connexion a la BD
$dbconn = pg_connect("hostaddr=$DBHOST_cad port=$PORT_cad dbname=$DBNAME_cad user=$LOGIN_cad password=$PASS_cad")
or die ('Connexion impossible :'. pg_last_error());


$sql = "
SELECT row_to_json(fc)
FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
FROM (SELECT 'Feature' As type
   , ST_AsGeoJSON( st_transform(lg.geom,4326) )::json As geometry
   , row_to_json(lp) As properties
  FROM $preloc As lg 
        INNER JOIN (SELECT 
            id_tourbiere ,
            nom_entite ,
            statut_tou ,
            date_maj ,
            structure ,
            coalesce(niv_flore, 'ø') AS niv_flore,
            coalesce(niv_pedolo, 'ø') AS niv_pedolo,
            enjeu_prot ,
			geom
       FROM $preloc
        WHERE 1=1 ) As lp 
      ON lg.id_tourbiere = lp.id_tourbiere ) As f )  As fc;
      ";

$query_result = pg_exec($dbconn,$sql) or die (pg_last_error());
while($row = pg_fetch_row($query_result))
{
  echo trim($row[0]);
}
//ferme la connexion a la BD
pg_close($dbconn);

?>
