require('dotenv').config()
const axios = require('axios');
const mongoose = require('mongoose');
var cron = require('node-cron');

var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const client = require('twilio')(accountSid, authToken);

mongoose.connect('mongodb://localhost:27017/kiawatch');

const Vehicle = mongoose.model('Vehicle', {
     vin: String,
     year: Number,
     model: String,
     name: String,
     msrp: Number,
     dealerPrice: Number,
     exteriorColor: String,
     interiorColor: String,
     range: Number,
     dealerCode: String
    });

let nearMatchUrl = "https://www.kia.com/us/services/en/inventory/near-match";
let requestData = {
    "filterSet": {
        "seriesName": "Sportage Hybrid",
        "series": "S",
        "year": "2023",
        "zipCode": "63132",
        "zipLocation": {
            "longitude": -90.374,
            "latitude": 38.6749
        },
        "criteriaGroups": [
            {
                "groupName": "Trims",
                "alwaysOpenAccordion": true,
                "componentType": "checkbox|trims",
                "groupCriteria": [
                    {
                        "name": "Trims",
                        "elements": [
                            {
                                "value": "LX",
                                "active": false,
                                "selected": false,
                                "name": "LX",
                                "msrp": "29135"
                            },
                            {
                                "value": "EX",
                                "active": false,
                                "selected": false,
                                "name": "EX",
                                "msrp": "32335"
                            },
                            {
                                "value": "SX Prestige",
                                "active": false,
                                "selected": true,
                                "name": "SX Prestige",
                                "msrp": "37485"
                            }
                        ]
                    }
                ]
            },
            {
                "groupName": "Colors",
                "alwaysOpenAccordion": true,
                "componentType": "colors",
                "groupCriteria": [
                    {
                        "name": "Exterior",
                        "alwaysOpenAccordian": true,
                        "componentType": "colors",
                        "elements": [
                            {
                                "value": "Fusion Black",
                                "active": false,
                                "selected": false,
                                "name": "Fusion Black",
                                "baseHex": "3d404a",
                                "useSwatch": false
                            },
                            {
                                "value": "Vesta Blue",
                                "active": false,
                                "selected": false,
                                "name": "Vesta Blue",
                                "baseHex": "02588c",
                                "useSwatch": false
                            },
                            {
                                "value": "Gravity Gray",
                                "active": false,
                                "selected": true,
                                "name": "Gravity Gray",
                                "baseHex": "4f5257",
                                "useSwatch": false
                            },
                            {
                                "value": "Dawning Red",
                                "active": false,
                                "selected": false,
                                "name": "Dawning Red",
                                "baseHex": "b83437",
                                "useSwatch": false
                            },
                            {
                                "value": "Shadow Matte Gray",
                                "active": false,
                                "selected": false,
                                "name": "Shadow Matte Gray",
                                "baseHex": "797b7c",
                                "useSwatch": false
                            },
                            {
                                "value": "Steel Gray",
                                "active": false,
                                "selected": false,
                                "name": "Steel Gray",
                                "baseHex": "979a9c",
                                "useSwatch": false
                            },
                            {
                                "value": "Snow White Pearl",
                                "active": false,
                                "selected": false,
                                "name": "Snow White Pearl",
                                "baseHex": "ffffff",
                                "useSwatch": false
                            }
                        ]
                    },
                    {
                        "name": "Interior",
                        "alwaysOpenAccordian": true,
                        "componentType": "colors",
                        "elements": [
                            {
                                "value": "Perforated And Quilted Saturn Black SynTex Seating Materials",
                                "active": false,
                                "selected": false,
                                "name": "Perforated And Quilted Saturn Black SynTex Seating Materials",
                                "useSwatch": true,
                                "swatchImage": "/us/content/dam/kia/us/en/vehicles/sportage-hybrid/2023/swatches/swatch_sportage-hev_2023_sx_prestige_hev_awd_saturn_black_quilted_syntex.jpg"
                            },
                            {
                                "value": "Perforated Saturn Black SynTex Seating Materials",
                                "active": false,
                                "selected": false,
                                "name": "Perforated Saturn Black SynTex Seating Materials",
                                "useSwatch": true,
                                "swatchImage": "/us/content/dam/kia/us/en/vehicles/sportage-hybrid/2023/swatches/swatch_sportage-hev_2023_ex_hev_awd_prem_roof_pkg_saturn_black_syntex.jpg"
                            },
                            {
                                "value": "Perforated Triton Navy And Misty Gray SynTex Seating Materials",
                                "active": false,
                                "selected": false,
                                "name": "Perforated Triton Navy And Misty Gray SynTex Seating Materials",
                                "useSwatch": true,
                                "swatchImage": "/us/content/dam/kia/us/en/vehicles/sportage-hybrid/2023/swatches/swatch_sportage-hev_2023_ex_hev_awd_triton_navy_misty_gray_snytex.jpg"
                            },
                            {
                                "value": "Saturn Black Woven Cloth SynTex Seating Materials",
                                "active": false,
                                "selected": false,
                                "name": "Saturn Black Woven Cloth SynTex Seating Materials",
                                "useSwatch": true,
                                "swatchImage": "/us/content/dam/kia/us/en/vehicles/sportage-hybrid/2023/swatches/swatch_sportage-hev_2023_lx_hev_saturn_black_woven_cloth.jpg"
                            }
                        ]
                    }
                ]
            },
            {
                "groupName": "Packages",
                "alwaysOpenAccordion": false,
                "componentType": "checkbox|packages",
                "groupCriteria": [
                    {
                        "name": "Packages",
                        "elements": [
                            {
                                "value": "PRS",
                                "active": false,
                                "selected": false,
                                "name": "EX Premium Package"
                            },
                            {
                                "value": "RLS",
                                "active": false,
                                "selected": false,
                                "name": "Carmine Red Interior Color Package"
                            }
                        ]
                    }
                ]
            },
            {
                "groupName": "Engine",
                "alwaysOpenAccordion": false,
                "componentType": "checkbox|engine",
                "groupCriteria": [
                    {
                        "name": "Engine",
                        "elements": [
                            {
                                "value": "1.6L Turbo, I-4",
                                "active": false,
                                "selected": false,
                                "name": "1.6L Turbo, I-4"
                            }
                        ]
                    }
                ]
            },
            {
                "groupName": "Transmission",
                "alwaysOpenAccordion": false,
                "componentType": "checkbox|transmission'",
                "groupCriteria": [
                    {
                        "name": "Transmission",
                        "elements": [
                            {
                                "value": "Auto",
                                "active": false,
                                "selected": false,
                                "name": "Auto"
                            }
                        ]
                    }
                ]
            },
            {
                "groupName": "Drivetrain",
                "alwaysOpenAccordion": false,
                "componentType": "checkbox|drivetrain",
                "groupCriteria": [
                    {
                        "name": "Drivetrain",
                        "elements": []
                    }
                ]
            }
        ],
        "page": 1,
        "pageSize": 210,
        "sortOrder": "DISTANCE_ASC",
        "dealers": [
            {
                "name": "Lou Fusz KIA",
                "code": "MO003",
                "url": "http://WWW.KIA.FUSZ.COM",
                "chat_enabled": true,
                "inventory": 0,
                "selected": false,
                "active": false,
                "distance": "1.7019712635177129",
                "location": {
                    "street1": "1025 N. Lindbergh Bvld. ",
                    "street2": null,
                    "city": "St. Louis",
                    "zipCode": "63132",
                    "state": "MO",
                    "longitude": "-90.405450000000002",
                    "latitude": "38.675759999999997"
                },
                "features": [
                    "14",
                    "7",
                    "8"
                ],
                "phones": [
                    {
                        "number": "3145954900",
                        "type": "business"
                    },
                    {
                        "number": "3145954902",
                        "type": "fax"
                    }
                ],
                "inTransitInventoryCount": null,
                "inventoryCount": null
            },
            {
                "name": "Hw KIA of West County",
                "code": "MO031",
                "url": "http://WWW.HWKIA.COM",
                "chat_enabled": true,
                "inventory": 0,
                "selected": false,
                "active": false,
                "distance": "8.6330383204810452",
                "location": {
                    "street1": "14116 Manchester Road ",
                    "street2": null,
                    "city": "Ballwin",
                    "zipCode": "63011",
                    "state": "MO",
                    "longitude": "-90.495130000000003",
                    "latitude": "38.593470000000003"
                },
                "features": [
                    "14",
                    "7"
                ],
                "phones": [
                    {
                        "number": "6365912900",
                        "type": "business"
                    },
                    {
                        "number": "6365912913",
                        "type": "fax"
                    }
                ],
                "inTransitInventoryCount": null,
                "inventoryCount": null
            },
            {
                "name": "Steve Schmitt KIA",
                "code": "MO034",
                "url": "http://WWW.STEVESCHMITTKIA.COM",
                "chat_enabled": true,
                "inventory": 0,
                "selected": false,
                "active": false,
                "distance": "8.8405251445090123",
                "location": {
                    "street1": "11655 New Halls Ferry Road ",
                    "street2": null,
                    "city": "Florissant",
                    "zipCode": "63033",
                    "state": "MO",
                    "longitude": "-90.276610000000005",
                    "latitude": "38.777850000000001"
                },
                "features": [
                    "14",
                    "7"
                ],
                "phones": [
                    {
                        "number": "3148310200",
                        "type": "business"
                    },
                    {
                        "number": "3149728890",
                        "type": "fax"
                    }
                ],
                "inTransitInventoryCount": null,
                "inventoryCount": null
            },
            {
                "name": "Suntrup KIA",
                "code": "MO017",
                "url": "HTTP://WWW.SUNTRUPKIASOUTH.COM",
                "chat_enabled": true,
                "inventory": 0,
                "selected": false,
                "active": false,
                "distance": "11.078529985668739",
                "location": {
                    "street1": "6263 S. Lindbergh Blvd. ",
                    "street2": null,
                    "city": "St. Louis",
                    "zipCode": "63123",
                    "state": "MO",
                    "longitude": "-90.344239999999999",
                    "latitude": "38.516030000000001"
                },
                "features": [
                    "14",
                    "7",
                    "8"
                ],
                "phones": [
                    {
                        "number": "3148942311",
                        "type": "business"
                    },
                    {
                        "number": "3148921764",
                        "type": "fax"
                    }
                ],
                "inTransitInventoryCount": null,
                "inventoryCount": null
            },
            {
                "name": "Jim Butler KIA",
                "code": "MO022",
                "url": "http://WWW.JIMBUTLERKIA.COM",
                "chat_enabled": true,
                "inventory": 0,
                "selected": false,
                "active": false,
                "distance": "13.308877653064636",
                "location": {
                    "street1": "722 Long Road Crossing ",
                    "street2": null,
                    "city": "Chesterfield",
                    "zipCode": "63005",
                    "state": "MO",
                    "longitude": "-90.620019999999997",
                    "latitude": "38.670990000000003"
                },
                "features": [
                    "14",
                    "8"
                ],
                "phones": [
                    {
                        "number": "6362569600",
                        "type": "business"
                    },
                    {
                        "number": "6367282546",
                        "type": "fax"
                    }
                ],
                "inTransitInventoryCount": null,
                "inventoryCount": null
            },
            {
                "name": "Napleton's Mid Rivers KIA",
                "code": "MO027",
                "url": "http://WWW.MIDRIVERSKIA.COM",
                "chat_enabled": true,
                "inventory": 0,
                "selected": false,
                "active": false,
                "distance": "14.422438832508389",
                "location": {
                    "street1": "4955 Veterns Memorial Pwky ",
                    "street2": null,
                    "city": "St. Peters",
                    "zipCode": "63376",
                    "state": "MO",
                    "longitude": "-90.590670000000003",
                    "latitude": "38.796959999999999"
                },
                "features": [
                    "14",
                    "7",
                    "8"
                ],
                "phones": [
                    {
                        "number": "6369262110",
                        "type": "business"
                    },
                    {
                        "number": "6362384345",
                        "type": "fax"
                    }
                ],
                "inTransitInventoryCount": null,
                "inventoryCount": null
            },
            {
                "name": "Federico KIA",
                "code": "IL079",
                "url": "http://WWW.FEDERICOKIA.COM",
                "chat_enabled": true,
                "inventory": 0,
                "selected": false,
                "active": false,
                "distance": "20.913943369269731",
                "location": {
                    "street1": "1911 East Edwardsville Road ",
                    "street2": null,
                    "city": "Wood River",
                    "zipCode": "62095",
                    "state": "IL",
                    "longitude": "-90.063896099999994",
                    "latitude": "38.856402600000003"
                },
                "features": [
                    "14",
                    "7"
                ],
                "phones": [
                    {
                        "number": "6182168080",
                        "type": "business"
                    },
                    {
                        "number": "6182540899",
                        "type": "fax"
                    }
                ],
                "inTransitInventoryCount": null,
                "inventoryCount": null
            },
            {
                "name": "Auffenberg KIA",
                "code": "IL014",
                "url": "http://WWW.AUFFENBERGKIA.COM",
                "chat_enabled": true,
                "inventory": 0,
                "selected": false,
                "active": false,
                "distance": "25.019939628901184",
                "location": {
                    "street1": "1155 Berg Blvd. ",
                    "street2": null,
                    "city": "Shiloh",
                    "zipCode": "62221",
                    "state": "IL",
                    "longitude": "-89.95102",
                    "latitude": "38.528799999999997"
                },
                "features": [
                    "14",
                    "7",
                    "8"
                ],
                "phones": [
                    {
                        "number": "6186242277",
                        "type": "business"
                    },
                    {
                        "number": "6186287320",
                        "type": "fax"
                    }
                ],
                "inTransitInventoryCount": null,
                "inventoryCount": null
            },
            {
                "name": "Green KIA",
                "code": "IL047",
                "url": "HTTP://WWW.GREENKIA.COM",
                "chat_enabled": true,
                "inventory": 0,
                "selected": false,
                "active": false,
                "distance": "82.35254047274455",
                "location": {
                    "street1": "3861 W. Wabash ",
                    "street2": null,
                    "city": "Springfield",
                    "zipCode": "62711",
                    "state": "IL",
                    "longitude": "-89.727080000000001",
                    "latitude": "39.757159999999999"
                },
                "features": [
                    "14",
                    "7",
                    "8"
                ],
                "phones": [
                    {
                        "number": "2175221222",
                        "type": "business"
                    },
                    {
                        "number": "2175231803",
                        "type": "fax"
                    }
                ],
                "inTransitInventoryCount": null,
                "inventoryCount": null
            },
            {
                "name": "Kingdom KIA",
                "code": "MO020",
                "url": "http://WWW.KINGDOMKIA.COM",
                "chat_enabled": true,
                "inventory": 0,
                "selected": false,
                "active": false,
                "distance": "89.625930289212548",
                "location": {
                    "street1": "2600 North Bishop Avenue ",
                    "street2": null,
                    "city": "Rolla",
                    "zipCode": "65401",
                    "state": "MO",
                    "longitude": "-91.759720000000002",
                    "latitude": "37.970529999999997"
                },
                "features": [
                    "14"
                ],
                "phones": [
                    {
                        "number": "5734263100",
                        "type": "business"
                    },
                    {
                        "number": "5734265371",
                        "type": "fax"
                    }
                ],
                "inTransitInventoryCount": null,
                "inventoryCount": null
            },
            {
                "name": "Larry Stovesand KIA",
                "code": "IL082",
                "url": "http://WWW.LARRYSTOVESANDKIA.COM",
                "chat_enabled": true,
                "inventory": 0,
                "selected": false,
                "active": false,
                "distance": "92.536034048527654",
                "location": {
                    "street1": "528 San Diego Road ",
                    "street2": null,
                    "city": "Carbondale",
                    "zipCode": "62901",
                    "state": "IL",
                    "longitude": "-89.146519999999995",
                    "latitude": "37.746830000000003"
                },
                "features": [
                    "14",
                    "7"
                ],
                "phones": [
                    {
                        "number": "6183194690",
                        "type": "business"
                    },
                    {
                        "number": "6183517957",
                        "type": "fax"
                    }
                ],
                "inTransitInventoryCount": null,
                "inventoryCount": null
            }
        ],
        "currentRange": 100,
        "selectedRange": 100,
        "priceData": {
            "selectedMinPrice": null,
            "selectedMaxPrice": null,
            "minDealerPrice": 29135,
            "maxDealerPrice": 50000
        },
        "isInitialRequest": false,
        "status": [
            "DS",
            "IT"
        ]
    }
};

