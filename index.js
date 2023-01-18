const searchTxt = document.getElementById("search-txt");
const searchBtn = document.getElementById("search-btn");
const list = document.getElementById("elements");

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const tracks = document.getElementById("tracks");
const link = document.getElementById("link");
const cover = document.getElementById("cover");

let albums_list = []

function search() {
    DZ.api("/search/album?q="+searchTxt.value, function(response) {
        searchTxt.value = "";
        list.innerHTML = "";
        albums_list = [];

        for (let i = 0; i < response.data.length; i++) {

            var album = document.createElement("input");
    
            album.type = "button";
            album.value = response.data[i].title + " - " + response.data[i].artist.name;
            album.setAttribute("onclick", "updateData(" + i + ");");

            list.appendChild(album);
            list.appendChild(document.createElement("br"));

            albums_list.push({
                "title": response.data[i].title,
                "artist": response.data[i].artist.name,
                "tracks": response.data[i].nb_tracks,
                "cover_xl": response.data[i].cover_xl,
                "link": response.data[i].link
            })
        }
    });
}

function updateData(number) {
    title.innerText = albums_list[number].title;
    artist.innerText = albums_list[number].artist;
    tracks.innerText = albums_list[number].tracks; 
    link.setAttribute("href", albums_list[number].link);
    link.setAttribute("target", "_blank");
    cover.src = albums_list[number].cover_xl;
    cover.alt = albums_list[number].title;
}

function download() {
    var url = cover.alt

    fetch(url).then(res => res.blob()).then(file => {
        let tempUrl = URL.createObjectURL(file);
        const aTag = document.createElement("a");
        aTag.href = tempUrl;
        aTag.download = (title.innerText + " - " + artist.innerText + ".jpeg").replace(/^.*[\\\/]/, '');
        document.body.appendChild(aTag);
        aTag.click();
        URL.revokeObjectURL(tempUrl);
        aTag.remove();
    }).catch(() => {
        alert("Failed to download file!");
    });
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Enter") {
        search();
    }
});