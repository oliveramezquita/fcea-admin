<template>
  <div class="h-100 d-flex align-center justify-md-space-between justify-center">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center text-medium-emphasis">
      &copy;
      {{ new Date().getFullYear() }}
      Hecho
      por <a
        href="https://simplebox.mx/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
      >SIMPLEBOX</a>
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a
        href="https://simplebox.mx/contacto/"
        target="_blank"
      >Soporte</a>
    </span>
  </div>
</template>
