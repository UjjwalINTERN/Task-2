const galleryContainer = document.querySelector(".gallery-container");
const galleryControlsContainer = document.querySelector(".gallery-controls");
const galleryControls = ["previous", "next"];
const galleryItems = document.querySelectorAll(".gallery-item");

class Carousel {
  constructor(container, items, controls) {
    this.carouselContainer = container;
    this.carouselControls = controls;
    this.carouselArray = [...items];
    this.autoplayInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  updateGallery() {
    this.carouselArray.forEach((el) => {
      el.classList.remove(
        "gallery-item-1",
        "gallery-item-2",
        "gallery-item-3",
        "gallery-item-4",
        "gallery-item-5"
      );
    });

    this.carouselArray.slice(0, 5).forEach((el, i) => {
      el.classList.add(`gallery-item-${i + 1}`);
    });
  }

  setCurrentState(direction) {
    if (
      direction === "previous" ||
      direction.classList.contains("gallery-controls-previous")
    ) {
      this.carouselArray.unshift(this.carouselArray.pop());
    } else {
      this.carouselArray.push(this.carouselArray.shift());
    }

    this.updateGallery();
  }

  setControls() {
    this.carouselControls.forEach((control) => {
      const button = document.createElement("button");
      button.className = `gallery-controls-${control}`;
      galleryControlsContainer.appendChild(button);
    });
  }

  useControls() {
    const triggers = [...galleryControlsContainer.childNodes];
    triggers.forEach((control) => {
      control.addEventListener("click", (e) => {
        e.preventDefault();
        this.setCurrentState(control);
      });
    });
  }

  // Touch support
  enableTouchSupport() {
    this.carouselContainer.addEventListener("touchstart", (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });

    this.carouselContainer.addEventListener("touchend", (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    if (this.touchStartX - this.touchEndX > swipeThreshold) {
      this.setCurrentState("next");
    } else if (this.touchEndX - this.touchStartX > swipeThreshold) {
      this.setCurrentState("previous");
    }
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  // Keyboard navigation
  enableKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.setCurrentState("previous");
      } else if (e.key === "ArrowRight") {
        this.setCurrentState("next");
      }
    });
  }
}

const exampleCarousel = new Carousel(
  galleryContainer,
  galleryItems,
  galleryControls
);

exampleCarousel.setControls();
exampleCarousel.useControls();
exampleCarousel.updateGallery();
exampleCarousel.enableTouchSupport();
exampleCarousel.startAutoplay();
exampleCarousel.enableKeyboardNavigation();

// Stop autoplay on user interaction
galleryContainer.addEventListener("mouseenter", () =>
  exampleCarousel.stopAutoplay()
);
galleryContainer.addEventListener("mouseleave", () =>
  exampleCarousel.startAutoplay()
);
galleryContainer.addEventListener("touchstart", () =>
  exampleCarousel.stopAutoplay()
);
galleryContainer.addEventListener("touchend", () =>
  exampleCarousel.startAutoplay()
);
