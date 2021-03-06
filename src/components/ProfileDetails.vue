<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase } from '@/plugins/supabase';
import { useUser } from '@/composables/useUser';

const user = useUser();

const loading = ref(true);
const username = ref('');
const website = ref('');
const avatar_url = ref('');

const getProfile = async () => {
    try {
        loading.value = true;
        user.user = supabase.auth.user();

        if (user.user) {
            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', user.user.id)
                .single();

            if (error && status !== 406) throw error;

            if (data) {
                username.value = data.username;
                website.value = data.website;
                avatar_url.value = data.avatar_url;
            }
        }
    } catch (err) {
        alert(err);
    } finally {
        loading.value = false;
    }
};

const updateProfile = async () => {
    try {
        loading.value = true;
        user.user = supabase.auth.user();

        if (user.user) {
            const updates = {
                id: user.user.id,
                username: username.value,
                website: website.value,
                avatar_url: avatar_url.value,
                updated_at: new Date(),
            };

            let { error } = await supabase.from('profiles').upsert(updates, {
                returning: 'minimal', // Don't return the value after inserting
            });

            if (error) throw error;
        }
    } catch (err) {
        alert(err);
    } finally {
        loading.value = false;
    }
};

const signOut = async () => {
    try {
        loading.value = true;
        let { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (err) {
        alert(err);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    getProfile();
});
</script>

<template>
    <form class="form-widget" @submit.prevent="updateProfile">
        <div>
            <label for="email">Email</label>
            <input id="email" type="text" :value="user.user?.email" disabled />
        </div>
        <div>
            <label for="username">Name</label>
            <input id="username" type="text" v-model="username" />
        </div>
        <div>
            <label for="website">Website</label>
            <input id="website" type="website" v-model="website" />
        </div>

        <div>
            <input
                type="submit"
                class="button block primary"
                :value="loading ? 'Loading ...' : 'Update'"
                :disabled="loading"
            />
        </div>

        <div>
            <button class="button block" @click="signOut" :disabled="loading">
                Sign Out
            </button>
        </div>
    </form>
</template>
