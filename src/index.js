import axios from "axios";
import Notiflix from 'notiflix';
// Described in documentation
import SimpleLightbox from "simplelightbox";
// Additional styles import
import "simplelightbox/dist/simple-lightbox.min.css";

const myForm = document.querySelector(".search-form");
myForm.style.paddingBottom = "10px";
const myGallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let page = 1;
let perPage = 40;
let srchTerm;
let notloadMore;
let storageVar = 0;
let cumlate;
let lightbox;


const startSrch = async () => {
    try {
        const response = await axios.get(`https://pixabay.com/api/`, {
            params: {
                key: "41151959-2696743ecd3219a7fd97287eb",
                q: srchTerm,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: "true",
                per_page: perPage,
                page: page
            }
        });
        const users = await response.data;
        return users;
    }
    catch (error) {
        console.error(error);
    }
};


myForm.addEventListener("submit", (event) => {
    cumlate = 0;
    storageVar = 0;
    notloadMore = null;
    page = 1;
    //loadMoreBtn.style.display = "none";
    loadMoreBtn.classList.add('hide');
    myGallery.innerHTML = ""
    event.preventDefault();
     srchTerm = myForm.querySelector("input[name='searchQuery']").value;
    console.log(srchTerm);
    Notiflix.Loading.hourglass("Loading data, please wait...")



  
    startSrch().then(users => {
        console.log(users);
        
        if (users.hits.length === 0) {
            Notiflix.Loading.remove();
            Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
            
            return;
        }
        Notiflix.Notify.success(`Hooray! We found ${users.totalHits} images.`);
        
        const dataArray = users.hits;
        /*dataArray.map(data => {
            
        })*/
        for (let i = 0; i < dataArray.length; i++) {
            const photoCard = document.createElement('div');
            photoCard.setAttribute("class", "photo-card");

            photoCard.innerHTML = `
  <a href="${dataArray[i].largeImageURL}"><img src=${dataArray[i].webformatURL} alt="${dataArray[i].tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${dataArray[i].likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${dataArray[i].views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${dataArray[i].comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${dataArray[i].downloads}</b>
    </p>
  </div>

            `
            
            myGallery.append(photoCard);
            Notiflix.Loading.remove();
            //console.log(i);
            //myGallery.insertAdjacentHTML("beforeend", photoCard.innerHTML);
            
            if (dataArray.length === users.totalHits) {
                notloadMore = true;
                //Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
                //loadMoreBtn.style.display = "none";
                loadMoreBtn.classList.add('hide');
                
            }

           /* else if (dataArray.length != users.totalHits) {
                notloadMore = false;  
            }*/
          
        }
        page += 1;
        
        if (page > 1 && !notloadMore) {
            //loadMoreBtn.style.display = "block";
            loadMoreBtn.classList.remove('hide');
        }
        
         lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
            closeText: 'X',
            animationSlide: false,
        });
    })
    
       .catch(error => {
        Notiflix.Loading.remove();
        Notiflix.Notify.failure("Oops! Something went wrong! Try reloading the page!");
        console.error(`Error message ${error}`)

    });
    
})

loadMoreBtn.addEventListener("click", () => {
    Notiflix.Loading.hourglass("Loading data, please wait...")
    notloadMore = null;
    startSrch().then(users => {
        console.log(users);
        
        
        storageVar = storageVar + users.hits.length;

        cumlate = storageVar + perPage;
        
        const dataArray = users.hits;
        console.log(cumlate)
        for (let i = 0; i < dataArray.length; i++) {
            const photoCard = document.createElement('div');
            photoCard.setAttribute("class", "photo-card");

            photoCard.innerHTML = `
  <a href="${dataArray[i].largeImageURL}" target="_blank"><img src=${dataArray[i].webformatURL} alt="${dataArray[i].tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${dataArray[i].likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${dataArray[i].views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${dataArray[i].comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${dataArray[i].downloads}</b>
    </p>
  </div>

            `
            myGallery.append(photoCard);
            Notiflix.Loading.remove();

            

            if (i === dataArray.length - 1 && cumlate >= users.totalHits) {
                notloadMore = true;
                Notiflix.Loading.remove();
                Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
                //loadMoreBtn.style.display = "none";
                loadMoreBtn.classList.add('hide');
                
         }
            
        }
        //console.log(cumlate)
        page += 1;  
     
        if (page > 1 && !notloadMore) {
            //loadMoreBtn.style.display = "block";
            loadMoreBtn.classList.remove('hide');
        }
        lightbox.refresh()
    })
        .catch(error => {
            Notiflix.Loading.remove();
            Notiflix.Notify.failure("Oops! Something went wrong! Try reloading the page!");
            console.error(`Error message ${error}`)

        });
})
    
