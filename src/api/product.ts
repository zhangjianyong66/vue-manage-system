import request from '../utils/request';

export interface SaveOrUpdateParam {
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

export interface GuideTravelPackageSearchParam {

}

export const save = (param: SaveOrUpdateParam) => {
    return request({
        url: '/guideTravelPackage/save',
        method: 'post',
        data: param,
    });
}

export const saveAsync = async (param: SaveOrUpdateParam) => {
    const res = await save(param)
    return res.data
}

export const update = (id: number, param: SaveOrUpdateParam) => {
    return request({
        url: `/guideTravelPackage/update/${id}`,
        method: 'post',
        data: param,
    });
}

export const updateAsync = async (id: number, param: SaveOrUpdateParam) => {
    const res = await update(id, param);
    return res.data
}

export const remove = (id: number) => {
    return request({
        url: `/guideTravelPackage/remove/${id}`,
        method: 'post'
    });
}

export const removeAsync = async (id: number) => {
    const res = await remove(id);
    return res.data
}


export const page = (pageNum: number, pageSize: number, param: GuideTravelPackageSearchParam) => {
    return request({
        url: `/guideTravelPackage/page/${pageNum}/${pageSize}`,
        method: 'post',
        data: param,
    });
}

export const pageAsync = async (pageNum: number, pageSize: number, param: GuideTravelPackageSearchParam) => {
    const res = await page(pageNum, pageSize, param)
    return res.data;
}