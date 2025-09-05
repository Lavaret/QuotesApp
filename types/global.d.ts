declare module 'vue' {
    export interface GlobalComponents {
        Quote: typeof import('~/components/Quote.vue')['default'];
    }
}
