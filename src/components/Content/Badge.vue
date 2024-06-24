<template>
  <div class="inline-block rounded-full shadow-sm " :class="badgeClassName">
    <div class="flex items-center">
      <BaseIcon v-if="icon" :name="icon" :size="icon_sizes[iconSize]" :class="iconClasses" :spin="iconSpin" />
      <p class="px-2">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheBadge',
  props: {
    icon: { type: String, default: '', required: false },
    size: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['md', 'sm'].includes(sizeValue)
      },
    },
    iconSize: {
      type: String,
      default: 'md',
      validator(sizeValue) {
        return ['sm', 'md', 'lg'].includes(sizeValue);
      },
    },
    iconSpin: { type: Boolean, default: false },
    color: {
      type: String,
      default: 'default',
      validator(colorValue) {
        return [
          'default',
          'primary',
          'positive',
          'warning',
          'danger',
          'processing',
          'success',
        ].includes(colorValue)
      },
    },
    text: { type: String, default: '' },
    uppercase: { type: Boolean, default: false },
    iconClasses: { type: String, default: '' },
    padding: { type: Boolean, default: true },
  },
  data() {
    return {
      badgeSizes: {
        sm: 'text-sm ',
        md: 'text-md ',
      },
      badgePadding: {
        sm: 'px-2',
        md: 'px-4',
      },
      variants: {
        default: 'bg-slate-100 text-slate-600 ',
        primary: 'bg-blue-500 text-white ',
        positive: 'bg-green-500 text-white ',
        warning: 'bg-amber-500 text-white ',
        danger: 'bg-red-700 text-white ',
        processing: 'bg-orange-600 text-white ',
        success: 'bg-lime-700 text-white'
      },
      icon_sizes: {
        sm: '14',
        md: '18',
        lg: '20',
      },
    }
  },
  computed: {
    badgeClassName() {
      let className = `${this.badgeSizes[this.size]} ${this.variants[this.color]}`
      if (this.uppercase) className += 'uppercase '
      if (this.padding) className += `${this.badgePadding[this.size]}`
      return className
    },
  },
}
</script>
