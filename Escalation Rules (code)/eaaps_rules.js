//importing .json file of the medications rules
var json = [
  ["id", "atc", "din", "href", "colour", "device", "function", "name", "type", "chemicalType", "chemicalLABA", "chemicalICS", "chemicalOther", "doseLABA", "doseICS", "doseOther", "maxGreenLABA", "maxGreenICS", "maxYellowLABA", "maxYellowICS", "lowCeilICS", "highFloorICS", "timesPerDay", "maxPuffPerTime", "dose (IF THERE ARE TWO NUMBERS, IT IS LABA, ICS)", "maxGreen (IF THERE ARE TWO NUMBERS, IT IS LABA, ICS)", "maxYellow (IF THERE ARE TWO NUMBERS, IT IS LABA, ICS)", "trade", "chemical", "appears in questionnaire", ""],
  ["21", "R03AC13", "2230898", "m24e4c9bed24c8c20ce0b560445df2cc0", "blue", "aerolizer", "controller,reliever", "foradil", "laba", "laba", "formoterol", ".", ".", "12", ".", ".", "24", ".", "48", ".", ".", ".", "2", "2", "12", "24", "", "Foradil", "formoterol", "Y", ""],
  ["2", "R03AK06", "2240835", "m6f6c7924b86047e8195d31fc0c481569", "purple", "diskus", "controller", "advair", "combo", "laba,ICS", "salmeterol", "fluticasone", ".", "50", "100", ".", "100", "1000", "100", "2000", "250", "501", "2", "2", "50, 100", "100, 1000", "100, 2000", "Advair", "salmeterol,fluticasone", "Y", ""],
  ["3", "R03AK06", "2240836", "m6f6926c583efcb408860cece832a0b60", "purple", "diskus", "controller", "advair", "combo", "laba,ICS", "salmeterol", "fluticasone", ".", "50", "250", ".", "100", "1000", "100", "2000", "250", "501", "2", "2", "50, 250", "100, 1000", "100, 2000", "Advair", "salmeterol,fluticasone", "Y", ""],
  ["4", "R03AK06", "2240837", "m5bf832d962e9dcc240d58248f73d072c", "purple", "diskus", "controller", "advair", "combo", "laba,ICS", "salmeterol", "fluticasone", ".", "50", "500", ".", "100", "1000", "100", "2000", "250", "501", "2", "2", "50, 500", "100, 1000", "100, 2000", "Advair", "salmeterol,fluticasone", "Y", ""],
  ["14", "R03BA05", "2237244", "mc8f4c370cdcf6ea32d16372bf9c796ea", "orange", "diskus", "controller", "flovent", "ICS", "ICS", ".", "fluticasone", ".", ".", "50", ".", ".", "1000", ".", "2000", "250", "501", "2", "4", "50", "1000", "2000", "Flovent", "fluticasone", "Y", ""],
  ["15", "R03BA05", "2237245", "m1e0d909522ad2ef65b4a1c2e075be4e2", "orange", "diskus", "controller", "flovent", "ICS", "ICS", ".", "fluticasone", ".", ".", "100", ".", ".", "1000", ".", "2000", "250", "501", "2", "4", "100", "1000", "2000", "Flovent", "fluticasone", "Y", ""],
  ["16", "R03BA05", "2237246", "mf0ac6ded81063593df47ed1edd7944dc", "orange", "diskus", "controller", "flovent", "ICS", "ICS", ".", "fluticasone", ".", ".", "250", ".", ".", "1000", ".", "2000", "250", "501", "2", "4", "250", "1000", "2000", "Flovent", "fluticasone", "Y", ""],
  ["17", "R03BA05", "2237247", "m1ca346ec02b843937794cb6540a8a2cf", "orange", "diskus", "controller", "flovent", "ICS", "ICS", ".", "fluticasone", ".", ".", "500", ".", ".", "1000", ".", "2000", "250", "501", "2", "4", "500", "1000", "2000", "Flovent", "fluticasone", "Y", ""],
  ["29", "R03AC12", "2231129", "m38ac235671a9ea9e6c73301884b9442e", "green", "diskus", "controller", "serevent", "laba", "laba", "salmeterol", ".", ".", "50", ".", ".", "100", ".", "100", ".", ".", ".", "2", "2", "50", "100", "100", "Serevent", "salmeterol", "Y", ""],
  ["35", "R03AC02", "2243115", "m4f45c44811e6aaae86d34e08fe3009e0", "blue", "diskus", "reliever", "ventolin", "other", "saba", ".", ".", "salbutamol", ".", ".", "200", ".", ".", ".", ".", ".", ".", ".", ".", "200", "", "", "Ventolin", "salbutamol", "Y", "doesn't ask \"how often do you use it\" questions"],
  ["31", "R03BB04", "2246793", "mec04316a7d6e3d29df8d00898e930c61", "grey", "handihaler", "controller", "spiriva", "other", "laac", ".", ".", "tiotropium", ".", ".", "18", ".", ".", ".", ".", ".", ".", "1", "1", "18", "", "", "Spiriva", "tiotropium", "Y", ""],
  ["7", "R03BA08", "2285606", "m2181c8cef3a08ba9fa0439527cd95300", "orange", "inhaler1", "controller", "alvesco", "ICS", "ICS", ".", "ciclesonide", ".", ".", "100", ".", ".", "400", ".", "1600", "200", "401", "1 OR 2", "4", "100", "400", "800", "Alvesco", "ciclesonide", "Y", ""],
  ["8", "R03BA08", "2285614", "m4c1d5585eaa4f8dcca2928eb666a94da", "orange", "inhaler1", "controller", "alvesco", "ICS", "ICS", ".", "ciclesonide", ".", ".", "200", ".", ".", "400", ".", "1600", "200", "401", "1 OR 2", "4", "200", "400", "800", "Alvesco", "ciclesonide", "Y", ""],
  ["27", "R03BA01", "2242029", "m93ef0025632ef5c9121f6282628a01f0", "beige", "inhaler1", "controller", "qvar", "ICS", "ICS", ".", "beclomethasone", ".", ".", "50", ".", ".", "800", ".", "800", "250", "501", "2", "4", "50", "800", "800", "Qvar", "beclomethasone", "Y", ""],
  ["28", "R03BA01", "2242030", "mf28a39c849147078c9f04865275b57fc", "red", "inhaler1", "controller", "qvar", "ICS", "ICS", ".", "beclomethasone", ".", ".", "100", ".", ".", "800", ".", "800", "250", "501", "2", "4", "100", "800", "800", "Qvar", "beclomethasone", "Y", ""],
  ["5", "R03AK06", "2245126", "mb6a527acc03190a3ad21fe50d6447087", "purple", "inhaler2", "controller", "advair", "combo", "laba,ICS", "salmeterol", "fluticasone", ".", "25", "125", ".", "100", "1000", "100", "2000", "250", "501", "2", "4", "25, 125", "100, 1000", "100, 2000", "Advair", "salmeterol,fluticasone", "Y", ""],
  ["6", "R03AK06", "2245127", "md5f0607e0e733d17bea21884a64c2507", "purple", "inhaler2", "controller", "advair", "combo", "laba,ICS", "salmeterol", "fluticasone", ".", "25", "250", ".", "100", "1000", "100", "2000", "250", "501", "2", "4", "25, 250", "100, 1000", "100, 2000", "Advair", "salmeterol,fluticasone", "Y", ""],
  ["9", "R03AC02", "2245669", "m4dfafc2a5f47c1bddb2296e6802d9599", "blue", "inhaler2", "reliever", "aposalvent", "other", "saba", ".", ".", "salbutamol", ".", ".", "100", ".", ".", ".", ".", ".", ".", ".", ".", "100", "", "", "Apo-Salvent", "salbutamol", "Y", "doesn't ask \"how often do you use it\" questions"],
  ["12", "R03BB01", "2247686", "mdf6ca77e3e772786db90f389cc54bb68", "green", "inhaler2", "reliever", "atrovent", "other", "saac", ".", ".", "ipratropium", ".", ".", "20", ".", ".", ".", ".", ".", ".", ".", ".", "20", "", "", "Atrovent", "ipratropium", "N", ""],
  ["18", "R03BA05", "2244291", "m72c420e1f98a5e87c561346026e5a96f", "orange", "inhaler2", "controller", "flovent", "ICS", "ICS", ".", "fluticasone", ".", ".", "50", ".", ".", "1000", ".", "2000", "250", "501", "2", "4", "50", "1000", "2000", "Flovent", "fluticasone", "Y", ""],
  ["19", "R03BA05", "2244292", "m619f0e70c5906d6f094efd34c768eb77", "orange", "inhaler2", "controller", "flovent", "ICS", "ICS", ".", "fluticasone", ".", ".", "125", ".", ".", "1000", ".", "2000", "250", "501", "2", "4", "125", "1000", "2000", "Flovent", "fluticasone", "y", ""],
  ["20", "R03BA05", "2244293", "m72533f4b33fb7a9fd0603ba7043e768e", "orange", "inhaler2", "controller", "flovent", "ICS", "ICS", ".", "fluticasone", ".", ".", "250", ".", ".", "1000", ".", "2000", "250", "501", "2", "4", "250", "1000", "2000", "Flovent", "fluticasone", "y", ""],
  ["34", "R03AC02", "2241497", "md0c1859ab641f957fd3aa575d1c77d52", "blue", "inhaler2", "reliever", "ventolin", "other", "saba", ".", ".", "salbutamol", ".", ".", "100", ".", ".", ".", ".", ".", ".", ".", ".", "100", "", "", "Ventolin", "salbutamol", "Y", "doesn't ask \"how often do you use it\" questions"],
  ["36", "R03AK07", "2361744", "m25c0eb13b501f8bd03f54c282f5b9310", "blue", "inhaler2", "controller", "zenhale", "combo", "laba,ICS", "formoterol", "mometasone", ".", "5", "50", ".", "20", "800", "40", "800", "399", "801", "2", "4", "5, 50", "20, 800", "20, 800", "Zenhale", "formoterol, mometasone", "N", ""],
  ["37", "R03AK07", "2361752", "m376399671ee65bf7fa64b3ecc1c892e4", "blue", "inhaler2", "controller", "zenhale", "combo", "laba,ICS", "formoterol", "mometasone", ".", "5", "100", ".", "20", "800", "40", "800", "399", "801", "2", "4", "5, 100", "20, 800", "20, 800", "Zenhale", "formoterol, mometasone", "Y", ""],
  ["38", "R03AK07", "2361760", "mf7b4edb50c2b715d9999bda2d89af597", "blue", "inhaler2", "controller", "zenhale", "combo", "laba,ICS", "formoterol", "mometasone", ".", "5", "200", ".", "20", "800", "40", "800", "399", "801", "2", "4", "5, 200", "20, 800", "20, 800", "Zenhale", "formoterol, mometasone", "Y", ""],
  ["1", "R03DC01", "2236606", "m86d31129dd70512f35357b077b5440a1", "white", "pills", "controller", "accolate", "other", "ltra", ".", ".", "zafirlukast", ".", ".", "20000", ".", ".", ".", ".", ".", ".", "1", ".", "20000", "", "", "Accolate", "zafirlukast", "Y", "doesn't ask \"how often do you use it\" questions"],
  ["30", "R03DC03", "2238217", "m90bb8c4bea59fb7dd9521d8cd5845c41", "beige", "pills", "controller", "singulair", "other", "ltra", ".", ".", "montelukast", ".", ".", "1000", ".", ".", ".", ".", ".", ".", "1", ".", "10000", "", "", "Singulair", "montelukast", "Y", "doesn't ask \"how often do you use it\" questions"],
  ["13", "R03AC03", "786616", "medab40bb2707595cbd68a2585c66d0b2", "blue", "turbuhaler", "reliever", "bricanyl", "other", "saba", ".", ".", "terbutaline", "", ".", "500", ".", ".", ".", ".", ".", ".", ".", ".", "500", "", "", "Bricanyl", "terbutaline", "Y", ""],
  ["22", "R03AC13", "2237224", "m2e016253478755504ad75995027ae2d4", "blue", "turbuhaler", "controller,reliever", "oxeze", "laba", "laba", "formoterol", ".", ".", "12", ".", ".", "24", ".", "48", ".", ".", ".", "2", "2", "12", "24", "", "Oxeze", "formoterol", "Y", ""],
  ["23", "R03AC13", "2237225", "m9001de01608df7290b9c4f13621bafcf", "blue", "turbuhaler", "controller,reliever", "oxeze", "laba", "laba", "formoterol", ".", ".", "6", ".", ".", "24", ".", "48", ".", ".", ".", "2", "4", "6", "24", "", "Oxeze", "formoterol", "Y", ""],
  ["24", "R03BA02", "851752", "mc90dafcdf3c7b8c995f03bbdf822f9a3", "brown", "turbuhaler", "controller", "pulmicort", "ICS", "ICS", ".", "budesonide", ".", ".", "200", ".", ".", "800", ".", "2400", "400", "801", "2", "4", "200", "800", "2400", "Pulmicort", "budesonide", "Y", ""],
  ["25", "R03BA02", "851760", "m7f9cc69e93525ac59041cb0049abfc12", "brown", "turbuhaler", "controller", "pulmicort", "ICS", "ICS", ".", "budesonide", ".", ".", "400", ".", ".", "800", ".", "2400", "400", "801", "2", "4", "400", "800", "2400", "Pulmicort", "budesonide", "Y", ""],
  ["26", "R03BA02", "852074", "m951906d3d15200f4d057ebb6a8a56e04", "brown", "turbuhaler", "controller", "pulmicort", "ICS", "ICS", ".", "budesonide", ".", ".", "100", ".", ".", "800", ".", "2400", "400", "801", "2", "4", "100", "800", "2400", "Pulmicort", "budesonide", "Y", ""],
  ["32", "R03AK07", "2245385", "me1b27b1efa3342f2e29c49ddd1e34d31", "red", "turbuhaler", "controller,reliever", "symbicort", "combo", "laba,ICS", "formoterol", "budesonide", ".", "6", "100", ".", "24", "800", "48", "2400", "400", "801", "2", "4", "6, 100", "24, 800", "48, 2400", "Symbicort", "formoterol, budesonide", "Y", ""],
  ["33", "R03AK07", "2245386", "m2326e00d3b6b382cf8b556e5fdf6ae29", "red", "turbuhaler", "controller,reliever", "symbicort", "combo", "laba,ICS", "formoterol", "budesonide", ".", "6", "200", ".", "24", "800", "48", "2400", "400", "801", "2", "4", "6, 200", "24, 800", "48, 2400", "Symbicort", "formoterol, budesonide", "Y", ""],
  ["10", "R03BA07", "2243595", "mcb897f3461a9850d8a1d6e4f059ea4c2", "pink", "twisthaler", "controller", "asmanex", "ICS", "ICS", ".", "mometasone", ".", ".", "200", ".", ".", "800", ".", "800", "399", "801", "1 OR 2", "4", "200", "800", "800", "Asmanex", "mometasone", "Y", ""],
  ["11", "R03BA07", "2243596", "me8cd8c870d0ea88706be758acbdefaaf", "pink", "twisthaler", "controller", "asmanex", "ICS", "ICS", ".", "mometasone", ".", ".", "400", ".", ".", "800", ".", "800", "399", "801", "1 OR 2", "2", "400", "800", "800", "Asmanex", "mometasone", "Y", ""]
]

