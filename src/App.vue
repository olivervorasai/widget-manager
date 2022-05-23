<script setup lang="ts">
import { RouterView } from 'vue-router';

import { useUser } from '@/composables/useUser';
import { supabase } from '@/plugins/supabase';
import SignIn from '@/components/SignIn.vue';

const user = useUser();

supabase.auth.onAuthStateChange((_, session) => {
    console.log(session);
    if (session) user.user = session.user;
});
</script>

<template>
    <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
            <SignIn v-if="!user.user" />

            <component :is="Component" v-else />
        </transition>
    </RouterView>
</template>

<style>
@import '@/assets/base.css';

#app {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
