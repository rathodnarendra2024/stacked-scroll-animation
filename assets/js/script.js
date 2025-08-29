gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector("#services");
const cards = gsap.utils.toArray(".service-card");
const stackGap = 20; // stacked layer gap
const viewH = 500; // height of .services-rights
const step = 350; // scroll distance per step

// Array of background colors according to each card
const colors = [
  "radial-gradient(circle at top right, #439539, #D9EAD7)",
  "radial-gradient(circle at top right, #00BCE4, #E5F8FC)",
  "radial-gradient(circle at top right, #FFD200, #FFFAE5)",
  "radial-gradient(circle at top right, #9747FF, #F0EBF1)",
  "radial-gradient(circle at top right, #C41230, #F9E7EA)",
  "radial-gradient(circle at top right, #FFD200, #FFFBE6)",
];

const progressFill = document.querySelector(".progress-fill");

// Total scroll distance for service cards
const totalScroll = (cards.length - 1) * step;

cards.forEach((card, i) => {
  gsap.set(card, {
    zIndex: 100 + i,
    y: i * (viewH + stackGap),
  });
});

// Spacer so scroll works naturally
document.querySelector("#services-spacer").style.height =
  (cards.length - 1) * step + "px";

function updateProgress(progress) {
  if (window.innerWidth < 768) {
    // Mobile-only code
    progressFill.style.width = `${progress * 100}%`;
    // console.log("Mobile view");
  } else {
    // Desktop code
    progressFill.style.height = `${progress * 100}%`;
    // console.log("Desktop view");
  }
}

// Initialize progress bar for first card
updateProgress(0);

// Timeline for stacking
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: "+=" + totalScroll,
    scrub: 0.5,
    pin: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      updateProgress(self.progress);
    },
    onLeave: () => {
      // Remove spacer when the section is fully scrolled
      document.querySelector("#services-spacer").style.height = "0px";
    },
  },
});

for (let i = 1; i < cards.length; i++) {
  const incoming = cards[i];

  // Animate incoming card to stacked position
  tl.to(
    incoming,
    {
      y: i * stackGap,
      ease: "none",
      duration: 1,
    },
    `step${i}`
  );

  // Gradually scale all previous cards
  for (let j = 0; j < i; j++) {
    const prevCard = cards[j];
    const scaleValue = 1 - 0.02 * (i - j); // decrease gradually
    const blurValue = 2 + 0.05 * (i - j); // optional blur
    tl.to(
      prevCard,
      {
        scale: scaleValue,
        filter: `blur(${blurValue}px)`,
        ease: "none",
        duration: 1,
      },
      `step${i}`
    );
  }

  // Change background color on card change
  tl.to(
    section,
    {
      background: colors[i % colors.length],
      ease: "none",
      duration: 1,
    },
    `step${i}`
  );
}
