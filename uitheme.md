# UI Theme Guide

## Tailwind CDN

``` html
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config={
 theme:{extend:{
  colors:{
   primary:'#9B5CF6',
   secondary:'#7C3AED',
   dark:'#111218',
   card:'#181922',
   border:'#2A2D38'
  },
  boxShadow:{glow:'0 0 30px rgba(155,92,246,.35)'}
 }}
}
</script>
```

## HTML Layout

``` html
<body class="bg-dark text-white overflow-hidden">
<div class="flex h-screen">
  <aside class="w-72 bg-[#15161D] border-r border-border"></aside>
  <main class="flex-1 p-8 overflow-y-auto"></main>
</div>
</body>
```

## Sidebar

``` html
<aside class="w-72 bg-[#15161D] border-r border-[#2d2f39] flex flex-col">
<div class="px-8 py-7">
<h1 class="text-3xl font-bold">EcoSphere</h1>
<p class="text-gray-400">ESG Platform</p>
</div>
<nav class="px-5 space-y-3">
<a class="flex items-center gap-3 bg-primary rounded-xl px-5 py-4">Dashboard</a>
<a class="flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-[#22242f]">Environment</a>
<a class="flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-[#22242f]">Social</a>
<a class="flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-[#22242f]">Governance</a>
<a class="flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-[#22242f]">Gamification</a>
<a class="flex items-center gap-3 px-5 py-4 rounded-xl hover:bg-[#22242f]">Reports</a>
</nav>
</aside>
```

## Header

``` html
<header class="flex justify-between items-center">
<div>
<h1 class="text-4xl font-bold">Welcome Back 👋</h1>
<p class="text-gray-400">Here's your ESG overview</p>
</div>
<div class="flex items-center gap-5">
<button class="bg-card px-5 py-3 rounded-xl">Download Report</button>
<img src="avatar.png" class="w-12 h-12 rounded-full"/>
</div>
</header>
```

## KPI Cards

``` html
<div class="grid grid-cols-4 gap-6 mt-10">
<div class="bg-card rounded-3xl p-7 border border-border shadow-glow">
<h3 class="text-gray-400">Overall Score</h3>
<h1 class="text-5xl font-bold mt-3">78.6</h1>
<p class="text-green-400 mt-3">+8.4%</p>
</div>
</div>
```

## Analytics

``` html
<div class="grid grid-cols-3 gap-6 mt-8">
<div class="col-span-2 bg-card rounded-3xl p-8">
<canvas id="chart"></canvas>
</div>
<div class="bg-card rounded-3xl p-8">
<canvas id="pie"></canvas>
</div>
</div>
```

## CSS

``` css
body{
 background:#0f1016;
 font-family:Inter,sans-serif;
}
.card{
 background:#181922;
 border:1px solid #2A2D38;
 border-radius:24px;
}
.glow{
 box-shadow:0 0 35px rgba(155,92,246,.25);
}
::-webkit-scrollbar{width:7px;}
::-webkit-scrollbar-thumb{
 background:#7C3AED;
 border-radius:20px;
}
```

## Font

``` html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

## Chart.js

``` html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

## Pages

-   Dashboard
-   Environment
-   Social
-   Governance
-   ESG Scoring
-   Gamification
-   Reports
-   Notifications
-   Profile
-   Settings
-   Organization
-   Calendar
-   Compliance
-   Leaderboard
-   Analytics
