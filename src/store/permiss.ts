import {defineStore} from 'pinia';

interface ObjectList {
    [key: string]: string[];
}

export const usePermissStore = defineStore('permiss', {
    state: () => {
        const defaultList: ObjectList = {
            admin: [
                '0', '1', '8', '11', '12', '13'
            ],
            user: ['0', '1', '11', '12', '13'],
        };
        const role = localStorage.getItem('role') || '';
        console.log('role',role);
        return {
            key: (role == 'admin' ? defaultList.admin : defaultList.user) as string[],
            defaultList,
        };
    },
    actions: {
        handleSet(val: string[]) {
            this.key = val;
        },
    },
});
