const queryForm = document.getElementById('query-form');
const moreArtButton = document.getElementById('get-more-art');
const paginationBlock = document.querySelector('.pagination-block');
const resultSummary = document.getElementById('query-result-summary');
const paginationSection = document.getElementById('pagination');
const pageNumbers = document.getElementById('page_numbers');


paginationBlock.addEventListener('click', changePage);

const apiKey='4d8e7511-c083-423a-b0f1-24e2215c1e40';
var paginationInfo = {
    lastQuery:"",
    currentPage:1,
    totalPages:1,
    totalResults:0
}

queryForm.onsubmit = fetchThatArt;

function resetPaginationInfo() {
    paginationInfo.lastQuery="";
    paginationInfo.currentPage=1;
    paginationInfo.totalPages=1;
    paginationInfo.totalResults=0;
}

//this function clears the pagination info and query from previous input
function resetThePage(){
    resetPaginationInfo();
    artList.innerHTML = "";
    
}

function isValid(formInput){
    var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //unacceptable chars
    if (pattern.test(formInput)) {
        alert("Please only use standard alphanumerics");
        return false;
    }
    return true; //good user input
}

function populateResultSummary(){
    resultSummary.innerHTML="";
    var summary = document.createElement('div');
    var summaryNode = document.createTextNode(paginationInfo.totalResults 
        + " results found for '" + paginationInfo.lastQuery +"'");
    summary.appendChild(summaryNode);
    console.log(summary);
    resultSummary.appendChild(summary);
}

//this function checks to see if there is more than one page of results
//if so, it shows the pagination block
//if not, it hides the pagination block
function togglePaginationBlock() {
    
    if(paginationSection.classList.contains('show') && paginationInfo.totalPages==1){
        pagination.classList.remove('show');
    }
    if(paginationInfo.totalPages>1 && paginationSection.classList.contains('show')==false){
        pagination.classList.add('show');
    }
} 

// function setVisiblePageNumbers(){
//     var visiblePageNums = 1;
//     var firstPageNum = 1;
    
//     if (paginationInfo.currentPage<=5){
//         firstPageNum = 1;
//     }
//     else if(paginationInfo>=4){
//         firstPageNum = paginationInfo.currentPage - 2;
//     }
//     if(paginationInfo.currentPage = paginationInfo.totalPages-2)
//     {
//         firstPageNum = paginationInfo.totalPages - 4;
//     }

//     var pageNum= firstPageNum;
//     while(visiblePageNums<=5 && pageNum <= paginationInfo.totalPages){
//         var div = document.createElement("div");
//         node = document.createTextNode(pageNum);
//         div.appendChild(node);
//         div.classList.add("page-num");
//         pageNumbers.appendChild(node);
//         pageNum++;
//         visiblePageNums++;
//     }
    
// }

//this function queries the Harvard API given a query and a page number
function apiCall(query, pageNum){
    fetch(`https://api.harvardartmuseums.org/object?size=20&page=${pageNum}&apikey=${apiKey}&q=title:${query}&hasimage=1&person=any`)
    .then(response => {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.log('type error - no JSON')
            throw new TypeError("Oops, we haven't got JSON!");
        }
        return response.json()
    }).then(data => {
        console.log("Data Retrieved", data)
        paginationInfo.totalResults = data.info.totalrecords;
        console.log(data.info.totalrecords);
        var artRecords = [];
        data.records.forEach(record => {
            console.log(record);
            imageurl=checkImageUrl(record);

            artRecords.push(
                new ArtworkDetails(
                    imageurl,
                    truncate(record.title), 
                    record.century,
                    truncate(record.people[0].displayname), 
                    record.url) 
                );
        });            
        
        
        paginationInfo.totalPages = data.info.pages;
        paginationInfo.currentPage = data.info.page;
        console.log(paginationInfo.totalPages);
        console.log(paginationInfo.currentPage);
        console.log(paginationInfo.totalResults);

        populateResultSummary();
        populateArtList(artRecords);
        togglePaginationBlock();
        // setVisiblePageNumbers();
    });
}

//this function is called when the user entes a word in the text box form

function fetchThatArt(event) {
    resetThePage();
    var query = ""
 
    if (isValid(artInput.value)){
        query = artInput.value;
        lastQuery = query;
        event.preventDefault();         
        paginationInfo.lastQuery=query;
        apiCall(query,paginationInfo.currentPage);
    }  
 
}

function changePage(event){
    if (event.target.classList.contains('next')){
        if(paginationInfo.currentPage<paginationInfo.totalPages){
            paginationInfo.currentPage += 1;
            apiCall(paginationInfo.lastQuery, paginationInfo.currentPage);
        }
        else{
            alert("You've seen it all - now search for some new art!");
        }
    }
    if(event.target.classList.contains('prev')){
        if(paginationInfo.currentPage>1){
            paginationInfo.currentPage -=1;
            apiCall(paginationInfo.lastQuery, paginationInfo.currentPage);
        }
        else{
            alert("You're on the first page.  Click 'next' to see more results.");
        }
    }
    if (event.target.classlist.contains('page-num')){
        paginationInfo.currentPage = event.value;
        apiCall(paginationinfo.lastQuery, paginationinfo.currentPage);
    }
    
}