//...spread operator
//var combine = _.zip(...json);


const header = _.filter(json, (item, index) => {
  return index === 0
});
const data = _.filter(json, (item, index) => {
  return index !== 0
});

//patient's list of medications
const patientMedications = [{
  id: "10",
  function: "controller",
  name: "asmanex",
  type: "ICS",
  chemicalType: "laba,ICS",
  chemicalLABA: "salmeterol",
  device: "diskus",
  doseICS: "500",
  lowCeilICS: "250",
  highFloorICS: "501",
  timesPerDay: "2",
  maxPuffPerTime: "2"
},
  {
    id: "11",
    function: "controller",
    name: "asmanex",
    type: "ICS",
    chemicalType: "ICS",
    chemicalLABA: "salmeterol",
    device: "diskus",
    doseICS: "50",
    lowCeilICS: "250",
    highFloorICS: "501",
    timesPerDay: "2",
    maxPuffPerTime: "2"
  },
  {
    id: "13",
    function: "controller",
    name: "asmanex",
    type: "laac",
    chemicalType: "ICS",
    chemicalLABA: "salmeterol",
    device: "diskus",
    doseICS: "100000",
    lowCeilICS: "250",
    highFloorICS: "501",
    timesPerDay: "2",
    maxPuffPerTime: "2"
  },
  {
    id: "14",
    function: "controller",
    name: "asmanex",
    type: "other",
    chemicalType: "laac",
    chemicalLABA: "salmeterol",
    device: "diskus",
    doseICS: "25",
    timesPerDay: "2",
    maxPuffPerTime: "2"
  },
  {
    id: "16",
    function: "controller",
    name: "asmanex",
    type: "combo",
    chemicalType: "ltra",
    chemicalLABA: "salmeterol",
    device: "diskus",
    doseICS: "3000",
    timesPerDay: "2",
    maxPuffPerTime: "2",
    name: "symbicort",
    maxGreenICS: "1000"
  },
  {
    id: "18",
    function: "controller,reliever",
    name: "asmanex",
    type: "ltra",
    chemicalType: "laba",
    chemicalLABA: "salmeterol",
    device: "diskus",
    doseICS: "3000",
    timesPerDay: "2",
    maxPuffPerTime: "2",
    name: "symbicort",
    maxGreenICS: "1000"
  }
];

