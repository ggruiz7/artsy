const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#search-term');
const searchResultsContainerEl = document.querySelector('#search-results');
const searchTextEl = document.querySelector('#search-term-display');

const formSubmitHandler = function(event) {
    event.preventDefault();
    
    const searchTerm = searchInputEl.value.trim();

    if (searchTerm) {
        getSearch(searchTerm);
        console.log(searchTerm);

        searchResultsContainerEl.textContent = "";
        searchInputEl.value = ""; 
    }
    else {
        alert("Please Enter a Valid Search");
    }
};

const getSearch = function(search) {
    const apiSearchUrl = "https://collectionapi.metmuseum.org/public/collection/v1/search?q=" + search;

    fetch(apiSearchUrl).then(function(response) {
        if(response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data.objectIDs);
                getSearchResults(data.objectIDs);
            })
        }
        else {
            alert("Error: " + response.statusText + " (see console for more info if ur a nerd)");
            return;
        }
    })
    .catch(function(error) {
        alert("Unable to Access MET Museum");
    })
};

const getSearchResults = function(searchIds) {
    if (searchIds.length === 0) {
        searchResultsContainerEl.textContent = "No results found, try a different search key.";
        return;
    }

    for (let i = 0; i < 8; i++) {
        const searchId = searchIds[i];

        const apiObjectUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects/" + searchId;

        fetch(apiObjectUrl).then(function(response) {
            if(response.ok) {
                console.log(response);
                response.json().then(function(data) {
                    console.log(data);
                    displaySearchResults(data);
                    })
            }
            else {
                alert("Error: " + response.statusText + " (see console for more info if ur a nerd)");
                return;
            }
        })
        .catch(function(error) {
            alert("Unable to access MET Museum")
        })
    }
};

const displaySearchResults = function(results) {
    searchTextEl.textContent = searchInputEl.value.trim();

    const artName = results.title + ", " + results.artistDisplayName;

    const artDesc = results.creditLine;

    const artCardEl = document.createElement('a');
    artCardEl.classList = "uk-card uk-card-default   uk-grid-collapse uk-child-width-1-2@s uk-margin uk-grid";
    artCardEl.setAttribute('href', results.objectURL);
    artCardEl.setAttribute('target', '_blank');

    const cardMediaEl = document.createElement('div');
    cardMediaEl.classList = "uk-card-media-left uk-cover-container uk-first-column";

    const cardImgEl = document.createElement('img');
    cardImgEl.setAttribute('src', results.primaryImage);

    cardMediaEl.appendChild(cardImgEl);

    const cardBodyEl = document.createElement('div');
    cardBodyEl.classList = "uk-card-body";
                
    const cardTitleEl = document.createElement('h3');
    cardTitleEl.textContent = artName;
    cardTitleEl.classList = "uk-card-title";
        
    const cardInfoEl = document.createElement('p');
    cardInfoEl.textContent = artDesc;
        
    cardBodyEl.append(cardTitleEl, cardInfoEl);
                
    artCardEl.append(cardMediaEl, cardBodyEl);

    searchResultsContainerEl.appendChild(artCardEl);

    const paginContainer = document.createElement('div');
    const pagination = document.createElement('a');
    pagination.setAttribute('href', "https://www.metmuseum.org/search-results#!/search?q=" + searchInputEl.value.trim());
    pagination.classList = ""
    paginContainer.appendChild(pagination);

    searchResultsContainerEl.appendChild(paginContainer);
}

searchFormEl.addEventListener('submit', formSubmitHandler);
