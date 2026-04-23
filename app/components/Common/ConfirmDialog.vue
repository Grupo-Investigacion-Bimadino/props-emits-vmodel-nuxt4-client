<template>
  <v-dialog
    v-model="model"
    max-width="420"
    persistent
  >
    <v-card class="glass-card pa-2" rounded="xl">
      <v-card-title class="text-h6 pt-4 px-4">
        <v-icon :color="iconColor" class="mr-2">{{ icon }}</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text class="text-body-2 text-medium-emphasis px-4">
        {{ message }}
      </v-card-text>
      <v-card-actions class="px-4 pb-4 gap-2">
        <v-spacer />
        <v-btn
          variant="text"
          @click="cancel"
        >
          Cancelar
        </v-btn>
        <v-btn
          :color="confirmColor"
          variant="flat"
          @click="confirm"
        >
          {{ confirmLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const model = defineModel<boolean>({ default: false })

const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    confirmLabel?: string
    confirmColor?: string
    icon?: string
    iconColor?: string
  }>(),
  {
    title: '¿Estás seguro?',
    message: 'Esta acción no se puede deshacer.',
    confirmLabel: 'Confirmar',
    confirmColor: 'error',
    icon: 'mdi-alert-circle-outline',
    iconColor: 'error',
  }
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function confirm() {
  emit('confirm')
  model.value = false
}

function cancel() {
  emit('cancel')
  model.value = false
}
</script>