//takes the data array and uses map to get a list of {[id:1, color: blue ...etc]}
//maps a data value to 
const masterMedications = _.chain(data)
//map data to header element
  .map((dataVal) => {
    return _.chain(header)
    //gets first element of array
      .head()
      .filter((headerVal) => {
        return headerVal !== ""
      })
      //	(headerVal) => !headerVal

      //acc array to iterate over
      //headVal the function that is called per iteration
      //index is the initual value
      //=> sets the header element to the corresponding index in the data array. It is put into array and returned
      .reduce((acc, headerVal, index) => {
        acc[headerVal] = dataVal[index];
        return acc;
      }, {})
      //_.chain is a wrapper instance. .value() unwraps the result of the sequences made
      .value();
  })
  .value();

//Rule 1
const rule1 = (patientMedications) => {
  return _.chain(patientMedications)
    .filter((patientMedication) => {
      return patientMedication.chemicalType === "laac";
    })
    .value();

  // return _.chain(patientMedications)
  // 	.map("chemicalType")
  // 	.filter( (chemicalType) => {
  // 	 	return chemicalType === "laac";
  // 	})
  // 	.value();

}

/*const test = _.chain(masterMedications)
 .filter((medicationElement) => {
 if (_.some(["chemicalType", "laba,ICS"])) {
 //console.log(medicationElement.chemicalType === "saac");
 return medicationElement.chemicalType === "saac";
 }
 return medicationElement.chemicalType === "saba"
 }).value();*/
