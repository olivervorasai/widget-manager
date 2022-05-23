<script setup lang="ts">
import type { ApiError } from '@supabase/gotrue-js';

import { ref } from 'vue';
import { supabase } from '@/plugins/supabase';

const loading = ref(false);
const email = ref('');

const handleLogin = async () => {
    try {
        loading.value = true;
        const { user, error } = await supabase.auth.signIn({
            email: email.value,
        });
        console.log(user);
        if (error) throw error;
        alert('Check your email for the login link!');
    } catch (err) {
        const apiError = err as ApiError;
        alert(apiError.message);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <form class="row flex flex-center" @submit.prevent="handleLogin">
        <div class="col-6 form-widget">
            <h1 class="header">Supabase + Vue 3</h1>
            <p class="description">
                Sign in via magic link with your email below
            </p>
            <div>
                <input
                    class="inputField"
                    type="email"
                    placeholder="Your email"
                    v-model="email"
                />
            </div>
            <div>
                <input
                    type="submit"
                    class="button block"
                    :value="loading ? 'Loading' : 'Send magic link'"
                    :disabled="loading"
                />
            </div>
        </div>
    </form>
</template>
