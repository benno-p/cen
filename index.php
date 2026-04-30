<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Sites du CEN Normandie</title>
    <link rel="shortcut icon" href="img/CenNormandie.ico" />
    <!-- Bootstrap Core CSS -->
	<link href="bootstrap-5.0.0/css/bootstrap.min.css" rel="stylesheet">
	
	<!-- Leaflet -->
    <link href="js/leaflet-1.9.4/leaflet.css" rel="stylesheet" type="text/css">
	

  <!-- Highcharts -->
  <script src="js/plugins/highcharts/highcharts12.4.0.js"></script>
  <script src="js/plugins/highcharts/accessibility12.4.0.js"></script>

  <!--Datatable bs5-->
  <link href="css/plugins/datatables.bootstrap5.min.css" rel="stylesheet">
	<link href="css/plugins/datatable/Buttons-1.7.0/css/buttons.bootstrap5.min.css" rel="stylesheet" type="text/css">
  <link href="js/plugins/datatable/select1.7.0/select.dataTables.min.css" rel="stylesheet" type="text/css">

	<!-- Custom CSS  -->
	<link href="css/custom.css" rel="stylesheet" type="text/css">
</head>
<body>

  <div class="app-root w-100">
    <!-- Header sticky -->
    <div id="app-header" class="app-header sticky-top text-light">
      <div class="container-fluid d-flex justify-content-between align-items-center py-2 blurred-background">
        <div class="d-flex align-items-center gap-2">
          <span class="moonflower fs-1 px-4">CEN Normandie</span>
        </div>
        <div class="d-flex">
          <img src="img/CenNormandie.png" alt="CEN Normandie" class="brand-logo" data-bs-toggle="tooltip" data-bs-placement="bottom" title="CEN Normandie">
        </div>
      </div>
    </div>

	<!-- Contenu: Grid 60/40 -->
    <div class="app-content">
      <!-- 60%: carte -->
      
<section class="pane-map">
    <div class="container-fluid h-100 p-0">
      <div class="row h-100 g-0">
        <div class="col-12 col-lg-8">
          <div id="map" class="h-100 w-100"><!-- Leaflet map --></div>
        </div>
        <aside class="col-12 col-lg-4"  style="max-height:100%; overflow-y:auto;">
          <div class="side-card p-2 bg-light">
                <p>
                </p>
          </div>
        </aside>
      </div>
    </div>
  </section>


      <!-- 40%: table -->
      <section class="pane-table">
        <div class="container-fluid  d-flex flex-row">
          <div class="col-8 " style="height:50vh;max-height:50vh; overflow-y:auto;">
          <!--<h2 class="h6 mb-2">Table des tourbières</h2>-->
            <table id="parcelles" class="table table-sm table-secondary table-striped table-bordered" style="width:100%;">
              <thead>
                <tr>
                  <!-- <th>#</th> -->
                  <th>ID Site</th>
                  <th>Nom Site</th>
                  <th>Parcelle</th>
                  <th>Convention</th>
                  <th>Acquisition</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
          <div class="d-flex col-4">

            <div class="w-100 d-flex flex-column col-4 h-100">
              <div class="d-flex">
                <div id="graphiqueStatut" class="col-6 p-1 d-flex justify-content-center align-items-center"></div>
                <div id="graphiqueEnjeu" class="col-6 p-1 d-flex justify-content-center align-items-center"></div>
              </div>
              <div id="logos" class="d-flex justify-content-center align-items-center flex-wrap mt-auto mb-2">
                <img src="img/logos/Region.jpg" style="max-height:80px;" class="mx-4" alt="logo REGION NORMANDIE" data-bs-toggle="tooltip" data-bs-placement="top" title="Région Normandie">
                <img src="img/logos/DREAL_2025.jpg" style="max-height:80px;" class="mx-4" alt="logo DREAL" data-bs-toggle="tooltip" data-bs-placement="top" title="DREAL Normandie">
                <img src="img/logos/AESN.jpg" style="max-height:80px;" class="mx-4" alt="logo AESN" data-bs-toggle="tooltip" data-bs-placement="top" title="AESN">
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  </div>


    <!-- Footer fixe -->
    <div class="fixed-footer bg-dark text-white rounded">
        <kbd class="small">CEN Normandie © <?php echo date("Y"); ?></kbd>
    </div>