//console.log(test);
//console.log(_.some(masterMedications,{chemicalType:"laba,ICS"}));
// _.filter(medicationElement, {
// 	chemicalType: 'laba,ICS',
// 	chemicalLABA: patientMedication.chemicalLABA
// })

// _.filter (medicationElement, ( medication ) => {
// 	return medication.chemicalType === 'laba,ICS' && medicationElement.chemicalLABA === patientMedication.chemicalLABA;
// })

const getLowestICSDose = (newMedications) => {
  return _.chain(newMedications)
    .map((newMedicationMaxPuffPerTime) => {
      if (newMedicationMaxPuffPerTime.maxPuffPerTime) {
        newMedicationMaxPuffPerTime.maxPuffPerTime =
          newMedicationMaxPuffPerTime.maxPuffPerTime
          / newMedicationMaxPuffPerTime.maxPuffPerTime;
      }
      return newMedicationMaxPuffPerTime;
    })
    .value();
}

const addToRecommendations = (elements) => {
  return _.chain(elements)
    .reduce((recommend, addElement) => {
      recommend.push(addElement);
      return recommend;
    }, [])
    .value();
}

// Rule 2
const rule2 = (patientMedications, masterMedications) => {
  let result = [];
  return _.chain(patientMedications)
  // return to whatever is true to the param inside
    .filter(
      _.partial((medicationElement, patientMedication) => {
        // 1
        if (patientMedication.chemicalType !== "ICS") {
          console.log(patientMedication);

          if ((patientMedication.chemicalType === "laba") && (_.some(medicationElement, {chemicalType: "laba,ICS"}) )) {
            console.log("medication element laba,ICS");

            if (!_.isEmpty(
                _.filter(medicationElement, {
                  chemicalType: "laba,ICS",
                  chemicalLABA: patientMedication.chemicalLABA
                }))) {
              console.log("chemicalLABA");

              if (!_.isEmpty(
                  _.filter(medicationElement, {
                    chemicalType: "laba,ICS", chemicalLABA: patientMedication.chemicalLABA,
                    device: patientMedication.device
                  }))) {

                let newMedications = _.filter(medicationElement, {
                  chemicalType: "laba,ICS",
                  chemicalLABA: patientMedication.chemicalLABA,
                  device: patientMedication.device
                });

                const lowestICSDose = getLowestICSDose(newMedications);
                result.push(addToRecommendations(lowestICSDose));
              }
              else {
                console.log("device: recommend new medication at lowest ICS dose in any device available");
                let newMedications = _.filter(medicationElement, {
                  chemicalType: "laba,ICS",
                  chemicalLABA: patientMedication.chemicalLABA
                });

                const lowestICSDose = getLowestICSDose(newMedications);
                result.push(addToRecommendations(lowestICSDose));
              }
            }
            else {
              console.log("chemicalLABA is not the same");

              const newMedications = _.chain(medicationElement)
                .reduce((recommend, medication) => {
                  if (medication.chemicalLABA === "salmeterol" && medication.chemicalICS === "fluticasone" && medication.device === "diskus") {
                    recommend.push(medication);
                  }
                  if (medication.chemicalLABA === "salmeterol" && medication.chemicalICS === "fluticasone" && medication.device === "inhaler2") {
                    recommend.push(medication);
                  }
                  if (medication.chemicalLABA === "formoterol" && medication.chemicalICS === "budesonide") {
                    recommend.push(medication);
                  }
                  if (medication.chemicalLABA === "formoterol" && medication.chemicalICS === "budesonide") {
                    recommend.push(medication);
                  }
                  return recommend;
                }, [])
                .value();

              result.push(addToRecommendations(newMedications));
            }
          }
          else {
            console.log("No chemicalType Laba in OrgMeds");
            const newMedications =
              ["Flovent 125 ug 1 PUFF bid",
                "Discus Flovent 100 ug 1 PUFF puff bid",
                "Pulmicort 200 ug 1 PUFF bid",
                "Asmanex 200 ug I PUFF od",
                "Alvesco 200 ug I PUFF od, OR QVAR 100 I PUFF ug bid"
              ];

            result.push(addToRecommendations(newMedications));
          }
        }

        //2
        if (patientMedication.chemicalType === "ltra") {
          console.log("ltra");
          result.push(patientMedication);
        }
      }, masterMedications))
    .concat(result)
    .value();
}
//console.log( rule2( patientMedications, masterMedications ) );

