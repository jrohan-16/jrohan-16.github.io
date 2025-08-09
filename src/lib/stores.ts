import { writable } from 'svelte/store';
export const selectedBank = writable<'jpm' | 'pnc'>('jpm');
