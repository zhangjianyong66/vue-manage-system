import request from '../utils/request';


export const manageUserlogin = (params: { username: string, password: string }) => {
    return request({
        url: '/manageUser/login',
        method: 'post',
        data: params,
    });
}
