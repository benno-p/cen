var map;

// Style Neutre
const contour_jaune={
    color:'#f9eb07',
    fillOpacity:0.1,
    weight:2,
    opacity:1
    };
// Style Rose
const contour_rose={
    color:'#ff09e0',
    fillOpacity:0.4,
    weight:3,
    opacity:1
    };
const contour_green={
    color:'#30842b',
    fillOpacity:0.1,
    weight:2,
    opacity:1
    };
const contour_rouge={
    color:'#ff0000',
    fillOpacity:0.1,
    weight:2,
    opacity:1
    };
// Index pour retrouver rapidement la couche par id_tourbiere
const parcelleIndex = Object.create(null);



function initmap() {
    // set up the map

    

    map = new L.Map('map');
    
    var ignAttrib = 'CEN Normandie | <a href="https://www.geoportail.gouv.fr/">Géoportail</a> - <a href="https://www.ign.fr/">IGN © </a>';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    
    //var osmUrlbg='http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
    //var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var ignOrtho='https://data.geopf.fr/wmts?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=ORTHOIMAGERY.ORTHOPHOTOS&format=image/jpeg&style=normal';

    //var osmbg=new L.TileLayer(osmUrlbg,{minZoom:4,maxZoom:22,attribution:osmAttrib,opacity: 0.6});
    //var osm=new L.TileLayer(osmUrl,{minZoom:4,maxZoom:22,attribution:osmAttrib,opacity: 0.6});
    const ignO = new L.TileLayer(ignOrtho,{minZoom:4,maxZoom:22,attribution:ignAttrib, opacity: 0.6});

    // WMTS en projection WebMercator (PM)
    const ignOrthoBW = new L.tileLayer(
    ignOrtho,
    {
      attribution: ignAttrib,
      tileSize: 256,
      className: 'tiles-bw',
      maxZoom: 19,
      opacity: 0.6
    }
    );

    map.setView(new L.LatLng(49.3,0.52),8);
    //map.addLayer(ignO);
    map.addLayer(ignOrthoBW);
    

    // 1) Contrôle personnalisé Leaflet pour l'input
    const SearchControl = L.Control.extend({
    options: { position: 'topright' }, // même coin que le contrôle des couches

    onAdd: function (map) {
        // wrapper styled comme un contrôle Leaflet
        const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar p-2');

        // contenu: input + dropdown bootstrap (si tu utilises l'autocomplete)
        container.innerHTML = `
        <div class="position-relative" style="min-width: 280px;">
            <input type="text" id="searchInput" class="form-control form-control-sm" placeholder="Recherchez un contour administratif…">
            <div id="autocompleteMenu" class="dropdown-menu w-100" aria-labelledby="searchInput"></div>
        </div>
        `;

        // Empêcher que les interactions avec l'input fassent « bouger » la carte
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        return container;
    }
    });

    // 2) Ajouter le contrôle de recherche
    const searchControl = new SearchControl();
    


    
    
    // Créer une couche geojson vide pour les Contours Admin
    admin_geojson_feature = L.geoJson(false, {
        style:contour_jaune
    }).addTo(map);
    
    
    parcelles = L.geoJson(false, {
        //style:contour_green,
        style: function(feature) {
        // Si acquisition est différent de 'ø', on retourne le style rouge, sinon vert
        if (feature.properties.acquisition !== 'ø') {
            return contour_green;
        } else {
            return contour_rouge;
        }
        },

        onEachFeature: function (feature, layer) //functionality on click on feature
            {
                
                const id = feature?.properties?.id_parcelle
                if (id != null) {
                parcelleIndex[id] = layer; // <-- indexation ici
                }
                const content = '\
                <div class="col-lg-12 leaf_title" >\
                    <div class="col-sm-12">\
                        <div class="form-group">\
                        <span>Parcelle: <span class="fw-bolder">'+feature.properties.id_parcelle+'</span></span>\
                        </div>\
                    </div>\
                    <div class="col-sm-12">\
                        <div class="form-group">\
                        <span>ID Site : <span class="fw-bolder">'+feature.properties.id_site+'</span></span>\
                        </div>\
                    </div>\
                    <div class="col-sm-12">\
                        <div class="form-group">\
                        <span>Nom Site : <span class="fw-bolder">'+feature.properties.nom_site+'</span></span>\
                        </div>\
                    </div>\
                    <div class="col-sm-12">\
                        <div class="form-group">\
                        <span>Convention : <span class="fw-bolder">'+feature.properties.convention+'</span></span>\
                        </div>\
                    </div>\
                    <div class="col-sm-12">\
                        <div class="form-group">\
                        <span>Acquisition : <span class="fw-bolder">'+feature.properties.acquisition+'</span></span>\
                        </div>\
                    </div>\
                </div>';
                
                
                layer.on("mouseover",function(e){
                    layer.setStyle(contour_rose);
                    if (id) {
                        //dt4.search(id).draw(); // Filtre la table avec l'ID
                        dt4.column(0).search(id).draw(); // Filtre la table avec l'ID uniquement sur la colonne 1
                        
                    }
                });
                layer.on("mouseout",function(e){
                    parcelles.resetStyle(e.target);
                    dt4.column(0).search('').draw(); // Réinitialise le filtre
                });
                layer.bindPopup(content, {maxWidth : 400})
                .on('popupopen', function (popup) {
                })
                .on('popupclose', function (popup) {
                });
                layer.on("click",function(e){
                });
            },
    }).addTo(map);
    
    overlaysMaps={"Sites":parcelles,"Contours Administratifs":admin_geojson_feature}; //,"Contours Administratifs":admin_geojson_feature
    baseMaps={"Ortho (IGN)":ignO,"Ortho (IGN N&B)":ignOrthoBW };//,"OSM":osm,"OSM (Noir & Blanc)":osmbg
    //baseMaps={"OSM N&B":osmbg,"OSM Watercolor":osmWatercolor};
    ControlLayer=L.control.layers(baseMaps,overlaysMaps, {position: 'bottomright'}).addTo(map); 
    // Ajoute la searchbar
    map.addControl(searchControl);
        
/*     map.on('zoomend', function() {
    var zoomlevel = map.getZoom();
        if (zoomlevel  <=14){
                map.removeLayer(tourbieres);
        }
        else {
                map.addLayer(tourbieres);
        }
    }); */

    L.control.scale().addTo(map);
};



