/* =========================================================================
   Xizhu Hou — DevOps Portfolio · interactions
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- nav shadow on scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- scroll reveal (scroll-driven; IO-free for max compatibility) ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  // registry of "reveal when in view" callbacks
  var viewportHooks = [];
  function onEnterView(el, ratio, cb) {
    viewportHooks.push({ el: el, ratio: ratio, cb: cb, fired: false });
  }
  function checkViewport() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < viewportHooks.length; i++) {
      var h = viewportHooks[i];
      if (h.fired) continue;
      var r = h.el.getBoundingClientRect();
      if (r.top < vh * h.ratio && r.bottom > 0) { h.fired = true; h.cb(); }
    }
  }
  reveals.forEach(function (el) { onEnterView(el, 0.92, function () { el.classList.add('in'); }); });
  window.addEventListener('scroll', checkViewport, { passive: true });
  window.addEventListener('resize', checkViewport);
  window.addEventListener('load', checkViewport);
  // Poll as well — some embedded/preview contexts don't deliver scroll events
  // or IntersectionObserver callbacks reliably. Stops once every hook has fired.
  var pollId = setInterval(function () {
    checkViewport();
    if (viewportHooks.every(function (h) { return h.fired; })) clearInterval(pollId);
  }, 200);
  checkViewport();
  // safety net: nothing should ever stay invisible (print / odd browsers)
  setTimeout(function () {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }, 3500);

  /* ===================== TERMINAL ===================== */
  var termBody = document.getElementById('termBody');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // script: array of lines. type:'cmd' typed char-by-char after a prompt; 'out' printed; 'gap' blank
  var PROMPT = '<span class="prompt"><span class="at">xizhu@infra</span>:~/platform$ </span>';
  var script = [
    { t: 'cmd', text: 'whoami' },
    { t: 'out', html: '<span class="g">Xizhu Hou</span> — DevOps · SRE · Platform Engineer' },
    { t: 'out', html: '<span class="m">multi-cloud · automation-first · remote (AEST)</span>' },
    { t: 'gap' },
    { t: 'cmd', text: 'cat stack.txt' },
    { t: 'out', html: '<span class="y">iac</span>        Terraform · CloudFormation' },
    { t: 'out', html: '<span class="y">config</span>     Ansible · Puppet · SaltStack' },
    { t: 'out', html: '<span class="y">cloud</span>      AWS · GCP' },
    { t: 'out', html: '<span class="y">containers</span> Kubernetes · EKS · Docker' },
    { t: 'out', html: '<span class="y">observe</span>    Prometheus · Grafana · New Relic' },
    { t: 'out', html: '<span class="y">code</span>       Python · Bash' },
    { t: 'gap' },
    { t: 'cmd', text: 'terraform apply -auto-approve' },
    { t: 'out', html: '<span class="ok">Apply complete!</span> Resources: <span class="g">12 added</span>, 3 changed, 0 destroyed.' },
    { t: 'out', html: '<span class="m"># infrastructure is code, not clicks.</span>' },
    { t: 'gap' },
    { t: 'cmd', text: 'kubectl get pods -A | grep Running' },
    { t: 'out', html: '<span class="b">prod</span>     api-gateway      <span class="g">Running</span>  6/6' },
    { t: 'out', html: '<span class="b">prod</span>     worker-pool      <span class="g">Running</span>  4/4' },
    { t: 'out', html: '<span class="g">✔ all systems healthy — SLOs green</span>' },
    { t: 'gap' },
    { t: 'cmd', text: 'echo "let\'s build something reliable →"' },
    { t: 'out', html: '<span class="y">let\'s build something reliable →</span>' }
  ];

  function lineEl(html) {
    var d = document.createElement('div');
    d.className = 'ln';
    d.innerHTML = html;
    termBody.appendChild(d);
    return d;
  }
  var cursor = document.createElement('span');
  cursor.className = 'cursor';

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function typeCmd(text) {
    return new Promise(function (resolve) {
      var d = lineEl(PROMPT + '<span class="cmd"></span>');
      var cmdSpan = d.querySelector('.cmd');
      cmdSpan.appendChild(cursor);
      var i = 0;
      (function step() {
        if (i < text.length) {
          cmdSpan.insertBefore(document.createTextNode(text[i]), cursor);
          i++;
          setTimeout(step, 30 + Math.random() * 45);
        } else {
          setTimeout(resolve, 260);
        }
      })();
    });
  }

  async function runTerminal() {
    termBody.innerHTML = '';
    for (var i = 0; i < script.length; i++) {
      var s = script[i];
      if (reduceMotion) {
        if (s.t === 'cmd') lineEl(PROMPT + '<span class="cmd">' + s.text + '</span>');
        else if (s.t === 'gap') lineEl('&nbsp;');
        else lineEl('<span class="out">' + s.html + '</span>');
        continue;
      }
      if (s.t === 'cmd') {
        await typeCmd(s.text);
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      } else if (s.t === 'gap') {
        lineEl('&nbsp;');
        await sleep(120);
      } else {
        lineEl('<span class="out">' + s.html + '</span>');
        await sleep(180 + Math.random() * 120);
      }
    }
    // trailing cursor
    var tail = lineEl(PROMPT);
    tail.appendChild(cursor);
  }

  // start terminal when in view (once)
  var termStarted = false;
  function startTerm() {
    if (termStarted) return; termStarted = true;
    runTerminal();
  }
  onEnterView(document.getElementById('terminal'), 0.7, startTerm);
  checkViewport();
  setTimeout(startTerm, 2500); // safety: ensure it runs even if never "seen"

  /* ===================== CI/CD PIPELINE ===================== */
  var rail = document.getElementById('pipeRail');
  var nodes = rail ? Array.prototype.slice.call(rail.querySelectorAll('.pipe-node')) : [];
  var bar = document.getElementById('pipeBar');
  var statusText = document.getElementById('pipeStatusText');
  var statusDot = document.querySelector('#pipeStatus .badge');
  var replayBtn = document.getElementById('pipeReplay');
  var STAGE_LABELS = ['Cloning repository…', 'Building image…', 'Running tests…', 'Pushing to registry…', 'Applying Terraform…', 'Rolling out to Kubernetes…', 'Watching dashboards…'];
  var pipeRunning = false;

  function resetPipe() {
    nodes.forEach(function (n) {
      n.classList.remove('active', 'done');
      n.querySelector('.meta').textContent = '';
    });
    bar.style.width = '0%';
  }

  function runPipe() {
    if (pipeRunning) return;
    pipeRunning = true;
    resetPipe();
    statusDot.style.color = 'var(--accent)';
    var i = 0;
    function next() {
      if (i > 0) {
        nodes[i - 1].classList.remove('active');
        nodes[i - 1].classList.add('done');
      }
      if (i >= nodes.length) {
        statusText.textContent = 'Deployed — SLOs green, 0 alerts ✔';
        statusDot.style.color = 'var(--code-green)';
        bar.style.width = '100%';
        pipeRunning = false;
        return;
      }
      var n = nodes[i];
      n.classList.add('active');
      n.querySelector('.meta').textContent = n.getAttribute('data-meta');
      statusText.textContent = STAGE_LABELS[i];
      bar.style.width = Math.round(((i + 1) / nodes.length) * 100) + '%';
      i++;
      setTimeout(next, reduceMotion ? 350 : 920);
    }
    next();
  }

  var pipeStarted = false;
  function startPipe() { if (pipeStarted) return; pipeStarted = true; setTimeout(runPipe, 350); }
  if (rail) {
    onEnterView(rail, 0.6, startPipe);
    checkViewport();
  }
  if (replayBtn) replayBtn.addEventListener('click', runPipe);

  /* ===================== ARCH DIAGRAM hover highlight ===================== */
  var diagram = document.querySelector('.diagram');
  if (diagram) {
    diagram.querySelectorAll('g').forEach(function (g) {
      var rect = g.querySelector('.node-rect');
      if (!rect) return;
      g.style.cursor = 'default';
      g.addEventListener('mouseenter', function () { rect.style.filter = 'drop-shadow(0 6px 14px rgba(0,0,0,.22))'; });
      g.addEventListener('mouseleave', function () { rect.style.filter = 'none'; });
    });
  }
})();