///////////////////////////////////////////////////////////// HELPER FUNCTIONS ////////////////////////////////////////////////////////

const stringToInteger = (medications) => {
  const changeToInteger = ['id', 'din', 'doseLABA', 'doseICS', 'doseOther', 'maxGreenLABA', 'maxGreenICS', 'maxYellowICS', 'lowCeilICS', 'highFloorICS', 'maxPuffPerTime'];

  for (i = 0; i < _.size(changeToInteger); i++) {
    for (j = 0; j < _.size(medications); i++) {
      medications[j][changeToInteger[i]] = _.toInteger(medications[j][changeToInteger[i]]);
    }
  }
  return medications;
}
console.log(stringToInteger([masterMedications[0], masterMedications[1]]));

const calculateICSDose = (medication) => { // Will I have to check if there is a value in the column or can I assume that
  // 	the medication that will be checked will have values?
  // Does this mean calculateICSDose will be essentially the same as calulating the
  // 	lowestICSDose?
  return medication.doseICS * medication.timesPerDay;
}

const getHighestDose = (medication) => {
  return medication.doseICS * medication.timesPerDay * medication.maxPuffPerTime;
}

const categorizeICSDose = (medication) => {
  let doseLevel = '';
  console.log("medication: ", medication);
  //for( i = 0; i < _.size(medications); i++) {
  console.log(medication);
  console.log(calculateICSDose(medication));
  console.log(medication.highFloorICS);
  if (calculateICSDose(medication) >= medication.highFloorICS) {
    console.log("high");
    doseLevel = "high";
  }
  else if (calculateICSDose(medication) <= medication.lowCeilICS) {
    console.log("low");
    doseLevel = "low";
  }
  else if ((calculateICSDose(medication) > medication.lowCeilICS) &&
    (calculateICSDose(medication) < medication.highFloorICS)) {
    console.log("medium");
    doseLevel = "medium";
  }
  else if (calculateICSDose(medication) > medication.maxGreenICS) {
    console.log("excessive");
    doseLevel = "excessive";
  }
  //}
  return doseLevel;
}
//console.log( categorizeICSDose( patientMedications ) );