function clear_all_layer() {
    //geojson_layer
    admin_geojson_feature.clearLayers();
    tourbieres.clearLayers();
}


function load_parcelles() {
        $.ajax({
        url      : "php/ajax/get_data.js.php",
        data     : {},
        method   : "POST",
        dataType : "json",
        async    : true,
        error    : function(request, error) { alert("Impossible d'accéder normalement à la ressource");},
        success  : function(data) {
            //dt4.clear().draw();
            x=0;
            dt4.clear().draw();
            //console.log(data);
            parcelles.clearLayers();
            // Vider la couche ET l'index
            for (const k in parcelleIndex) delete parcelleIndex[k];
            if (data.features != null) {
                $(data.features).each(function(key, value) {
                    parcelles.addData(data.features[key]);
                        x++;
                        var rowNode = dt4.row.add( [
                        //x,

/*                   <th>ID Site</th>
                  <th>Nom Site</th>
                  <th>Parcelle</th>
                  <th>Convention</th>
                  <th>Acquisition</th> */

                        data.features[key].properties.id_site,
                        data.features[key].properties.nom_site,
                        data.features[key].properties.id_parcelle,
                        data.features[key].properties.convention,
                        data.features[key].properties.acquisition,
                        data.features[key].properties.commune,
                        data.features[key].properties.section,
                        data.features[key].properties.numero_parcelle
                        ] ).draw( true ).node();

                });
                // Redessiner le DataTable après toutes les ajouts
                dt4.draw();
                // Appeler la fonction d'affichage des graphiques
                afficherGraphiquesParcelles('parcelles');
                // Forcer le redimensionnement
            }
        
            } 
        });
        activate_events ();
};


function add_layer_admin(item) {
    console.log("Ajout de la couche administrative pour:", item);
    admin_geojson_feature.clearLayers();
    admin_geojson_feature.addData(item.geom);
    map.fitBounds(admin_geojson_feature.getBounds(), { padding: [20, 20] });
}

function activate_events() {
  dt4.on('select', function (e, dt, type, indexes) {
    if (type !== 'row') return;

    const rowData = dt4.row(indexes[0]).data();
    const id = rowData[2]; // colonne 3 -> index 2
    if (!id) return;

    const layer = parcelleIndex[id];
    console.log(id);

    if (!layer) {
      console.warn(`Aucune parcelle trouvée pour id_parcelle="${id}"`);
      return;
    }

    if (layer.getBounds) {
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    } else if (layer.getLatLng) {
      map.flyTo(layer.getLatLng(), 14, { duration: 0.8 });
    }
    layer.openPopup();
  });

  // --- Désélection d'une ligne : zoomer sur toute la couche parcelles
  dt4.on('deselect.dyn', function (e, dt, type, indexes) {
    map.closePopup();
    if (type !== 'row') return;
    // Si la couche est vide, ne rien faire
    const bounds = parcelles && parcelles.getLayers().length > 0
      ? parcelles.getBounds()
      : null;

    if (bounds && bounds.isValid && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      console.warn('Pas de géométrie disponible dans la couche "parcelles" pour zoomer.');
    }
  });

}


/**
 * Affiche deux graphiques Highcharts basés sur les données d'un DataTable.
 * @param {string} tableId - L'ID du DataTable dans le DOM.
 */
function afficherGraphiquesParcelles(tableId) {
}


































