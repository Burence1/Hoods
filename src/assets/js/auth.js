var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function (s) {
    return document.querySelector(s);
  },
  selectAll = function (s) {
    return document.querySelectorAll(s);
  },
  pin = select('.pin'),
  track = select('.track')


TweenMax.set('svg', {
  visibility: 'visible'
})

CustomBounce.create('bobbleBounce', { strength: 0.6, squash: 13, endAtStart: false, squashID: 'bobbleSquash' });
CustomEase.create("return", "M0,0 C0,0 0.162,1 0.4,1 0.918,1 1,0 1,0");
CustomEase.create("hup", "M0,0 C0.21,0.978 0.78,1 1,1")
TweenMax.set(pin, {
  transformOrigin: '50% 100%'
})

var tl = new TimelineMax({ repeat: -1 });
tl.from(pin, 1.8, {
  y: -43,
  ease: 'bobbleBounce'
})
  .to(pin, 1.8, {
    scaleX: 1.3,
    scaleY: 0.7,
    ease: 'bobbleSquash'
  }, '-=1.8')
  .to(track, 4, {
    x: '-=240',
    ease: Linear.easeNone
  }, '-=1.8')

  .to('.boop', 1.2, {
    alpha: 0,
    attr: {
      r: 13
    },
    strokeWidth: 0,
    ease: Sine.easeOut
  }, '-=1.2')
  .to(pin, 1.15, {
    transformOrigin: '50% 31%',
    //rotation:360,
    scaleX: -1,
    y: -43,
    ease: 'hup'
  }, '-=1.15')

tl.timeScale(2.4)
