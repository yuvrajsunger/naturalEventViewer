var url = "https://eonet.sci.gsfc.nasa.gov/api/v3/events",
    cat_url = "https://eonet.gsfc.nasa.gov/api/v3/categories",
    tornadoIcon = L.icon({
        iconUrl: 'icons/tornado.png',
        iconSize: [30, 40],
        iconAnchor: [18, 37],
        popupAnchor: [0, -30]
    }),
    forestFireIcon = L.icon({
        iconUrl: 'icons/forestFire.png',
        iconSize: [40, 40],
        iconAnchor: [18, 39],
        popupAnchor: [0, -30]
    }),
    volcanoIcon = L.icon({
        iconUrl: 'icons/volcano.png',
        iconSize: [40, 40],
        iconAnchor: [20, 39],
        popupAnchor: [0, -30]
    });


var map = L.map("map").setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


$.getJSON(url, function (data) {
    $.each(data.events, function (key1, value1) {
        var eventId = value1.categories[0].id;
        if (eventId == "severeStorms") {
            var coordList = [],
                startCoord = value1.geometry[0],
                endCoord = value1.geometry[value1.geometry.length - 1];
            L.geoJSON(startCoord, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: tornadoIcon });
                }
            })
                .bindPopup("Title: " + value1.title + "<br>" + "Date: " + startCoord.date)
                .addTo(map);
            L.geoJSON(endCoord, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: tornadoIcon });
                }
            })
                .bindPopup("Title: " + value1.title + "<br>" + "Date: " + endCoord.date)
                .addTo(map);
            $.each(value1.geometry, function (key2, value2) {
                coordList.push(value2.coordinates.reverse());
            })
            L.polyline(coordList, { weight: 3, color: 'red' }).addTo(map);
        }
        else if (eventId != "manmade" && eventId != "seaLakeIce" && eventId != "waterColor") {
            L.geoJSON(value1.geometry, {
                pointToLayer: function (feature, latlng) {
                    if (eventId == "wildfires") {
                        return L.marker(latlng, { icon: forestFireIcon });
                    }
                    else if (eventId == "volcanoes") {
                        return L.marker(latlng, { icon: volcanoIcon });
                    }
                    else {
                        return L.marker(latlng);
                    }
                }
            })
                .bindPopup("Title: " + value1.title + "<br>" + "Date: " + value1.geometry[0].date)
                .addTo(map);
        }
    })
});

$.getJSON(cat_url, function (data) {
    $.getJSON(url, function (e_data) {
        var events = e_data.events
        num = 1;
        $.each(data.categories, function (key, value) {
            var title = value.title,
                eventId = value.id,
                count = 0;
            if (eventId != "manmade" && eventId != "seaLakeIce" && eventId != "waterColor") {
                for (let i = 0; i < events.length; i++) {
                    if (eventId == events[i].categories[0].id) {
                        count = count + 1
                    }
                }
                $("#event_table").append('<tr><th scope="row">' + num + '</th><td>' + title + '</td><td>' + count + '</td></tr>');
                num = num + 1
            }
        })
    })
});