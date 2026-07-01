<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="2023年" name="first">
                <cardList year="2023"></cardList>
            </el-tab-pane>
            <el-tab-pane label="2022年" name="second">
                <cardList year="2022"></cardList>
            </el-tab-pane>
            <el-tab-pane label="2021年" name="third">
                <cardList year="2021"></cardList>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import cardList from './components/cardList'
export default {
    data() {
        return {
            activeName: 'first'
        }
    },
    components: {
        cardList
    }
}
</script>

<style lang="scss" scoped></style>