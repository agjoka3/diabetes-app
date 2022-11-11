export interface NewsModel {
    author: string;
    title: string;
    description: string;
    url: string;
    published: Date;
    source: {id: null, name: string}
}