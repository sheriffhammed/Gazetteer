
import {getCountry, getCurrencyCode} from './countriesInfo.js';
import { countries } from './countries.js';
import { allCountries } from './allCountries.js';

window.onload = function(){
		const successCallback = (position) => {
		console.log("The position = ",position);
		const latitude =  position.coords.latitude
		const longitude =  position.coords.longitude
		
		let cordinate = [];
		var base = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
						maxZoom: 19,
						subdomains: 'abcd',
						attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
					});
					
					var map = L.map('map', {
						layers: [base],
						tap: false, // ref https://github.com/Leaflet/Leaflet/issues/7255
						center: new L.LatLng(latitude, longitude),
						zoom: 5,
						fullscreenControl: true,
						fullscreenControlOptions: { // optional
							title:"Show me the fullscreen !",
							titleCancel:"Exit fullscreen mode"
						}
					//}).fitWorld();
					}).setView([latitude, longitude], 5);
					const countryname = getCountry();
					applyCountryBorder(map, countryname);

					//Red Marker
					var redMarker = L.ExtraMarkers.icon({
						icon: 'fa-graduation-cap',
						markerColor: 'red',
						shape: 'circle',
						prefix: 'fa'
					  });
					
					L.marker([latitude, longitude], {icon: redMarker}).addTo(map);
					//const firstMarker = L.marker([latitude, longitude]).addTo(map);
					//const secondMarker = L.marker([latitude + 3,  longitude + 0.2 ]).addTo(map);
					//const thirdMarker = L.marker([latitude + 6,  longitude + 0.4]).addTo(map);
					
					//Marker Cluster
					var markers = L.markerClusterGroup();
					
						//Cities Ajax
						$.ajax({
							url: "libs/php/cities.php",
							type: 'GET',
							dataType: 'JSON',
							data: {
								country: $('#country').val(),
								
						},
						success: function(result){
							//console.log("Cities Result",JSON.stringify(result));
							//var lat = result['data'][0].geometry.lat;
							result['data'].forEach(element => {
								cordinate.push(
									[
										element.lat, element.lng, element.name
									]
								)
							});
							//console.log("Cities", cordinate);
							
							for (var i = 0; i < cordinate.length; i++) {
								var a = cordinate[i];
								var title = a[2];
								var marker = L.marker(new L.LatLng(a[0], a[1]), {
								title: title
								});
								marker.bindPopup(title);
								markers.addLayer(marker);
							}
							
							map.addLayer(markers);
						},
						error: function(jqXHR, textStatus, errorThrown){

						}
						})

				

					//map.addLayer([latitude, longitude]);
					//map.fitBounds([latitude, longitude].getBounds());
					// detect fullscreen toggling
					map.on('enterFullscreen', function(){
						if(window.console) window.console.log('enterFullscreen');
					});
					map.on('exitFullscreen', function(){
						if(window.console) window.console.log('exitFullscreen');
					});
					
					
					//Get Latitude and Longtitude on Map on Mouse Over
					map.on('mousemove',function(e){
						document.getElementsByClassName('cordinate')[0].innerHTML = '<b>Lat:</b> ' + e.latlng.lat + ' <b>Lng:</b> ' + e.latlng.lng;
						//console.log('Lat: ' + e.latlng.lat , 'Lng: ' + e.latlng.lng);
					})

					//Logo Image
					L.Control.Watermark = L.Control.extend({
						onAdd(map) {
							const img = L.DomUtil.create('img','img1');

							img.src = './libs/images/logo.png';
							img.style.width = '100px';
							return img;
						},
						onRemove(map) {
						
						}
					});

					L.control.watermark = function (opts) {
						return new L.Control.Watermark(opts);
					};
					
					const watermarkControl = L.control.watermark({position: 'bottomleft'}).addTo(map);

					   
	};
	
	const errorCallback = (error) => {
		console.log("The error = ",error);
	};
	
	navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

