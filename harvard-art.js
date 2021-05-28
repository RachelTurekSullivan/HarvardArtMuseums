const form = document.getElementById('form');
const artInput = document.getElementById('art-input');
const artList = document.getElementById('art-list');
const moreArtForm = document.getElementById('get-more-art-form');
const pagination = document.getElementById('pagination');
const apiKey='4d8e7511-c083-423a-b0f1-24e2215c1e40';

var lastQuery = "";

form.onsubmit = fetchThatArt;
moreArtForm.onsubmit = getMoreArt;

//this class takes in info about one piece of art from a JSON response and processes it
//taking only the first part of an array
class ArtworkDetails {
    constructor(imageurl, title, dated, artistName, artworkUrl) {
        this.imageUrl = imageurl;
        this.title = title;
        this.dated = dated;
        this.artistName = artistName;
        this.artworkUrl = artworkUrl;
    }
}

//class to store all of the ArtworkDetails objcts for a whole page
//used when pagination is activated
class PaginatedArtworkDetails{
    constructor(ArtworkDetailsArray){
        this.ArtworkDetailsArray = ArtworkDetailsArray;
    }
}
var pageDetails = new PaginatedArtworkDetails([]);

//this function takes in an image url and returns an IMG html element
function createImageElement(imageUrl) {
    var img = new Image();
    img.src = imageUrl;
    img.style.display = 'inline-block';
    return img;
} 

//this function turns the strings from an Artwork detail object and turns them into nodes
function createArtworkCardNodes (artworkDetails){
    var imageElementNode = createImageElement(artworkDetails.imageUrl);
    var titleNode = document.createTextNode(artworkDetails.title);
    var dateNode = document.createTextNode(artworkDetails.dated);
    var artistNameNode = document.createTextNode(artworkDetails.artistName);

    var artworkUrlNode = document.createElement('a');
    artworkUrlNode.title="link";
    artworkUrlNode.href=artworkDetails.artworkUrl;
    artworkUrlNode.appendChild(document.createTextNode('Learn More'));

    return [imageElementNode,titleNode,dateNode,artistNameNode,artworkUrlNode];
}

//this function takes an array of html nodes related to a single artwork, 
//puts them in a styled div, and returns the div
function createArtworkCardDiv(artworkNodes){
    var artDiv = document.createElement("div");
    var imageDiv = document.createElement("div");
    var infoDiv= document.createElement('div');

    imageDiv.appendChild(artworkNodes[0]);
    imageDiv.classList.add("card-img");
    imageDiv.classList.add('row');
    imageDiv.classList.add('no-wrap');

    for (let index = 1; index < artworkNodes.length; index++) {
        var div = document.createElement('div');
        div.appendChild(artworkNodes[index]);
        infoDiv.appendChild(div);    
    }
   
    infoDiv.classList.add('col');
    infoDiv.classList.add('card-info');
    infoDiv.classList.add('small-font');

    artDiv.appendChild(imageDiv);
    artDiv.appendChild(infoDiv);
    artDiv.classList.add('col');
    artDiv.classList.add('card');
    return artDiv;
}

//this function injects the HTML for the Artwork Cards into the Art list element on the page  
function populateArtList(artRecords){
    artRecords.forEach(element => {
        var artworkNodes = createArtworkCardNodes(element);
        var artCard = createArtworkCardDiv(artworkNodes);
        artList.appendChild(artCard);
    });
}



//This function checks to see if the image is present, and if not, provides a default
function checkImageUrl(record){
    var imageurl="";
    if (record.images[0]){
        imageurl = record.images[0].baseimageurl;
    }
    else{
        imageurl='https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
    }
    return imageurl;
}






//this function fetches art using the Harvard Art Museums API
//if no event is passed in, it automatically searches for lighthouse
function fetchThatArt(event) {
    artList.innerHTML = "";
    var query = ""
    if(pagination.classList.contains('show')){
            pagination.classList.remove('show');
    }
    
    if (event){
        query = artInput.value;
        lastQuery = query;
        event.preventDefault(); 
    }
    else {
       query = 'lighthouse';
    }

    fetch(`https://api.harvardartmuseums.org/object?size=20&apikey=${apiKey}&q=title:${query}&hasimage=1&person=any`)
        .then(response => {
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.log('type error - no JSON')
                throw new TypeError("Oops, we haven't got JSON!");
            }
            return response.json()
        })
        .then(data => {
            console.log("Data Retrieved", data)
            var artRecords = [];
        

            data.records.forEach(record => {
                console.log(record);
                imageurl=checkImageUrl(record);

                artRecords.push(
                    new ArtworkDetails(
                        imageurl,
                        record.title, 
                        record.century,
                        record.people[0].displayname, 
                        record.url) 
                    );
            });            
            populateArtList(artRecords);
        });
}

    

// paginate takes in: 
//totalItems: number,
//     currentPage: number = 1,
//     pageSize: number = 10,
//     maxPages: number = 10

//paginate returns:
//         totalItems: totalItems,
//         currentPage: currentPage,
//         pageSize: pageSize,
//         totalPages: totalPages,
//         startPage: startPage,
//         endPage: endPage,
//         startIndex: startIndex,
//         endIndex: endIndex,
//         pages: pages

//API format for size=100 art forms with # of pages = 5
//   https://api.harvardartmuseums.org/object?size=5&page=42

//this function will get 100 record (if they exist) and arrange tem 20 to a page
//need to add event listenders for eage page link and back/forward button
//need to create "Pages" for in the shape of the new query (array[]?)
//need to figure out why npm isn't working in this project



https://api.harvardartmuseums.org/object?size=20&page=100apikey=$4d8e7511-c083-423a-b0f1-24e2215c1e40&q=title:lighthouse&hasimage=1&person=any
function getMoreArt(){
   
    fetch(`https://api.harvardartmuseums.org/object?size=20&page=100apikey=${apiKey}&q=title:${lastQuery}&hasimage=1&person=any`)
    .then(response => {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.log('type error - no JSON')
            throw new TypeError("Oops, we haven't got JSON!");
        }
        return response.json()
    })
    .then(data => {
        console.log("Data Retrieved", data)
        var pageRecords = [];
    
        data.records.forEach(recordSet => {
            var artRecords = [];
            recordSet.forEach(record => {
                
                console.log(record);
                imageurl=checkImageUrl(record);
    
                artRecords.push(
                    new ArtworkDetails(
                        imageurl,
                        record.title, 
                        record.century,
                        record.people[0].displayname, 
                        record.url) 
                    );
            });
            pageRecords.push[recordSet];
        });
        
        artRecords.forEach(element => {
            var artworkNodes = createArtworkCardNodes(element);
            var artCard = createArtworkCardDiv(artworkNodes);
            artList.appendChild(artCard);
        });
    
    });






    paginate.classList.add('show');
}







//this function gets art when the page loads
function onLoad() {
    fetchThatArt(null);
}

//this calls the onLoad function so that the page loads
//by default, it searches for lighthouses
onLoad();