const adjustICSDose = (medication, level) => {
  if (level === "lowestMedium") {
    const max = medication.maxPuffPerTime;
    let lowMediumICSDose = false;
    let counter = 1;
    let testAdjustment;
    while (lowMediumICSDose === false && (counter < lowMediumICSDose)) {
      testAdjustment = medication.doseICS * medication.timesPerDay * counter;
      if ((testAdjustment > medication.lowCeilICS) && (testAdjustment < medication.highFloorICS)) {
        medication.maxPuffPerTime = counter; // Should the maxPuffPerTIme be adjusted so the doctor can use it to calculate?
                                             // Am I allowed to change the maxPuffPerTime? or will I need to create another
                                             // 	column for puffPerTime?
        lowMediumICSDose = true;
      }
      counter++;
    }
  }
}

const match = (recommendedMedications, dataCol) => {
  return [];
}

const minimize = (recommendedMedications, dataCol) => {
  return _.maxBy(recommendedMedications, dataCol);
}
// console.log( minimize( patientMedications, 'doseICS' ) );
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Rule on page 9 (Rule 4)
/*const rule4 = ( patientMedications, masterMedications) => {
 let result = [];
 return _.chain( patientMedications )
 .filter(
 _.partial( ( medicationElement, patientMedication ) => {
 if( patientMedication.chemicalType === "ICS" &&
 patientMedication.name !== "symbicort" &&
 (calculateICSDose( patientMedication ) === "medium" || calculateICSDose( patientMedication ) === "high") &&
 _.some( patientMedications, { chemicalType: "laba" } ) ) {
 if( patientMedication.chemicalType === "laba,ICS" ) {
 result.push( patientMedication );
 result.push( _.filter( medicationElement, { name: "singulair" } ) );
 }
 else if( patientMedication.chemicalType === "laba" && _.some( patientMedications, { chemicalType: "ICS" } ) ) {

 }
 }
 }, masterMedications)
 )
 .value();
 }*/
