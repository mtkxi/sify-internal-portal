// Data Centers with location details
export const SIFY_DATA_CENTERS = [
  { name: 'DC Mumbai 1 - Rabale', pinCode: '400701', latitude: '19.1521', longitude: '72.9956' },
  { name: 'DC Mumbai 2 - Airoli', pinCode: '400708', latitude: '19.1568', longitude: '72.9989' },
  { name: 'DC Bangalore 1 - Whitefield', pinCode: '560066', latitude: '12.9698', longitude: '77.7499' },
  { name: 'DC Bangalore 2 - Electronic City', pinCode: '560100', latitude: '12.8456', longitude: '77.6603' },
  { name: 'DC Delhi NCR 1 - Noida', pinCode: '201301', latitude: '28.5355', longitude: '77.3910' },
  { name: 'DC Chennai 1 - Ambattur', pinCode: '600053', latitude: '13.1143', longitude: '80.1548' },
  { name: 'DC Hyderabad 1 - Gachibowli', pinCode: '500032', latitude: '17.4399', longitude: '78.3489' },
  { name: 'DC Pune 1 - Hinjewadi', pinCode: '411057', latitude: '18.5912', longitude: '73.7389' },
  { name: 'DC Kolkata 1 - Rajarhat', pinCode: '700156', latitude: '22.6145', longitude: '88.4724' }
];

export const CONNECTED_DATA_CENTERS = [
  { name: 'NetMagic DC - Mumbai', pinCode: '400059', latitude: '19.0896', longitude: '72.8656' },
  { name: 'NetMagic DC - Bangalore', pinCode: '560045', latitude: '12.9352', longitude: '77.6245' },
  { name: 'ST Telemedia DC - Chennai', pinCode: '600096', latitude: '13.0475', longitude: '80.2086' },
  { name: 'ST Telemedia DC - Hyderabad', pinCode: '500081', latitude: '17.4485', longitude: '78.3908' },
  { name: 'CtrlS DC - Mumbai', pinCode: '400063', latitude: '19.1136', longitude: '72.8697' },
  { name: 'CtrlS DC - Hyderabad', pinCode: '500084', latitude: '17.4239', longitude: '78.4738' },
  { name: 'Web Werks DC - Mumbai', pinCode: '400070', latitude: '19.1253', longitude: '72.8267' },
  { name: 'Yotta DC - Mumbai', pinCode: '400705', latitude: '19.1497', longitude: '73.0089' },
  { name: 'NTT DC - Mumbai', pinCode: '400072', latitude: '19.1176', longitude: '72.9060' },
  { name: 'NTT DC - Chennai', pinCode: '600113', latitude: '13.0569', longitude: '80.2425' }
];

export const CONNECTED_BUILDINGS = [
  { 
    city: 'Mumbai', 
    buildings: [
      { name: 'Technopolis', pinCode: '400076', latitude: '19.2183', longitude: '72.8479' },
      { name: 'Birla Centurion', pinCode: '400051', latitude: '19.0625', longitude: '72.8726' },
      { name: 'Peninsula Business Park', pinCode: '400013', latitude: '19.0176', longitude: '72.8562' },
      { name: 'Infiniti Mall', pinCode: '400064', latitude: '19.1743', longitude: '72.9472' },
      { name: 'Supreme Business Park', pinCode: '400059', latitude: '19.0896', longitude: '72.8803' }
    ] 
  },
  { 
    city: 'Bangalore', 
    buildings: [
      { name: 'Manyata Tech Park', pinCode: '560045', latitude: '13.0358', longitude: '77.6181' },
      { name: 'RMZ Ecoworld', pinCode: '560103', latitude: '12.9941', longitude: '77.6869' },
      { name: 'Prestige Tech Park', pinCode: '560087', latitude: '12.9352', longitude: '77.6223' },
      { name: 'Embassy Tech Village', pinCode: '560103', latitude: '12.9591', longitude: '77.6947' },
      { name: 'Brigade Tech Park', pinCode: '560066', latitude: '12.9698', longitude: '77.7499' }
    ] 
  },
  { 
    city: 'Delhi', 
    buildings: [
      { name: 'Unitech Infospace', pinCode: '122002', latitude: '28.4952', longitude: '77.0869' },
      { name: 'DLF Cyber City', pinCode: '122002', latitude: '28.4950', longitude: '77.0890' },
      { name: 'Airtel Centre', pinCode: '110020', latitude: '28.5562', longitude: '77.1000' },
      { name: 'Max House', pinCode: '110001', latitude: '28.6304', longitude: '77.2177' },
      { name: 'Statesman House', pinCode: '110001', latitude: '28.6289', longitude: '77.2065' }
    ] 
  },
  { 
    city: 'Chennai', 
    buildings: [
      { name: 'Tidel Park', pinCode: '600113', latitude: '13.0569', longitude: '80.2425' },
      { name: 'ELCOT IT Park', pinCode: '600096', latitude: '13.0475', longitude: '80.2086' },
      { name: 'RMZ Millenia', pinCode: '600096', latitude: '13.0359', longitude: '80.2091' },
      { name: 'DLF IT Park', pinCode: '600089', latitude: '13.0418', longitude: '80.2341' },
      { name: 'Olympia Tech Park', pinCode: '600096', latitude: '13.0525', longitude: '80.2167' }
    ] 
  },
  { 
    city: 'Hyderabad', 
    buildings: [
      { name: 'Cyber Towers', pinCode: '500081', latitude: '17.4400', longitude: '78.3489' },
      { name: 'Raheja Mind Space', pinCode: '500081', latitude: '17.4326', longitude: '78.3851' },
      { name: 'DLF Cyber City', pinCode: '500081', latitude: '17.4239', longitude: '78.3738' },
      { name: 'My Home Hub', pinCode: '500081', latitude: '17.4280', longitude: '78.3808' },
      { name: 'Divyasree Omega', pinCode: '500081', latitude: '17.4317', longitude: '78.3745' }
    ] 
  },
  { 
    city: 'Pune', 
    buildings: [
      { name: 'Cerebrum IT Park', pinCode: '411014', latitude: '18.5590', longitude: '73.9156' },
      { name: 'EON Free Zone', pinCode: '411014', latitude: '18.5598', longitude: '73.9070' },
      { name: 'Blue Ridge', pinCode: '411057', latitude: '18.5912', longitude: '73.7389' },
      { name: 'Commerzone', pinCode: '411014', latitude: '18.5619', longitude: '73.9147' },
      { name: 'ICC Trade Tower', pinCode: '411016', latitude: '18.5314', longitude: '73.9256' }
    ] 
  }
];
