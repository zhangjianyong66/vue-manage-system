import request from '../utils/request';


export const manageUserlogin = (params: { username: string, password: string }) => {
    return request({
        url: '/manageUser/login',
        method: 'post',
        data: params,
    });
}
export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};
