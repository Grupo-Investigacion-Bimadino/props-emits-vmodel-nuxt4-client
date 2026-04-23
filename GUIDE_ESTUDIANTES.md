# 🎓 Guía Maestra de Arquitectura: Music App (Nuxt 4 + Pinia)

Esta guía ha sido diseñada para estudiantes de programación que desean entender cómo se construye una aplicación de nivel profesional, manteniendo la reactividad y la persistencia de datos.

---

## 📂 1. Capa de Componentes (Atómicos y Reactivos)
Los componentes son piezas aisladas que no deberían conocer la lógica global. Se comunican mediante un contrato estricto.

### A. Props y Emits (El patrón clásico)
Un padre envía datos (`props`) y un hijo avisa eventos (`emits`).
```vue
<!-- Ejemplo: TrackCard.vue -->
<script setup>
defineProps(['track']) // Recibe la canción
const emit = defineEmits(['select']) // Avisa cuando se hace clic
</script>
```

### B. defineModel (El estándar moderno Vue 3.4+)
Permite que un componente hijo modifique un valor del padre de forma directa pero controlada.
```vue
<!-- Ejemplo: SearchBar.vue -->
<script setup>
const model = defineModel() // Enlaza directamente con v-model en el padre
</script>
<template>
  <input v-model="model" />
</template>
```

---

## 🧠 2. Capa de Stores (Pinia - Estado Global)
Cuando los datos deben ser compartidos por muchos componentes (como el reproductor), usamos Pinia.

### Estructura de un Store Profesional
```typescript
// app/stores/player.ts
export const usePlayerStore = defineStore('player', () => {
  const currentTrack = ref(null) // State
  const isPlaying = ref(false)   // State

  function setTrack(track) {     // Action (Lógica de negocio)
    currentTrack.value = track
    isPlaying.value = true
  }

  return { currentTrack, isPlaying, setTrack }
})
```

---

## 🌐 3. Capa de Servidor y API (Comunicación REST)
Para que los datos no se pierdan, nos comunicamos con el backend usando métodos HTTP. En este proyecto usamos `$fetch`.

| Método | Acción | Uso en este Proyecto |
| :--- | :--- | :--- |
| **GET** | Obtener | Listar todas las canciones de la base de datos. |
| **POST** | Crear | Guardar una nueva canción enviada desde el formulario. |
| **PATCH** | Actualizar | Cambiar solo el título o artista de una canción existente. |
| **DELETE** | Eliminar | Quitar permanentemente una canción del sistema. |

### Ejemplo de Petición Profesional
```typescript
// En el Store de Tracks
async function updateTrack(id, data) {
  await $fetch(`/api/tracks/${id}`, {
    method: 'PATCH',
    body: data
  })
}
```

---

## 🖥️ 4. Capa de Backend (Persistencia Real)
Usamos **JSON Server**. Es una herramienta que convierte un archivo `.json` en una API REST real.
- **db.json**: Es nuestra base de datos.
- **Mocking**: Esta técnica permite desarrollar el frontend sin esperar a que el equipo de backend termine el servidor real.

---

## 🔄 El Flujo de Datos Completo (Un ejemplo real)

1. **Interfaz**: El estudiante hace clic en "Eliminar" en la lista.
2. **Componente**: `TrackList.vue` emite un evento `@delete`.
3. **Página**: `tracks/index.vue` captura el evento y llama a `tracksStore.deleteTrack(id)`.
4. **Store (Acción)**: Envía una petición `DELETE` a la API.
5. **Store (Estado)**: Tras el éxito, elimina el track del array `tracks` local.
6. **Reactividad**: La UI se actualiza instantáneamente y el elemento desaparece sin recargar la página.

---

### 💡 Consejo Pro para Estudiantes
"Manten tus componentes tontos y tus stores inteligentes". Si un componente tiene demasiada lógica de base de datos, cámbiala a un Store. Tu código será mucho más fácil de testear y mantener.
