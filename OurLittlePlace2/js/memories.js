/* =========================================
   OUR MEMORIES
========================================= */


/*
    IMPORTANT:

    Put your photos here:

    assets/memories/photo1.jpg
    assets/memories/photo2.jpg
    ...
    assets/memories/photo17.jpg

    The order below determines the order
    in the gallery.
*/


const memories = [

    "photo1.jpg",
    "photo2.jpg",
    "photo3.jpg",
    "photo4.jpg",
    "photo5.jpg",
    "photo6.jpg",
    "photo7.jpg",
    "photo8.jpg",
    "photo9.jpg",
    "photo10.jpg",
    "photo11.jpg",
    "photo12.jpg",
    "photo13.jpg",
    "photo14.jpg",
    "photo15.jpg",
    "photo16.jpg",
    "photo17.jpg"

];


let currentPhoto = 0;


/* =========================================
   ELEMENTS
========================================= */

const gallery =
    document.getElementById("gallery");

const counter =
    document.getElementById("counter");

const progressBar =
    document.getElementById("progressBar");

const photoViewer =
    document.getElementById("photoViewer");

const viewerImage =
    document.getElementById("viewerImage");

const viewerNumber =
    document.getElementById("viewerNumber");


/* =========================================
   CREATE GALLERY
========================================= */

function createGallery() {

    gallery.innerHTML = "";

    memories.forEach((photo, index) => {

        const card =
            document.createElement("article");

        card.className = "memory-card";

        /*
            Photo #17 gets the special
            highlighted style.
        */

        if (index === 16) {
            card.classList.add("last-memory");
        }


        const number =
            String(index + 1).padStart(2, "0");


        card.innerHTML = `

            <div class="memory-number">
                ${number}
            </div>

            <div class="memory-image-wrapper">

                <img
                    class="memory-image"
                    src="assets/memories/${photo}"
                    alt="Спомен ${number}"
                    loading="lazy"
                >

                <div class="card-heart">
                    ${index % 3 === 0 ? "♥" : "♡"}
                </div>

            </div>

        `;


        card.addEventListener(
            "click",
            () => openPhoto(index)
        );


        gallery.appendChild(card);

    });


    updateProgress();

}


/* =========================================
   UPDATE PROGRESS
========================================= */

function updateProgress() {

    const number =
        String(currentPhoto + 1).padStart(2, "0");

    counter.textContent = number;


    const percentage =
        ((currentPhoto + 1) / memories.length) * 100;

    progressBar.style.width =
        `${percentage}%`;

}


/* =========================================
   OPEN PHOTO
========================================= */

function openPhoto(index) {

    currentPhoto = index;

    updateViewer();

    photoViewer.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* =========================================
   UPDATE VIEWER
========================================= */

function updateViewer() {

    const number =
        String(currentPhoto + 1).padStart(2, "0");


    viewerImage.src =
        `assets/memories/${memories[currentPhoto]}`;


    viewerImage.alt =
        `Наш спомен ${number}`;


    viewerNumber.textContent =
        `${number} / 17`;


    updateProgress();

}


/* =========================================
   CLOSE VIEWER
========================================= */

function closeViewer() {

    photoViewer.classList.remove("active");

    document.body.style.overflow = "";

}


/* =========================================
   NEXT PHOTO
========================================= */

function nextPhoto() {

    currentPhoto++;

    if (currentPhoto >= memories.length) {

        currentPhoto =
            memories.length - 1;

        closeViewer();

        /*
            If this is photo 17,
            the next button takes her
            to the letter.
        */

        goToLetter();

        return;
    }


    updateViewer();

    if (!photoViewer.classList.contains("active")) {

        /*
            If we're navigating from the
            gallery, scroll to the selected
            memory.
        */

        const cards =
            document.querySelectorAll(".memory-card");

        cards[currentPhoto].scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


/* =========================================
   PREVIOUS PHOTO
========================================= */

function previousPhoto() {

    currentPhoto--;

    if (currentPhoto < 0) {
        currentPhoto = 0;
        return;
    }


    if (
        photoViewer.classList.contains("active")
    ) {

        updateViewer();

    } else {

        const cards =
            document.querySelectorAll(".memory-card");

        cards[currentPhoto].scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        updateProgress();

    }

}


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {
            closeViewer();
        }

        if (event.key === "ArrowRight") {
            nextPhoto();
        }

        if (event.key === "ArrowLeft") {
            previousPhoto();
        }

    }
);


/* =========================================
   CLICK OUTSIDE PHOTO
========================================= */

photoViewer.addEventListener(
    "click",
    function(event) {

        if (event.target === photoViewer) {
            closeViewer();
        }

    }
);


/* =========================================
   TOUCH / SWIPE
========================================= */

let touchStartX = 0;
let touchEndX = 0;


photoViewer.addEventListener(
    "touchstart",
    function(event) {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


photoViewer.addEventListener(
    "touchend",
    function(event) {

        touchEndX =
            event.changedTouches[0].screenX;

        handleSwipe();

    },
    { passive: true }
);


function handleSwipe() {

    const difference =
        touchStartX - touchEndX;


    if (Math.abs(difference) < 50) {
        return;
    }


    if (difference > 0) {

        nextPhoto();

    } else {

        previousPhoto();

    }

}


/* =========================================
   NAVIGATION TO OTHER SCENES
========================================= */

/*
    These functions will connect to the
    rest of our love program later.
*/


function goBack() {

    /*
        For now:
        return to the previous page.

        Later we'll connect this directly
        to the game scene.
    */

    if (document.referrer) {
        history.back();
    }

}


function goToLetter() {

    /*
        Later this becomes something like:

        showScene("letter");

        For now it looks for letter.html.
    */

    window.location.href =
        "letter.html";

}


/* =========================================
   START
========================================= */

createGallery();