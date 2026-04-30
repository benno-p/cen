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
  FROM $parcelles As lg 
        INNER JOIN (SELECT 
          id_unique,
            SUBSTRING(SPLIT_PART(id_unique, '|', 2) FROM 1 FOR 5)||TRIM(LEADING '0' FROM (SUBSTRING(SPLIT_PART(id_unique, '|', 2) FROM 9 FOR 2)))||TRIM(LEADING '0' FROM (SUBSTRING(SPLIT_PART(id_unique, '|', 2) FROM 11 FOR 4))) as id_parcelle ,
            nom_group as nom_site ,
            id_group as id_site ,
            coalesce(id_convention, 'ø') AS convention,
            coalesce(id_acquisition, 'ø') AS acquisition,
            SUBSTRING(SPLIT_PART(id_unique, '|', 2) FROM 1 FOR 5) as commune,
            TRIM(LEADING '0' FROM (SUBSTRING(SPLIT_PART(id_unique, '|', 2) FROM 9 FOR 2))) as section,
            TRIM(LEADING '0' FROM (SUBSTRING(SPLIT_PART(id_unique, '|', 2) FROM 11 FOR 4))) as numero_parcelle,
			geom
       FROM $parcelles
        WHERE categorie_site='1' ) As lp 
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
