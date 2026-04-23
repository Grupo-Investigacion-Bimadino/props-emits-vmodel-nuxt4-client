<template>
  <v-breadcrumbs :items="breadcrumbs" class="pa-0 mb-2">
    <template #divider>
      <v-icon size="small" color="primary">mdi-chevron-right</v-icon>
    </template>
    <template #item="{ item }">
      <v-breadcrumbs-item
        :to="item.to"
        :disabled="item.disabled"
        :title="item.title"
        class="text-body-2"
      />
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
const route = useRoute()

interface Crumb { title: string; to?: string; disabled?: boolean }

const breadcrumbs = computed<Crumb[]>(() => {
  const paths = route.path.split('/').filter(Boolean)
  const crumbs: Crumb[] = [{ title: 'Inicio', to: '/' }]
  let acc = ''
  paths.forEach((seg, i) => {
    acc += `/${seg}`
    const title = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')
    crumbs.push({
      title,
      to: acc,
      disabled: i === paths.length - 1,
    })
  })
  return crumbs
})
</script>