// Rule of pg 4
/*if (patientMedication.chemicalType === "ICS" && medicationElement.chemicalType === "laba,ICS") {
 if( medicationElement.chemicalICS === patientMedication.chemicalICS ) {
 if( calculateICSDose() === calculateICSDose() ) { // check if the ICS DOSE(puffperTimes x timesPerDay x dosePerStuff) of Org and New
 function()
 }
 }
 }*/

//Rule 6
/*
 * If there exists an original medication that DOES NOT have “name” is “symbicort” AND
 * has the following: “chemicalType” is “LABA, ICS”; OR “chemicalType” is “LABA” AND “chemicalType” is “ICS”  AND
 * there also exists an original medication “chemicalType” is “LTRA” AND
 * ICS DOSE (puffPerTimes x timesPerDay x dosePerPuff) >=  max ICS (column maxGreenICS),
 * Recommend consulting a respirologist
 */

// NEED TO CLARIFY: AND has the following: “chemicalType” is “LABA, ICS”; OR “chemicalType” is “LABA” AND “chemicalType” is “ICS”
const rule6 = (patientMedications) => {
  let result = [];
  let recommend = "";
  return _.chain(patientMedications)
    .filter((patientMedication) => {
      if (patientMedication.name !== "symbicort" &&

        (patientMedication.chemicalType === "laba,ICS" ||
        patientMedication.chemicalType === "ICS" ||
        patientMedication.chemicalType === "laba" ) &&

        _.some(patientMedications, {chemicalType: "ltra"}) &&
        calculateICSDose(_.find(patientMedications, {chemicalType: "ltra"})) >=
        _.find(patientMedications, {chemicalType: "ltra"}).maxGreenICS) {

        console.log("consult a respirologist");
        result.push("consult a respirologist");
      }
    })
    .concat(result)
    .value();
}
// console.log( rule6( patientMedications ) );

// Rule 7
/*
 * If there exists an original medication with the “name” is “Symbicort” and this medication is listed in both “controllers” and “relievers”;
 * AND ICS DOSE (puffPerTimes x timesPerDay x dosePerPuff) is low,
 * recommend this original medication at the lowest possible medium ICS dose (puffPerTimes x timesPerDay x dosePerPuff) in a SMART approach
 * - attempt to match the orgMed[doseICS]
 * - if not possible to match the orgMed[doseICS], minimize the new medication required  [puffsPerTime]
 */
const rule7 = (patientMedications) => {
  let result = [];
  for (i = 0; i < _.size(patientMedications); i++) {
    if (patientMedications[i].name === "symbicort" &&
      patientMedications[i].function === "controller,reliever" &&
      categorizeICSDose(patientMedications[i]) === "low") {
      result.push(adjustICSDose(patientMedications[i], "lowestMedium"));
    }
  }
  // attempt to match the orgMed[doseICS] -> QUESTION: wouldn't the doseICS be the same? would this then go directly to
  // "if not possible to match the orgMed[doseICS], minimize the new medicaiton required [puffsPerTime]"
  if (match(result, "doseICS") === []) {
    return minimize(result, "dose,ICS");
  }
  return match(result, "doseICS");
}

