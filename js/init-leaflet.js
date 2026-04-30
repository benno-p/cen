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
// Index pour retrouver rapidement la couche par id_tourbiere
const tourbiereIndex = Object.create(null);



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
    
    
    tourbieres = L.geoJson(false, {
        style:contour_green,
        onEachFeature: function (feature, layer) //functionality on click on feature
            {
                
                const id = feature?.properties?.id_tourbiere;
                if (id != null) {
                tourbiereIndex[id] = layer; // <-- indexation ici
                }
                const content = '\
                <div class="col-lg-12 leaf_title" >\
                    <div class="col-sm-12">\
                        <div class="form-group">\
                        <span>Id : <span class="fw-bolder">'+feature.properties.id_tourbiere+'</span></span>\
                        </div>\
                    </div>\
                    <div class="col-sm-12">\
                        <div class="form-group">\
                        <span>Statut : <span class="fw-bolder">'+feature.properties.statut_tou+'</span></span>\
                        </div>\
                    </div>\
                    <div class="col-sm-12">\
                        <div class="form-group">\
                        <span>Date : <span class="fw-bolder">'+feature.properties.date_maj+'</span></span>\
                        </div>\
                    </div>\
                    <div class="col-sm-12">\
                        <div class="form-group">\
                        <span>Structure : <span class="fw-bolder">'+feature.properties.structure+'</span></span>\
                        </div>\
                    </div>\
                    <div class="col-sm-12">\
                        <div class="form-group">\
                        <span>Enjeu de protection : <span class="fw-bolder">'+feature.properties.enjeu_prot+'</span></span>\
                        </div>\
                    </div>\
                    <div class="col-sm-12">\
                        <div class="form-group">\
                        <span>Niveau de flore : <span class="fw-bolder">'+feature.properties.niv_flore+'</span></span>\
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
                    tourbieres.resetStyle(e.target);
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
    
    overlaysMaps={"Tourbiere":tourbieres,"Contours Administratifs":admin_geojson_feature}; //,"Contours Administratifs":admin_geojson_feature
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


function load_preloc_prat() {
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
            tourbieres.clearLayers();
            // Vider la couche ET l'index
            for (const k in tourbiereIndex) delete tourbiereIndex[k];
            if (data.features != null) {
                $(data.features).each(function(key, value) {
                    tourbieres.addData(data.features[key]);
                        x++;
                        var rowNode = dt4.row.add( [
                        //x,
                        data.features[key].properties.id_tourbiere,
                        data.features[key].properties.nom_entite,
                        data.features[key].properties.statut_tou,
                        data.features[key].properties.date_maj,
                        data.features[key].properties.structure,
                        data.features[key].properties.niv_flore,
                        data.features[key].properties.niv_pedolo,
                        data.features[key].properties.enjeu_prot
                        ] ).draw( true ).node();

                });
                // Redessiner le DataTable après toutes les ajouts
                dt4.draw();
                dt4.column(4).visible(false);
                dt4.column(7).visible(false);
                // Appeler la fonction d'affichage des graphiques
                afficherGraphiquesTourbiere('prat');
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
    const id = rowData[0]; // colonne 2 -> index 1
    if (!id) return;

    const layer = tourbiereIndex[id];
    console.log(id);

    if (!layer) {
      console.warn(`Aucune tourbière trouvée pour id_tourbiere="${id}"`);
      return;
    }

    if (layer.getBounds) {
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    } else if (layer.getLatLng) {
      map.flyTo(layer.getLatLng(), 14, { duration: 0.8 });
    }
    layer.openPopup();
  });

  // --- Désélection d'une ligne : zoomer sur toute la couche tourbieres
  dt4.on('deselect.dyn', function (e, dt, type, indexes) {
    map.closePopup();
    if (type !== 'row') return;
    // Si la couche est vide, ne rien faire
    const bounds = tourbieres && tourbieres.getLayers().length > 0
      ? tourbieres.getBounds()
      : null;

    if (bounds && bounds.isValid && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else {
      console.warn('Pas de géométrie disponible dans la couche "tourbieres" pour zoomer.');
    }
  });

}


/**
 * Affiche deux graphiques Highcharts basés sur les données d'un DataTable.
 * @param {string} tableId - L'ID du DataTable dans le DOM.
 */
function afficherGraphiquesTourbiere(tableId) {
    // Récupérer les données du DataTable
    const table = $(`#${tableId}`).DataTable();
    const data = table.rows().data();

    // Initialiser les compteurs pour chaque catégorie
    const statutTourbiere = { Potentielle: 0, Avérée: 0 };
    const enjeuProtection = {
        "Menace très forte": 0,
        "Menace faible": 0,
        "Menace potentielle": 0
    };

    // Parcourir les données et compter les occurrences
    data.each((row) => {
        // Colonne 3 : Statut de tourbière (index 2)
        const statut = row[2];
        if (statut in statutTourbiere) {
            statutTourbiere[statut]++;
        }

        // Colonne 6 : Enjeu de protection (index 5)
        const enjeu = row[7];
        if (enjeu in enjeuProtection) {
            enjeuProtection[enjeu]++;
        }
    });

    // Préparer les données pour Highcharts
    const statutData = Object.entries(statutTourbiere).map(([name, y]) => ({ name, y }));
    const enjeuData = Object.entries(enjeuProtection).map(([name, y]) => ({ name, y }));

    // Graphique 1 : Statut de tourbière
    const chartStatut =Highcharts.chart('graphiqueStatut', {
        chart: { type: 'pie', backgroundColor: '#f8f9fa' , height: '80%'   },
        title: { text: 'Statut de tourbière' },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
            size: '120px',
            center: ['50%', '50%'],
            dataLabels: { enabled: true },
            showInLegend: true
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Statut',
            data: statutData
        }]
    });

    // Graphique 2 : Enjeu de protection
    const chartEnjeu = Highcharts.chart('graphiqueEnjeu', {
        chart: { type: 'pie', backgroundColor: '#f8f9fa' , height: '80%' },
        title: { text: 'Enjeu de protection' },
        credits: { enabled: false },
        plotOptions: {
            pie: {
            size: '120px',
            dataLabels: { enabled: true },
            showInLegend: true
            }
        },
        legend: { enabled: false },
        series: [{
            name: 'Enjeu',
            data: enjeuData
        }]
    });
}


