<script src="js/jquery-3.7.1.min.js" ></script>
<!-- Bootstrap Core JavaScript -->
<script src="bootstrap-5.0.0/js/bootstrap.bundle.min.js"></script>

<!-- Leaflet -->
<script src="js/leaflet-1.9.4/leaflet.js"></script>
<script src="js/init-leaflet.js" ></script>


<!--Datatable bs5-->
<script src="js/plugins/datatable/jquery.dataTables.min.js"></script>
<script src="js/plugins/datatable/dataTables.bootstrap5.min.js"></script>
<script src="js/plugins/datatable/select1.7.0/dataTables.select.min.js"></script>

<!-- Buttons -->
<script src="js/plugins/datatable/Buttons-1.7.0/js/dataTables.buttons.min.js"></script>
<script src="js/plugins/datatable/Buttons-1.7.0/js/buttons.bootstrap5.min.js"></script>
<script src="js/plugins/datatable/Buttons-1.7.0/js/buttons.html5.min.js"></script>
<script src="js/plugins/datatable/Buttons-1.7.0/js/buttons.print.min.js"></script>
<script src="js/plugins/datatable/jszip3.10.1/jszip.min.js"></script>
<script src="js/plugins/datatable/pdfmake0.2.7/pdfmake.min.js"></script>
<script src="js/plugins/datatable/pdfmake0.2.7/vfs_fonts.js"></script>


<!-- general.js -->
<script type="text/javascript" src="js/autocomplete.js" ></script>
<script type="text/javascript" src="js/general/general.js" ></script>

    
    <script>
	// 1) Mesure de la hauteur du header et mise à jour de la variable CSS
    function setHeaderHeightVar() {
      const header = document.getElementById('app-header');
      const h = header ? header.offsetHeight : 0;
      document.documentElement.style.setProperty('--header-h', h + 'px');
    }
	setHeaderHeightVar();
    window.addEventListener('resize', setHeaderHeightVar);

	// 2) Initialisation Leaflet une fois la hauteur calculée
    initmap();

	// Invalider la taille après le premier paint + après resize
    requestAnimationFrame(() => map.invalidateSize());
    window.addEventListener('resize', () => map.invalidateSize());


	const dt4 = $('#parcelles').DataTable({
		"language": {
		"paginate": {
		"previous": "Préc.",
		"next": "Suiv."
		},
		"search": "Filtrer :",
		"sLengthMenu":     "Afficher _MENU_ &eacute;l&eacute;ments",
		"sInfo":           "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
		"sInfoEmpty":      "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment",
		"sInfoFiltered":   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
		"sInfoPostFix":    "",
		"sLoadingRecords": "Chargement en cours...",
		"sZeroRecords":    "Aucun &eacute;l&eacute;ment &agrave; afficher",
		"sEmptyTable":     "Aucune donn&eacute;e disponible dans le tableau"
	},
	dom: '' + 't' + '<"d-flex align-items-center gap-2 px-2"fB<"ms-auto"p>>',
  select: {
      style: 'single', // garantit une seule ligne sélectionnée
      toggle: true
    }
 	,
    buttons: [
          { extend: 'excel', text: 'Excel', className: 'btn btn-sm btn-outline-success', init: function(api, node, config) {$(node).removeClass('btn-secondary')}}, //,className: 'btn btn-success m-2', init: function(api, node, config) {$(node).removeClass('dt-button')}
          { extend: 'pdf',   text: 'PDF',   className: 'btn btn-sm btn-outline-danger',init: function(api, node, config) {$(node).removeClass('btn-secondary')}   }
        ]
	});
	console.log("DataTable initialized");



	// 3) DataTables + Buttons
	load_parcelles();

  // Initialisation des tooltips Bootstrap
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });


    </script>
</body>
</html>
