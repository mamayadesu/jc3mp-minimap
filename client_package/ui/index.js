            /**
			* Some super cool advanced options!!!
			*/
			let rotationActive = true;
			let transparentMode = false;

            let map = L.map('map', {
				crs: L.CRS.Simple
			}).setView([0, 0], 4);

            L.tileLayer('tiles/{z}/{y}/{x}.png', {
                attribution: '',
                maxZoom: 4,
                continuousWorld: true,
                noWrap: false
            }).addTo(map);

            // disable map controls
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();
            if (map.tap) map.tap.disable();
            document.getElementById('map').style.cursor = 'default';
            $(`.leaflet-control-container`).remove();

			function pan(lat, lng) {
				let s = 0.78111749;
				lat = (lat * s) - 128;
				lng = (lng * s) + 128;
				map.panTo([lat, lng], {
					easeLinearity: 1,
					duration: 0.1
				});
			};

			if (transparentMode) {
				$('#internalCustomStyle').remove();
				$('head').append(`<style id="internalCustomStyle" type="text/css">.leaflet-container { background: rgba(0, 0, 0, 0); } #map { border: 0px solid rgba(0, 0, 0, 0); } </style>`);
			}

            // Updates the Map
            const interval = setInterval(() => {
                jcmp.CallEvent('minimap_getLocalPlayerPos');
                jcmp.CallEvent('minimap_getLocalPlayerRot');
            }, 100);

            jcmp.AddEvent('minimap_setLocalPlayerPos', (pos) => {
                pos = JSON.parse(pos);
                pan(pos[0], pos[1]);
            });

            jcmp.AddEvent('minimap_setLocalPlayerRot', (rot) => {
                if(rotationActive) {
                    $('.arrow').css({
						'transition': '50ms ease all',
                        'transform': 'rotateZ(' + rot + 'deg)'
                    });
                }
            });

            jcmp.AddEvent('minimap_clear', (data) => {

            });

            jcmp.AddEvent('minimap_addText', (data) => {

            });

			jcmp.AddEvent('minimap_setVisible', (toggle) => {
				(toggle) ? $('#map').fadeIn('slow') : $('#map').hide();
            });

            jcmp.AddEvent('minimap_addCircle', (data) => {
                L.circle([data['x'], data['y']], {
                    radius: data['radius']
                }).addTo(map);
            });

            jcmp.AddEvent('minimap_addCustomCSS', (css) => {
                css = JSON.parse(css);
                $('head').append(`<style id="${css['identifier']}" type="text/css">${css['data']['css']}</style>`);
            });
			
			jcmp.AddEvent('minimap_changeStyle', (data) => {
                style = JSON.parse(data);
				if (data.type == 'transparent') {
					$('#internalCustomStyle').remove();
					$('head').append(`<style id="internalCustomStyle" type="text/css">.leaflet-container { background: rgba(0, 0, 0, 0); } #map { border: 0px solid rgba(0, 0, 0, 0); } </style>`);
				}
            });

            jcmp.AddEvent('minimap_removeCSS', (identifier) => {
                $(`#${identifier}`).remove();
            });

            jcmp.CallEvent('minimap_ready');
