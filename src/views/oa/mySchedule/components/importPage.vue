<template>
    <div class="">
        <div>
            <subScheduleCard listType="important"></subScheduleCard>
        </div>
    </div>
</template>

<script>
import subScheduleCard from './subScheduleCard'
export default {
    components: {  subScheduleCard },
    data() {
        return {         
        }
    },
    methods: {        
    }
}
</script>

<style class="scss">
.isEmpty {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>