//Load Countries into Country Select 
	$.ajax({
		url: "libs/php/countries.php",
		type: 'GET',
		dataType: 'json',
		success: function(result) {		
			const curLocation = getCountry()
			// console.log('All Countries', allCountries[0].name)
			// console.log("My Location ", curLocation)
			const objectData = result['data']
			// console.log(objectData.features[0].properties.name);
			// console.log(objectData.features[0].properties.iso_a2);
			var optionData = `<option>Select Country</option>`;
			// for(let i in objectData.features){
			// 	let selected = objectData.features[i].properties.name.trim() === curLocation.trim() ? "selected" : ""
				
			// 	if(selected !== ""){
					
			// 		const currencyCode = getCurrencyCode(objectData.features[i].properties.iso_a2)
			// 		console.log("My countryCode ", currencyCode)
			// 	}
			// 	//const optionValue = objectData.features[i].properties.name.replace(" " , "_");optionData += `<option ${selected} value=${optionValue}>
			// 	optionData += `<option ${selected} value=${objectData.features[i].properties.iso_a2}>
				
			// 		${objectData.features[i].properties.name}
			// 	</option>`;			
			// }
			for(let i in allCountries){
				let selected = allCountries[i].name.trim() === curLocation.trim() ? "selected" : ""
				
				if(selected !== ""){
					
					const currencyCode = getCurrencyCode(allCountries[i].code)
					//console.log("My countryCode ", currencyCode)
				}
				//const optionValue = objectData.features[i].properties.name.replace(" " , "_");optionData += `<option ${selected} value=${optionValue}>
				optionData += `<option ${selected} value=${allCountries[i].code}>
				
					${allCountries[i].name}
				</option>`;			
			}
			
			$('#country').html(optionData);
			
			//sortOptions();
			
		}
		
	});
	
}


// call this method before you initialize your map.
function initializingMap() 
{
	var container = L.DomUtil.get('map');
	if(container != null){
	container._leaflet_id = null;
	}
}

//Apply Country Map Border Function
function applyCountryBorder(map, countryname) {
	jQuery
	  .ajax({
		type: "GET",
		dataType: "json",
		url:
		  "https://nominatim.openstreetmap.org/search?country=" +
		  countryname.trim() +
		  "&polygon_geojson=1&format=json"
	  })
	  .then(function(data) {
		/*const latLngs = L.GeoJSON.coordsToLatLngs(data[0].geojson.coordinates,2) 
		L.polyline(latLngs, {
		  color: "green",
		  weight: 14,
		  opacity: 1
		}).addTo(map);*/
  
		L.geoJSON(data[0].geojson, {
		  color: "green",
		  weight: 2,
		  opacity: 1,
		  fillOpacity: 0.0 
		}).addTo(map);
	  });
  }

//Sort ALl Select Tag
function sortOptions() {
	var allOptions = $("select option");
	allOptions.sort(function (op1, op2) {
	   var text1 = $(op1).text().toLowerCase();
	   var text2 = $(op2).text().toLowerCase();
	   return (text1 < text2) ? -1 : 1;
	});
	allOptions.appendTo("select");
 }

//***************************************************/
//Sorts all Countries
/*    
$('#country').on('click',function() {
	var allOptions = $("select option");
         allOptions.sort(function (op1, op2) {
            var text1 = $(op1).text().toLowerCase();
            var text2 = $(op2).text().toLowerCase();
            return (text1 < text2) ? -1 : 1;
         });
         allOptions.appendTo("select");
});
*/
//***************************************************/
//Countries details API from opencagedata
    
