const artInput = document.getElementById('art-input');
const artList = document.getElementById('art-list');
// const apiKey='4d8e7511-c083-423a-b0f1-24e2215c1e40';

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
    artList.innerHTML = "";
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

//this funciton shortens the title if it's too long to fit on the card
function truncate(string){
    if(string.length > 30){
        string=string.substring(0, 30);
        string+='...';
    }
    return string;
}