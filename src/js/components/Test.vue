<template>
    <div id="test">
        <h1 v-if="title">{{title}}</h1>
        <input v-model="text"></input>
        <p>{{text}}</p>
    </div>
</template>

<script>
    export default {
        name: 'fc-test',
        props:{
            title: 'Example Title'
        },
        data() {
            return {
                text: 'Hello World'
            }
        },
        mounted() {
            console.log('the element mounted');
        }
    }
</script>