$('#country').on('change',function() {
	let countryName = "";
	//var cordinate = "";
	// for(let j in countries.features){
	// 	if(countries.features[j].properties.iso_a2 == $('#country').val()) {
	// 		countryName = countries.features[j].properties.name;
	// 		//cordinate = countries.features[j].geometry.coordinates;
	// 	}
	// }

	for(let j in allCountries){
		if(allCountries[j].code == $('#country').val()) {
			countryName = allCountries[j].name;
			//cordinate = countries.features[j].geometry.coordinates;
		}		
	}



	countryName = countryName.replace(/ /g , "_");
	//console.log("Country Name on Change", countryName);
	//console.log("Cordinates for " + countryName, cordinate);
        $.ajax({
            url: "libs/php/selectCountry.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: countryName
                
            },
            success: function(result) {
    
                //console.log(JSON.stringify(result));

				//console.log(result['data'][0].geometry.lat);
				//console.log(result['data'][0].geometry.lng);
				var lat = result['data'][0].geometry.lat;
				var lng = result['data'][0].geometry.lng;
				var callingcode = result['data'][0].annotations.callingcode;
				var isoCode = result['data'][0].annotations.currency.iso_code;
				var isoNumeric = result['data'][0].annotations.currency.iso_numeric;
				var subunit = result['data'][0].annotations.currency.subunit;
				var continent = result['data'][0].components.continent;
				var country = result['data'][0].components.country;
				var countryCode = result['data'][0].components.country_code;
				var flag = result['data'][0].annotations.flag;
				//Map
				initializingMap();
				let cordinate = []
				// Initialise Map
				var map = L.map('map').setView([lat, lng], 4);
				//map.dragging.enable();
				const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
					//Draggable: true,
					
				}).addTo(map);
				
				applyCountryBorder(map, country);

				//markerClusterGroup
				var markers = L.markerClusterGroup();
  
				//Cities Ajax
				$.ajax({
					url: "libs/php/cities.php",
					type: 'GET',
					dataType: 'JSON',
					data: {
						country: $('#country').val(),
						
				},
				success: function(result){
					//console.log("Cities Result",JSON.stringify(result));
					//var lat = result['data'][0].geometry.lat;
					/*
					for(let i=0; i<=result.data.length; i++){
						cordinate.push(
							//result['data'][i].lat, result['data'][i].lng, result['data'][i].name
							//result['data'][0].lat, result['data'][0].lng, result['data'][0].name
					)
						}		
					console.log("Cities", cordinate);
					*/
					cordinate = [
						[result['data'][0].lat, result['data'][0].lng, result['data'][0].name],
						[result['data'][1].lat, result['data'][1].lng, result['data'][1].name],
						[result['data'][2].lat, result['data'][2].lng, result['data'][2].name],
						[result['data'][3].lat, result['data'][3].lng, result['data'][3].name],
						[result['data'][4].lat, result['data'][4].lng, result['data'][4].name],
						[result['data'][5].lat, result['data'][5].lng, result['data'][5].name],
						[result['data'][6].lat, result['data'][6].lng, result['data'][6].name],
						[result['data'][7].lat, result['data'][7].lng, result['data'][7].name],
						[result['data'][8].lat, result['data'][8].lng, result['data'][8].name],
						[result['data'][9].lat, result['data'][9].lng, result['data'][9].name]
						
					]
					for (var i = 0; i < cordinate.length; i++) {
						var a = cordinate[i];
						var title = a[2];
						var marker = L.marker(new L.LatLng(a[0], a[1]), {
						title: title
						});
						marker.bindPopup(title);
						markers.addLayer(marker);
					}
					
					map.addLayer(markers);
				},
				error: function(jqXHR, textStatus, errorThrown){

				}
				})


				
				//Red Marker
				var redMarker = L.ExtraMarkers.icon({
					icon: 'fa-graduation-cap',
					markerColor: 'red',
					shape: 'circle',
					prefix: 'fa'
				  });
				
				  L.marker([lat, lng], {icon: redMarker}).addTo(map);
				
				//const marker = L.marker([lat, lng]).addTo(map)
				//const firstMarker = L.marker([lat, lng]).addTo(map);
				//const secondMarker = L.marker([lat + 3,  lng + 0.2 ]).addTo(map);
				//const thirdMarker = L.marker([lat + 6,  lng + 0.4]).addTo(map);
				
				//Additional Marker using Leaflet Extra Marker
				

            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }
        }); 
    
    });

/**************Country Information Modal***********************/

