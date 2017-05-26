/* const object = { a: 'b', b: 'c', c: 'd'};
 const o=_.chain(object)
 	.keys()
 	.map(
 		(function (_object, key) {
 			return _object[key].toUpperCase()
 		}).bind(null, object)).value();
const a = ["a","b","c","d","e"];
const b = _.size(a);*/

//1) get size of header 
//	 set header=data 
//	 for every element in DATA that corresponds to the element in HEADER:
//	 take that position in the DATA array and add the size to the index in DATA to set each data/header relationship throughout the rest of  the array
//does not work because this would set all elements would be under one key

/*const headerFlatten = _.flatten(header);
const size = _.size(headerFlatten);*/


//2) if the index of DATA mod SIZE of header is 0 
/*const test2 = _.chain(data)
	.flatten()
	.reduce(function(_data, acc, index, _size,){
		if (index % _size === 0){
			for(i=0; i<_size; i++){
				const newData = {
					{newData[header[0][i]]: _data[i]}
				}
				acc.push(newData);
			}//end for
		}//end if
		return acc;
		}
		.bind(null, size),{})
	.value();
	*/

const rule2 = ( patientMedications, masterMedications ) => {
	//let findLaba = [];
	return  _.chain(patientMedications)
			//return to whatever is true to the param inside
			.filter( 				
				_.partial( (medicationElement, patientMedication) => {
					//1
					if(patientMedication.chemicalType !== "ICS"){
						//console.log(patientMedication);
						//use .map to change the patientMedications
						if( (patientMedication.chemicalType === "laba") && (_.some(medicationElement,{chemicalType:"laba,ICS"}))){
							console.log("medication element laba,ICS");
							console.log(patientMedication);
							//console.log(medicationElement);
							console.log(_.filter(_.filter(medicationElement,{chemicalType:"laba,ICS"}), {chemicalLABA: patientMedication.chemicalLABA}));
							
							console.log(_.filter(_.filter(_.filter(medicationElement,{chemicalType:"laba,ICS"}), {chemicalLABA: patientMedication.chemicalLABA})
							, {device: patientMedication.device}));
							
							//use filter function _.filter function
							if( _.filter(_.filter(medicationElement,{chemicalType:"laba,ICS"}), {chemicalLABA: patientMedication.chemicalLABA})){
								//_.filter( (medicationElement.chemicalType === "laba,ICS").chemicalLABA === patientMedication.chemicalLABA)){
								console.log("chemicalLABA");
								if(_.filter(
											_.filter(
													_.filter(medicationElement,{chemicalType:"laba,ICS"})
											, {chemicalLABA: patientMedication.chemicalLABA})
									, {device: patientMedication.device})){
									console.log("device: recommend new medication at lowest ICS dose");
									//console.log(_.find(masterMedications,{chemicalType:"laba,ICS"}).device);
									//console.log(patientMedication.device);
									//console.log(patientMedication);
									let newMedication = _.filter(
											_.filter(
													_.filter(medicationElement,{chemicalType:"laba,ICS"})
											, {chemicalLABA: patientMedication.chemicalLABA})
										, {device: patientMedication.device});
									
									console.log(patientMedication);
									let createNewMedication = _.map( patientMedication,(recommendNewMedication) => {  
																		console.log(recommendNewMedication);
																		return _.chain(newMedication)
																					.mapValues( (lowestICSDose) => { 
																						console.log(lowestICSDose)
																						if(lowestICSDose.timesPerDay){
																							if(_.size(lowestICSDose.timesPerDay) > 1){
																								return lowestICSDose.timesPerDay = "3";
																							}
																						}
																							/*if(_.size(lowestICSDose.timesPerDay) > 1){
																								lowestICSDose.timesPerDay = _.get(lowestICSDose.timesPerDay[0]);
																								console.log(lowestICSDose.timesPerDay);
																								lowestICSDose.maxPuffPerTime = 
																								_.get(
																									_.toString(
																										_.toInteger(lowestICSDose.maxPuffPerTime[0]) 
																										/ _.toInteger(lowestICSDose.maxPuffPerTime[0])));
																								console.log(lowestICSDose.maxPuffPerTime);
																								return lowestICSDose.timesPerDay;
																							}*/
																						})
																						.value();
																					})
																					
									console.log(createNewMedication);
									return patientMedication.chemicalType === "laba";
								}
								else {
									console.log("device: recommend new medication at lowest ICS dose in any device available");
									return patientMedication.chemicalType === "laba";
									//return _.map(_.filter(/*filter out doseICD, timesPerDat, maxPuffPerTime for any device*/));
								}
							}
							else {
								//only need one of each type??
								console.log("chemicalLABA is not the same");
								return [
									_.find(medicationElement, {chemicalLABA:"salmeterol", chemicalICS:"fluticasone", device:"diskus"}),
									_.find(medicationElement, {chemicalLABA:"salmeterol", chemicalICS:"fluticasone", device:"inhaler2"}),
									_.find(medicationElement, {chemicalLABA:"formoterol", chemicalICS:"budesonide"}),
									_.find(medicationElement, {chemicalLABA:"formoterol", chemicalICS:"mometasone"})
								];
							}	
						}
						else {
							//how to get these new recommended medications
							//return ["Recommend any of the following new medication: Flovent 125 ug 1 PUFF bid;..."];
							return patientMedication.chemicalType === "laac";
						}
					}
					
					//2: is it if they are all ICS is when it goes to number 2 or will both conditions always be executed
					if(_.some(patientMedication,{chemicalType: "ltra"})) {
						return patientMedication.chemicalType === "ltra";
					}
				}
			, masterMedications))
			.value();
}
console.log(rule2(patientMedications, masterMedications));

