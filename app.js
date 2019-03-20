let searchBar = document.getElementById('searchBar')
let searchButton = document.getElementById('searchButton')
let resultsBox = document.getElementById('resultsBox')
let resultsUL = document.getElementById('resultsUL')
let userAccessToken = "BQBD3YjFyPhz0C87FyTmPIhu9hupxCmtzp2xF8rSaOYvt4UiFLQQaOJgoKbExWOjZrptOG_AVzKDPp4FK6Oc-9HU3Pyo0EbziRyFA6gVC_g0N_YzonUopZAbjhXSozEGMRFipQU8jCaA0V5g7-F0260Z4cTWPpyxO3JMZO-brenEroGCfM-l"

let tracksId = document.getElementById('tracksId')


// Searches albums by artist
searchButton.addEventListener('click', function () {
    fetch("https://api.spotify.com/v1/search?q=" + searchBar.value + "&type=track%2Cartist&market=US&limit=10&offset=5",
        {
            method: "GET",
            headers:
            {
                Authorization: `Bearer ${userAccessToken}`
            }
        })
        .then(response => response.json())
        .then(({ tracks }) => {
            let resultsLItem = tracks.items.map((item) => {
                return `<li>
                        <h3>${item.album.artists[0].name}</h3>
                        <div class="elementBox">
                        <img onclick="getTracks('${item.album.id}')" src="${item.album.images[1].url}"></img>
                        <p>${item.album.name}</p>
                        <p>${item.album.release_date}</p>
                        </div>
                        </li>`
            })
            resultsUL.innerHTML = resultsLItem.join('')
        })
})

let trackInfoList
let happinessList
function getTracks(id) {
    //place html visibility = show
    fetch("https://api.spotify.com/v1/albums/" + id + "/tracks",
        {
            method: "GET",
            headers:
            {

                Authorization: `Bearer ${userAccessToken}`
            }
        })
        .then(response => response.json())
        .then(({ items }) => {
            trackInfoList = []
            trackInfoList = items.map((item) => {

                return {
                    id: `${item.id}`,
                    track_number: item.track_number,
                    name: item.name,
                    happiness: ""
                }
            })
            let idString = ""
            console.log(trackInfoList)
            trackInfoList.map((item) => {

                idString += item.id + ","
                //     return `

                //         <li><p>${item.track_number}</p>
                //             <p>${item.name}</p>
                //         </li>
                //         `
            })
            // tracksId.innerHTML = list.join('')
            getTrackFeatures(idString)

            // for (let i = 0; i < trackInfoList.length; i++) {
            //     trackInfoList[i].happiness = happinessList[i]
            // }
            // let list = trackInfoList.map((item) => {

            //     return `

            //         <li class="trackLI">
            //         <p>${item.track_number}</p>
            //         <p>${item.name}</p>
            //         <p>${item.happiness}</p>
            //         </li>
            //         `
            // })
            // // let happinessDisplay = happinessList.map((value) => {
            // //     return `<li>
            // //                 <h3>${value}</h3>
            // //             </li>`
            // // })
            // tracksId.innerHTML = list.join('')
        })
}






function getTrackFeatures(idString) {
    // pass a variable to show one of severl track features
    fetch("https://api.spotify.com/v1/audio-features/?ids=" + idString, {
        method: "GET",
        headers:
        {
            Authorization: `Bearer ${userAccessToken}`
        }
    })
        .then(features => features.json())
        .then(({ audio_features }) => {
            let featuresList = audio_features.map((feature) => {
                return feature.valence
            })
            console.log(featuresList)
            happinessList = []
            happinessList = featuresList.map((valence) => {
                if (valence >= 0.6) {
                    return ":)"
                }
                else {
                    return ":("
                }
            })
            console.log(happinessList)
            displayTrackInfo()
            // let happinessDisplay = happinessList.map((value) => {
            //     return `<li>
            //                 <h3>${value}</h3>
            //             </li>`
            // })
            // happinessUL.innerHTML = happinessDisplay.join("")

        })
}

function displayTrackInfo() {
    for (let i = 0; i < trackInfoList.length; i++) {
        trackInfoList[i].happiness = happinessList[i]
    }
    let list = trackInfoList.map((item) => {

        return `
            
                    <li class="trackLI">
                        <div class="trackBox">
                            <p class="trackNumber">${item.track_number}-</p>
                            <p id="${item.id}">${item.name}</p>
                            <p class="featureValue">${item.happiness}</p>
                        </div>
                    </li>
                    `
    })
    tracksId.innerHTML = list.join('')
}