$('#countryInfo').click(function() {
	let countryName = "";
	// for(let j in countries.features){
	// 	if(countries.features[j].properties.iso_a2 == $('#country').val()) {
	// 		countryName = countries.features[j].properties.name;
			
	// 	}
	// }
	for(let j in allCountries){
		if(allCountries[j].code == $('#country').val()) {
			countryName = allCountries[j].name;
			//cordinate = countries.features[j].geometry.coordinates;
		}		
	}
	countryName = countryName.replace(/ /g , "_");
	//console.log("Country Name on countryInfo", countryName);
	$.ajax({
		url: "libs/php/selectedCountry.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: countryName
			
		},
		success: function(result) {

			//console.log(JSON.stringify(result));
			//console.log($('#country').val());
			//console.log(result['data'][0].geometry.lat);
			//console.log(result['data'][0].geometry.lng);
			var lat = result['data'][0].geometry.lat;
			var lng = result['data'][0].geometry.lng;
			var callingcode = result['data'][0].annotations.callingcode;
			var isoCode = result['data'][0].annotations.currency.iso_code;
			var isoNumeric = result['data'][0].annotations.currency.iso_numeric;
			var subunit = result['data'][0].annotations.currency.subunit;
			var continent = result['data'][0].components.continent;
			var country = result['data'][0].components.country;
			var countryCode = result['data'][0].components.country_code;
			var flag = result['data'][0].annotations.flag;
			var url = result['data'][0].annotations.OSM.url;
			var currency = result['data'][0].annotations.currency.name;
			var drive_on = result['data'][0].annotations.roadinfo.drive_on;
			var speed_in = result['data'][0].annotations.roadinfo.speed_in;
			
			//var countryReplace = country.replace(" " , "_");
			//var wikipedia = `https://en.m.wikipedia.org/wiki/${countryReplace}`;
			var countryURL = `<a href=${url} target="_blank"><button type="button" class="btn btn-primary">	Country URL </button></a>`;
			//console.log(url);
			//console.log(countryReplace);
			//console.log(wikipedia);
			
			const countryInfo = `
			<table class="table table-striped">
				<thead>					
					<tr> 
						<th scope="col"></th>
						<th scope="col"></th>							
					</tr>	
				</thead>
							
				<tbody>
					<tr>
						<td><b>Country:</b></td>
						<td>${country}</td>
					</tr>	
					<tr>
						<td><b>Continent:</b></td>
						<td>${continent}</td>
					</tr>
					<tr>
						<td><b>Country Code:</b></td>
						<td>${countryCode}</td>
					</tr>	
					<tr>
						<td><b>Calling Code:</b></td>
						<td>${callingcode}</td>
					</tr>	
					<tr>
						<td><b>Currency:</b></td>
						<td>${currency}</td>
					</tr>
					<tr>
						<td><b>Iso Numeric:</b></td>
						<td>${isoNumeric}</td>
					</tr>	
					<tr>
						<td><b>Sub unit:</b></td>
						<td>${subunit}</td>
					</tr>		
					<tr>
						<td><b>Drive On:</b></td>
						<td>${drive_on}</td>
					</tr>
					<tr>
						<td><b>Speed In:</b></td>
						<td>${speed_in}</td>
					</tr>
					
					
				</tbody>
			</table>`;
			
			$('#countryInfoModal').html(`${countryInfo}`);
			
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// your error code
		}
	}); 

});

/***************Weather Detail***************************************/
$('.weatherDetail').on('click',function () {
	let countryName = "";
	// for(let j in countries.features){
	// 	if(countries.features[j].properties.iso_a2 == $('#country').val()) {
	// 		countryName = countries.features[j].properties.name;
	// 		//console.log("Country Name on Click", countryName);
	// 	}
	// }
	for(let j in allCountries){
		if(allCountries[j].code == $('#country').val()) {
			countryName = allCountries[j].name;
			//cordinate = countries.features[j].geometry.coordinates;
		}		
	}
	countryName = countryName.replace(/ /g , "_");
	//console.log("Country Name on weatherDetail", countryName);
	$.ajax({
	   url: "libs/php/updatedWeather.php",
	   type: 'POST',
	   dataType: 'json',
	   data: {
		   country: countryName
	   },
	   success: function(result) {
		   //$(".result").empty()
		   //console.log(JSON.stringify(result));
		   const new_lat = result['data'][0].geometry.lat;
		   const new_lng = result['data'][0].geometry.lng;
		   
		//    console.log("New lat var",new_lat);
		//    console.log("New long var",new_lng); 
		   
		   $.ajax({
			   url: "libs/php/openweathermap2.php",
			   type: 'GET',
			   dataType: 'json',
			   data: {
				   lat: new_lat,
				   lng: new_lng
			   },
			   success: function(result) {
			   //
				   //$(".result tableHeader").empty();
				   //console.log("All result ", result)
				   // console.log(result.data);
				   //console.log($('#lat').val());
				   //var temp = "Tempearture" + result['data'][0].main.temp;
				   //console.log(temp);
				   
	   
				   const tableHeader =`<tr>
				   <th scope="col">Date/Time</th>
					   <th scope="col">Temperature</th>
					   <th scope="col">Feels Like</th>
					   <th scope="col">Min Temperature</th>
					   <th scope="col">Max Temperature</th>
					   <th scope="col">Description</th>
					   </tr>`;		
	   
				   let tableData = '';
				   for(let key in result.data){
					   //console.log("each object "+key)
					   const date = new Date(key);
					   const new_date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full'}).format(date);
	   
					   tableData += `<tr>
					   <th colspan='6' style='background:#337ab7;color:yellow;font-size:16px;text-align:center;padding:5px'>${new_date}</th>							
					   </tr>`;	
					   for(let j in result.data[key]){
						   tableData += `<tr>							
						   <td>${result.data[key][j].dt_txt.slice(11)}</td>
						   <td>${result.data[key][j].main.temp}</td>
						   <td>${result.data[key][j].main.feels_like}</td>
						   <td>${result.data[key][j].main.temp_min}</td>
						   <td>${result.data[key][j].main.temp_max}</td>
						   <td>${result.data[key][j].weather[0].description}</td>
						   
						   </tr>`;			
					   }
					   //console.log(tableData);
				   //document.querySelector('.tableData').innerHTML = tableData;
				   
					   $('.modal-tableHeader').html(tableHeader);
					   $('.modal-tableData').html(tableData);
				   //$('#weather_forecast').modal('show');//now its working
				   }
			   
			   },
			   error: function(jqXHR, textStatus, errorThrown) {
				   // your error code
				   console.log("erreor",errorThrown)
			   }
		   });
	   },
	   async: false
   });
});


