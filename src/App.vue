<template>
  <div id="app" class="app">
    <router-view />
  </div>
</template>

<style>
@font-face {
  font-family: 'UbuntuMono';
  src: url('./fonts/UbuntuMono.woff') format('woff');
  font-weight: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Fyodor';
  src: url('./fonts/fyodor-bold-expanded.woff') format('woff');
  font-weight: normal;
  font-display: swap;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5e8, #ffe0c8);
}

.app {
  padding: 20px;
  overflow-x: hidden;
  max-width: 800px;
  margin: auto;
  font-family: 'Ubuntu', sans-serif;
  font-size: 16px;
  font-weight: 400;
}

h1,
h2,
h3,
h4,
p,
.post h3,
.description {
  word-wrap: break-word;
   word-break: break-word; 
  overflow-wrap: break-word;
  max-width: 100%;
  hyphens: auto;                    /* автоматические переносы */
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
}
</style>
