/* Piedmont Environmental — interactions */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector(".hamburger");
  var nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        burger.classList.remove("open");
      }
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero parallax + vine growing down the page ----------
     The vine stem draws on as you scroll. Each leaf (fixed to the stem,
     no independent motion) sprouts only AFTER the vine has grown past its
     node, and tucks back in just before the retracting vine reaches it. */
  var heroImg = document.querySelector(".hero__bg img");
  var leafPos = Array.prototype.slice.call(document.querySelectorAll(".vine .vine-leaf-pos"));
  var stem = document.querySelector(".vine .vine-stem");
  var stemLen = 1000;
  var VINE_H = 820;    // matches the svg viewBox height
  var LEAF_DELAY = 18; // how far (viewBox units) the vine grows past a node before its leaf sprouts
  if (stem) {
    stemLen = stem.getTotalLength ? stem.getTotalLength() : 1000;
    stem.style.strokeDasharray = stemLen;
    stem.style.strokeDashoffset = reduce ? 0 : stemLen;
  }
  function setLeaf(pos, on) {
    var leaf = pos.querySelector(".vine-leaf");
    if (leaf) leaf.classList.toggle("grown", on);
  }
  if (reduce) {
    leafPos.forEach(function (p) { setLeaf(p, true); });
  } else {
    var ticking = false;
    var frame = function () {
      ticking = false;
      var y = window.scrollY;
      if (heroImg) heroImg.style.transform = "translateY(" + (y * 0.18) + "px)";
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var prog = docH > 0 ? Math.min(1, y / docH) : 0;
      if (stem) stem.style.strokeDashoffset = stemLen * (1 - prog);
      var reached = prog * VINE_H; // how far down the stem is currently drawn
      for (var i = 0; i < leafPos.length; i++) {
        // grown only while the drawn stem extends past this node (plus a lead),
        // so leaves appear after the vine arrives and vanish before it leaves.
        setLeaf(leafPos[i], reached >= +leafPos[i].getAttribute("data-y") + LEAF_DELAY);
      }
    };
    var onScroll = function () {
      if (!ticking) { window.requestAnimationFrame(frame); ticking = true; }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    frame(); // set initial state
  }

  /* ---------- Lightbox ---------- */
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    var idx = 0;
    function srcOf(el) { return el.getAttribute("data-full") || (el.querySelector("img") || el).src; }
    function show(i) {
      idx = (i + triggers.length) % triggers.length;
      lbImg.src = srcOf(triggers[idx]);
    }
    triggers.forEach(function (t, i) {
      t.addEventListener("click", function () {
        show(i); lb.classList.add("open"); document.body.style.overflow = "hidden";
      });
    });
    function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }
    lb.querySelector(".lightbox__close").addEventListener("click", close);
    var prev = lb.querySelector(".prev"), next = lb.querySelector(".next");
    if (prev) prev.addEventListener("click", function () { show(idx - 1); });
    if (next) next.addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && next) show(idx + 1);
      if (e.key === "ArrowLeft" && prev) show(idx - 1);
    });
  }

  /* ---------- Testimonials carousel ---------- */
  var track = document.querySelector(".reviews__track");
  if (track) {
    var slides = track.querySelectorAll(".review");
    var dotsWrap = document.querySelector(".dots");
    var cur = 0, timer;
    var dots = [];
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Review " + (i + 1));
      b.addEventListener("click", function () { go(i); reset(); });
      dotsWrap.appendChild(b);
      dots.push(b);
    });
    function go(i) {
      slides[cur].classList.remove("active");
      dots[cur].classList.remove("active");
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add("active");
      dots[cur].classList.add("active");
    }
    function reset() { if (timer) { clearInterval(timer); start(); } }
    function start() { if (!reduce) timer = setInterval(function () { go(cur + 1); }, 6500); }
    slides[0].classList.add("active");
    dots[0].classList.add("active");
    var p = document.querySelector(".reviews__nav .prev");
    var n = document.querySelector(".reviews__nav .next");
    if (p) p.addEventListener("click", function () { go(cur - 1); reset(); });
    if (n) n.addEventListener("click", function () { go(cur + 1); reset(); });
    start();
  }

  /* ---------- Occasional drifting leaves (disabled) ----------
     Leaves that fell across the whole screen have been turned off.
  if (!reduce) {
    var leafSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.2 4 22c1-3 3-4 7-5 2-.5 5-2 6-9z" opacity=".55"/><path d="M21 3c-7 0-12 5-12 12 0 1 .2 2 .5 3C16 16 19 11 21 3z"/></svg>';
    function dropLeaf() {
      if (document.hidden) return;
      var el = document.createElement("div");
      el.className = "leaf-fall";
      el.innerHTML = leafSVG;
      el.style.left = (Math.random() * 92 + 2) + "vw";
      var dur = 9 + Math.random() * 7;
      el.style.animationDuration = dur + "s";
      el.style.fontSize = (12 + Math.random() * 12) + "px";
      document.body.appendChild(el);
      setTimeout(function () { el.remove(); }, dur * 1000 + 200);
    }
    setInterval(dropLeaf, 4200);
    setTimeout(dropLeaf, 1500);
  }
  ---------- end disabled drifting leaves ---------- */

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