/***************Ex Rate***************************************/
$(".exRate").on('click',function(){
   $.ajax({
	   url: "libs/php/countriesRec.php",
	   type: 'GET',
	   dataType: 'json',
	   data: {
		   country: $('#country').val(),
	   },
	   success: function(result) {		
		   //const selectedLocation = getCountry()
		   const selectedLocation = $('#country').val()
		   // console.log("My currencyCode onChange ",selectedLocation )
		   // const objectData = result['data']
		   // const countryData = Object.entries(objectData.features)
		   // const filteredData = countryData.filter(([key,value]) => value.properties.name.trim() === selectedLocation.trim() )
		   // const cCode = filteredData[0][1].properties.iso_a2
		   //console.log("My filteredData Code = ", cCode)
		   const currencyCodeObj = getCurrencyCode(selectedLocation)
		   const curCode = Object.entries(currencyCodeObj)[0][1]
		   
		   $.ajax({
			   url: "libs/php/currencyDetails.php",
			   type: 'GET',
			   dataType: 'json',
			   data: {
				   currencies:curCode,
			   },
			   success: function(result) {
				   //JSON.stringify(result)
				   //console.log("currency api",result.data);
   
   
			   
				   const rateTableHeader =`<tr>
					   <th scope="col">Currency</th>
					   <th scope="col">Exchange Rate</th>
					   <th scope="col">&lt;&gt</th>	
					   <th scope="col">Dollar</th>							
					   </tr>`;		

				   let rateTableData = '';
				   for(let i in result.data){
					   rateTableData += `<tr>
					   <td>${result.data[i].code}</td>
					   <td>${result.data[i].value.toFixed(2)}</td>
					   <td>-</td>
					   <td>$1</td>			
					   </tr>`;			
				   
					   //console.log(tableData);
				   //document.querySelector('.tableData').innerHTML = tableData;
				   
				   $('.rateTableHeader').html(rateTableHeader);
				   $('.rateTableData').html(rateTableData);
				   $('#exchange_rate').modal('show');//now its working
				   }
			   
			   },
			   error: function(jqXHR, textStatus, errorThrown) {
				   // your error code
				   console.log(errorThrown);
			   }
		   }); 
	   
	   }
	   
   });

});


