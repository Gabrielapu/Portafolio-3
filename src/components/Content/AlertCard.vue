<template>
  <div class="pb-2">
    <div class="inline-block w-full rounded-md border shadow-sm p-3 text-red-900" :class="alertClassName">
      <div class="flex justify-start content-center items-center">
        <BaseIcon 
          v-if="icon" 
          :name="icon" 
          :size="icon_sizes[iconSize]" 
        />
        <p class="px-1">
          {{ title }}
        </p>
      </div>
      <Divider class="mt-2" :color="color" />
      <p v-if="!infolist">
        {{ text }}
      </p>
      <ul v-else>
        <li v-for="item in infolist" :key="item" class="list-disc ml-6">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertCard',
  props: {
    title: { type: String, default: '', required: false },
    icon: { type: String, default: '', required: false },
    size: {
      type: String,
      default: '',
      validator(sizeValue) {
        return ['md', 'sm'].includes(sizeValue);
      },
    },
    color: {
      type: String,
      default: 'default',
      validator(colorValue) {
        return ['error','alert'].includes(colorValue);
      },
    },
    text: {
      type: String,
      default: '',
    },
    infolist: {
      type: Array,
      default: () => [],
    },
    uppercase: {
      type: Boolean,
      default: false,
    },
    iconSize: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['sm', 'md', 'lg'].includes(sizeValue);
      },
    },
  },
  data() {
    return {
      alertSizes: {
        sm: 'text-sm px-2 ',
        md: 'text-md px-4 ',
      },
      variants: {
        error: 'bg-red-50 text-red-500 border-red-500 ',
        alert: 'bg-orange-50 text-orange-700 border-orange-500',
      },
      icon_sizes: {
        sm: '14',
        md: '18',
        lg: '20',
      },
    };
  },
  computed: {
    alertClassName() {
      let className = `${this.alertSizes[this.size]} ${this.variants[this.color]}`;

      if (this.uppercase) className += 'uppercase ';

      return className;
    },
  },
};
</script>
