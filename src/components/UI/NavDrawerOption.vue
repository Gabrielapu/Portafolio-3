<template>
  <div v-if="showItem" class="nav-drawer-option my-1">
    <div 
      class="flex flex-row justify-between items-center rounded cursor-pointer"
      @click="hasChildrens ? displayListItems('parent') : null"
    >
      <NavDrawerLink
        class="flex flex-row pl-1 py-1"
        :class="{
          'bg-company-secondary text-white rounded-md w-full': 
            isActive(item.active),
          'text-slate-600 rounded-md w-full': !isActive(item.active)
        }"
        :name="item.title"
        :start-icon="item.icon"
        :link="item.link"
      />
      <div v-if="hasChildrens > 0" >
        <BaseIcon
          name="fe:arrow-down"
          class="transition ease-in-out"
          :class="item.displayItems ? 'rotate-180' : ''"
        />
      </div>
    </div>
    <div v-if="hasChildrens > 0" v-show="item.displayItems">
      <div v-for="(subitem, j) in item.children" :key="j">
        <div 
          class="flex justify-between items-center rounded cursor-pointer"
          @click="hasGrandchildrens(subitem) ? displayListItems('child', subitem) : null"
        >
          <NavDrawerLink  
            class="flex flex-row pl-1 py-1"
            :class="{
              'bg-company-secondary text-white rounded-md w-full': 
                isActive(subitem.active),
              'text-slate-600 rounded-md w-full': !isActive(subitem.active)
            }"
            :name="subitem.title"
            :start-icon="subitem.icon"
            :link="subitem.link"
          />
          <div v-if="hasGrandchildrens(subitem)">
            <BaseIcon
              name="fe:arrow-down"
              class="transition ease-in-out"
              :class="subitem.displayGrandchildren ? 'rotate-180' : ''"
            />
          </div>
        </div>
        <div v-if="hasGrandchildrens(subitem)" v-show="subitem.displayGrandchildren">
          <NavDrawerLink
            v-for="(grandson, k) in subitem.children"
            :key="k"
            class="flex flex-row pl-4 py-1"
            :class="{
              'bg-company-secondary text-white rounded-md w-full': 
                isActive(grandson.active),
              'text-slate-600 rounded-md w-full': !isActive(grandson.active)
            }"
            :name="grandson.title"
            :start-icon="grandson.icon"
            :link="grandson.link"
          />
        </div>
      </div>      
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavDrawerOption',
  props: {
    item: { type: Object, default: () => {} },
  },
  setup() {
    const scenarioStore = useScenarioStore()
    return { scenarioStore }
  },
  computed: {
    hasChildrens() {
      return this.item.children && this.item.children?.length > 0
    },
    hasGrandchildrens(subitem) {
      return subitem => subitem.children && subitem.children?.length > 0
    },
    showItem() {
      if(
        !this.$route.params.scenario_id 
        && (this.item.active === 'scenario_detail'
        || this.item.title === 'Resultados'
        || this.item.active === 'scenario_plan') 
      ) {
          return false
      }
      if(
        this.$route.params.scenario_id 
        && (this.item.title === 'Resultados'
        || this.item.active === 'scenario_plan') 
        && this.scenarioStore.getStatus !== 'Completado'
      ) {
          return false
      }
      return true
    }
  },
  methods: {
    isActive(route) {
      return this.$route?.name === route 
    },
    displayListItems(type, item) {
      if(type === 'parent') {
        this.$emit('displayChildren', this.item)
      } 
      if(type === 'child') {
        this.$emit('displayGrandchildren', { subitem: item, parent: this.item })
      }
    },
  },
}
</script>
