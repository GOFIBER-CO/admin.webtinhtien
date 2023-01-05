const uploadFileToBunny = async (file) => {
  // console.log("🚀 ~ file: api_bunny.js ~ line 9 ~ uploadFileToBunny ~ file", file)

  var fileName = file.name;
  // fileReader.readAsDataURL(fileName)
  const formData = new FormData();
  const blob = new Blob([file]);
  formData.append("selectedFile", file);
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
      AccessKey: "f9e3afdd-1370-42a8-924150b950c1-eab4-4ecf",
    },
    body: blob,
  };

  return await fetch(
    "https://sg.storage.bunnycdn.com/baovietnam/" + fileName,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => console.error(err));
};
const getListImageBunny = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "*/*",
      AccessKey: "f9e3afdd-1370-42a8-924150b950c1-eab4-4ecf",
    },
  };

  return await fetch("https://sg.storage.bunnycdn.com/baovietnam/", options)
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));
};
const deleteImageBunny = async (fileName) => {
  const options = {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      AccessKey: "f9e3afdd-1370-42a8-924150b950c1-eab4-4ecf",
    },
  };

  return fetch(
    "https://sg.storage.bunnycdn.com/baovietnam/" + fileName,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));
};
export { uploadFileToBunny, getListImageBunny, deleteImageBunny };
