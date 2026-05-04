# 🏛️ Capa 3: Orquestación (Layouts y Páginas)

En Nuxt 4, no construimos solo "pantallas" aisladas. Construimos una **jerarquía**. Imagina un teatro: el escenario, las luces y las butacas siempre están ahí (Layout), pero la obra que se presenta cambia cada noche (Páginas).

---

## 1. El Layout (`layouts/default.vue`)
Es el marco de tu aplicación. Aquí es donde ponemos los elementos que **nunca deben recargarse**, como:
- La barra de navegación lateral.
- El reproductor de música.
- El chat en vivo.

### 🧠 El Concepto de `<slot />`:
Dentro del archivo `.vue` del layout, verás una etiqueta especial llamada `<slot />`. Es un "hueco vacío" donde Nuxt inyectará el contenido de la página que el usuario esté visitando.

**¿Por qué es importante para la música?**
Si pusiéramos el reproductor dentro de cada página, cada vez que navegues de "Inicio" a "Biblioteca", la música se cortaría. Al ponerlo en el **Layout**, el reproductor vive en una capa superior y no se ve afectado por los cambios de contenido.

---

## 2. Las Páginas (`pages/`)
Las páginas son los componentes que ocupan el `<slot />` del layout. Representan una URL específica.

- `pages/index.vue` -> URL: `/`
- `pages/tracks/create.vue` -> URL: `/tracks/create`

### 💻 Ejemplo de Orquestación:
Cada página puede decirle al Layout qué título mostrar o qué estilo usar mediante `definePageMeta`.

```vue
<!-- pages/index.vue -->
<script setup>
definePageMeta({
  title: 'Descubrir Música',
  layout: 'default'
})
</script>

<template>
  <div>
    <h1>Lista de Canciones</h1>
    <!-- Contenido de la página -->
  </div>
</template>
```

---

## 3. El Flujo de Datos en esta Capa
Las páginas actúan como **Directores de Orquesta**:
1.  Piden datos al Store o a la API.
2.  Distribuyen esos datos a los componentes hijos (`TrackCard`, `SearchBar`) mediante **Props**.
3.  Escuchan eventos (**Emits**) de esos hijos para realizar acciones (ej: abrir un diálogo de confirmación).

---

## 🚀 Resumen para Estudiantes:

| Elemento | Función | Duración |
| :--- | :--- | :--- |
| **Layout** | Estructura fija y persistente. | Toda la sesión. |
| **Páginas** | Contenido específico de una URL. | Mientras estés en esa URL. |
| **App.vue** | La raíz de todo (normalmente solo tiene `<NuxtLayout>`). | Permanente. |

### 💡 Consejo Pro:
Si notas que estás repitiendo el mismo código en todas tus páginas (ej: un encabezado), muévelo al **Layout**. Si solo lo usas en una página, déjalo ahí o conviértelo en un **Componente**.