var config = {
    method: 'post',
    url: 'https://www.kia.com/us/services/en/inventory/near-match',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : JSON.stringify(requestData)
  };
  
function checkInventory() {
  axios(config)
  .then(async function (response) {
    let vehicles = response.data.vehicles;
    for (var i = 0; i < vehicles.length; i++) {

        // Find the vehicle in the database
        let originalVehicle = await Vehicle.findOne({ vin: vehicles[i].vin });
        if (!originalVehicle) {

            let dealer = getDealerById(vehicles[i].dealerCode);

            const vehicle = new Vehicle({
                vin: vehicles[i].vin,
                year: vehicles[i].year.year,
                model: vehicles[i].model.model,
                name: vehicles[i].trim.name,
                msrp: vehicles[i].msrp,
                dealerPrice: vehicles[i].dealerPrice,
                exteriorColor: vehicles[i].exteriorColor.name,
                interiorColor: vehicles[i].interiorColor.name,
                range: vehicles[i].range,
                dealerCode: vehicles[i].dealerCode
            });
            vehicle.save().then(() => console.log('Vehicle added'));
            sendMessage(vehicle, dealer);
        } else {
            console.log('Vehicle already exists');
        }
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}
  
getDealerById = (dealerCode) => {
    let dealers = requestData.filterSet.dealers;
    for (var i = 0; i < dealers.length; i++) {
      if (dealers[i].code === dealerCode) {
        return dealers[i];
      }
    }
};

sendMessage = (vehicle, dealer) => {
    let message = 'New vehicle match found: ' + vehicle.year + ' ' + vehicle.model + ' ' + vehicle.name + ' - ' + vehicle.exteriorColor + '/' + vehicle.interiorColor + ' - Dealer is ' + vehicle.range + ' miles away from work.  Dealer Name: ' + dealer.name + ' - ' + dealer.location.street1 + ' ' + dealer.location.city + ', ' + dealer.location.state + ' ' + dealer.location.zipCode + ' - ' + dealer.phones[0].number;

    client.messages
    .create({body: message, from: process.env.FROM_PHONE_NUMBER, to: process.env.TO_PHONE_NUMBER})
    .then(message => console.log(message.sid))
    .catch(err => console.log(err));
}

cron.schedule('*/1 * * * *', () => {
    checkInventory();
});