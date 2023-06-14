async function execute(email, password, code, shots) {
	const now = new Date();
	const expirationDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

	document.cookie = `email=${email}; password=${password}; expires=${expirationDate.toUTCString()}; path=/`;
	const URL = 'https://api.quantum-inspire.com/';
	document.cookie = `email=${email};expires=${expirationDate.toUTCString()};path=/`;
	
	const call = async (url, data) => {
	  const response = await fetch(URL + url, {
		headers: {
			Authorization: `Basic ${btoa(`${email}:${password}`)}`,
			...(data === undefined ? undefined : {
				"Content-Type": "application/json"
			}),
		},
		...(data === undefined ? undefined : {
			body: JSON.stringify(data)
		}),
		method: data === undefined ? "GET" : "POST"
	  });
	  if (response.status==401) throw new Error("Wrong email or password!");
	  if (!response.ok) throw new Error();
	  return await (response.json());
	}
	
	const projectCreationResponse = await call("PaardenProject/", {
		name: "generatedProject",
		backend_type: "https://api.quantum-inspire.com/backendtypes/1/",
		default_number_of_shots: shots
	});
	
	const projectUrl = projectCreationResponse.url;
	console.log(`A project was created at: ${projectUrl}`);
	const assetCreationResponse = await call("assets/", {
		name: "generatedAsset",
		project: projectUrl,
		contentType: "text/plain",
		content: code
	});
	
	const assetUrl = assetCreationResponse.url;
	console.log(`An asset was created at: ${assetUrl}`);
	const jobCreationResponse = await call("jobs/", {
		name: "generatedJob",
		input: assetUrl,
		backend_type: "https://api.quantum-inspire.com/backendtypes/1/",
		number_of_shots: shots
	});
	
	const jobId = jobCreationResponse.id;
	console.log(`A job was created with id: ${jobId}`);
	console.log(`We now wait for completion...`);
	let status = "WAITING";
	while (status != "COMPLETE") {
		await new Promise(res => setTimeout(res, 1000));
		const jobReadResponse = await call(`jobs/${jobId}/`);
		status = jobReadResponse.status;
		console.log(`Current status: ${status}`);
	}
	
	const resultResponse = await call(`jobs/${jobId}/result/`);
	console.log(`Retrieving data at: ${resultResponse.raw_data_url}`);
	return await call(`${resultResponse.raw_data_url.substring(URL.length)}?format=json`);
};