/***************Wikipedia***************************************/
/*
$('#wikipedia').click(function() {
	var countryName = "";
	for(let j in countries.features){
		if(countries.features[j].properties.iso_a2 == $('#country').val()) {
			countryName = countries.features[j].properties.name;
			
		}
	}
	countryName = countryName.replace(/ /g , "_");
	console.log("Country Name on wikipedia", countryName);
   $.ajax({
	   url: "libs/php/selectedCountry.php",
	   type: 'POST',
	   dataType: 'json',
	   data: {
		   country: countryName
		   
	   },
	   success: function(result) {

		   //console.log(JSON.stringify(result));
		   console.log($('#country').val());
		   //console.log(result['data'][0].geometry.lat);
		   //console.log(result['data'][0].geometry.lng);
		   var lat = result['data'][0].geometry.lat;
		   var lng = result['data'][0].geometry.lng;
		   var callingcode = result['data'][0].annotations.callingcode;
		   var isoCode = result['data'][0].annotations.currency.iso_code;
		   var isoNumeric = result['data'][0].annotations.currency.iso_numeric;
		   var subunit = result['data'][0].annotations.currency.subunit;
		   var continent = result['data'][0].components.continent;
		   var country = result['data'][0].components.country;
		   var countryCode = result['data'][0].components.country_code;
		   var flag = result['data'][0].annotations.flag;
		   var url = result['data'][0].annotations.OSM.url;
		   var countryReplace = country.replace(" " , "_");
		   //var wikipedia = `https://en.m.wikipedia.org/wiki/${countryReplace}`;
		   var wikipedia = `https://simple.m.wikipedia.org/wiki/${countryReplace}`;
		   //var countryURL = `<a href=${url} target="_blank"><button type="button" class="btn btn-primary">	Country URL </button></a>`;
		   console.log(url);
		   console.log(countryReplace);
		   console.log(wikipedia);
		   
		   const wikipediaData = `<div>
		   <object type="text/html" data="${wikipedia}" width="100%" height="600px"  style="overflow:auto">
		   </object></div>`


		   $('#wikipediaModal').html(`${wikipediaData}`);
		   //$('#countryInfo').html(`${country}`);
		   
	   },
	   error: function(jqXHR, textStatus, errorThrown) {
		   // your error code
	   }
   }); 

});
*/

/***************Full Wikipedia Modal***************************************/
$('#wikipediabutton').click(function() {
	let countryName = "";
	// for(let j in countries.features){
	// 	if(countries.features[j].properties.iso_a2 == $('#country').val()) {
	// 		countryName = countries.features[j].properties.name;
			
	// 	}
	// }
	for(let j in allCountries){
		if(allCountries[j].code == $('#country').val()) {
			countryName = allCountries[j].name;
			//cordinate = countries.features[j].geometry.coordinates;
		}		
	}
	countryName = countryName.replace(/ /g , "_");
	console.log("Country Name on Full wikipedia", countryName);
   $.ajax({
	   url: "libs/php/selectedCountry.php",
	   type: 'POST',
	   dataType: 'json',
	   data: {
		   country: countryName
		   
	   },
	   success: function(result) {

		   //console.log(JSON.stringify(result));
		   //console.log($('#country').val());
		   //console.log(result['data'][0].geometry.lat);
		   //console.log(result['data'][0].geometry.lng);
		   var lat = result['data'][0].geometry.lat;
		   var lng = result['data'][0].geometry.lng;
		   var callingcode = result['data'][0].annotations.callingcode;
		   var isoCode = result['data'][0].annotations.currency.iso_code;
		   var isoNumeric = result['data'][0].annotations.currency.iso_numeric;
		   var subunit = result['data'][0].annotations.currency.subunit;
		   var continent = result['data'][0].components.continent;
		   var country = result['data'][0].components.country;
		   var countryCode = result['data'][0].components.country_code;
		   var flag = result['data'][0].annotations.flag;
		   var url = result['data'][0].annotations.OSM.url;
		   var countryReplace = country.replace(" " , "_");
		   var wikipedia = `https://en.m.wikipedia.org/wiki/${countryReplace}`;
		   //var wikipedia = `https://simple.m.wikipedia.org/wiki/${countryReplace}`;
		   //var countryURL = `<a href=${url} target="_blank"><button type="button" class="btn btn-primary">	Country URL </button></a>`;
		//    console.log(url);
		//    console.log(countryReplace);
		//    console.log(wikipedia);
		   
		   const wikipediaData = `<div>
		   <object type="text/html" data="${wikipedia}" width="100%" height="600px"  style="overflow:auto">
		   </object></div>`


		   $('#fullWikipediaModal').html(`${wikipediaData}`);
		   //$('#countryInfo').html(`${country}`);
		   
	   },
	   error: function(jqXHR, textStatus, errorThrown) {
		   // your error code
	   }
   }); 

});

