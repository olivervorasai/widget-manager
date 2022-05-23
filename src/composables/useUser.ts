import { defineStore, acceptHMRUpdate } from 'pinia';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/plugins/supabase';

interface UserState {
    user: User | null;
}

export const useUser = defineStore('user', {
    state: (): UserState => {
        return {
            user: null,
        };
    },

    actions: {
        async SIGN_IN(email: string) {
            try {
                const { user, error } = await supabase.auth.signIn({
                    email,
                });

                if (error) throw error;

                if (user) this.user = user;
            } catch (err) {
                console.error(err);
            }
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot));
}
