const ClientId = "cd082f7b61b3475fbe9a42a56a9354e1";
const ClientSecret = "3fd38505f4bb464f80e19fdc7a981e84";

const AccessTokenURL = "https://accounts.spotify.com/api/token";

var AccessToken;
var path = 0;

var artist1;
var artist2;

var input = document.querySelector("#query");
var output = document.querySelector(".output");

var para0 = document.createElement("P");
var para1 = document.createElement("P");
var para2 = document.createElement("P");
var para3 = document.createElement("P");
var para4 = document.createElement("P");

var encodedKey = encodeURIComponent("grant_type");
var encodedValue = encodeURIComponent("client_credentials");

var formbody = encodedKey + "=" + encodedValue;

const getAccessToken = async () => {
  const response = await fetch(AccessTokenURL, {
    method: "POST",
    body: formbody,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(ClientId + ":" + ClientSecret),
    },
  });

  var Access = await response.json();
  AccessToken = Access.access_token;
  console.log(AccessToken);
};

const searchartist = async () => {
  para0.remove();
  para1.remove();
  para2.remove();
  para3.remove();
  para4.remove();
  if (AccessToken && input.value != "") {
    var searchresponse = await fetch(
      `https://api.spotify.com/v1/search?q=${urlencode(
        input.value
      )}&type=artist`,
      {
        headers: {
          Authorization: "Bearer " + AccessToken,
        },
      }
    );
    responseartist = await searchresponse.json();

    artists = responseartist.artists.items;

    if (input.value == " ") {
      output.style.display = none;
    }

    para0.innerHTML = artists[0].name;
    para0.setAttribute("onclick", "setartist(0)");
    document.querySelector(".output").appendChild(para0);

    para1.innerHTML = artists[1].name;
    para1.setAttribute("onclick", "setartist(1)");
    document.querySelector(".output").appendChild(para1);

    para2.innerHTML = artists[2].name;
    para2.setAttribute("onclick", "setartist(2)");
    document.querySelector(".output").appendChild(para2);

    para3.innerHTML = artists[3].name;
    para3.setAttribute("onclick", "setartist(3)");
    document.querySelector(".output").appendChild(para3);

    para4.innerHTML = artists[4].name;
    para4.setAttribute("onclick", "setartist(4)");
    document.querySelector(".output").appendChild(para4);
  }
};

function setartist(x) {
  if (artist1) {
    artist2 = artists[x];
    document.getElementById("artist2").src = artist2.images[1].url;
  } else {
    artist1 = artists[x];
    document.getElementById("artist1").src = artist1.images[1].url;
  }
}

function urlencode(str) {
  var replaced = str.split(" ").join("+");
  return replaced;
}

var artistids = [];
var relatedartistsarray = [];

async function getRelatedArtistIds(ids) {
  artistids = [];
  for (let i = 0; i < ids.length; i++) {
    let response = await fetch(
      `https://api.spotify.com/v1/artists/${ids[i]}/related-artists`,
      {
        headers: {
          Authorization: "Bearer " + AccessToken,
        },
      }
    );

    let data = await response.json();
    artistids.push(data);
  }
  relatedartistsarray = [];
  for (let i = 0; i < artistids.length; i++) {
    for (let j = 0; j < artistids[i].artists.length; j++) {
      relatedartistsarray.push(artistids[i].artists[j].id);
    }
  }
  console.log(relatedartistsarray);
  return relatedartistsarray;
}

async function startpath() {
  if (artist1.id == artist2.id) {
    alert("sameartist");
  } else {
    var array = await getRelatedArtistIds([artist1.id]);
    findpath(false, array);
  }
}

async function findpath(gotit, array) {
  if (gotit == true) {
    return;
  }

  var what = array.includes(artist2.id);
  path++;
  if (what == false) {
    var array1 = await getRelatedArtistIds(array);
    findpath(what, array1);
  } else {
    console.log(path);
    document.getElementById("pathvalue").innerHTML = path;
    document.getElementById("none").style.display = "none";
    document.getElementById("showresult").style.display = "block";
    findpath(true, [1, 2, 3]);
  }
}