/***************Time Zone***************************************/
$('#timezone').on('click',function () {
	let countryName = "";
	// for(let j in countries.features){
	// 	if(countries.features[j].properties.iso_a2 == $('#country').val()) {
	// 		countryName = countries.features[j].properties.name;
	// 		//console.log("Country Name on Click", countryName);
	// 	}
	// }
	for(let j in allCountries){
		if(allCountries[j].code == $('#country').val()) {
			countryName = allCountries[j].name;
			//cordinate = countries.features[j].geometry.coordinates;
		}		
	}
	countryName = countryName.replace(/ /g , "_");
	//console.log("Country Name on TimeZone", countryName);
	$.ajax({
	   url: "libs/php/selectedCountry.php",
	   type: 'POST',
	   dataType: 'json',
	   data: {
		   country: countryName
	   },
	   success: function(result) {
		   //$(".result").empty()
		   //console.log(JSON.stringify(result));
		   const new_lat = result['data'][0].geometry.lat;
		   const new_lng = result['data'][0].geometry.lng;
		   
		//    console.log("New lat var",new_lat);
		//    console.log("New long var",new_lng); 
		   
		   $.ajax({
			   url: "libs/php/timezone.php",
			   type: 'GET',
			   dataType: 'json',
			   data: {
				   lat: new_lat,
				   lng: new_lng
			   },
			   success: function(result) {
			   //
				   //$(".result tableHeader").empty();
				//    console.log("All result ", result)
				//    console.log("All result Data",result.data);
				   //console.log($('#lat').val());
				   //var temp = "Tempearture" + result['data'][0].main.temp;
				   //console.log(temp);
				   var sunrise = result['data'].sunrise;
				   var sunset = result['data'].sunset;
				   var countryName = result['data'].countryName;
				   var time = result['data'].time;
				   var timezoneId = result['data'].timezoneId;
				   const timeZones = `
				   <table class="table table-striped">
					   <thead>					
						   <tr> 
							   <th scope="col"></th>
							   <th scope="col"></th>							
						   </tr>	
					   </thead>
								   
					   <tbody>
						   <tr>
							   <td><b>Sunrise:</b></td>
							   <td>${sunrise}</td>
						   </tr>	
						   <tr>
							   <td><b>Sunset:</b></td>
							   <td>${sunset}</td>
						   </tr>
						   <tr>
							   <td><b>Country Name:</b></td>
							   <td>${countryName}</td>
						   </tr>	
						   <tr>
							   <td><b>Current Time:</b></td>
							   <td>${time}</td>
						   </tr>	
						   <tr>
							   <td><b>Time Zone Id:</b></td>
							   <td>${timezoneId}</td>
						   </tr>
						   					   
						   
					   </tbody>
				   </table>`;
				   
				   $('#timeZoneModal').html(`${timeZones}`);
			   },
			   error: function(jqXHR, textStatus, errorThrown) {
				   // your error code
				   console.log("erreor",errorThrown)
			   }
		   });
	   },
	   async: false
   });
});

/***************Nearby Modal***************************************/
$('#nearby').on('click',function () {
	let countryName = "";
	// for(let j in countries.features){
	// 	if(countries.features[j].properties.iso_a2 == $('#country').val()) {
	// 		countryName = countries.features[j].properties.name;
	// 		//console.log("Country Name on Click", countryName);
	// 	}
	// }
	for(let j in allCountries){
		if(allCountries[j].code == $('#country').val()) {
			countryName = allCountries[j].name;
			//cordinate = countries.features[j].geometry.coordinates;
		}		
	}
	countryName = countryName.replace(/ /g , "_");
	//console.log("Country Name on Near By", countryName);
	$.ajax({
	   url: "libs/php/selectedCountry.php",
	   type: 'POST',
	   dataType: 'json',
	   data: {
		   country: countryName
	   },
	   success: function(result) {
		   //$(".result").empty()
		   //console.log(JSON.stringify(result));
		   const new_lat = result['data'][0].geometry.lat;
		   const new_lng = result['data'][0].geometry.lng;
		   
		//    console.log("New lat var",new_lat);
		//    console.log("New long var",new_lng); 
		   
		   $.ajax({
			   url: "libs/php/findNearby.php",
			   type: 'GET',
			   dataType: 'json',
			   data: {
				   lat: new_lat,
				   lng: new_lng
			   },
			   success: function(result) {
			   //
				   //$(".result tableHeader").empty();
				//    console.log("All result ", result)
				//    console.log("All result Data",result.data);
				   //console.log($('#lat').val());
				   //var temp = "Tempearture" + result['data'][0].main.temp;
				   //console.log(temp);
				   
				   var placedName = result['data'][0].name;
				   var fcodeName = result['data'][0].fcodeName;
				   var countryName = result['data'][0].countryName;
				   var fclName = result['data'][0].fclName;
				   var distance = result['data'][0].distance;
				   var population = result['data'][0].population;
				   var geonameId = result['data'][0].geonameId;
				   const nearBy = `
				   <table class="table table-striped">
					   <thead>					
						   <tr> 
							   <th scope="col"></th>
							   <th scope="col"></th>							
						   </tr>	
					   </thead>
								   
					   <tbody>
						   <tr>
							   <td><b>Place Name:</b></td>
							   <td>${placedName}</td>
						   </tr>	
						   <tr>
							   <td><b>Type of place:</b></td>
							   <td>${fcodeName}</td>
						   </tr>
						   <tr>
							   <td><b>Country Name:</b></td>
							   <td>${countryName}</td>
						   </tr>	
						   <tr>
							   <td><b>FCL Name:</b></td>
							   <td>${fclName}</td>
						   </tr>	
						     
						    <tr>
							   <td><b>Geoname Id:</b></td>
							   <td>${geonameId}</td>
						   </tr>

					   </tbody>
				   </table>`;
				   
				   $('#nearByModal').html(`${nearBy}`);
				   
			   },
			   error: function(jqXHR, textStatus, errorThrown) {
				   // your error code
				   console.log("erreor",errorThrown)
			   }
		   });
	   },
	   async: false
   });
});

