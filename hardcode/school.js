// schoolData.js
const nameOfSchool = "hutech";
const birthDay = "1995-26-04T17:00:00.000Z";
const gender = "male";
const phone = "02854452222";
const owner = "HMCUuser";
const HMCUpost = "HMCUpost";
const HMCUacc = "HMCUacc";
////////////////
// const latitude = 10.8016185;
// const longitude = 106.7141636;
const HMCUlocation = "HMCUlocation";
////////////////
const message = "We are proud of you";
const schoolData = {
	data: [
		{
			_id: HMCUpost,
			owner: {
				_id: owner,
				firstName: nameOfSchool,
				lastName: " campus AB",
				birthDay: birthDay,
				gender: gender,
				avatar: "school/hutech-logo.jpg",
				phone: phone,
				friends: [],
				idAcc: HMCUacc,
				createdAt: birthDay,
				updatedAt: "2023-12-14T04:27:57.364Z",
				__v: 0,
			},
			message: message,
			location: {
				latitude: 10.8016175,
				longitude: 106.7141581,
				_id: HMCUlocation,
			},
			createdAt: birthDay,
			updatedAt: birthDay,
			__v: 0,
		}, //cs AB
		{
			_id: HMCUpost,
			owner: {
				_id: owner,
				firstName: nameOfSchool,
				lastName: " campus U",
				birthDay: birthDay,
				gender: gender,
				avatar: "school/hutech-logo.jpg",
				phone: phone,
				friends: [],
				idAcc: HMCUacc,
				createdAt: birthDay,
				updatedAt: "2023-12-14T04:27:57.364Z",
				__v: 0,
			},
			message: message,
			location: {
				latitude: 10.8094942,
				longitude: 106.7150298,
				_id: HMCUlocation,
			},
			createdAt: birthDay,
			updatedAt: birthDay,
			__v: 0,
		}, //cs U
		{
			_id: HMCUpost,
			owner: {
				_id: owner,
				firstName: nameOfSchool,
				lastName: " campus U",
				birthDay: birthDay,
				gender: gender,
				avatar: "school/hutech-logo.jpg",
				phone: phone,
				friends: [],
				idAcc: HMCUacc,
				createdAt: birthDay,
				updatedAt: "2023-12-14T04:27:57.364Z",
				__v: 0,
			},
			message: message,
			location: {
				latitude: 10.8550427,
				longitude: 106.7758458,
				_id: HMCUlocation,
			},
			createdAt: birthDay,
			updatedAt: birthDay,
			__v: 0,
		}, //cs E
		{
			_id: HMCUpost,
			owner: {
				_id: owner,
				firstName: nameOfSchool,
				lastName: " campus U",
				birthDay: birthDay,
				gender: gender,
				avatar: "school/hutech-logo.jpg",
				phone: phone,
				friends: [],
				idAcc: HMCUacc,
				createdAt: birthDay,
				updatedAt: "2023-12-14T04:27:57.364Z",
				__v: 0,
			},
			message: message,
			location: {
				latitude: 10.8293127,
				longitude: 106.8063621,
				_id: HMCUlocation,
			},
			createdAt: birthDay,
			updatedAt: birthDay,
			__v: 0,
		}, //cs R
	],
};

module.exports = schoolData;