// Rule 8
/*
 * If there exists an original medication with the “name” is “Symbicort” and this medication is listed in both “controllers” and “relievers”;
 * AND ICS DOSE (puffPerTimes x timesPerDay x dosePerPuff) is medium or high,
 * recommend addition of a new medication “name” is “singulair”
 */
const rule8 = (patientMedications, masterMedications) => {
  let result = [];
  return _.chain(patientMedications)
    .filter(
      _.partial((medicationElements, patientMedication) => {
        if (patientMedication.name === "symbicort" &&
          patientMedication.function === "controller,reliever" &&
          categorizeICSDose(patientMedication) === "medium" || categorizeICSDose(patientMedication) === "high") {
          console.log("recommend addition of new Medication name === singulair");
          result.push(patientMedication);
          result.push(_.filter(medicationElements, {name: "singulair"}));
        }
      }, masterMedications)
    )


    // _.chain( patientMedications)
    // .filter( (patientMedication) => {
    // 	if( patientMedication.name === "symbicort" &&
    // 			patientMedication.function === "controller,reliever" &&
    // 			categorizeICSDose( patientMedication ) === "medium" || categorizeICSDose( patientMedication ) === "high") {
    // 		return true;
    // 	}
    // 	return false;
    // })
    // .concat( _.chain( masterMedications).filter( { name: "singulair" }))
    // .value()

    .concat(result)
    .flatten()
    .value();
}
//console.log( rule8( patientMedications, masterMedications ) );

// Rule 9
/*
 * If there exists an original medication with the “name” is “Symbicort” and this medication is listed in both “controllers” and “relievers”;
 * AND ICS DOSE (puffPerTimes x timesPerDay x doseICS) is < “maxGreenICS”
 * AND there also exists an original medication “chemicalType” is “LTRA.”
 * RECOMMEND this original medication at the highest ICS dose “maxGreenICS”
 * AND RECOMMEND original “LTRA”
 * - attempt to match the orgMed[doseICS]
 * - if not possible to match the orgMed[doseICS], minimize the new medication required [puffsPerTime]
 */
/*const rule9 = ( patientMedications ) => {
 let result = [];
 for( i = 0; i < _.size( patientMedications ); i++ ){
 if( patientMedication[i].name === "symbicort" && patientMedication[i].controller === "controller,reliever" &&
 ( calculateICSDose( patientMedication[i] ) < patientMedication[i].maxGreenICS ) &&
 _.some( patientMedications, { chemicalType: "ltra" } ) ){
 result.push( _.filter( patientMedications, { chemicalType: "ltra" } ) );
 result.push( patientMedications[i] );
 }
 }
 // attempt to match -> SAME QUESTION AS RULE 7
 return result;
 }*/

// Rule 10
const rule10 = (patientMedications, masterMedications) => {
  return _.chain(patientMedications)
    .filter(
      _.partial((medicationElements, patientMedication) => {
        if (patientMedication.name === "symbicort" &&
          patientMedication.function === "controller,reliever" &&
          ( calculateICSDose(patientMedication) >= patientMedication.maxGreenICS )) {
          if (_.find(patientMedications, {chemicalType: "ltra"})) {
            console.log("consult a respirologist");
          }
        }
      }, masterMedications)
    )
    .value();
}
//console.log( rule10( patientMedications, masterMedications ) );

const getLabaICSAndICS = (patientMedications) => {
  let result = [];
  let labaICS = false;
  let ICS = false;
  return _.chain(patientMedications)
    .filter(
      _.partial((medicationElements, patientMedication) => {
        if (patientMedication.chemicalType === "ICS") {
          console.log("ICS");
          ICS = true;
          console.log(ICS);
          result.push(patientMedication);
        }
        else if (patientMedication.chemicalType === "laba,ICS") {
          console.log("laba,ICS");
          labaICS = true;
          result.push(patientMedication);
        }
      }, masterMedications))
    .concat(result)
    .flatten()
    .value();
}

// Rule 11
const rule11 = (patientMedications, masterMedications) => {
  let newMedication = [];
  let filteredPatientMedications = getLabaICSAndICS(patientMedications);
  if (_.find(filteredPatientMedications, {chemicalType: "ICS"}) && _.find(filteredPatientMedications, {chemicalType: "laba,ICS"})) {
    newMedication = _.filter(masterMedications, {name: "singulair"});
  }
  else {
    filteredPatientMedications = [];
  }
  return _.concat(newMedication, filteredPatientMedications)
}
//console.log( rule11( patientMedications, masterMedications ) );
debugger