/***************Wikipedia***************************************/

$('#wikipedia').click(function() {
	let countryName = "";
	// for(let j in countries.features){
	// 	if(countries.features[j].properties.iso_a2 == $('#country').val()) {
	// 		countryName = countries.features[j].properties.name;
			
	// 	}
	// }
	for(let j in allCountries){
		if(allCountries[j].code == $('#country').val()) {
			countryName = allCountries[j].name;
			//cordinate = countries.features[j].geometry.coordinates;
		}		
	}
	countryName = countryName.replace(/ /g , "_");
	//console.log("Country Name on wikipedia", countryName);
   $.ajax({
	   url: "libs/php/selectedCountry.php",
	   type: 'POST',
	   dataType: 'json',
	   data: {
		   country: countryName
		   
	   },
	   success: function(result) {

		   //console.log(JSON.stringify(result));
		   //console.log($('#country').val());
		   //console.log(result['data'][0].geometry.lat);
		   //console.log(result['data'][0].geometry.lng);
		   var lat = result['data'][0].geometry.lat;
		   var lng = result['data'][0].geometry.lng;
		   var callingcode = result['data'][0].annotations.callingcode;
		   var isoCode = result['data'][0].annotations.currency.iso_code;
		   var isoNumeric = result['data'][0].annotations.currency.iso_numeric;
		   var subunit = result['data'][0].annotations.currency.subunit;
		   var continent = result['data'][0].components.continent;
		   var country = result['data'][0].components.country;
		   var countryCode = result['data'][0].components.country_code;
		   var flag = result['data'][0].annotations.flag;
		   //var url = result['data'][0].annotations.OSM.url;
		   var countryReplace = country.replace(" " , "_");
		   //var wikipedia = `https://en.m.wikipedia.org/wiki/${countryReplace}`;
		   var url = `https://simple.m.wikipedia.org/wiki/${countryReplace}`;
		   //var countryURL = `<a href=${url} target="_blank"><button type="button" class="btn btn-primary">	Country URL </button></a>`;
		//    console.log(url);
		//    console.log(countryReplace);
		//    console.log(wikipedia);

		   //Wikipedia Summary
		   $.ajax({
			type: "GET",
			url: `https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=${countryReplace}&callback=?`,
			contentType: "application/json; charset=utf-8",
			async: false,
			dataType: "json",
			success: function (data, textStatus, jqXHR) {
	 
				var markup = data.parse.text["*"];
				var blurb = $('<div></div>').html(markup);
				$('#wikipediaModal').html($(blurb).find('p'));
				
			},
			error: function (errorMessage) {
			}
		});
		   

		 //  $('#wikipediaModal').html(`${wikipediaData}`);
		   
		   
	   },
	   error: function(jqXHR, textStatus, errorThrown) {
		   // your error code
	   }
   }); 

});
