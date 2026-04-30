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
  FROM mfu.parcelles As lg 
        INNER JOIN (SELECT 
            id_unique ,
            nom_group as nom_site ,
            id_group as id_site ,
            coalesce(id_convention, 'ø') AS convention,
            coalesce(id_acquisition, 'ø') AS acquisition,
			geom
       FROM mfu.parcelles
        WHERE 1=1 ) As lp 
      ON lg.id_unique = lp.id_unique ) As f )  As fc;
      ";

$query_result = pg_exec($dbconn,$sql) or die (pg_last_error());
while($row = pg_fetch_row($query_result))
{
  echo trim($row[0]);
}
//ferme la connexion a la BD
pg_close($dbconn);

?>
