import request from '../utils/request';

interface SaveParam {
    title: string;
    image: string;
    duration: string;
    price: number;
    area: string;
    province: string;
    city: string;
    district: string;
    address: string;
    score: string;
    introImage: string;
    hostPerson: string;
    hostIntroduction: string;
    hostAvatar: string;
    locationMap: string;
    locationDetail: string;
}

export const save = (params: SaveParam) => {
    return request({
        url: '/guideTravelPackage/save',
        method: 'post',
        data: params,
    });
}

export const update = (id: number, params: SaveParam) => {
    return request({
        url: `/guideTravelPackage/update/{id}`,
        method: 'post',
        data: params,
    });
}

export const remove = (id: number) => {
    return request({
        url: `/guideTravelPackage/remove/${id}`,
        method: 'post'
    });
}

export interface guideTravelPackageSearchParam {

}

export const page = (pageNum: number, pageSize: number, param: guideTravelPackageSearchParam) => {
    return request({
        url: `/guideTravelPackage/page/${pageNum}/${pageSize}`,
        method: 'post',
        data: param,
    });
}