<script setup>
import { ref } from 'vue'

const props = defineProps({
    label: {
        type:String,
        default:''
    },
})

</script>

<template>
    <div class='flex flex-col mx-6'>
        <span class="text-xs mb-1">{{ props.label }}</span>
        <div>
            <slot></slot>
        </div>
    </div>
</template>

<style scoped lang='scss'>
</style>